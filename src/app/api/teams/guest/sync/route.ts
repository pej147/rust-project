import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const guestMarkerSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  type: z.enum(["ENEMY", "TEAM_BASE", "LOOT", "MONUMENT", "DANGER", "NOTE", "RAID"]),
  x: z.number(),
  y: z.number(),
  color: z.string().default("#FF0000"),
});

const syncSchema = z.object({
  guestToken: z.string().min(1, "Guest token is required"),
  code: z.string().min(1, "Team code is required"),
  seed: z.string().min(1, "Seed is required"),
  guestName: z.string().min(1, "Guest name is required").max(20),
  markers: z.array(guestMarkerSchema),
});

// POST - Sync guest markers to team (no auth required)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = syncSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { guestToken, code, seed, guestName, markers } = result.data;

    // Find team and validate guestToken
    const team = await db.team.findUnique({
      where: { code: code.toUpperCase() },
      select: { id: true, guestToken: true },
    });

    if (!team) {
      return NextResponse.json(
        { error: "Team not found" },
        { status: 404 }
      );
    }

    // Validate: either this is the team creator (guestToken matches team)
    // or this is another guest syncing to the team (any valid token format)
    // For security, we check that either:
    // 1. The guestToken matches the team's guestToken (team creator)
    // 2. The team has a guestToken set (it's a guest team, others can sync)
    if (!team.guestToken) {
      return NextResponse.json(
        { error: "This team does not support guest syncing" },
        { status: 403 }
      );
    }

    // Find or create map session for this team + seed
    let mapSession = await db.mapSession.findFirst({
      where: {
        seed,
        teamId: team.id,
      },
    });

    if (!mapSession) {
      mapSession = await db.mapSession.create({
        data: {
          seed,
          teamId: team.id,
          createdById: null, // Guest-created session
        },
      });
    }

    // Delete existing markers from THIS specific guest (by guestToken)
    await db.marker.deleteMany({
      where: {
        mapSessionId: mapSession.id,
        guestToken: guestToken,
      },
    });

    // Insert new markers
    if (markers.length > 0) {
      await db.marker.createMany({
        data: markers.map((m) => ({
          title: m.title,
          description: m.description || null,
          type: m.type,
          x: m.x,
          y: m.y,
          color: m.color,
          visibility: "TEAM",
          mapSessionId: mapSession.id,
          createdById: null, // Guest marker
          teamId: team.id,
          guestName: guestName,
          guestToken: guestToken,
        })),
      });
    }

    return NextResponse.json({ synced: markers.length });
  } catch (error) {
    console.error("Guest sync error:", error);
    return NextResponse.json(
      { error: "Could not sync markers" },
      { status: 500 }
    );
  }
}
