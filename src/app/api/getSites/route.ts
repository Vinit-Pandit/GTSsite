import { db } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const sitesCollection = await db.collection('Sites').get();
        const sitesDoc = sitesCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        return NextResponse.json(sitesDoc);
    } catch (err) {
        return NextResponse.json({ error: "Failed to fetch sites", details: String(err) }, { status: 500 });
    }
}

//http://localhost:3000/api/getSiteInfo?siteName=Client