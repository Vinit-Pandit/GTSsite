import { db } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
	const user = getUserFromRequest(request);
	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const body = await request.json();
		if (!body || !body.id) {
			return NextResponse.json({ error: "Missing id" }, { status: 400 });
		}
		const { id } = body;
		await db.collection("Clients").doc(id).delete();
		return NextResponse.json({ id, deleted: true }, { status: 200 });
	} catch (err) {
		return NextResponse.json({ error: "Failed to delete client", details: String(err) }, { status: 500 });
	}
}
