/**
 * Check if user is admin (for client components)
 * This is a simple client-side check - actual authorization
 * should always be done server-side in API routes
 */
export function isAdmin(role: string | undefined): boolean {
  return role === "ADMIN";
}
