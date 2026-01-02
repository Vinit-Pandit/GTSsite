import { db } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams }  = new URL(request.url);
    const siteName = searchParams.get("siteName");
    if ( !siteName ) {
        return new Response( "Missing SiteName", { status: 400 } );
    }
    const siteDoc = await db.collection('Sites').doc(siteName).get();
    return NextResponse.json(siteDoc.data());
}

//http://localhost:3000/api/getSiteInfo?siteName=Client