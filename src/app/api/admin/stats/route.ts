import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

// GET /api/admin/stats - Dashboard statistics
export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const [
      totalUsers,
      totalMaps,
      totalMarkers,
      totalTeams,
      recentUsers,
      recentMaps,
      usersByRole,
      markersByType,
    ] = await Promise.all([
      db.user.count(),
      db.mapSession.count(),
      db.marker.count(),
      db.team.count(),
      db.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
        },
      }),
      db.mapSession.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      db.user.groupBy({
        by: ["role"],
        _count: true,
      }),
      db.marker.groupBy({
        by: ["type"],
        _count: true,
      }),
    ]);

    return NextResponse.json({
      totals: {
        users: totalUsers,
        maps: totalMaps,
        markers: totalMarkers,
        teams: totalTeams,
      },
      recent: {
        users: recentUsers,
        maps: recentMaps,
      },
      usersByRole: usersByRole.reduce(
        (acc, item) => {
          acc[item.role] = item._count;
          return acc;
        },
        {} as Record<string, number>
      ),
      markersByType: markersByType.reduce(
        (acc, item) => {
          acc[item.type] = item._count;
          return acc;
        },
        {} as Record<string, number>
      ),
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
