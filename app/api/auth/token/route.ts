import { NextResponse } from "next/server";
import {
  verifyFirebaseToken,
  signToken,
  COOKIE_NAME,
  TOKEN_COOKIE_OPTIONS,
} from "@/utils/jwt";
import { connectDB } from "@/config/mongodb";
import User from "@/models/User";

/**
 * POST /api/auth/token
 * Accepts a Firebase ID token, verifies it with Google's JWKS,
 * then issues a signed application JWT stored as an httpOnly cookie.
 *
 * Body: { idToken: string }
 */
export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();

    if (!idToken || typeof idToken !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid idToken" },
        { status: 400 }
      );
    }

    // Verify the Firebase ID token against Google's public keys
    const { sub: firebaseUid, email } = await verifyFirebaseToken(idToken);

    // Ensure the user record exists in MongoDB (upsert on first login)
    await connectDB();
    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Sign our own short-lived JWT
    const appToken = await signToken({
      firebaseUid,
      email: email ?? user.email,
    });

    // Return the token in an httpOnly cookie
    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE_NAME, appToken, TOKEN_COOKIE_OPTIONS);
    return res;
  } catch (err: any) {
    console.error("AUTH TOKEN ERROR:", err?.message ?? err);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 401 }
    );
  }
}
