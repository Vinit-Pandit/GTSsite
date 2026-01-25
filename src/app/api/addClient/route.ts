import { db } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
	const user = getUserFromRequest(request);
	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const body = await request.json().catch(() => null);
	if (!body) {
		return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
	}

	// Minimal validation of required fields
	const required = ["siteName", "clientName", "siteBill", "paymentType", "date"];
	for (const key of required) {
		if (body[key] === undefined || body[key] === null || body[key] === "") {
			return NextResponse.json({ error: `Missing required field: ${key}` }, { status: 400 });
		}
	}

	const siteBill = Number(body.siteBill) || 0;

	// If client sends paymentReceived, compute paymentRemaining. Otherwise use provided paymentRemaining or default to siteBill.
	let paymentRemaining: number;
	if (body.paymentReceived !== undefined && body.paymentReceived !== null) {
		paymentRemaining = siteBill - Number(body.paymentReceived || 0);
	} else if (body.paymentRemaining !== undefined && body.paymentRemaining !== null) {
		paymentRemaining = Number(body.paymentRemaining);
	} else {
		paymentRemaining = siteBill;
	}

	const docData = {
		// ...existing code...
		siteName: body.siteName,
		clientName: body.clientName,
		siteBill: siteBill,
		paymentType: body.paymentType,
		paymentRemaining: paymentRemaining,
		remarks: body.remarks || "",
		driveLink: body.driveLink || "",
		mobileNumber: body.mobileNumber || "",
		address: body.address || "",
		architectureOrPMC: body.architectureOrPMC || "",
		date: body.date,
		createdAt: new Date().toISOString(),
	};

	try {
		const docRef = await db.collection("Clients").add(docData);
		return NextResponse.json({ id: docRef.id, ...docData }, { status: 201 });
	} catch (err) {
		return NextResponse.json({ error: "Failed to add client", details: String(err) }, { status: 500 });
	}
}
