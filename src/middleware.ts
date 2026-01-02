import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public paths that don't require authentication
const PUBLIC_PATHS = [
  "/login",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/health",
  "/_next/",
  "/static/",
  "/favicon.ico",
  "/robots.txt",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths unchanged
  for (const p of PUBLIC_PATHS) {
    if (pathname === p || pathname.startsWith(p)) {
      return NextResponse.next();
    }
  }

  // Extract token from cookie or Authorization header (Edge-compatible APIs)
  const cookieToken = request.cookies.get("token")?.value ?? null;
  const authHeader = request.headers.get("authorization") ?? "";
  const bearerToken = authHeader.toLowerCase().startsWith("bearer ") ? authHeader.slice(7).trim() : null;
  const token = cookieToken || bearerToken;

  // If no token -> API: 401 JSON, Page: redirect to /login
  if (!token) {
    if (pathname.startsWith("/api")) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    // preserve original path (optional)
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Token present — allow request. (Server-side handlers should verify signature/expiry.)
  return NextResponse.next();
}

// Apply middleware broadly but exclude static/_next and auth login/register explicitly
export const config = {
  matcher: ["/((?!_next|static|favicon.ico|api/auth/login|api/auth/register).*)"],
};
