import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { signToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body ?? {};

    if (!username || !password) {
      return NextResponse.json({ message: "Missing credentials" }, { status: 400 });
    }

    // Replace mock DB lookup with Firestore query
    const usersQuery = await db.collection("users").where("username", "==", username).limit(1).get();
    if (usersQuery.empty) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const userDoc = usersQuery.docs[0];
    console.log(userDoc.data());
    const user = { id: userDoc.id, ...(userDoc.data() as any) };

    // Plain-text password comparison against stored "password" field
    if (password !== user.password) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // sign token
    const token = signToken({ sub: user.id, username: user.username });

    // set httpOnly cookie
    const res = NextResponse.json({ ok: true });
    const cookieOptions = [
      `token=${token}`,
      `HttpOnly`,
      `Path=/`,
      `Max-Age=${60 * 60 * 24 * 7}`, // 7 days
      `SameSite=Lax`,
      // Secure should be enabled in production (HTTPS)
    ];
    // Only set Secure in production
    if (process.env.NODE_ENV === "production") cookieOptions.push("Secure");

    res.headers.set("Set-Cookie", cookieOptions.join("; "));
    return res;
  } catch (err) {
    console.log(err)
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
