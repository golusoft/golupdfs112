import { NextResponse } from "next/server";
import { runResearchAgent } from "@/services/multi-agent-engine";
import { insertDbKeyword, insertDbLog } from "@/lib/admin/mock-blog-data";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const seedTopic = body.topic || "PDF productivity tools";

    // Trigger AI Research Agent
    const keywords = await runResearchAgent(seedTopic);

    // Save newly discovered opportunities into the DB
    for (const kw of keywords) {
      await insertDbKeyword({
        keyword: kw.keyword,
        difficulty: kw.difficulty || 30,
        search_volume: kw.search_volume || 1000,
        intent: kw.intent || "Informational",
        opportunity_score: kw.opportunity_score || 50,
        status: "discovered",
        suggested_title: kw.suggested_title || `Comprehensive Guide to ${kw.keyword}`,
        title_variations: kw.title_variations || [kw.suggested_title],
        topic_cluster: kw.topic_cluster || "General",
        is_pillar: kw.is_pillar || false
      });
    }

    return NextResponse.json({
      success: true,
      count: keywords.length,
      keywords
    });
  } catch (error: any) {
    await insertDbLog("research", "failed", `Research API failed: ${error.message || error}`);
    return NextResponse.json({ error: error.message || "Failed keyword research" }, { status: 500 });
  }
}
