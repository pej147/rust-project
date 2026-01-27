import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";
import { z } from "zod";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/admin/users/[id] - Get single user
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  try {
    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        displayName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            markers: true,
            mapSessions: true,
            teamMembers: true,
          },
        },
        teamMembers: {
          include: {
            team: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/users/[id] - Update user role
const updateUserSchema = z.object({
  role: z.enum(["ADMIN", "USER"]).optional(),
  displayName: z.string().min(2).optional(),
});

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { error, session } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  try {
    const body = await request.json();
    const data = updateUserSchema.parse(body);

    // Prevent admin from demoting themselves
    if (id === session!.user.id && data.role === "USER") {
      return NextResponse.json(
        { error: "Cannot demote yourself" },
        { status: 400 }
      );
    }

    const user = await db.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        displayName: true,
        role: true,
      },
    });

    // Log the action
    await db.auditLog.create({
      data: {
        action: "UPDATE_USER",
        entityType: "User",
        entityId: id,
        userId: session!.user.id,
        details: JSON.stringify(data),
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/users/[id] - Delete user
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { error, session } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  // Prevent admin from deleting themselves
  if (id === session!.user.id) {
    return NextResponse.json(
      { error: "Cannot delete yourself" },
      { status: 400 }
    );
  }

  try {
    const user = await db.user.findUnique({
      where: { id },
      select: { email: true, displayName: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await db.user.delete({ where: { id } });

    // Log the action
    await db.auditLog.create({
      data: {
        action: "DELETE_USER",
        entityType: "User",
        entityId: id,
        userId: session!.user.id,
        details: JSON.stringify({ email: user.email }),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
