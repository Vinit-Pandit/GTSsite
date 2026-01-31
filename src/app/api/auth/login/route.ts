import { NextResponse } from "next/server";
import admin from "firebase-admin";
import { signToken } from "@/lib/auth";
import "@/lib/firebaseAdmin"; // Ensure Firebase Admin is initialized

// IMPORTANT: admin must already be initialized in firebaseAdmin.ts

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Missing Authorization header" },
        { status: 401 }
      );
    }

    const idToken = authHeader.split("Bearer ")[1];

    // ✅ Verify Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // You now have a VERIFIED user
    const userId = decodedToken.uid;
    const email = decodedToken.email;

    // (Optional) issue your own app token
    const token = signToken({
      sub: userId,
      email,
    });

    const res = NextResponse.json({ ok: true });

    const cookieParts = [
      `token=${token}`,
      `HttpOnly`,
      `Path=/`,
      `Max-Age=${60 * 60 * 24 * 7}`, // 7 days
      `SameSite=Lax`,
    ];

    if (process.env.NODE_ENV === "production") {
      cookieParts.push("Secure");
    }

    res.headers.set("Set-Cookie", cookieParts.join("; "));
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 401 }
    );
  }
}

