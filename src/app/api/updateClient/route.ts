import { db } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		if (!body || !body.id || !body.data) {
			return NextResponse.json({ error: "Missing id or data" }, { status: 400 });
		}
		const { id, data } = body;
		await db.collection("Clients").doc(id).set(data, { merge: true });
		return NextResponse.json({ id, ...data }, { status: 200 });
	} catch (err) {
		return NextResponse.json({ error: "Failed to update client", details: String(err) }, { status: 500 });
	}
}
