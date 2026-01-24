import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";

const registerSchema = z.object({
  email: z.string().email("Ongeldig email adres"),
  password: z
    .string()
    .min(8, "Wachtwoord moet minimaal 8 karakters zijn")
    .max(100, "Wachtwoord mag maximaal 100 karakters zijn"),
  displayName: z
    .string()
    .min(2, "Naam moet minimaal 2 karakters zijn")
    .max(50, "Naam mag maximaal 50 karakters zijn"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Valideer input
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password, displayName } = result.data;

    // Check of email al bestaat
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Er bestaat al een account met dit email adres" },
        { status: 400 }
      );
    }

    // Hash wachtwoord
    const passwordHash = await hash(password, 12);

    // Maak gebruiker aan
    const user = await db.user.create({
      data: {
        email,
        passwordHash,
        displayName,
      },
    });

    return NextResponse.json(
      {
        message: "Account aangemaakt",
        user: {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Er is iets misgegaan bij het registreren" },
      { status: 500 }
    );
  }
}
