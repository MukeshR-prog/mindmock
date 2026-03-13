import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// ─── Constants ────────────────────────────────────────────────────────────────

const COOKIE_NAME = "mm_token";

/** Routes that do NOT require authentication. */
const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/signup",
  "/forgot-password",
];

/** API routes that are intentionally public (auth / user bootstrap). */
const PUBLIC_API_PREFIXES = [
  "/api/auth/token",
  "/api/auth/logout",
  "/api/users",       // user upsert called right after Firebase sign-in
];

// ─── Helper ───────────────────────────────────────────────────────────────────

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET environment variable is not set");
  return new TextEncoder().encode(secret);
}

async function verifyJwt(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}

// ─── Middleware ───────────────────────────────────────────────────────────────

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Allow Next.js internals and static assets through immediately
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/icon") ||
    pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?)$/)
  ) {
    return NextResponse.next();
  }

  // 2. Allow explicitly public page routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // 3. Allow explicitly public API routes
  if (PUBLIC_API_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  // ── From here, the route requires a valid JWT ──────────────────────────────

  // 4. Try to get JWT from Authorization header first, then cookie
  let token: string | undefined;

  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.slice(7);
  } else {
    token = req.cookies.get(COOKIE_NAME)?.value;
  }

  const isValid = token ? await verifyJwt(token) : false;

  // 5a. API route — return 401 JSON, never redirect
  if (pathname.startsWith("/api/")) {
    if (!isValid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  // 5b. Page route — redirect to /login and preserve the intended destination
  if (!isValid) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// ─── Matcher ──────────────────────────────────────────────────────────────────

export const config = {
  /*
   * Match every route EXCEPT:
   *  - Next.js build files / static assets  (_next/static, _next/image, etc.)
   *  - Files with common static extensions at the root
   */
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
