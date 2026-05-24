import { Activity, Globe, Zap, AlertTriangle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/admin/stat-card";
import { siteHealth } from "@/lib/admin/mock-data";

export default function AdminHealthPage() {
  const h = siteHealth();
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Uptime (30d)" value={Math.floor(h.uptime30d)} suffix={`.${Math.round((h.uptime30d % 1) * 100)}%`} icon={Activity} color="from-emerald-500 to-teal-500" delta={0.04} />
        <StatCard label="Avg response" value={h.avgResponse} suffix="ms" icon={Zap} color="from-brand-500 to-cyan-500" delta={-12.3} />
        <StatCard label="Lighthouse" value={h.cwv.score} suffix="/100" icon={Globe} color="from-violet-500 to-fuchsia-500" delta={2.1} />
        <StatCard label="Errors (24h)" value={h.errorsLast24h} icon={AlertTriangle} color="from-amber-500 to-orange-500" delta={-25.0} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Core Web Vitals</CardTitle>
          <CardDescription>Live measurements · 75th percentile</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <Vital label="Largest Contentful Paint" value={`${h.cwv.lcp}s`} threshold="< 2.5s" />
            <Vital label="First Input Delay" value={`${h.cwv.fid}ms`} threshold="< 100ms" />
            <Vital label="Cumulative Layout Shift" value={`${h.cwv.cls}`} threshold="< 0.1" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Integrations</CardTitle>
          <CardDescription>External services powering this dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 sm:grid-cols-2">
            {[
              { name: "Google Analytics 4", status: "Connected" },
              { name: "Google Search Console", status: "Connected" },
              { name: "Google AdSense", status: "Connected" },
              { name: "UptimeRobot", status: "Connected" },
              { name: "Supabase", status: "Connected" },
              { name: "Vercel Analytics", status: "Connected" },
            ].map((s) => (
              <li key={s.name} className="flex items-center justify-between rounded-lg border bg-card/50 p-3">
                <span className="text-sm font-medium">{s.name}</span>
                <span className="inline-flex items-center gap-2 text-xs text-emerald-600">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-md shadow-emerald-500/40" />
                  {s.status}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function Vital({ label, value, threshold }: { label: string; value: string; threshold: string }) {
  return (
    <div className="rounded-xl border bg-emerald-500/5 p-5">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-3xl font-bold text-emerald-600">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">Target: {threshold}</p>
    </div>
  );
}
