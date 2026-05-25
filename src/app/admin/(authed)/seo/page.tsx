"use client";

import { useState } from "react";
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
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Mock SEO analytics data — will read from Supabase GSC integration in production
const INDEXING_STATUS = [
  { url: "/blog/best-pdf-compressor-2026", status: "indexed", impressions: 4821, clicks: 312, position: 1.4, ctr: "6.5%" },
  { url: "/blog/compress-pdf-to-100kb", status: "indexed", impressions: 3102, clicks: 198, position: 2.1, ctr: "6.4%" },
  { url: "/compress-pdf-to-100kb", status: "indexed", impressions: 2841, clicks: 176, position: 3.2, ctr: "6.2%" },
  { url: "/merge-pdf-online", status: "indexed", impressions: 1923, clicks: 104, position: 4.8, ctr: "5.4%" },
  { url: "/sign-pdf-online", status: "pending", impressions: 0, clicks: 0, position: 0, ctr: "0%" },
  { url: "/blog/sign-pdf-online-free-2026", status: "not_indexed", impressions: 0, clicks: 0, position: 0, ctr: "0%" },
];

const RANK_DECAY_ALERTS = [
  { keyword: "pdf compressor online free", previousPos: 1.2, currentPos: 2.8, change: -1.6, article: "best-pdf-compressor-2026" },
  { keyword: "merge pdf without watermark", previousPos: 3.4, currentPos: 5.1, change: -1.7, article: "merge-pdf-without-watermark" },
];

const KEYWORD_CLUSTERS = [
  { cluster: "Compression Tools", articles: 4, avgPosition: 2.1, totalImpressions: 12840, topKeyword: "pdf compressor" },
  { cluster: "Digital Signatures", articles: 2, avgPosition: 4.2, totalImpressions: 5210, topKeyword: "sign pdf online" },
  { cluster: "Document Joining", articles: 3, avgPosition: 5.8, totalImpressions: 3820, topKeyword: "merge pdf" },
  { cluster: "Text Extraction OCR", articles: 1, avgPosition: 8.4, totalImpressions: 1240, topKeyword: "ocr pdf reader" },
];

export default function AdminSeoPage() {
  const [reindexing, setReindexing] = useState<string | null>(null);

  const totalImpressions = INDEXING_STATUS.reduce((s, p) => s + p.impressions, 0);
  const totalClicks = INDEXING_STATUS.reduce((s, p) => s + p.clicks, 0);
  const indexedCount = INDEXING_STATUS.filter((p) => p.status === "indexed").length;
  const avgCtr =
    totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(1) : "0";

  const handleReindex = async (url: string) => {
    setReindexing(url);
    await new Promise((r) => setTimeout(r, 1800));
    setReindexing(null);
  };

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Total Impressions</p>
          <p className="text-2xl font-bold text-foreground">{totalImpressions.toLocaleString()}</p>
          <Badge variant="glass" className="text-[10px]">
            Last 30 days
          </Badge>
        </div>
        <div className="rounded-xl border bg-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Total Clicks</p>
          <p className="text-2xl font-bold text-emerald-400">{totalClicks.toLocaleString()}</p>
          <Badge variant="glass" className="text-[10px]">
            GSC data
          </Badge>
        </div>
        <div className="rounded-xl border bg-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Avg CTR</p>
          <p className="text-2xl font-bold text-violet-400">{avgCtr}%</p>
          <Badge variant="glass" className="text-[10px]">
            {indexedCount}/{INDEXING_STATUS.length} indexed
          </Badge>
        </div>
        <div className="rounded-xl border bg-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Rank Decay Alerts</p>
          <p className="text-2xl font-bold text-amber-400">{RANK_DECAY_ALERTS.length}</p>
          <Badge variant="outline" className="text-[10px] border-amber-500/50 text-amber-400">
            Needs attention
          </Badge>
        </div>
      </div>

      {/* Rank Decay Alerts */}
      {RANK_DECAY_ALERTS.length > 0 && (
        <Card className="border-amber-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-400">
              <AlertTriangle className="h-4 w-4" /> Rank Decay Alerts
            </CardTitle>
            <CardDescription>Keywords losing position — refresh content recommended</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {RANK_DECAY_ALERTS.map((alert, i) => (
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
                    <Badge variant="outline" className="border-red-500/50 text-red-400">
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
          <Badge variant="glass">GSC Connected</Badge>
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
                {INDEXING_STATUS.map((page, i) => (
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
                      {page.status === "not_indexed" && (
                        <Badge
                          variant="outline"
                          className="border-red-500/50 text-red-400 text-[10px]"
                        >
                          <XCircle className="h-2.5 w-2.5 mr-1" />
                          Not Indexed
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-right text-muted-foreground">
                      {page.impressions.toLocaleString()}
                    </td>
                    <td className="px-4 py-2.5 text-right text-muted-foreground">{page.clicks}</td>
                    <td className="px-4 py-2.5 text-right">
                      {page.position > 0 ? (
                        <span
                          className={`font-medium ${
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
            {KEYWORD_CLUSTERS.map((cluster, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border bg-muted/20 hover:bg-muted/30 transition-colors space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-foreground">{cluster.cluster}</h4>
                  <Badge variant="glass" className="text-[10px]">
                    {cluster.articles} articles
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground">Avg Position</p>
                    <p
                      className={`text-sm font-bold ${
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
                    <p className="text-xs text-muted-foreground">Impressions</p>
                    <p className="text-sm font-bold text-foreground">
                      {cluster.totalImpressions.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Top KW</p>
                    <p className="text-xs font-medium text-primary truncate">
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
