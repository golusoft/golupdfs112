import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { insertDbLog } from "@/lib/admin/mock-blog-data";

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false }
  });
}

/**
 * Click Telemetry Tracker Route.
 * Logs click events contextually inside Supabase and redirects users to the target affiliate offer.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug") || "unknown";
    const product = searchParams.get("product") || "unknown";
    const destUrl = searchParams.get("url");

    if (!destUrl) {
      return new NextResponse("Destination URL is required.", { status: 400 });
    }

    const decodedUrl = decodeURIComponent(destUrl);
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    // 1. Log click event to production Supabase
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { error } = await supabase
          .from("affiliate_clicks")
          .insert({
            post_slug: slug,
            product_name: product,
            affiliate_link: decodedUrl,
            user_ip: ip,
            user_agent: userAgent
          });
        if (error) throw error;
      } catch (e) {
        console.warn("Supabase click telemetry write failed, falling back to mock logger:", e);
      }
    }

    // 2. Save click activity locally
    await insertDbLog(
      "affiliate_click",
      "success",
      `Affiliate click registered for product '${product}' from article '/blog/${slug}'. User IP: ${ip}`,
      slug,
      { product, ip, userAgent }
    );

    // 3. Perform clean 302 temp redirect
    return NextResponse.redirect(decodedUrl, 302);
  } catch (error: any) {
    console.error("Click telemetry tracker crashed:", error);
    // If telemetry crash, always protect user navigation path by executing the redirect
    try {
      const { searchParams } = new URL(req.url);
      const destUrl = searchParams.get("url");
      if (destUrl) {
        return NextResponse.redirect(decodeURIComponent(destUrl), 302);
      }
    } catch {}
    return new NextResponse("Server Error", { status: 500 });
  }
}
