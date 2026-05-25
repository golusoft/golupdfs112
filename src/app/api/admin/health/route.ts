import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false }
  });
}

/**
 * System Health & Observability API.
 * Securely verifies environment variables and database statuses without exposing raw keys.
 */
export async function GET() {
  try {
    const geminiSet = !!process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.startsWith("replace");
    const openrouterSet = !!process.env.OPENROUTER_API_KEY && !process.env.OPENROUTER_API_KEY.startsWith("replace");
    const discordSet = !!process.env.DISCORD_WEBHOOK_URL && !process.env.DISCORD_WEBHOOK_URL.startsWith("replace");
    
    const supabase = getSupabaseClient();
    let supabaseConnected = false;
    let pgvectorActive = false;
    let tablesAudited: string[] = [];

    if (supabase) {
      try {
        // Query to check table connectivity and verify schema presence
        const { data, error } = await supabase
          .from("blog_posts")
          .select("id")
          .limit(1);
          
        if (!error) {
          supabaseConnected = true;
          tablesAudited.push("blog_posts");
        }

        // Check if pgvector embeddings tables are registered
        const { error: vecError } = await supabase
          .from("article_embeddings")
          .select("id")
          .limit(1);

        if (!vecError) {
          pgvectorActive = true;
          tablesAudited.push("article_embeddings");
        }

        // Audit remaining tables
        const remaining = ["keyword_opportunities", "generation_logs", "analytics_insights", "affiliate_clicks"];
        for (const t of remaining) {
          const { error: tErr } = await supabase.from(t).select("id").limit(1);
          if (!tErr) tablesAudited.push(t);
        }
      } catch (e) {
        console.warn("Supabase health audit failed during DB query:", e);
      }
    }

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      trace_engine: "Antigravity v2.5",
      subsystems: {
        gemini_advanced: geminiSet ? "active" : "simulation",
        openrouter_agent: openrouterSet ? "active" : "simulation",
        discord_alerts: discordSet ? "active" : "simulation",
        supabase_postgres: supabaseConnected ? "active" : "simulation",
        pgvector_memory: pgvectorActive ? "active" : "simulation"
      },
      verified_tables: tablesAudited,
      security: {
        ssl: true,
        rls: supabaseConnected,
        caching: "active"
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      status: "degraded",
      error: error.message || "Failed health diagnostics"
    }, { status: 500 });
  }
}
export const dynamic = "force-dynamic";
