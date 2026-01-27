import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";

// Validatie schema voor update
const updateMarkerSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  type: z.enum(["ENEMY", "TEAM_BASE", "LOOT", "MONUMENT", "DANGER", "NOTE", "RAID"]).optional(),
  x: z.number().min(0).max(8000).optional(),
  y: z.number().min(0).max(8000).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  icon: z.string().nullable().optional(),
  visibility: z.enum(["PRIVATE", "TEAM", "PUBLIC"]).optional(),
  lastSeenAt: z.string().nullable().optional(),
  tags: z.array(z.string()).nullable().optional(),
});

// GET - Enkele marker ophalen
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
    }

    const { id } = await params;

    const marker = await db.marker.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: { id: true, displayName: true },
        },
        mapSession: {
          select: { id: true, seed: true, serverName: true, teamId: true },
        },
        residents: {
          include: {
            enemyProfile: true,
          },
        },
      },
    });

    if (!marker) {
      return NextResponse.json(
        { error: "Marker niet gevonden" },
        { status: 404 }
      );
    }

    // Check visibility permissions
    const isOwner = marker.createdById === session.user.id;
    const isPublic = marker.visibility === "PUBLIC";

    if (!isOwner && !isPublic) {
      // Check team membership voor TEAM visibility
      if (marker.visibility === "TEAM" && marker.teamId) {
        const teamMember = await db.teamMember.findFirst({
          where: {
            teamId: marker.teamId,
            userId: session.user.id,
          },
        });

        if (!teamMember) {
          return NextResponse.json(
            { error: "Geen toegang tot deze marker" },
            { status: 403 }
          );
        }
      } else {
        return NextResponse.json(
          { error: "Geen toegang tot deze marker" },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(marker);
  } catch (error) {
    console.error("Get marker error:", error);
    return NextResponse.json(
      { error: "Kon marker niet ophalen" },
      { status: 500 }
    );
  }
}

// PATCH - Marker updaten
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const result = updateMarkerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    // Check of marker bestaat en gebruiker eigenaar is
    const existingMarker = await db.marker.findUnique({
      where: { id },
    });

    if (!existingMarker) {
      return NextResponse.json(
        { error: "Marker niet gevonden" },
        { status: 404 }
      );
    }

    // Alleen de maker mag de marker bewerken
    if (existingMarker.createdById !== session.user.id) {
      return NextResponse.json(
        { error: "Geen toegang om deze marker te bewerken" },
        { status: 403 }
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
    } = result.data;

    const marker = await db.marker.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(type !== undefined && { type }),
        ...(x !== undefined && { x }),
        ...(y !== undefined && { y }),
        ...(color !== undefined && { color }),
        ...(icon !== undefined && { icon }),
        ...(visibility !== undefined && { visibility }),
        ...(lastSeenAt !== undefined && {
          lastSeenAt: lastSeenAt ? new Date(lastSeenAt) : null,
        }),
        ...(tags !== undefined && {
          tags: tags ? JSON.stringify(tags) : null,
        }),
      },
      include: {
        createdBy: {
          select: { id: true, displayName: true },
        },
      },
    });

    return NextResponse.json(marker);
  } catch (error) {
    console.error("Update marker error:", error);
    return NextResponse.json(
      { error: "Kon marker niet updaten" },
      { status: 500 }
    );
  }
}

// DELETE - Marker verwijderen
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
    }

    const { id } = await params;

    // Check of marker bestaat
    const existingMarker = await db.marker.findUnique({
      where: { id },
    });

    if (!existingMarker) {
      return NextResponse.json(
        { error: "Marker niet gevonden" },
        { status: 404 }
      );
    }

    // Alleen de maker mag de marker verwijderen
    if (existingMarker.createdById !== session.user.id) {
      return NextResponse.json(
        { error: "Geen toegang om deze marker te verwijderen" },
        { status: 403 }
      );
    }

    await db.marker.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Marker verwijderd" });
  } catch (error) {
    console.error("Delete marker error:", error);
    return NextResponse.json(
      { error: "Kon marker niet verwijderen" },
      { status: 500 }
    );
  }
}
