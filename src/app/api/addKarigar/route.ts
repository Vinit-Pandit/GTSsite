import { db } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	// Parse body
	const body = await request.json().catch(() => null);
	if (!body) {
		return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
	}

	// Minimal validation of required fields
	const required = [
		"siteName",
		"karigarName",
		"karigarSiteBill",
		"paymentType",
		"paymentAmount",
		"paymentDate",
		"paymentGivenBy",
	];
	for (const key of required) {
		if (body[key] === undefined || body[key] === null || body[key] === "") {
			return NextResponse.json({ error: `Missing required field: ${key}` }, { status: 400 });
		}
	}

	// Compute remainingAmount if not provided
	const karigarSiteBill = Number(body.karigarSiteBill) || 0;
	const paymentAmount = Number(body.paymentAmount) || 0;
	const remainingAmount =
		body.remainingAmount !== undefined && body.remainingAmount !== null
			? Number(body.remainingAmount)
			: karigarSiteBill - paymentAmount;

	// Prepare document
	const docData = {
		// ...existing code...
		siteName: body.siteName,
		karigarName: body.karigarName,
		karigarSiteBill: karigarSiteBill,
		paymentType: body.paymentType,
		referenceOrChequeNumber: body.referenceOrChequeNumber || "",
		bankName: body.bankName || "",
		paymentAmount: paymentAmount,
		paymentDate: body.paymentDate,
		remainingAmount: remainingAmount,
		paymentGivenBy: body.paymentGivenBy,
		documentLinkTitle: body.documentLinkTitle || "",
		documentDriveLink: body.documentDriveLink || "",
		createdAt: new Date().toISOString(),
	};

	try {
		const docRef = await db.collection("Karigars").add(docData);
		return NextResponse.json({ id: docRef.id, ...docData }, { status: 201 });
	} catch (err) {
		return NextResponse.json({ error: "Failed to add karigar", details: String(err) }, { status: 500 });
	}
}
