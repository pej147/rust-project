import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";

// Validation schema for creating enemy profile
const createEnemySchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  clanTag: z.string().max(10).optional(),
  notes: z.string().max(500).optional(),
  threatLevel: z.number().min(1).max(5).default(1),
});

// GET - Search/list enemy profiles
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    const enemies = await db.enemyProfile.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search } },
              { clanTag: { contains: search } },
            ],
          }
        : undefined,
      orderBy: { name: "asc" },
      take: 50,
    });

    return NextResponse.json(enemies);
  } catch (error) {
    console.error("Get enemies error:", error);
    return NextResponse.json(
      { error: "Could not fetch enemies" },
      { status: 500 }
    );
  }
}

// POST - Create new enemy profile
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const body = await request.json();
    const result = createEnemySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, clanTag, notes, threatLevel } = result.data;

    const enemy = await db.enemyProfile.create({
      data: {
        name,
        clanTag: clanTag || null,
        notes: notes || null,
        threatLevel,
      },
    });

    return NextResponse.json(enemy, { status: 201 });
  } catch (error) {
    console.error("Create enemy error:", error);
    return NextResponse.json(
      { error: "Could not create enemy" },
      { status: 500 }
    );
  }
}
