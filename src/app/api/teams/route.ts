import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";

// Generate a unique team code (6 characters, alphanumeric)
function generateTeamCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // No I/O/0/1 for readability
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

const createTeamSchema = z.object({
  name: z.string().min(2, "Team name must be at least 2 characters").max(30, "Team name cannot exceed 30 characters"),
});

// GET - List teams the user is a member of
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const teams = await db.team.findMany({
      where: {
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
      include: {
        members: {
          select: {
            id: true,
            role: true,
            userId: true,
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
      orderBy: { createdAt: "desc" },
    });

    // Add userRole for frontend
    const teamsWithUserRole = teams.map((team) => {
      const userMembership = team.members.find((m) => m.userId === session.user.id);
      return {
        ...team,
        userRole: userMembership?.role || null,
      };
    });

    return NextResponse.json(teamsWithUserRole);
  } catch (error) {
    console.error("Get teams error:", error);
    return NextResponse.json(
      { error: "Could not fetch teams" },
      { status: 500 }
    );
  }
}

// POST - Create a new team
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const body = await request.json();
    const result = createTeamSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name } = result.data;

    // Generate unique code
    let code = generateTeamCode();
    let attempts = 0;
    while (attempts < 10) {
      const existing = await db.team.findUnique({ where: { code } });
      if (!existing) break;
      code = generateTeamCode();
      attempts++;
    }

    // Create team with creator as OWNER
    const team = await db.team.create({
      data: {
        name,
        code,
        members: {
          create: {
            userId: session.user.id,
            role: "OWNER",
          },
        },
      },
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

    return NextResponse.json(team, { status: 201 });
  } catch (error) {
    console.error("Create team error:", error);
    return NextResponse.json(
      { error: "Could not create team" },
      { status: 500 }
    );
  }
}
