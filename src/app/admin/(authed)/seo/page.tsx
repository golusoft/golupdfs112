"use client";

import { useState, useEffect } from "react";
import {
  Search,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  BarChart2,
  Zap,
  Globe,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SeoStats {
  totalImpressions: number;
  totalClicks: number;
  avgCtr: string;
  decayAlertsCount: number;
  indexingStatus: { url: string; status: string; impressions: number; clicks: number; position: number; ctr: string }[];
  decayAlerts: { keyword: string; previousPos: number; currentPos: number; change: number; article: string }[];
  topicClusters: { cluster: string; articles: number; avgPosition: number; totalImpressions: number; topKeyword: string }[];
  seoSource: string;
  indexingSource: string;
}

export default function AdminSeoPage() {
  const [seo, setSeo] = useState<SeoStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reindexing, setReindexing] = useState<string | null>(null);

  const fetchSeoStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/seo");
      if (!res.ok) throw new Error("Failed to pull Google Search Console telemetry");
      const data = await res.json();
      setSeo(data);
    } catch (err: any) {
      setError(err.message || "Failed to load SEO stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeoStats();
  }, []);

  const handleReindex = async (url: string) => {
    setReindexing(url);
    await new Promise((r) => setTimeout(r, 1800));
    setReindexing(null);
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center gap-2">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="text-xs text-muted-foreground font-mono">Loading Search Console indices...</span>
      </div>
    );
  }

  if (error || !seo) {
    return (
      <div className="flex h-[30vh] flex-col items-center justify-center gap-2">
        <AlertCircle className="h-8 w-8 text-red-400" />
        <p className="text-xs text-muted-foreground">{error || "No SEO metrics registered."}</p>
        <Button onClick={fetchSeoStats} size="sm" variant="outline" className="mt-2">
          <RefreshCw className="h-3 w-3 mr-1" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card p-4 space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Total Impressions</p>
            <Badge variant="glass" className="text-[8px] font-mono">[{seo.seoSource}]</Badge>
          </div>
          <p className="text-2xl font-bold text-foreground">{seo.totalImpressions.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground font-mono">Last 30 days</p>
        </div>
        <div className="rounded-xl border bg-card p-4 space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Total Clicks</p>
            <Badge variant="glass" className="text-[8px] font-mono">[{seo.seoSource}]</Badge>
          </div>
          <p className="text-2xl font-bold text-emerald-400">{seo.totalClicks.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground font-mono">Last 30 days</p>
        </div>
        <div className="rounded-xl border bg-card p-4 space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Avg CTR</p>
            <Badge variant="glass" className="text-[8px] font-mono">[{seo.seoSource}]</Badge>
          </div>
          <p className="text-2xl font-bold text-violet-400">{seo.avgCtr}%</p>
          <p className="text-[10px] text-muted-foreground font-mono">
            {seo.indexingStatus.filter(s => s.status === 'indexed').length}/{seo.indexingStatus.length} indexed
          </p>
        </div>
        <div className="rounded-xl border bg-card p-4 space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Rank Decay Alerts</p>
            <Badge variant="glass" className="text-[8px] font-mono">[{seo.seoSource}]</Badge>
          </div>
          <p className="text-2xl font-bold text-amber-400">{seo.decayAlertsCount}</p>
          <p className="text-[10px] text-muted-foreground font-mono">Needs attention</p>
        </div>
      </div>

      {/* Rank Decay Alerts */}
      {seo.decayAlerts.length > 0 && (
        <Card className="border-amber-500/30">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-amber-400">
                <AlertTriangle className="h-4 w-4" /> Rank Decay Alerts
              </CardTitle>
              <CardDescription>Keywords losing position — refresh content recommended</CardDescription>
            </div>
            <Badge variant="glass" className="font-mono">[{seo.seoSource}]</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {seo.decayAlerts.map((alert, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg bg-amber-500/5 border border-amber-500/20"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{alert.keyword}</p>
                    <p className="text-xs text-muted-foreground">/blog/{alert.article}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        Was #{alert.previousPos.toFixed(1)}
                      </p>
                      <p className="text-sm font-bold text-red-400">
                        Now #{alert.currentPos.toFixed(1)}
                      </p>
                    </div>
                    <Badge variant="outline" className="border-red-500/50 text-red-400 text-[10px] font-mono">
                      {alert.change.toFixed(1)} pos
                    </Badge>
                    <Button size="sm" variant="outline" className="h-7 text-xs">
                      <Zap className="h-3 w-3 mr-1" /> Refresh
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Indexing Status Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-4 w-4" /> Google Indexing Status
            </CardTitle>
            <CardDescription>Live index status for all published pages</CardDescription>
          </div>
          <Badge variant="glass" className="font-mono">[{seo.indexingSource}]</Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/20">
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">
                    URL
                  </th>
                  <th className="text-center px-4 py-2.5 text-xs font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground">
                    Impressions
                  </th>
                  <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground">
                    Clicks
                  </th>
                  <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground">
                    Position
                  </th>
                  <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {seo.indexingStatus.map((page, i) => (
                  <tr key={i} className="border-b hover:bg-muted/10 transition-colors">
                    <td className="px-4 py-2.5">
                      <a
                        href={page.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-mono text-xs flex items-center gap-1"
                      >
                        {page.url} <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      {page.status === "indexed" && (
                        <Badge
                          variant="outline"
                          className="border-emerald-500/50 text-emerald-400 text-[10px]"
                        >
                          <CheckCircle2 className="h-2.5 w-2.5 mr-1" />
                          Indexed
                        </Badge>
                      )}
                      {page.status === "pending" && (
                        <Badge
                          variant="outline"
                          className="border-amber-500/50 text-amber-400 text-[10px]"
                        >
                          <Clock className="h-2.5 w-2.5 mr-1" />
                          Pending
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-right text-muted-foreground font-mono">
                      {page.impressions.toLocaleString()}
                    </td>
                    <td className="px-4 py-2.5 text-right text-muted-foreground font-mono">{page.clicks}</td>
                    <td className="px-4 py-2.5 text-right">
                      {page.position > 0 ? (
                        <span
                          className={`font-semibold font-mono ${
                            page.position <= 3
                              ? "text-emerald-400"
                              : page.position <= 10
                              ? "text-amber-400"
                              : "text-red-400"
                          }`}
                        >
                          #{page.position}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      {page.status !== "indexed" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 text-[10px] px-2"
                          disabled={reindexing === page.url}
                          onClick={() => handleReindex(page.url)}
                        >
                          {reindexing === page.url ? (
                            <RefreshCw className="h-2.5 w-2.5 animate-spin" />
                          ) : (
                            <>
                              <RefreshCw className="h-2.5 w-2.5 mr-1" />
                              Request
                            </>
                          )}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Keyword Cluster Authority Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" /> Topical Authority Clusters
          </CardTitle>
          <CardDescription>
            Semantic topic groups and their collective ranking power
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {seo.topicClusters.map((cluster, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border bg-muted/20 hover:bg-muted/30 transition-colors space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-foreground">{cluster.cluster}</h4>
                  <Badge variant="glass" className="text-[10px]">
                    {cluster.articles} spoke pages
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-[10px] text-muted-foreground">Avg Position</p>
                    <p
                      className={`text-sm font-bold font-mono ${
                        cluster.avgPosition <= 3
                          ? "text-emerald-400"
                          : cluster.avgPosition <= 10
                          ? "text-amber-400"
                          : "text-red-400"
                      }`}
                    >
                      #{cluster.avgPosition}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Impressions</p>
                    <p className="text-sm font-bold text-foreground font-mono">
                      {cluster.totalImpressions.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Top KW</p>
                    <p className="text-xs font-semibold text-primary truncate max-w-[80px]">
                      {cluster.topKeyword}
                    </p>
                  </div>
                </div>
                {/* Progress bar representing cluster strength */}
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div
                    className="bg-gradient-to-r from-brand-500 to-violet-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${Math.min((cluster.articles / 6) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
