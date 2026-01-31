// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getUserFromRequest } from "./lib/auth";

// Import firebaseAdmin to ensure it's initialized
import "./lib/firebaseAdmin";

// List of paths that do NOT require authentication
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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  for (const p of PUBLIC_PATHS) {
    if (pathname === p || pathname.startsWith(p)) {
      return NextResponse.next();
    }
  }

  // Extract and verify JWT token from cookies or Authorization header
  const user = getUserFromRequest(request);

  if (!user) {
    console.log("No valid token found, redirecting to /login");
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Token is valid
  console.log("User verified:", user.sub || user.email);
  return NextResponse.next();
}

// Apply middleware to all paths except _next, static, favicon.ico, and login/register APIs
export const config = {
  matcher: ["/((?!_next|static|favicon.ico|api/auth/login|api/auth/register).*)"],
  runtime: "nodejs",
};

