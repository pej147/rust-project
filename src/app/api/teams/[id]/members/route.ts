import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";

const updateMemberSchema = z.object({
  memberId: z.string(),
  role: z.enum(["ADMIN", "MEMBER"]).optional(),
  action: z.enum(["update", "remove", "leave"]),
});

// Helper: Check team membership
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

// GET - All members of a team
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

    const members = await db.teamMember.findMany({
      where: { teamId: id },
      include: {
        user: {
          select: { id: true, displayName: true, email: true },
        },
      },
      orderBy: [
        { role: "asc" },
        { joinedAt: "asc" },
      ],
    });

    return NextResponse.json(members);
  } catch (error) {
    console.error("Get members error:", error);
    return NextResponse.json(
      { error: "Could not fetch members" },
      { status: 500 }
    );
  }
}

// POST - Member actions (update role, remove, leave)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const { id: teamId } = await params;

    const body = await request.json();
    const result = updateMemberSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { memberId, role, action } = result.data;

    // Check own membership
    const myMembership = await getTeamMembership(teamId, session.user.id);
    if (!myMembership) {
      return NextResponse.json(
        { error: "You are not a member of this team" },
        { status: 403 }
      );
    }

    // Get target member
    const targetMember = await db.teamMember.findUnique({
      where: { id: memberId },
      include: { user: true },
    });

    if (!targetMember || targetMember.teamId !== teamId) {
      return NextResponse.json(
        { error: "Member not found" },
        { status: 404 }
      );
    }

    // LEAVE - User leaves the team themselves
    if (action === "leave") {
      // Check if this is not the OWNER
      if (myMembership.role === "OWNER") {
        return NextResponse.json(
          { error: "You cannot leave the team as owner. Transfer ownership first or delete the team." },
          { status: 400 }
        );
      }

      // Check if user is removing themselves
      if (targetMember.userId !== session.user.id) {
        return NextResponse.json(
          { error: "You can only leave yourself" },
          { status: 403 }
        );
      }

      await db.teamMember.delete({
        where: { id: memberId },
      });

      return NextResponse.json({ success: true, message: "You have left the team" });
    }

    // REMOVE - Remove another member (OWNER/ADMIN)
    if (action === "remove") {
      // Cannot remove yourself via remove
      if (targetMember.userId === session.user.id) {
        return NextResponse.json(
          { error: "Use 'leave' to leave the team" },
          { status: 400 }
        );
      }

      // Permission check
      if (myMembership.role === "MEMBER") {
        return NextResponse.json(
          { error: "No permission to remove members" },
          { status: 403 }
        );
      }

      // ADMIN cannot remove other ADMIN or OWNER
      if (myMembership.role === "ADMIN" && targetMember.role !== "MEMBER") {
        return NextResponse.json(
          { error: "You can only remove regular members" },
          { status: 403 }
        );
      }

      // OWNER can remove anyone except themselves
      await db.teamMember.delete({
        where: { id: memberId },
      });

      return NextResponse.json({ success: true, message: "Member removed" });
    }

    // UPDATE - Change role (OWNER only)
    if (action === "update" && role) {
      if (myMembership.role !== "OWNER") {
        return NextResponse.json(
          { error: "Only the owner can change roles" },
          { status: 403 }
        );
      }

      // Cannot change OWNER role
      if (targetMember.role === "OWNER") {
        return NextResponse.json(
          { error: "The owner role cannot be changed" },
          { status: 400 }
        );
      }

      await db.teamMember.update({
        where: { id: memberId },
        data: { role },
      });

      return NextResponse.json({ success: true, message: `Role changed to ${role}` });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Member action error:", error);
    return NextResponse.json(
      { error: "Action failed" },
      { status: 500 }
    );
  }
}
