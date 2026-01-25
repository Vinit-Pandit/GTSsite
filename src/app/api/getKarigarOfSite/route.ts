import { db } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const user = getUserFromRequest(request);
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const siteName = searchParams.get("siteName");
    const karigarsCollection = await db.collection('Karigars').where('siteName', '==', siteName).get();
    const karigarsDocs = karigarsCollection.docs.map((doc) => doc.data());
    return NextResponse.json(karigarsDocs);
}

//http://localhost:3000/api/getSiteInfo?siteName=Client