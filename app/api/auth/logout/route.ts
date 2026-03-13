import { NextResponse } from "next/server";
import { COOKIE_NAME, TOKEN_COOKIE_OPTIONS } from "@/utils/jwt";

/**
 * POST /api/auth/logout
 * Clears the application JWT cookie.
 */
export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, "", {
    ...TOKEN_COOKIE_OPTIONS,
    maxAge: 0,
  });
  return res;
}
