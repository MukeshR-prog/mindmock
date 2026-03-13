import { NextResponse } from "next/server";
import { connectDB } from "@/config/mongodb";
import User from "@/models/User";
import { verifyFirebaseToken } from "@/utils/jwt";

/**
 * POST /api/users
 *
 * Bootstrap / upsert the user record in MongoDB right after Firebase sign-in.
 * This endpoint is called BEFORE our own JWT cookie is issued, so we cannot
 * use the app JWT here. Instead we require the raw Firebase ID token sent as
 *   Authorization: Bearer <firebase-id-token>
 * and verify it against Google's JWKS before trusting the payload.
 */
export async function POST(req: Request) {
  try {
    // ── Verify the caller's Firebase ID token ──────────────────────────────
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const idToken = authHeader.slice(7);
    let firebasePayload: { sub: string; email?: string };
    try {
      firebasePayload = await verifyFirebaseToken(idToken);
    } catch {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ── Upsert the user record ────────────────────────────────────────────
    await connectDB();

    const body = await req.json();
    // Trust the firebaseUid from the verified token, NOT from the body
    const { firebaseUid: bodyUid, email, name, provider } = body;

    // Safety: ensure the token's sub matches the body's uid
    if (firebasePayload.sub !== bodyUid) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const firebaseUid = firebasePayload.sub;

    let user = await User.findOne({ firebaseUid });
    if (!user) {
      user = await User.create({
        firebaseUid,
        email: email ?? firebasePayload.email,
        name,
        provider,
      });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "User creation failed" },
      { status: 500 }
    );
  }
}

