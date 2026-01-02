import { db } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const siteName = searchParams.get("siteName");
    const karigarsCollection = await db.collection('Karigars').where('siteName', '==', siteName).get();
    const karigarsDocs = karigarsCollection.docs.map((doc) => doc.data());
    return NextResponse.json(karigarsDocs);
}

//http://localhost:3000/api/getSiteInfo?siteName=Client