import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";

const joinTeamSchema = z.object({
  code: z.string().length(6, "Team code must be 6 characters").toUpperCase(),
});

// POST - Join a team with code
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const body = await request.json();
    const result = joinTeamSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { code } = result.data;

    // Find team by code
    const team = await db.team.findUnique({
      where: { code },
      include: {
        members: {
          select: { userId: true },
        },
      },
    });

    if (!team) {
      return NextResponse.json(
        { error: "Team not found. Please check the code." },
        { status: 404 }
      );
    }

    // Check if user is already a member
    const isAlreadyMember = team.members.some((m) => m.userId === session.user.id);
    if (isAlreadyMember) {
      return NextResponse.json(
        { error: "You are already a member of this team" },
        { status: 400 }
      );
    }

    // Add user as MEMBER
    await db.teamMember.create({
      data: {
        teamId: team.id,
        userId: session.user.id,
        role: "MEMBER",
      },
    });

    // Fetch updated team
    const updatedTeam = await db.team.findUnique({
      where: { id: team.id },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, displayName: true },
            },
          },
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

    return NextResponse.json(updatedTeam, { status: 200 });
  } catch (error) {
    console.error("Join team error:", error);
    return NextResponse.json(
      { error: "Could not join team" },
      { status: 500 }
    );
  }
}
