import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "golupdfs_admin";
const ALG = "HS256";

function getSecret(): Uint8Array {
  const secret =
    process.env.ADMIN_JWT_SECRET ||
    "dev-only-secret-change-me-this-must-be-at-least-32-chars-long";
  return new TextEncoder().encode(secret);
}

export interface AdminPayload {
  email: string;
  role: "admin";
  iat?: number;
  exp?: number;
}

export async function signAdminToken(email: string): Promise<string> {
  return await new SignJWT({ email, role: "admin" })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(getSecret());
}

export async function verifyAdminToken(token: string): Promise<AdminPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    const adminPayload = payload as unknown as AdminPayload;
    if (adminPayload.role !== "admin") return null;
    return adminPayload;
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminPayload | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifyAdminToken(token);
}

export const AUTH_COOKIE = COOKIE_NAME;

/**
 * Verifies admin authentication for API routes.
 * Checks the admin JWT from either:
 *  1. The golupdfs_admin cookie
 *  2. The Authorization: Bearer <token> header
 *
 * Returns a 401 NextResponse if not authenticated, or null if OK.
 */
export async function verifyAuth(req: Request): Promise<Response | null> {
  const { NextResponse } = await import("next/server");

  // Try cookie first
  const session = await getAdminSession();
  if (session) return null;

  // Try Authorization header as fallback
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    const payload = await verifyAdminToken(token);
    if (payload) return null;
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function authCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 12,
  };
}
