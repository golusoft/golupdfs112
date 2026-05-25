"use client";

import { useState, useEffect } from "react";
import { DollarSign, TrendingUp, MousePointerClick, Eye, ExternalLink, Package, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/admin/stat-card";
import { RevenueLineChart } from "@/components/admin/charts";
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
  topProducts?: { name: string; category: string; clicks: number; ctr: string; revenue: string; badge: string }[];
  topArticles?: { title: string; slug: string; clicks: number; revenue: string }[];
}

export default function AdminRevenuePage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRevenue = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/dashboard-stats");
      if (!res.ok) throw new Error("Failed to pull revenue telemetry");
      const data = await res.json();
      setStats(data);
    } catch (err: any) {
      setError(err.message || "Failed to load revenue metrics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenue();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center gap-2">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="text-xs text-muted-foreground font-mono">Loading revenue telemetry...</span>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex h-[30vh] flex-col items-center justify-center gap-2">
        <AlertCircle className="h-8 w-8 text-red-400" />
        <p className="text-xs text-muted-foreground">{error || "No revenue metrics registered."}</p>
        <Button onClick={fetchRevenue} size="sm" variant="outline" className="mt-2">
          <RefreshCw className="h-3 w-3 mr-1" /> Retry
        </Button>
      </div>
    );
  }

  // Map trafficChart for RevenueLineChart format
  const chartData = stats.trafficChart.map((d) => ({
    date: d.date,
    adsense: Math.round(d.visits * 0.0035 * 100) / 100,
    affiliate: Math.round(d.conversions * 1.25 * 100) / 100,
    total: Math.round((d.visits * 0.0035 + d.conversions * 1.25) * 100) / 100
  }));

  const affiliateClicksCount = stats.conversions30d;
  const products = stats.topProducts || [];
  const articles = stats.topArticles || [];

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="AdSense (30d)" value={Math.floor(stats.adsenseRevenue)} prefix="$" icon={DollarSign} color="from-brand-500 to-cyan-500" delta={undefined} source={stats.adsenseSource} />
        <StatCard label="Affiliate (30d)" value={Math.floor(stats.affiliateRevenue)} prefix="$" icon={TrendingUp} color="from-violet-500 to-fuchsia-500" delta={undefined} source={stats.affiliateSource} />
        <StatCard label="Affiliate Clicks" value={affiliateClicksCount} icon={MousePointerClick} color="from-emerald-500 to-teal-500" delta={undefined} source={stats.affiliateSource} />
        <StatCard label="Total Revenue" value={Math.floor(stats.revenue30d)} prefix="$" icon={Eye} color="from-amber-500 to-orange-500" delta={undefined} source={stats.revenueSource} />
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Revenue Breakdown</CardTitle>
            <CardDescription>AdSense + Affiliate commissions · last 30 days based on live pageviews</CardDescription>
          </div>
          <Badge variant="glass" className="font-mono">[{stats.revenueSource}]</Badge>
        </CardHeader>
        <CardContent>
          <RevenueLineChart data={chartData} />
          <p className="mt-4 text-center text-sm text-muted-foreground font-mono">
            Total this month:{" "}
            <span className="font-bold text-foreground">${stats.revenue30d.toFixed(2)}</span>
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Top Affiliate Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-4 w-4" /> Top Products
              </CardTitle>
              <CardDescription>Affiliate link performance by product</CardDescription>
            </div>
            <Badge variant="glass" className="font-mono">[{stats.affiliateSource}]</Badge>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center text-xs text-muted-foreground font-mono border border-dashed rounded-xl">
                <Package className="h-8 w-8 mb-2 text-muted-foreground/55" />
                <p className="font-bold">No Affiliate Clicks Logged</p>
                <p className="mt-1">Add saas contextual links in your published blog posts to start generating clicks!</p>
              </div>
            ) : (
              <div className="space-y-1">
                {products.map((product, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{product.name}</span>
                        <Badge variant="outline" className="text-[10px] py-0 font-mono">
                          {product.badge}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">{product.category}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-emerald-400 font-mono">{product.revenue}</div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {product.clicks} clicks · {product.ctr} CTR
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Articles by Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" /> Money Pages
              </CardTitle>
              <CardDescription>Articles generating the most affiliate revenue</CardDescription>
            </div>
            <Badge variant="glass" className="font-mono">[{stats.affiliateSource}]</Badge>
          </CardHeader>
          <CardContent>
            {articles.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center text-xs text-muted-foreground font-mono border border-dashed rounded-xl">
                <TrendingUp className="h-8 w-8 mb-2 text-muted-foreground/55" />
                <p className="font-bold">No Top Performing Money Pages</p>
                <p className="mt-1">Publish optimized high-quality articles to drive saas traffic!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {articles.map((article, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-7 w-7 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-xs font-bold text-white font-mono">
                        #{i + 1}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground line-clamp-1">
                          {article.title}
                        </div>
                        <div className="text-xs text-muted-foreground font-mono">
                          {article.clicks} affiliate clicks
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-emerald-400 font-mono">{article.revenue}</span>
                      <a
                        href={`/blog/${article.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Disclosure note */}
            <div className="mt-4 p-3 rounded-lg bg-muted/20 border border-border/50">
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                <strong>Affiliate Disclosure:</strong> GoluPDFs earns commission from affiliate
                partner links. All product recommendations are editorial decisions independent of
                affiliate status.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
