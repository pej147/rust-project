import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";

// Validation schema for adding resident
const addResidentSchema = z.object({
  enemyProfileId: z.string().min(1, "Enemy profile ID is required"),
});

// Validation schema for creating new enemy and adding as resident
const createAndAddSchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  clanTag: z.string().max(10).optional(),
  notes: z.string().max(500).optional(),
  threatLevel: z.number().min(1).max(5).default(1),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - List residents of a marker
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const { id: markerId } = await params;

    // Check if marker exists and user has access
    const marker = await db.marker.findUnique({
      where: { id: markerId },
      include: {
        residents: {
          include: {
            enemyProfile: true,
          },
          orderBy: {
            enemyProfile: {
              threatLevel: "desc",
            },
          },
        },
      },
    });

    if (!marker) {
      return NextResponse.json({ error: "Marker not found" }, { status: 404 });
    }

    // Return residents with their enemy profiles
    const residents = marker.residents.map((r) => ({
      id: r.id,
      addedAt: r.addedAt,
      enemy: r.enemyProfile,
    }));

    return NextResponse.json(residents);
  } catch (error) {
    console.error("Get residents error:", error);
    return NextResponse.json(
      { error: "Could not fetch residents" },
      { status: 500 }
    );
  }
}

// POST - Add resident to marker (existing enemy or create new)
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const { id: markerId } = await params;
    const body = await request.json();

    // Check if marker exists and user is owner
    const marker = await db.marker.findUnique({
      where: { id: markerId },
    });

    if (!marker) {
      return NextResponse.json({ error: "Marker not found" }, { status: 404 });
    }

    if (marker.createdById !== session.user.id) {
      return NextResponse.json(
        { error: "Only the marker owner can add residents" },
        { status: 403 }
      );
    }

    // Check if adding existing enemy or creating new
    if (body.enemyProfileId) {
      // Add existing enemy
      const result = addResidentSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json(
          { error: result.error.issues[0].message },
          { status: 400 }
        );
      }

      // Check if enemy exists
      const enemy = await db.enemyProfile.findUnique({
        where: { id: result.data.enemyProfileId },
      });

      if (!enemy) {
        return NextResponse.json(
          { error: "Enemy profile not found" },
          { status: 404 }
        );
      }

      // Check if already a resident
      const existing = await db.markerResident.findUnique({
        where: {
          markerId_enemyProfileId: {
            markerId,
            enemyProfileId: result.data.enemyProfileId,
          },
        },
      });

      if (existing) {
        return NextResponse.json(
          { error: "This player is already a resident" },
          { status: 400 }
        );
      }

      const resident = await db.markerResident.create({
        data: {
          markerId,
          enemyProfileId: result.data.enemyProfileId,
        },
        include: {
          enemyProfile: true,
        },
      });

      return NextResponse.json(
        {
          id: resident.id,
          addedAt: resident.addedAt,
          enemy: resident.enemyProfile,
        },
        { status: 201 }
      );
    } else {
      // Create new enemy and add as resident
      const result = createAndAddSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json(
          { error: result.error.issues[0].message },
          { status: 400 }
        );
      }

      const { name, clanTag, notes, threatLevel } = result.data;

      // Create enemy and resident in transaction
      const resident = await db.$transaction(async (tx) => {
        const enemy = await tx.enemyProfile.create({
          data: {
            name,
            clanTag: clanTag || null,
            notes: notes || null,
            threatLevel,
          },
        });

        return tx.markerResident.create({
          data: {
            markerId,
            enemyProfileId: enemy.id,
          },
          include: {
            enemyProfile: true,
          },
        });
      });

      return NextResponse.json(
        {
          id: resident.id,
          addedAt: resident.addedAt,
          enemy: resident.enemyProfile,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Add resident error:", error);
    return NextResponse.json(
      { error: "Could not add resident" },
      { status: 500 }
    );
  }
}

// DELETE - Remove resident from marker
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const { id: markerId } = await params;
    const { searchParams } = new URL(request.url);
    const residentId = searchParams.get("residentId");

    if (!residentId) {
      return NextResponse.json(
        { error: "residentId is required" },
        { status: 400 }
      );
    }

    // Check if marker exists and user is owner
    const marker = await db.marker.findUnique({
      where: { id: markerId },
    });

    if (!marker) {
      return NextResponse.json({ error: "Marker not found" }, { status: 404 });
    }

    if (marker.createdById !== session.user.id) {
      return NextResponse.json(
        { error: "Only the marker owner can remove residents" },
        { status: 403 }
      );
    }

    // Delete resident
    await db.markerResident.delete({
      where: { id: residentId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Remove resident error:", error);
    return NextResponse.json(
      { error: "Could not remove resident" },
      { status: 500 }
    );
  }
}
