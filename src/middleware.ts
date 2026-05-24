import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

/**
 * Edge-safe middleware:
 * 1. Adds basic security headers
 * 2. Implements lightweight in-memory rate limiting per IP for /api/* routes
 * 3. Enforces JWT auth on /admin/(authed) — login page is excluded
 *
 * NOTE: For multi-region production deployments, swap the in-memory bucket
 * for Upstash Redis or Vercel KV. This implementation is per-edge-instance.
 */

const RATE_LIMIT = { window: 60_000, max: 60 }; // 60 req / minute / ip
const buckets = new Map<string, { count: number; reset: number }>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const b = buckets.get(ip);
  if (!b || now > b.reset) {
    buckets.set(ip, { count: 1, reset: now + RATE_LIMIT.window });
    return true;
  }
  if (b.count >= RATE_LIMIT.max) return false;
  b.count += 1;
  return true;
}

async function isAdminTokenValid(token?: string): Promise<boolean> {
  if (!token) return false;
  try {
    const secret = new TextEncoder().encode(
      process.env.ADMIN_JWT_SECRET ||
        "dev-only-secret-change-me-this-must-be-at-least-32-chars-long"
    );
    const { payload } = await jwtVerify(token, secret);
    return (payload as { role?: string }).role === "admin";
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── 1. Rate limit /api/* ──────────────────────────────────────────────────
  if (pathname.startsWith("/api/")) {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (!rateLimit(ip)) {
      return new NextResponse("Too many requests", {
        status: 429,
        headers: { "Retry-After": "60" },
      });
    }
  }

  // ── 2. Protect /admin (except /admin/login) ───────────────────────────────
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = req.cookies.get("golupdfs_admin")?.value;
    const ok = await isAdminTokenValid(token);
    if (!ok) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
  }

  // ── 3. Security headers ──────────────────────────────────────────────────
  const res = NextResponse.next();
  res.headers.set("X-DNS-Prefetch-Control", "on");
  res.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  res.headers.set("X-Frame-Options", "SAMEORIGIN");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return res;
}

export const config = {
  matcher: [
    // Match everything except Next internals and static files
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|opengraph-image|robots.txt|sitemap.xml).*)",
  ],
};
