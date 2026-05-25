import { NextResponse } from "next/server";
import { runFullAutonomousWorkflow } from "@/services/multi-agent-engine";
import { insertDbLog } from "@/lib/admin/mock-blog-data";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const keyword = body.keyword;

    if (!keyword) {
      return NextResponse.json({ error: "Target keyword is required." }, { status: 400 });
    }

    // Fire the entire 9-agent pipeline
    const result = await runFullAutonomousWorkflow(keyword);

    if (!result.post) {
      return NextResponse.json({
        success: false,
        logs: result.logs,
        error: "Orchestration pipeline failed to create post."
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      slug: result.post.slug,
      seo_score: result.post.seo_score,
      post: result.post,
      logs: result.logs
    });
  } catch (error: any) {
    await insertDbLog("publish", "failed", `Generate Blog API failed: ${error.message || error}`);
    return NextResponse.json({ error: error.message || "Failed blog generation" }, { status: 500 });
  }
}
export const maxDuration = 60; // Extend Vercel runtime to 60 seconds (for multi-agent writing depth)
