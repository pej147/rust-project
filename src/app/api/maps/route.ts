import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";

const createMapSchema = z.object({
  seed: z.string().min(1, "Seed is verplicht"),
  serverName: z.string().optional(),
  mapSize: z.number().min(1000).max(8000).default(4000),
  wipeDate: z.string().optional(),
  teamId: z.string().optional(),
});

// GET - Lijst van map sessies
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get("teamId");

    const maps = await db.mapSession.findMany({
      where: {
        OR: [
          { createdById: session.user.id },
          teamId ? { teamId } : {},
        ],
      },
      include: {
        createdBy: {
          select: { id: true, displayName: true },
        },
        team: {
          select: { id: true, name: true },
        },
        _count: {
          select: { markers: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(maps);
  } catch (error) {
    console.error("Get maps error:", error);
    return NextResponse.json(
      { error: "Kon map sessies niet ophalen" },
      { status: 500 }
    );
  }
}

// POST - Nieuwe map sessie aanmaken
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
    }

    const body = await request.json();
    const result = createMapSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { seed, serverName, mapSize, wipeDate, teamId } = result.data;

    const mapSession = await db.mapSession.create({
      data: {
        seed,
        serverName: serverName || null,
        mapSize,
        wipeDate: wipeDate ? new Date(wipeDate) : null,
        createdById: session.user.id,
        teamId: teamId || null,
      },
      include: {
        createdBy: {
          select: { id: true, displayName: true },
        },
      },
    });

    return NextResponse.json(mapSession, { status: 201 });
  } catch (error) {
    console.error("Create map error:", error);
    return NextResponse.json(
      { error: "Kon map sessie niet aanmaken" },
      { status: 500 }
    );
  }
}
