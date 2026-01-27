import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Admin routes - alleen voor admins
    if (pathname.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;

        // Alle /map routes zijn publiek - login is optioneel
        if (pathname.startsWith("/map")) {
          return true;
        }

        // Alle andere beschermde routes vereisen login
        return !!token;
      },
    },
  }
);

// Bescherm deze routes
// Let op: /map/* is volledig publiek - login is optioneel
export const config = {
  matcher: ["/map", "/map/:path*", "/teams/:path*", "/profile/:path*", "/admin/:path*"],
};
