import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";

const updateTeamSchema = z.object({
  name: z.string().min(2).max(30).optional(),
});

// Helper: Check if user is a team member and get their role
async function getTeamMembership(teamId: string, userId: string) {
  return db.teamMember.findUnique({
    where: {
      teamId_userId: {
        teamId,
        userId,
      },
    },
  });
}

// GET - Fetch team details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const { id } = await params;

    // Check if user is a member
    const membership = await getTeamMembership(id, session.user.id);
    if (!membership) {
      return NextResponse.json(
        { error: "You are not a member of this team" },
        { status: 403 }
      );
    }

    const team = await db.team.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, displayName: true, email: true },
            },
          },
          orderBy: [
            { role: "asc" }, // OWNER first, then ADMIN, then MEMBER
            { joinedAt: "asc" },
          ],
        },
        mapSessions: {
          select: {
            id: true,
            seed: true,
            serverName: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 5,
        },
        _count: {
          select: {
            members: true,
            markers: true,
            mapSessions: true,
          },
        },
      },
    });

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...team,
      userRole: membership.role,
    });
  } catch (error) {
    console.error("Get team error:", error);
    return NextResponse.json(
      { error: "Could not fetch team" },
      { status: 500 }
    );
  }
}

// PATCH - Update team (OWNER/ADMIN only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const { id } = await params;

    // Check permissions
    const membership = await getTeamMembership(id, session.user.id);
    if (!membership || membership.role === "MEMBER") {
      return NextResponse.json(
        { error: "No permission to edit team" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const result = updateTeamSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const team = await db.team.update({
      where: { id },
      data: result.data,
      include: {
        members: {
          include: {
            user: {
              select: { id: true, displayName: true },
            },
          },
        },
      },
    });

    return NextResponse.json(team);
  } catch (error) {
    console.error("Update team error:", error);
    return NextResponse.json(
      { error: "Could not update team" },
      { status: 500 }
    );
  }
}

// DELETE - Delete team (OWNER only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const { id } = await params;

    // Check if user is OWNER
    const membership = await getTeamMembership(id, session.user.id);
    if (!membership || membership.role !== "OWNER") {
      return NextResponse.json(
        { error: "Only the owner can delete the team" },
        { status: 403 }
      );
    }

    // Delete team (cascade deletes members via Prisma schema)
    await db.team.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete team error:", error);
    return NextResponse.json(
      { error: "Could not delete team" },
      { status: 500 }
    );
  }
}
