import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	const user = getUserFromRequest(request);
	if (!user) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}
	// return basic user info from token payload
	return NextResponse.json({ message: "ok", user });
}
