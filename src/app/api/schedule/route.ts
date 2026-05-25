import { NextResponse } from "next/server";
import {
  runFullAutonomousWorkflow,
  runSeoAgent,
  runInternalLinkingAgent
} from "@/services/multi-agent-engine";
import {
  getDbKeywords,
  updateDbKeywordStatus,
  insertDbLog,
  getDbPosts,
  insertDbPost
} from "@/lib/admin/mock-blog-data";
import { sendDailyPublishingSummary, triggerAlert } from "@/services/cron-orchestrator";
import { revalidatePath } from "next/cache";

const MAX_RETRIES = 3;

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function withRetry<T>(
  fn: () => Promise<T>,
  name: string,
  maxRetries = MAX_RETRIES
): Promise<T | null> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      const delay = Math.pow(2, attempt) * 1500;
      await insertDbLog(
        "cron", "warning",
        `[Retry ${attempt}/${maxRetries}] ${name} failed: ${err.message}. Waiting ${delay}ms...`
      );
      if (attempt < maxRetries) await sleep(delay);
      else {
        await insertDbLog("cron", "failed", `[Retry Exhausted] ${name} failed after ${maxRetries} attempts: ${err.message}`);
      }
    }
  }
  return null;
}

export async function GET(req: Request) {
  const cronStart = Date.now();
  const traceId = `cron-${Date.now().toString(36)}`;
  
  const { searchParams } = new URL(req.url);
  const authQuery = searchParams.get("secret");
  const authHeader = req.headers.get("authorization")?.replace("Bearer ", "");
  const secret = process.env.CRON_SECRET || "super-secret-cron-agent-token-2026";
  
  if (authQuery !== secret && authHeader !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let publishedCount = 0;
  let failedCount = 0;
  let refreshedCount = 0;
  const executionLogs: string[] = [];
  const log = (msg: string) => {
    executionLogs.push(`[${new Date().toISOString()}] ${msg}`);
    console.log(`[Cron ${traceId}] ${msg}`);
  };

  log("Daily cron execution started.");
  await insertDbLog("cron", "running", `Daily cron started. Trace: ${traceId}`);

  let publishedSlug: string | null = null;
  let selectedKeyword: string | null = null;

  // ── STEP 1: Autonomous Article Publishing ──────────────────────────────────
  try {
    const keywords = await getDbKeywords();
    const selectedKw = keywords.find(k => k.status === "approved") ||
                       keywords.find(k => k.status === "discovered");

    if (selectedKw) {
      selectedKeyword = selectedKw.keyword;
      log(`Selected keyword for publishing: '${selectedKeyword}'`);
      await updateDbKeywordStatus(selectedKw.id, "generating");

      const result = await withRetry(
        () => runFullAutonomousWorkflow(selectedKeyword!),
        `Article generation for '${selectedKeyword}'`
      );

      if (result?.post) {
        publishedCount++;
        publishedSlug = result.post.slug;
        await updateDbKeywordStatus(selectedKw.id, "published");
        log(`✅ Published: /blog/${publishedSlug}`);
      } else {
        failedCount++;
        await updateDbKeywordStatus(selectedKw.id, "discovered"); // Reset for retry
        log(`❌ Publishing failed for '${selectedKeyword}' — keyword reset to queue.`);
      }
    } else {
      log("No keywords in backlog. Skipping new article step.");
    }
  } catch (err: any) {
    failedCount++;
    log(`FATAL error in publishing step: ${err.message}`);
    await insertDbLog("cron", "failed", `Cron publish step crashed: ${err.message}`);
  }

  // ── STEP 2: Rank Stabilization (Re-optimize oldest article) ───────────────
  try {
    const posts = await getDbPosts();
    if (posts.length > 0) {
      const oldest = [...posts].sort(
        (a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
      )[0];

      log(`Rank stabilizer refreshing: '${oldest.title}'`);
      await insertDbLog("old_articles_update", "running",
        `Rank stabilizer re-linking: '${oldest.title}'`, oldest.keywords?.[0]);

      const relinked = await withRetry(
        () => runInternalLinkingAgent(oldest.content, oldest.slug),
        "Internal link refresh"
      );

      if (relinked) {
        oldest.content = relinked;
        oldest.updated_at = new Date().toISOString();
        oldest.seo_score = Math.min((oldest.seo_score || 0) + 1, 100);
        await insertDbPost(oldest);
        refreshedCount++;
        log(`✅ Refreshed: '${oldest.title}'`);
        await insertDbLog("old_articles_update", "success",
          `Rank stabilizer refreshed '${oldest.title}'.`, oldest.keywords?.[0]);
      }
    }
  } catch (err: any) {
    log(`Rank stabilizer step failed (non-blocking): ${err.message}`);
    await insertDbLog("old_articles_update", "failed", `Rank stabilizer: ${err.message}`);
  }

  // ── STEP 3: ISR Cache Revalidation ────────────────────────────────────────
  try {
    revalidatePath("/blog");
    revalidatePath("/sitemap.xml");
    if (publishedSlug) revalidatePath(`/blog/${publishedSlug}`);
    log("ISR cache revalidated.");
  } catch (e) { log("ISR revalidation skipped (non-critical)."); }

  // ── STEP 4: Daily Summary Alert ────────────────────────────────────────────
  const durationMs = Date.now() - cronStart;
  log(`Cron completed in ${durationMs}ms. Published: ${publishedCount}, Failed: ${failedCount}, Refreshed: ${refreshedCount}`);
  
  await sendDailyPublishingSummary(publishedCount, failedCount, 1, executionLogs);
  await insertDbLog("cron", publishedCount > 0 ? "success" : "warning",
    `Cron done. Published: ${publishedCount}, Failed: ${failedCount}, Refreshed: ${refreshedCount}. Duration: ${durationMs}ms`,
    undefined,
    { traceId, publishedSlug, durationMs }
  );

  return NextResponse.json({
    success: true,
    traceId,
    published: publishedCount,
    failed: failedCount,
    refreshed: refreshedCount,
    durationMs,
    slug: publishedSlug,
    keyword: selectedKeyword,
    logs: executionLogs.slice(-10),
  });
}
