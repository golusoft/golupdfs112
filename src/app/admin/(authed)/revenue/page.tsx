"use client";

import { DollarSign, TrendingUp, MousePointerClick, Eye, ExternalLink, Package } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/admin/stat-card";
import { RevenueLineChart } from "@/components/admin/charts";
import { revenueSeries } from "@/lib/admin/mock-data";

// Top affiliate products data (from our affiliate-config.ts categories)
const TOP_PRODUCTS = [
  { name: "iLovePDF Pro", category: "PDF Tools", clicks: 342, ctr: "8.4%", revenue: "$127.40", badge: "🔥 Hot" },
  { name: "Adobe Acrobat DC", category: "PDF Tools", clicks: 218, ctr: "6.1%", revenue: "$89.20", badge: "Steady" },
  { name: "NordVPN", category: "VPN", clicks: 187, ctr: "5.2%", revenue: "$74.80", badge: "Rising" },
  { name: "Notion AI", category: "AI Tools", clicks: 156, ctr: "4.8%", revenue: "$62.40", badge: "New" },
  { name: "Cloudways Hosting", category: "Hosting", clicks: 134, ctr: "4.1%", revenue: "$53.60", badge: "Steady" },
  { name: "Smallpdf Business", category: "PDF Tools", clicks: 98, ctr: "3.4%", revenue: "$39.20", badge: "Steady" },
];

// Top articles by affiliate revenue
const TOP_ARTICLES = [
  { title: "Best Free PDF Compressor 2026", slug: "best-pdf-compressor-2026", clicks: 284, revenue: "$113.60" },
  { title: "Compress PDF to 100KB Guide", slug: "compress-pdf-to-100kb", clicks: 198, revenue: "$79.20" },
  { title: "PDF Signer Comparison 2026", slug: "sign-pdf-online", clicks: 156, revenue: "$62.40" },
];

export default function AdminRevenuePage() {
  const data = revenueSeries(30);
  const totalAdsense = data.reduce((s, d) => s + d.adsense, 0);
  const totalAffiliate = data.reduce((s, d) => s + d.affiliate, 0);
  const totalTotal = data.reduce((s, d) => s + d.total, 0);

  const productClicks = TOP_PRODUCTS.reduce((s, p) => s + p.clicks, 0);

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="AdSense (30d)" value={Math.floor(totalAdsense)} prefix="$" icon={DollarSign} color="from-brand-500 to-cyan-500" delta={11.4} />
        <StatCard label="Affiliate (30d)" value={Math.floor(totalAffiliate)} prefix="$" icon={TrendingUp} color="from-violet-500 to-fuchsia-500" delta={6.2} />
        <StatCard label="Affiliate Clicks" value={productClicks} icon={MousePointerClick} color="from-emerald-500 to-teal-500" delta={14.8} />
        <StatCard label="Total Revenue" value={Math.floor(totalTotal)} prefix="$" icon={Eye} color="from-amber-500 to-orange-500" delta={9.1} />
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Breakdown</CardTitle>
          <CardDescription>AdSense + Affiliate commissions · last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <RevenueLineChart data={data} />
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Total this month:{" "}
            <span className="font-bold text-foreground">${totalTotal.toFixed(2)}</span>
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
            <Badge variant="glass">Live</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {TOP_PRODUCTS.map((product, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{product.name}</span>
                      <Badge variant="outline" className="text-[10px] py-0">
                        {product.badge}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">{product.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-emerald-400">{product.revenue}</div>
                    <div className="text-xs text-muted-foreground">
                      {product.clicks} clicks · {product.ctr} CTR
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Articles by Revenue */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" /> Money Pages
            </CardTitle>
            <CardDescription>Articles generating the most affiliate revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {TOP_ARTICLES.map((article, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-7 w-7 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-xs font-bold text-white">
                      #{i + 1}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground line-clamp-1">
                        {article.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {article.clicks} affiliate clicks
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-emerald-400">{article.revenue}</span>
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

            {/* Disclosure note */}
            <div className="mt-4 p-3 rounded-lg bg-muted/20 border border-border/50">
              <p className="text-[11px] text-muted-foreground">
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
