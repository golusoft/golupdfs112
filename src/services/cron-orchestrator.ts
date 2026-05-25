import { insertDbLog, insertDbInsight } from "@/lib/admin/mock-blog-data";

export type AlertSeverity = "info" | "warning" | "error" | "critical";

export interface AlertPayload {
  title: string;
  description: string;
  source: "cron" | "ai_generation" | "database" | "indexing" | "publishing";
  severity: AlertSeverity;
  traceId?: string;
  error?: string;
  meta?: any;
}

/**
 * Technical Observability & Multi-Channel Alerting Service.
 * Implements Discord Webhook dispatcher, rate-limiting, and severity escalation rules.
 */

// In-memory bucket to prevent notification alert flooding
const alertCache = new Map<string, { count: number; lastSent: number }>();
const FLOOD_LIMIT = 5; // max 5 alerts
const FLOOD_WINDOW = 300000; // per 5 minutes

function shouldRateLimit(title: string): boolean {
  const now = Date.now();
  const cached = alertCache.get(title);

  if (!cached) {
    alertCache.set(title, { count: 1, lastSent: now });
    return false;
  }

  if (now - cached.lastSent > FLOOD_WINDOW) {
    alertCache.set(title, { count: 1, lastSent: now });
    return false;
  }

  if (cached.count >= FLOOD_LIMIT) {
    cached.count++;
    return true;
  }

  cached.count++;
  return false;
}

// 1. Core Discord Webhook Dispatcher
export async function sendDiscordWebhook(payload: AlertPayload): Promise<boolean> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl || webhookUrl.startsWith("replace")) {
    console.log(`[Observability Simulator] Discord Webhook (Unset): ${payload.title} - ${payload.description}`);
    return false;
  }

  // Rate limit flood control
  if (shouldRateLimit(payload.title)) {
    console.warn(`[Observability] Alert rate-limited to avoid Discord spam: '${payload.title}'`);
    return false;
  }

  try {
    // Map severity to hexadecimal color codes for discord embed bars
    const colors: Record<AlertSeverity, number> = {
      info: 3447003,      // Blue
      warning: 16776960,  // Yellow
      error: 15158332,    // Orange-Red
      critical: 16515840  // Bright Crimson Red
    };

    const embed = {
      title: `${payload.severity.toUpperCase()}: ${payload.title}`,
      description: payload.description,
      color: colors[payload.severity],
      fields: [
        { name: "Source Core", value: payload.source, inline: true },
        { name: "Execution Trace ID", value: payload.traceId || "N/A", inline: true },
        ...(payload.error ? [{ name: "Crashed Stack Message", value: `\`\`\`${payload.error.substring(0, 1000)}\`\`\``, inline: false }] : []),
        ...(payload.meta ? [{ name: "Telemetric Payload Metadata", value: `\`\`\`json\n${JSON.stringify(payload.meta, null, 2).substring(0, 1000)}\n\`\`\``, inline: false }] : [])
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: "GoluPDFs Antigravity Engine Observability v2.5"
      }
    };

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: payload.severity === "critical" ? "⚠️ **CRITICAL PLATFORM ALARM ACTIVE** ⚠️" : undefined,
        embeds: [embed]
      })
    });

    return response.ok;
  } catch (e) {
    console.error("Failed to post alerts to Discord Webhook:", e);
    return false;
  }
}

// 2. Main Trigger Alert Action API
export async function triggerAlert(payload: AlertPayload): Promise<void> {
  // Always log to standard admin database activity logger
  await insertDbLog(
    `alert_${payload.source}`,
    payload.severity === "critical" || payload.severity === "error" ? "failed" : "success",
    `[Alert] ${payload.title}: ${payload.description}`,
    payload.meta?.keyword,
    { severity: payload.severity, traceId: payload.traceId, error: payload.error }
  );

  // If error level is high, write an Analytics Insight for Dashboard admin review
  if (payload.severity === "critical" || payload.severity === "error") {
    await insertDbInsight({
      insight_type: "system_alert",
      title: `System Alert: ${payload.title}`,
      description: `${payload.description}. Affected subsystem: ${payload.source}. Trace ID: ${payload.traceId || 'N/A'}. Error: ${payload.error || 'None'}`,
      recommended_action: "Examine execution step logs in Agent Backoffice to troubleshoot and reload agent workflow manual queue.",
      status: "pending"
    });
  }

  // Push to Discord Channel
  await sendDiscordWebhook(payload);
}

// 3. Retry Exhaustion Alert
export async function alertRetryExhaustion(
  keyword: string,
  subsystem: string,
  errorMsg: string,
  traceId: string
): Promise<void> {
  await triggerAlert({
    title: `Retry Pipeline Exhausted: ${subsystem}`,
    description: `The autonomous generation sequence for target keyword '${keyword}' has completely exhausted all exponential query retry attempts and aborted. Subsystem: ${subsystem}`,
    source: "ai_generation",
    severity: "critical",
    traceId,
    error: errorMsg,
    meta: { keyword }
  });
}

// 4. Daily Publishing Summary
export async function sendDailyPublishingSummary(
  publishedCount: number,
  failedCount: number,
  keywordsDiscovered: number,
  logs: string[]
): Promise<void> {
  await triggerAlert({
    title: "Daily Autonomous SEO Campaign Summary",
    description: `Daily SEO Publishing operations complete. Published ${publishedCount} new articles, experienced ${failedCount} errors, and scanned ${keywordsDiscovered} new topics.`,
    source: "cron",
    severity: "info",
    meta: {
      published_articles: publishedCount,
      failed_runs: failedCount,
      keywords_discovered: keywordsDiscovered,
      sample_trace_logs: logs.slice(-5)
    }
  });
}
