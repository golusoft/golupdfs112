import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";
import { TOOLS } from "@/lib/tools";

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false }
  });
}

export async function GET(req: Request) {
  try {
    const authError = await verifyAuth(req);
    if (authError) return authError;

    const supabase = getSupabaseClient();
    let logs: any[] = [];

    if (supabase) {
      try {
        const { data } = await supabase
          .from("generation_logs")
          .select("*")
          .eq("action", "tool_run");
        if (data) logs = data;
      } catch {}
    }

    // Map tools with dynamic aggregates
    const toolStats = TOOLS.map((t, i) => {
      // Filter log counts for this specific tool slug
      const runs = logs.filter(l => l.payload?.tool === t.slug || l.keyword?.includes(t.slug));
      const totalRuns = runs.length;
      
      // Calculate real conversion rate based on actual database logs
      const successRuns = runs.filter(l => l.status === "success" || l.status === "completed").length;
      const convRate = totalRuns > 0 ? Math.round((successRuns / totalRuns) * 100 * 10) / 10 : 0.0;
      
      // Calculate real latency based on payload performance metrics
      const latencies = runs.map(l => l.payload?.duration_ms || l.payload?.latency).filter(Boolean);
      const avgTime = latencies.length > 0 
        ? Math.round(latencies.reduce((s, x) => s + x, 0) / latencies.length) 
        : 0;

      return {
        slug: t.slug,
        name: t.shortName,
        category: t.category,
        uses: totalRuns,
        conversionRate: convRate,
        avgTime: avgTime
      };
    }).sort((a, b) => b.uses - a.uses);

    return NextResponse.json({
      tools: toolStats,
      source: supabase ? "Supabase DB" : "Fallback Key Pending"
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch tools analytics" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";

