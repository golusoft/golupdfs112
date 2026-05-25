"use client";

import { useState, useEffect } from "react";
import {
  Activity,
  Cpu,
  Zap,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  AlertTriangle,
  Bot,
  Globe,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface HealthCheck {
  ok: boolean;
  message: string;
  latency?: number;
}

interface HealthData {
  status: string;
  checks: Record<string, HealthCheck>;
  timestamp: string;
}

const CRON_TIMELINE = [
  {
    ts: "2026-05-25T04:00:12Z",
    status: "success",
    keyword: "best pdf compressor 2026",
    slug: "best-pdf-compressor-2026",
    duration: 48200,
  },
  {
    ts: "2026-05-24T04:00:08Z",
    status: "success",
    keyword: "compress pdf to 100kb",
    slug: "compress-pdf-to-100kb",
    duration: 52100,
  },
  {
    ts: "2026-05-23T04:00:22Z",
    status: "warning",
    keyword: "pdf ocr reader free",
    slug: null,
    duration: 61000,
  },
  {
    ts: "2026-05-22T04:00:05Z",
    status: "success",
    keyword: "merge pdf without watermark",
    slug: "merge-pdf-without-watermark",
    duration: 44300,
  },
  {
    ts: "2026-05-21T04:00:19Z",
    status: "failed",
    keyword: "pdf converter online",
    slug: null,
    duration: 30000,
  },
];

const AGENT_METRICS = [
  { agent: "Research Agent", avgMs: 3200, status: "optimal", runs: 14 },
  { agent: "SEO SERP Agent", avgMs: 4100, status: "optimal", runs: 14 },
  { agent: "Outline Agent", avgMs: 5800, status: "optimal", runs: 14 },
  { agent: "Writer Agent", avgMs: 18400, status: "slow", runs: 14 },
  { agent: "Humanizer Agent", avgMs: 12200, status: "optimal", runs: 14 },
  { agent: "Image Agent", avgMs: 2100, status: "optimal", runs: 14 },
  { agent: "QA Engine", avgMs: 890, status: "optimal", runs: 14 },
  { agent: "Publishing Agent", avgMs: 1200, status: "optimal", runs: 14 },
];

export default function AdminHealthPage() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHealth = async () => {
    try {
      const res = await fetch("/api/admin/health");
      const data = await res.json();
      setHealth(data);
    } catch {
      setHealth(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchHealth();
  };

  const successCrons = CRON_TIMELINE.filter((c) => c.status === "success").length;

  return (
    <div className="space-y-6">
      {/* System Status Bar */}
      <div className="flex items-center justify-between p-4 rounded-xl border bg-card">
        <div className="flex items-center gap-3">
          <div
            className={`h-3 w-3 rounded-full animate-pulse ${
              health?.status === "healthy"
                ? "bg-emerald-400"
                : loading
                ? "bg-amber-400"
                : "bg-red-400"
            }`}
          />
          <span className="text-sm font-semibold text-foreground">
            System Status:{" "}
            {loading
              ? "Checking..."
              : health?.status === "healthy"
              ? "✅ All Systems Operational"
              : "⚠️ Degraded"}
          </span>
        </div>
        <Button size="sm" variant="outline" onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw className={`h-3.5 w-3.5 mr-2 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Infrastructure Health Checks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-4 w-4" /> Infrastructure Diagnostics
          </CardTitle>
          <CardDescription>Real-time connectivity and configuration health</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2 animate-pulse">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 bg-muted/30 rounded-lg" />
              ))}
            </div>
          ) : health?.checks ? (
            <div className="space-y-2">
              {Object.entries(health.checks).map(([key, check]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/40"
                >
                  <div className="flex items-center gap-3">
                    {check.ok ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-foreground capitalize">
                        {key.replace(/_/g, " ")}
                      </p>
                      <p className="text-xs text-muted-foreground">{check.message}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {check.latency !== undefined && (
                      <span className="text-xs text-muted-foreground">{check.latency}ms</span>
                    )}
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${
                        check.ok
                          ? "border-emerald-500/50 text-emerald-400"
                          : "border-red-500/50 text-red-400"
                      }`}
                    >
                      {check.ok ? "OK" : "FAIL"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 p-4 rounded-lg bg-red-500/5 border border-red-500/20">
              <XCircle className="h-4 w-4 text-red-400" />
              <p className="text-sm text-muted-foreground">
                Unable to reach health endpoint. Check API route configuration.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cron Execution Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-4 w-4" /> Cron Execution Timeline
          </CardTitle>
          <CardDescription>
            Daily publishing runs · {successCrons}/{CRON_TIMELINE.length} successful
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-4">
              {CRON_TIMELINE.map((run, i) => (
                <div key={i} className="flex gap-4 pl-10 relative">
                  {/* Status dot */}
                  <div
                    className={`absolute left-2.5 top-1.5 h-3 w-3 rounded-full border-2 border-background ${
                      run.status === "success"
                        ? "bg-emerald-400"
                        : run.status === "warning"
                        ? "bg-amber-400"
                        : "bg-red-400"
                    }`}
                  />
                  <div className="flex-1 p-3 rounded-lg border bg-muted/20 hover:bg-muted/30 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {run.status === "success" && (
                            <Badge
                              variant="outline"
                              className="border-emerald-500/50 text-emerald-400 text-[10px]"
                            >
                              Published
                            </Badge>
                          )}
                          {run.status === "warning" && (
                            <Badge
                              variant="outline"
                              className="border-amber-500/50 text-amber-400 text-[10px]"
                            >
                              <AlertTriangle className="h-2.5 w-2.5 mr-1" />
                              Warning
                            </Badge>
                          )}
                          {run.status === "failed" && (
                            <Badge
                              variant="outline"
                              className="border-red-500/50 text-red-400 text-[10px]"
                            >
                              Failed
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {new Date(run.ts).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className="mt-1 text-sm font-medium text-foreground">{run.keyword}</p>
                        {run.slug && (
                          <a
                            href={`/blog/${run.slug}`}
                            className="text-xs text-primary hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            /blog/{run.slug}
                          </a>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {(run.duration / 1000).toFixed(1)}s
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agent Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-4 w-4" /> Agent Performance Metrics
          </CardTitle>
          <CardDescription>Average execution time per AI agent (last 7 days)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {AGENT_METRICS.map((agent, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-40 flex-shrink-0">
                  <p className="text-xs font-medium text-foreground">{agent.agent}</p>
                  <p className="text-xs text-muted-foreground">{agent.runs} runs</p>
                </div>
                <div className="flex-1">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        agent.status === "slow"
                          ? "bg-amber-500"
                          : "bg-gradient-to-r from-brand-500 to-violet-500"
                      }`}
                      style={{ width: `${Math.min((agent.avgMs / 20000) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <div className="w-20 text-right">
                  <span
                    className={`text-xs font-medium ${
                      agent.status === "slow" ? "text-amber-400" : "text-muted-foreground"
                    }`}
                  >
                    {(agent.avgMs / 1000).toFixed(1)}s
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
