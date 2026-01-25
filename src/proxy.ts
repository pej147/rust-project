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

        // /map en /map/guest/* zijn publiek (guest mode) - geen login nodig
        if (pathname === "/map" || pathname.startsWith("/map/guest")) {
          return true;
        }

        // Alle andere beschermde routes vereisen login
        return !!token;
      },
    },
  }
);

// Bescherm deze routes - vereist inloggen
// Let op: /map is publiek (guest mode), maar /map/new en /map/[id] zijn beschermd
export const config = {
  matcher: ["/map", "/map/:path*", "/teams/:path*", "/profile/:path*", "/admin/:path*"],
};
