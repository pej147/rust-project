import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

// GET /api/admin/audit - List audit logs
export async function GET(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get("limit") || "50");
  const offset = parseInt(searchParams.get("offset") || "0");
  const entityType = searchParams.get("entityType");
  const action = searchParams.get("action");

  try {
    const where: {
      entityType?: string;
      action?: { contains: string };
    } = {};

    if (entityType) {
      where.entityType = entityType;
    }
    if (action) {
      where.action = { contains: action };
    }

    const [logs, total] = await Promise.all([
      db.auditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      db.auditLog.count({ where }),
    ]);

    // Get user info for each log
    const userIds = [...new Set(logs.map((log) => log.userId))];
    const users = await db.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, displayName: true, email: true },
    });

    const userMap = new Map(users.map((u) => [u.id, u]));

    const logsWithUsers = logs.map((log) => ({
      ...log,
      user: userMap.get(log.userId) || { displayName: "Unknown", email: "" },
      details: log.details ? JSON.parse(log.details) : null,
    }));

    return NextResponse.json({
      logs: logsWithUsers,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch audit logs" },
      { status: 500 }
    );
  }
}
