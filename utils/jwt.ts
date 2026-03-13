import { SignJWT, jwtVerify, createRemoteJWKSet } from "jose";
import { cookies } from "next/headers";

// ─── Constants ───────────────────────────────────────────────────────────────

export const COOKIE_NAME = "mm_token";

const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET environment variable is not set");
  return new TextEncoder().encode(secret);
};

const IS_PRODUCTION = process.env.NODE_ENV === "production";

export const TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: IS_PRODUCTION,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

// ─── App JWT ─────────────────────────────────────────────────────────────────

export interface TokenPayload {
  firebaseUid: string;
  email: string;
}

/** Sign a new JWT with the application secret. */
export async function signToken(payload: TokenPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

/** Verify an application JWT and return its payload. Throws on invalid/expired token. */
export async function verifyToken(token: string): Promise<TokenPayload> {
  const { payload } = await jwtVerify(token, getSecret());
  return payload as unknown as TokenPayload;
}

// ─── Firebase ID Token Verification ─────────────────────────────────────────

const FIREBASE_JWKS = createRemoteJWKSet(
  new URL(
    "https://www.googleapis.com/robot/v1/metadata/jwk/securetoken@system.gserviceaccount.com"
  )
);

/** Verify a Firebase ID token using Google's public JWKS. Returns { sub, email }. */
export async function verifyFirebaseToken(
  idToken: string
): Promise<{ sub: string; email?: string }> {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) throw new Error("NEXT_PUBLIC_FIREBASE_PROJECT_ID is not set");

  const { payload } = await jwtVerify(idToken, FIREBASE_JWKS, {
    issuer: `https://securetoken.google.com/${projectId}`,
    audience: projectId,
  });

  return { sub: payload.sub as string, email: payload["email"] as string | undefined };
}

// ─── Route Auth Helper ────────────────────────────────────────────────────────

/**
 * Verify the JWT from the mm_token cookie (or Authorization: Bearer header).
 * Returns the decoded payload or throws with a descriptive message.
 */
export async function verifyAuth(req: Request): Promise<TokenPayload> {
  // 1. Check Authorization: Bearer <token> header
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    return verifyToken(token);
  }

  // 2. Fall back to httpOnly cookie
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    throw new Error("Unauthorized: No token provided");
  }

  return verifyToken(token);
}
