import { db } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	const user = getUserFromRequest(request);
	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const coll = await db.collection("Clients").get();
		const docs = coll.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
		return NextResponse.json(docs);
	} catch (err) {
		return NextResponse.json({ error: "Failed to fetch clients", details: String(err) }, { status: 500 });
	}
}
