import { Search, MousePointerClick, Eye, ArrowUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/admin/stat-card";
import { topQueries, trafficSeries } from "@/lib/admin/mock-data";
import { TrafficAreaChart } from "@/components/admin/charts";

export default function AdminSeoPage() {
  const queries = topQueries(20);
  const totalClicks = queries.reduce((s, q) => s + q.clicks, 0);
  const totalImpressions = queries.reduce((s, q) => s + q.impressions, 0);
  const avgCtr = totalClicks / totalImpressions * 100;
  const avgPos = queries.reduce((s, q) => s + q.position, 0) / queries.length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Search clicks (28d)" value={totalClicks} icon={MousePointerClick} color="from-brand-500 to-cyan-500" delta={14.2} />
        <StatCard label="Impressions" value={totalImpressions} icon={Eye} color="from-violet-500 to-fuchsia-500" delta={9.4} />
        <StatCard label="Avg CTR" value={Math.floor(avgCtr * 10) / 10} suffix="%" icon={ArrowUp} color="from-emerald-500 to-teal-500" delta={2.3} />
        <StatCard label="Avg position" value={Math.floor(avgPos * 10) / 10} icon={Search} color="from-amber-500 to-orange-500" delta={-0.8} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search performance</CardTitle>
          <CardDescription>Last 30 days · Google Search Console</CardDescription>
        </CardHeader>
        <CardContent>
          <TrafficAreaChart data={trafficSeries(30)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top queries</CardTitle>
          <CardDescription>Highest-volume search queries driving organic traffic</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="py-3">Query</th>
                  <th className="py-3 text-right">Clicks</th>
                  <th className="py-3 text-right">Impressions</th>
                  <th className="py-3 text-right">CTR</th>
                  <th className="py-3 text-right">Position</th>
                </tr>
              </thead>
              <tbody>
                {queries.map((q) => (
                  <tr key={q.q} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="py-3 font-medium">{q.q}</td>
                    <td className="py-3 text-right font-mono">{q.clicks.toLocaleString()}</td>
                    <td className="py-3 text-right font-mono text-muted-foreground">{q.impressions.toLocaleString()}</td>
                    <td className="py-3 text-right">
                      <Badge variant="secondary" className="font-mono">{q.ctr}%</Badge>
                    </td>
                    <td className="py-3 text-right">
                      <Badge variant={q.position < 3 ? "gradient" : "secondary"} className="font-mono">
                        #{q.position.toFixed(1)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
