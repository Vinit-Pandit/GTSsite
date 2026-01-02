import { db } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const karigarsCollection = await db.collection('Karigars').get();
        const karigarsDocs = karigarsCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        return NextResponse.json(karigarsDocs);
    } catch (err) {
        return NextResponse.json({ error: "Failed to fetch karigars", details: String(err) }, { status: 500 });
    }
}

//http://localhost:3000/api/getSiteInfo?siteName=Client