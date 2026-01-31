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
		if (!body || !body.id || !body.data) {
			return NextResponse.json({ error: "Missing id or data" }, { status: 400 });
		}
		const { id, data } = body;
		await db.collection("Karigars").doc(id).set(data, { merge: true });
		return NextResponse.json({ id, ...data }, { status: 200 });
	} catch (err) {
		return NextResponse.json({ error: "Failed to update karigar", details: String(err) }, { status: 500 });
	}
}
