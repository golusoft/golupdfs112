import { DollarSign, TrendingUp, MousePointerClick, Eye } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/admin/stat-card";
import { RevenueLineChart } from "@/components/admin/charts";
import { revenueSeries } from "@/lib/admin/mock-data";

export default function AdminRevenuePage() {
  const data = revenueSeries(30);
  const totalAdsense = data.reduce((s, d) => s + d.adsense, 0);
  const totalAffiliate = data.reduce((s, d) => s + d.affiliate, 0);
  const totalTotal = data.reduce((s, d) => s + d.total, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="AdSense (30d)" value={Math.floor(totalAdsense)} prefix="$" icon={DollarSign} color="from-brand-500 to-cyan-500" delta={11.4} />
        <StatCard label="Affiliate (30d)" value={Math.floor(totalAffiliate)} prefix="$" icon={TrendingUp} color="from-violet-500 to-fuchsia-500" delta={6.2} />
        <StatCard label="Page RPM" value={14} suffix=".20" icon={MousePointerClick} color="from-emerald-500 to-teal-500" delta={3.1} />
        <StatCard label="Avg CTR" value={2} suffix=".4%" icon={Eye} color="from-amber-500 to-orange-500" delta={-0.4} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue breakdown</CardTitle>
          <CardDescription>AdSense + affiliate · last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <RevenueLineChart data={data} />
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Total this month: <span className="font-bold text-foreground">${totalTotal.toFixed(2)}</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
