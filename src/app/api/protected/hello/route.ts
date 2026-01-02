import { NextResponse } from "next/server";
import { parseTokenFromCookie, verifyToken } from "@/lib/auth";

export async function GET(request: Request) {
	const cookieHeader = request.headers.get("cookie") || "";
	const token = parseTokenFromCookie(cookieHeader);
	if (!token) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}
	const payload = verifyToken(token);
	if (!payload) {
		return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
	}
	// return basic user info from token payload
	return NextResponse.json({ message: "ok", user: payload });
}
