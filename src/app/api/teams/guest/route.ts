import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import crypto from "crypto";

// Generate a unique team code (6 characters, alphanumeric)
function generateTeamCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Generate a secure guest token (32 characters)
function generateGuestToken(): string {
  return crypto.randomBytes(16).toString("hex");
}

const createGuestTeamSchema = z.object({
  name: z
    .string()
    .min(2, "Team name must be at least 2 characters")
    .max(30, "Team name cannot exceed 30 characters"),
  guestName: z
    .string()
    .min(1, "Guest name is required")
    .max(20, "Guest name cannot exceed 20 characters"),
});

// POST - Create a guest team (no auth required)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = createGuestTeamSchema.safeParse(body);

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

    const guestToken = generateGuestToken();

    // Create team without members (guest has no userId)
    const team = await db.team.create({
      data: {
        name,
        code,
        guestToken,
      },
    });

    return NextResponse.json(
      {
        code: team.code,
        guestToken,
        teamName: team.name,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create guest team error:", error);
    return NextResponse.json(
      { error: "Could not create team" },
      { status: 500 }
    );
  }
}
