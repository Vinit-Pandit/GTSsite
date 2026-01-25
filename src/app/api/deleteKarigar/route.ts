import { db } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        if (!body || !body.id) {
            return NextResponse.json({ error: "Missing id" }, { status: 400 });
        }
        const { id } = body;
        await db.collection("Karigars").doc(id).delete();
        return NextResponse.json({ id, deleted: true }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: "Failed to delete karigar", details: String(err) }, { status: 500 });
    }
}
