import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";

const updateMapSchema = z.object({
  serverName: z.string().optional(),
  mapSize: z.number().min(1000).max(8000).optional(),
  wipeDate: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
});

// GET - Enkele map sessie ophalen
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
    }

    const { id } = await params;

    const mapSession = await db.mapSession.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: { id: true, displayName: true },
        },
        team: {
          select: { id: true, name: true },
        },
        markers: {
          include: {
            createdBy: {
              select: { id: true, displayName: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!mapSession) {
      return NextResponse.json(
        { error: "Map sessie niet gevonden" },
        { status: 404 }
      );
    }

    return NextResponse.json(mapSession);
  } catch (error) {
    console.error("Get map error:", error);
    return NextResponse.json(
      { error: "Kon map sessie niet ophalen" },
      { status: 500 }
    );
  }
}

// PATCH - Map sessie updaten
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const result = updateMapSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    // Check of gebruiker eigenaar is
    const existingMap = await db.mapSession.findUnique({
      where: { id },
    });

    if (!existingMap) {
      return NextResponse.json(
        { error: "Map sessie niet gevonden" },
        { status: 404 }
      );
    }

    if (existingMap.createdById !== session.user.id) {
      return NextResponse.json(
        { error: "Geen toegang tot deze map sessie" },
        { status: 403 }
      );
    }

    const { serverName, mapSize, wipeDate, isActive } = result.data;

    const mapSession = await db.mapSession.update({
      where: { id },
      data: {
        ...(serverName !== undefined && { serverName }),
        ...(mapSize !== undefined && { mapSize }),
        ...(wipeDate !== undefined && {
          wipeDate: wipeDate ? new Date(wipeDate) : null,
        }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json(mapSession);
  } catch (error) {
    console.error("Update map error:", error);
    return NextResponse.json(
      { error: "Kon map sessie niet updaten" },
      { status: 500 }
    );
  }
}

// DELETE - Map sessie verwijderen
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
    }

    const { id } = await params;

    // Check of gebruiker eigenaar is
    const existingMap = await db.mapSession.findUnique({
      where: { id },
    });

    if (!existingMap) {
      return NextResponse.json(
        { error: "Map sessie niet gevonden" },
        { status: 404 }
      );
    }

    if (existingMap.createdById !== session.user.id) {
      return NextResponse.json(
        { error: "Geen toegang tot deze map sessie" },
        { status: 403 }
      );
    }

    await db.mapSession.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Map sessie verwijderd" });
  } catch (error) {
    console.error("Delete map error:", error);
    return NextResponse.json(
      { error: "Kon map sessie niet verwijderen" },
      { status: 500 }
    );
  }
}
