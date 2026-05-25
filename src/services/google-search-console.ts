import { getDbPosts, insertDbInsight, insertDbLog, BlogPost } from "@/lib/admin/mock-blog-data";

export interface GscStats {
  impressions: number;
  clicks: number;
  ctr: number;
  position: number;
  keyword: string;
}

/**
 * Google Search Console & Indexing API Integration Service.
 */

/**
 * 1. Automatic Indexing Request
 * Sends indexation ping to Google Indexing API on article publications.
 */
export async function requestGoogleIndexing(url: string): Promise<{ success: boolean; message: string }> {
  try {
    // In production: Google APIs auth client with JWT service account
    // POST 'https://indexing.googleapis.com/v1/urlNotifications:publish'
    await insertDbLog("publish", "success", `Google Indexing API: Sent publication notification for URL: ${url}`);
    
    return {
      success: true,
      message: `Google Indexing API: Indexation requested for ${url} successfully.`
    };
  } catch (error: any) {
    await insertDbLog("publish", "failed", `Google Indexing API failed for URL ${url}: ${error.message}`);
    return {
      success: false,
      message: error.message
    };
  }
}

/**
 * 2. Fetch GSC Organic Metrics
 * Returns click, impression, and positioning analytics for a given keyword/url.
 */
export async function getGscMetrics(keyword: string): Promise<GscStats> {
  const kwLower = keyword.toLowerCase();
  
  // Custom mock data mapping aligned with search impressions
  let clicks = Math.floor(Math.random() * 400) + 10;
  let impressions = clicks * 15 + Math.floor(Math.random() * 1000);
  let position = 2.4 + Math.random() * 4;

  if (kwLower.includes("compress") || kwLower.includes("100kb")) {
    clicks = 850 + Math.floor(Math.random() * 100);
    impressions = 12400 + Math.floor(Math.random() * 800);
    position = 1.2;
  } else if (kwLower.includes("sign") || kwLower.includes("signature")) {
    clicks = 420;
    impressions = 6300;
    position = 3.4;
  }

  const ctr = impressions > 0 ? parseFloat(((clicks / impressions) * 100).toFixed(2)) : 0;

  return {
    impressions,
    clicks,
    ctr,
    position: parseFloat(position.toFixed(1)),
    keyword
  };
}

/**
 * 3. Automated Rank Decay Detector
 * Scans published blog posts to identify position drops and inserts administrative alerts.
 */
export async function runRankDecayDetector(): Promise<number> {
  await insertDbLog("old_articles_update", "running", "Google Search Console: Running automated rank decay audits...");

  const posts = await getDbPosts();
  let decayAlertsCreated = 0;

  for (const post of posts) {
    if (!post.published_at) continue;

    // Fetch current organic positioning GSC metric
    const gsc = await getGscMetrics(post.keywords?.[0] || post.title);
    
    // Simulate rank decay if position is worse than post's historical avg_position by > 1.5 places
    const positionDrop = gsc.position - post.avg_position;
    
    if (positionDrop > 1.5 && post.avg_position > 0) {
      decayAlertsCreated++;
      
      const advice = `The article is experiencing click decay. Add these LSI keywords to stabilize: '${(post.lsi_keywords || []).slice(0, 3).join(", ")}' and update the main structural FAQ section.`;
      
      await insertDbInsight({
        insight_type: "decay_warning",
        affected_post_id: post.id,
        title: `Rank Decay Warning: '${post.title}'`,
        description: `Position dropped from #${post.avg_position.toFixed(1)} to #${gsc.position.toFixed(1)} on target query '${post.keywords?.[0]}'. CTR has dropped by ${Math.abs(gsc.ctr - post.ctr_30d).toFixed(1)}%.`,
        recommended_action: advice,
        status: "pending"
      });
      
      await insertDbLog("old_articles_update", "success", `Rank Decay Alarm triggered for '${post.title}'. Inserted advice inside Analytics Brain.`, post.keywords?.[0]);
    }
  }

  await insertDbLog("old_articles_update", "success", `Google Search Console rank decay audits finished. Logged ${decayAlertsCreated} decay alerts.`);
  
  return decayAlertsCreated;
}
