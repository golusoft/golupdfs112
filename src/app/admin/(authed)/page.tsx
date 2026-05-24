import { Eye, MousePointerClick, Wrench, DollarSign } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { TrafficAreaChart, ToolsBarChart } from "@/components/admin/charts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  trafficSeries,
  topTools,
  recentActivity,
  siteHealth,
} from "@/lib/admin/mock-data";

export default function AdminDashboardPage() {
  const traffic = trafficSeries(30);
  const tools = topTools(8);
  const activity = recentActivity();
  const health = siteHealth();

  const totalVisits = traffic.reduce((s, d) => s + d.visits, 0);
  const totalConversions = traffic.reduce((s, d) => s + d.conversions, 0);
  const totalToolUses = tools.reduce((s, t) => s + t.uses, 0);
  const totalRevenue = traffic.reduce((s, d) => s + d.revenue, 0);

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Visits (30d)" value={totalVisits} delta={12.4} icon={Eye} color="from-brand-500 to-cyan-500" />
        <StatCard label="Tool conversions" value={totalConversions} delta={8.7} icon={MousePointerClick} color="from-violet-500 to-fuchsia-500" />
        <StatCard label="Total tool runs" value={totalToolUses} delta={15.2} icon={Wrench} color="from-emerald-500 to-teal-500" />
        <StatCard label="Revenue (30d)" value={Math.floor(totalRevenue)} prefix="$" delta={6.8} icon={DollarSign} color="from-amber-500 to-orange-500" />
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
              <Badge variant="glass">Live</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <TrafficAreaChart data={traffic} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top tools</CardTitle>
            <CardDescription>By usage in the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ToolsBarChart data={tools.slice(0, 6).map((t) => ({ name: t.name, uses: t.uses }))} />
          </CardContent>
        </Card>
      </div>

      {/* Site health + activity */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Site health</CardTitle>
            <CardDescription>UptimeRobot + Vercel Analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <HealthMetric label="Uptime (30d)" value={`${health.uptime30d}%`} good />
              <HealthMetric label="Avg response" value={`${health.avgResponse}ms`} good />
              <HealthMetric label="P95 response" value={`${health.p95Response}ms`} good />
              <HealthMetric label="Errors (24h)" value={`${health.errorsLast24h}`} good={health.errorsLast24h < 10} />
            </div>
            <div className="mt-4 rounded-xl border bg-muted/30 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Core Web Vitals</p>
              <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-md bg-emerald-500/10 p-2">
                  <p className="font-semibold text-emerald-600">LCP {health.cwv.lcp}s</p>
                </div>
                <div className="rounded-md bg-emerald-500/10 p-2">
                  <p className="font-semibold text-emerald-600">FID {health.cwv.fid}ms</p>
                </div>
                <div className="rounded-md bg-emerald-500/10 p-2">
                  <p className="font-semibold text-emerald-600">CLS {health.cwv.cls}</p>
                </div>
              </div>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Lighthouse: <span className="font-bold text-foreground">{health.cwv.score}</span>/100
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>Latest events on your platform</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {activity.map((a, i) => (
                <li key={i} className="flex items-start gap-3 rounded-lg border bg-card/50 p-3">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gradient-to-r from-brand-500 to-fuchsia-500" />
                  <div className="flex-1">
                    <p className="text-sm">{a.message}</p>
                    <p className="text-xs text-muted-foreground">{a.ts}</p>
                  </div>
                  <Badge variant="secondary" className="capitalize">{a.type}</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function HealthMetric({ label, value, good }: { label: string; value: string; good?: boolean }) {
  return (
    <div className="rounded-lg border bg-background/50 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`mt-1 font-display text-xl font-bold ${good ? "text-emerald-600" : "text-rose-600"}`}>
        {value}
      </p>
    </div>
  );
}
