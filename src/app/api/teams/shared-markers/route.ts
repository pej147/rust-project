import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Public endpoint: fetch team markers for a seed (no login required)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code")?.trim().toUpperCase();
    const seed = searchParams.get("seed")?.trim();

    if (!code || !seed) {
      return NextResponse.json(
        { error: "Missing code or seed parameter" },
        { status: 400 }
      );
    }

    // Find team by code
    const team = await db.team.findUnique({
      where: { code },
      select: { id: true, name: true },
    });

    if (!team) {
      return NextResponse.json(
        { error: "Team not found" },
        { status: 404 }
      );
    }

    // Find map sessions for this team + seed
    const mapSessions = await db.mapSession.findMany({
      where: {
        seed,
        teamId: team.id,
      },
      select: { id: true },
    });

    const sessionIds = mapSessions.map((s) => s.id);

    if (sessionIds.length === 0) {
      return NextResponse.json({
        teamName: team.name,
        markers: [],
      });
    }

    // Fetch TEAM and PUBLIC markers (never PRIVATE)
    const markers = await db.marker.findMany({
      where: {
        mapSessionId: { in: sessionIds },
        visibility: { in: ["TEAM", "PUBLIC"] },
      },
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        x: true,
        y: true,
        color: true,
        visibility: true,
        createdAt: true,
        createdBy: {
          select: {
            displayName: true,
          },
        },
        residents: {
          select: {
            enemyProfile: {
              select: {
                name: true,
                clanTag: true,
                threatLevel: true,
              },
            },
          },
        },
      },
    });

    // Format markers - strip emails, flatten residents
    const formattedMarkers = markers.map((m) => ({
      id: m.id,
      title: m.title,
      description: m.description,
      type: m.type,
      x: m.x,
      y: m.y,
      color: m.color,
      visibility: m.visibility,
      createdAt: m.createdAt.toISOString(),
      sharedBy: m.createdBy.displayName,
      residents: m.residents.map((r) => ({
        name: r.enemyProfile.name,
        clanTag: r.enemyProfile.clanTag,
        threatLevel: r.enemyProfile.threatLevel,
      })),
    }));

    return NextResponse.json({
      teamName: team.name,
      markers: formattedMarkers,
    });
  } catch (error) {
    console.error("Shared markers error:", error);
    return NextResponse.json(
      { error: "Could not fetch shared markers" },
      { status: 500 }
    );
  }
}
