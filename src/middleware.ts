// The purpose of the middleware is to control user access based on authentication state and handle automatic redirection in Next.js application.
// It acts as a gatekeeper that runs before every request to certain routes and decides what should happen next.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export { default } from "next-auth/middleware"; // Leverage NextAuth's built-in middleware for handling sessions
import { getToken } from "next-auth/jwt";

/**
 * Custom middleware to handle authentication-based routing.
 *
 * This middleware runs before every request to determine whether
 * the user should be allowed to access a certain page based on
 * whether they are authenticated or not.
 */
export async function middleware(request: NextRequest) {
  // Retrieve the JWT token from the user's cookies using NextAuth
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET, // Secret used to decrypt the token
  });

  const url = request.nextUrl; // Current requested URL

  /**
   * If the user is logged in (has a valid token) and tries to visit:
   * - Sign-in page
   * - Sign-up page
   * - Email verification page
   * - Home page
   *
   * Then redirect them to the dashboard because they don't need to see
   * these public or onboarding pages once authenticated.
   */
  if (
    token &&
    (url.pathname.startsWith("/sign-in") ||
      url.pathname.startsWith("/sign-up") ||
      url.pathname.startsWith("/verify") ||
      url.pathname.startsWith("/"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  /**
   * If the user is NOT logged in (no token found) and tries to access:
   * - Any `/dashboard` page (protected routes),
   *
   * Then redirect them to the sign-in page to authenticate first.
   */
  if (!token && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // If none of the above conditions match, allow the request to proceed as normal
  return NextResponse.next();
}

/**
 * Configuration for which paths this middleware will run on.
 *
 * `matcher` defines a list of routes where the middleware is active:
 * - `/sign-in`        → Sign-in page
 * - `/sign-up`        → Sign-up page
 * - `/`               → Home page
 * - `/dashboard/:path*` → All dashboard pages and nested routes
 * - `/verify/:path*`    → All email verification pages and nested routes
 */
export const config = {
  matcher: ["/sign-in", "/sign-up", "/", "/dashboard/:path*", "/verify/:path*"],
};
