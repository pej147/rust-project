import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { Prisma, Visibility, MarkerType } from "@prisma/client";

// Validatie schema voor nieuwe marker
const createMarkerSchema = z.object({
  title: z.string().min(1, "Titel is verplicht"),
  description: z.string().optional(),
  type: z.enum(["ENEMY", "TEAM_BASE", "LOOT", "MONUMENT", "DANGER", "NOTE", "RAID"]),
  x: z.number().min(0).max(8000),
  y: z.number().min(0).max(8000),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default("#FF0000"),
  icon: z.string().optional(),
  visibility: z.enum(["PRIVATE", "TEAM", "PUBLIC"]).default("TEAM"),
  lastSeenAt: z.string().optional(),
  tags: z.array(z.string()).optional(),
  mapSessionId: z.string().min(1, "Map sessie is verplicht"),
  teamId: z.string().optional(),
});

// GET - Lijst van markers (gefilterd op mapSession)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const mapSessionId = searchParams.get("mapSessionId");
    const type = searchParams.get("type");

    if (!mapSessionId) {
      return NextResponse.json(
        { error: "mapSessionId is verplicht" },
        { status: 400 }
      );
    }

    // Check of gebruiker toegang heeft tot deze map sessie
    const mapSession = await db.mapSession.findUnique({
      where: { id: mapSessionId },
      include: {
        team: {
          include: {
            members: {
              where: { userId: session.user.id },
            },
          },
        },
      },
    });

    if (!mapSession) {
      return NextResponse.json(
        { error: "Map sessie niet gevonden" },
        { status: 404 }
      );
    }

    // Bepaal welke markers de gebruiker mag zien
    const isOwner = mapSession.createdById === session.user.id;
    const isTeamMember = mapSession.team?.members && mapSession.team.members.length > 0;

    // Build where clause voor markers
    const whereClause: Prisma.MarkerWhereInput = {
      mapSessionId,
    };

    // Filter op type als opgegeven
    if (type && Object.values(MarkerType).includes(type as MarkerType)) {
      whereClause.type = type as MarkerType;
    }

    // Filter markers op basis van visibility
    // - PRIVATE: alleen eigen markers
    // - TEAM: eigen markers + team markers
    // - PUBLIC: iedereen kan zien
    if (!isOwner) {
      const orConditions: Prisma.MarkerWhereInput[] = [
        { visibility: Visibility.PUBLIC },
        { createdById: session.user.id },
      ];

      if (isTeamMember && mapSession.teamId) {
        orConditions.push({
          visibility: Visibility.TEAM,
          teamId: mapSession.teamId
        });
      }

      whereClause.OR = orConditions;
    }

    const markers = await db.marker.findMany({
      where: whereClause,
      include: {
        createdBy: {
          select: { id: true, displayName: true },
        },
        residents: {
          include: {
            enemyProfile: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(markers);
  } catch (error) {
    console.error("Get markers error:", error);
    return NextResponse.json(
      { error: "Kon markers niet ophalen" },
      { status: 500 }
    );
  }
}

// POST - Nieuwe marker aanmaken
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
    }

    const body = await request.json();
    const result = createMarkerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const {
      title,
      description,
      type,
      x,
      y,
      color,
      icon,
      visibility,
      lastSeenAt,
      tags,
      mapSessionId,
      teamId
    } = result.data;

    // Check of map sessie bestaat en gebruiker toegang heeft
    const mapSession = await db.mapSession.findUnique({
      where: { id: mapSessionId },
    });

    if (!mapSession) {
      return NextResponse.json(
        { error: "Map sessie niet gevonden" },
        { status: 404 }
      );
    }

    const marker = await db.marker.create({
      data: {
        title,
        description: description || null,
        type,
        x,
        y,
        color,
        icon: icon || null,
        visibility,
        lastSeenAt: lastSeenAt ? new Date(lastSeenAt) : null,
        tags: tags ? JSON.stringify(tags) : null,
        mapSessionId,
        createdById: session.user.id,
        teamId: teamId || mapSession.teamId || null,
      },
      include: {
        createdBy: {
          select: { id: true, displayName: true },
        },
      },
    });

    return NextResponse.json(marker, { status: 201 });
  } catch (error) {
    console.error("Create marker error:", error);
    return NextResponse.json(
      { error: "Kon marker niet aanmaken" },
      { status: 500 }
    );
  }
}
