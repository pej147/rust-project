import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

// GET /api/admin/maps - List all map sessions
export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const maps = await db.mapSession.findMany({
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
        _count: {
          select: {
            markers: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(maps);
  } catch (error) {
    console.error("Error fetching maps:", error);
    return NextResponse.json(
      { error: "Failed to fetch maps" },
      { status: 500 }
    );
  }
}
