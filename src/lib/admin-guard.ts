import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "./auth";

/**
 * Check if the current user is an admin (server-side)
 * Returns the session if admin, or a 403 response if not
 */
export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return {
      error: NextResponse.json(
        { error: "Unauthorized - Please log in" },
        { status: 401 }
      ),
      session: null,
    };
  }

  if (session.user.role !== "ADMIN") {
    return {
      error: NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      ),
      session: null,
    };
  }

  return { error: null, session };
}
