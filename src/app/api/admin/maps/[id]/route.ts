import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/admin/maps/[id] - Get single map with details
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  try {
    const map = await db.mapSession.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            displayName: true,
            email: true,
          },
        },
        team: {
          select: {
            id: true,
            name: true,
          },
        },
        markers: {
          include: {
            createdBy: {
              select: {
                id: true,
                displayName: true,
              },
            },
          },
        },
      },
    });

    if (!map) {
      return NextResponse.json({ error: "Map not found" }, { status: 404 });
    }

    return NextResponse.json(map);
  } catch (error) {
    console.error("Error fetching map:", error);
    return NextResponse.json({ error: "Failed to fetch map" }, { status: 500 });
  }
}

// DELETE /api/admin/maps/[id] - Delete map session
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { error, session } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  try {
    const map = await db.mapSession.findUnique({
      where: { id },
      select: { seed: true, serverName: true },
    });

    if (!map) {
      return NextResponse.json({ error: "Map not found" }, { status: 404 });
    }

    // Delete the map (markers are cascade deleted)
    await db.mapSession.delete({ where: { id } });

    // Log the action
    await db.auditLog.create({
      data: {
        action: "DELETE_MAP",
        entityType: "MapSession",
        entityId: id,
        userId: session!.user.id,
        details: JSON.stringify({ seed: map.seed, serverName: map.serverName }),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting map:", error);
    return NextResponse.json(
      { error: "Failed to delete map" },
      { status: 500 }
    );
  }
}
