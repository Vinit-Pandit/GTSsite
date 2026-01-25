// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { getApps, initializeApp, cert } from "firebase-admin/app";
import { Runtime } from "firebase-admin/extensions";

// Initialize Firebase Admin (in case this middleware is first import)
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    }),
  });
}

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

  // Extract token from cookie
  const token = request.cookies.get("token")?.value;

  if (!token) {
    console.log("No Firebase token found in cookie, redirecting to /login");
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verify Firebase ID token
  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    // Token is valid — you can also attach user info as headers if needed
    console.log("Firebase token verified for UID:", decodedToken.uid);
    return NextResponse.next();
  } catch (err) {
    console.log("Invalid or expired Firebase token:", err);
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }
}

// Apply middleware to all paths except _next, static, favicon.ico, and login/register APIs
export const config = {
  matcher: ["/((?!_next|static|favicon.ico|api/auth/login|api/auth/register).*)"],
  runtime: "nodejs",
};

