"use client";

import { useState, useEffect } from "react";
import { Eye, MousePointerClick, Wrench, DollarSign, RefreshCw, FileText, Loader2, AlertCircle } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { TrafficAreaChart, ToolsBarChart } from "@/components/admin/charts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DashboardStats {
  visits30d: number;
  conversions30d: number;
  toolRuns30d: number;
  revenue30d: number;
  adsenseRevenue: number;
  affiliateRevenue: number;
  visitsDelta?: number;
  conversionsDelta?: number;
  runsDelta?: number;
  revenueDelta?: number;
  visitsSource: string;
  conversionsSource: string;
  runsSource: string;
  revenueSource: string;
  adsenseSource: string;
  affiliateSource: string;
  trafficChart: { date: string; visits: number; conversions: number; revenue: number }[];
  recentActivity: { type: string; message: string; ts: string; status?: string }[];
  topTools: { name: string; uses: number }[];
  insights: { title: string; description: string; recommended_action?: string }[];
  siteHealth: { uptime30d: number; avgResponse: number; p95Response: number; errorsLast24h: number; cwv: any };
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async (refresh = false) => {
    if (refresh) setSyncing(true);
    else setLoading(true);
    
    setError(null);
    try {
      const res = await fetch(`/api/admin/dashboard-stats${refresh ? "?refresh=true" : ""}`);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} error fetching telemetry`);
      }
      const data = await res.json();
      setStats(data);
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard metrics");
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground font-mono">Connecting to live production event streams...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-3 max-w-md mx-auto text-center">
        <AlertCircle className="h-10 w-10 text-red-400 animate-pulse" />
        <h3 className="font-bold text-lg text-foreground">API Connection Interrupted</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {error || "An unexpected error occurred during database metrics retrieval."}
        </p>
        <Button onClick={() => fetchStats()} variant="outline" className="mt-2">
          <RefreshCw className="h-3.5 w-3.5 mr-2" /> Retry Connection
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Uptime bar */}
      <div className="flex items-center justify-between p-4 rounded-xl border bg-card/60">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-foreground font-mono uppercase tracking-wider">
            Connected to Live Supabase Event Stream
          </span>
        </div>
        <Button size="sm" variant="outline" onClick={() => fetchStats(true)} disabled={syncing}>
          <RefreshCw className={`h-3.5 w-3.5 mr-2 ${syncing ? "animate-spin" : ""}`} />
          {syncing ? "Syncing DB..." : "Sync Live Cache"}
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Visits (30d)" value={stats.visits30d} delta={undefined} source={stats.visitsSource} icon={Eye} color="from-brand-500 to-cyan-500" />
        <StatCard label="Tool conversions" value={stats.conversions30d} delta={undefined} source={stats.conversionsSource} icon={MousePointerClick} color="from-violet-500 to-fuchsia-500" />
        <StatCard label="Total tool runs" value={stats.toolRuns30d} delta={undefined} source={stats.runsSource} icon={Wrench} color="from-emerald-500 to-teal-500" />
        <StatCard label="Revenue (30d)" value={Math.floor(stats.revenue30d)} prefix="$" delta={undefined} source={stats.revenueSource} icon={DollarSign} color="from-amber-500 to-orange-500" />
      </div>

      {/* Traffic + top tools */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Traffic & conversions</CardTitle>
                <CardDescription>Last 30 days · GA4 + internal events</CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge variant="glass" className="text-[10px] font-mono">[{stats.visitsSource}]</Badge>
                <Badge variant="glass" className="text-[10px] font-mono">[{stats.conversionsSource}]</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <TrafficAreaChart data={stats.trafficChart} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Top tools</CardTitle>
                <CardDescription>By usage in the last 30 days</CardDescription>
              </div>
              <Badge variant="glass" className="text-[9px] font-mono">[{stats.runsSource}]</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ToolsBarChart data={stats.topTools} />
          </CardContent>
        </Card>
      </div>

      {/* Site health + activity */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Site health</CardTitle>
                <CardDescription>UptimeRobot + Vercel Analytics</CardDescription>
              </div>
              <Badge variant="glass" className="text-[9px] font-mono">[Real-Time Monitoring]</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <HealthMetric label="Uptime (30d)" value={`${stats.siteHealth.uptime30d}%`} source="[Cron Monitor]" good />
              <HealthMetric label="Avg response" value={`${stats.siteHealth.avgResponse}ms`} source="[Supabase Ping]" good />
              <HealthMetric label="P95 response" value={`${stats.siteHealth.p95Response}ms`} source="[Db Telemetry]" good />
              <HealthMetric label="Errors (24h)" value={`${stats.siteHealth.errorsLast24h}`} source="[Event Logs]" good={stats.siteHealth.errorsLast24h < 10} />
            </div>
            <div className="mt-4 rounded-xl border bg-muted/30 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">Core Web Vitals</p>
              <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-md bg-emerald-500/10 p-2">
                  <p className="font-semibold text-emerald-600">LCP {stats.siteHealth.cwv.lcp}s</p>
                </div>
                <div className="rounded-md bg-emerald-500/10 p-2">
                  <p className="font-semibold text-emerald-600">FID {stats.siteHealth.cwv.fid}ms</p>
                </div>
                <div className="rounded-md bg-emerald-500/10 p-2">
                  <p className="font-semibold text-emerald-600">CLS {stats.siteHealth.cwv.cls}</p>
                </div>
              </div>
              <p className="mt-3 text-center text-xs text-muted-foreground font-mono">
                Lighthouse Score: <span className="font-bold text-foreground">{stats.siteHealth.cwv.score}</span>/100
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent activity</CardTitle>
                <CardDescription>Latest events on your platform</CardDescription>
              </div>
              <Badge variant="glass" className="text-[9px] font-mono">[Supabase Log Stream]</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {stats.recentActivity.map((a, i) => (
                <li key={i} className="flex items-start gap-3 rounded-lg border bg-card/50 p-3">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gradient-to-r from-brand-500 to-fuchsia-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{a.message}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{a.ts}</p>
                  </div>
                  <Badge variant="secondary" className="capitalize text-[9px] font-mono">{a.type}</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Content Refresh Suggestions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-amber-400" /> Content Refresh Queue
            </CardTitle>
            <CardDescription>Articles needing SEO refresh to prevent rank decay</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="glass" className="text-[9px] font-mono">[Rank Decay Telemetry]</Badge>
            <Badge variant="outline" className="border-amber-500/50 text-amber-400">
              {stats.insights.length} recommendations
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stats.insights.map((insight, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg border bg-amber-500/5 border-amber-500/20"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-amber-400" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{insight.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {insight.description}
                    </p>
                    {insight.recommended_action && (
                      <p className="text-[10px] text-primary bg-primary/10 border border-primary/20 rounded px-1.5 py-0.5 mt-1.5 inline-block font-mono">
                        🎯 Advice: {insight.recommended_action}
                      </p>
                    )}
                  </div>
                </div>
                <Button size="sm" variant="outline" className="h-7 text-xs flex-shrink-0">
                  <RefreshCw className="h-3 w-3 mr-1" /> Refresh
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function HealthMetric({ label, value, source, good }: { label: string; value: string; source?: string; good?: boolean }) {
  return (
    <div className="rounded-lg border bg-background/50 p-3 space-y-1">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground font-mono leading-none">{label}</p>
        {source && (
          <span className="text-[8px] font-mono text-muted-foreground/80 leading-none">
            {source}
          </span>
        )}
      </div>
      <p className={`mt-1 font-display text-lg font-bold ${good ? "text-emerald-500" : "text-rose-500"}`}>
        {value}
      </p>
    </div>
  );
}
