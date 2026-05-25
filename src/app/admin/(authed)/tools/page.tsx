"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ToolsBarChart } from "@/components/admin/charts";
import { CATEGORIES, getToolBySlug } from "@/lib/tools";
import { cn, formatNumber } from "@/lib/utils";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ToolPerformance {
  slug: string;
  name: string;
  category: string;
  uses: number;
  conversionRate: number;
  avgTime: number;
}

export default function AdminToolsPage() {
  const [data, setData] = useState<ToolPerformance[]>([]);
  const [source, setSource] = useState<string>("Supabase DB");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTools = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/tools");
      if (!res.ok) throw new Error("Failed to load tools performance metrics");
      const result = await res.json();
      setData(result.tools || []);
      setSource(result.source || "Supabase DB");
    } catch (err: any) {
      setError(err.message || "Failed to load tools data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[40vh] items-center justify-center gap-2">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="text-xs text-muted-foreground font-mono">Aggregating live tool events...</span>
      </div>
    );
  }

  if (error || data.length === 0) {
    return (
      <div className="flex h-[30vh] flex-col items-center justify-center gap-2">
        <AlertCircle className="h-8 w-8 text-red-400" />
        <p className="text-xs text-muted-foreground">{error || "No tools data registered."}</p>
        <Button onClick={fetchTools} size="sm" variant="outline" className="mt-2">
          <RefreshCw className="h-3 w-3 mr-1" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Tool usage breakdown</CardTitle>
            <CardDescription>Top tools by runs dynamically aggregated from Supabase events</CardDescription>
          </div>
          <Badge variant="glass" className="text-[10px] font-mono">[{source}]</Badge>
        </CardHeader>
        <CardContent>
          <ToolsBarChart data={data.slice(0, 10).map((t) => ({ name: t.name, uses: t.uses }))} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>All tools — performance</CardTitle>
            <CardDescription>Conversion rate = % of uploads that complete a successful run</CardDescription>
          </div>
          <Badge variant="glass" className="text-[10px] font-mono">[{source}]</Badge>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="py-3">Tool</th>
                  <th className="py-3">Category</th>
                  <th className="py-3 text-right">Runs (30d)</th>
                  <th className="py-3 text-right">Conv. rate</th>
                  <th className="py-3 text-right">Avg time</th>
                </tr>
              </thead>
              <tbody>
                {data.map((t) => {
                  const tool = getToolBySlug(t.slug);
                  return (
                    <tr key={t.slug} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          {tool && (
                            <span
                              className={cn(
                                "grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br shadow-sm",
                                CATEGORIES[tool.category].color
                              )}
                            >
                              <tool.icon className="h-4 w-4 text-white" />
                            </span>
                          )}
                          <span className="font-medium">{t.name}</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <Badge variant="secondary" className="capitalize">{t.category}</Badge>
                      </td>
                      <td className="py-3 text-right font-mono">{formatNumber(t.uses)}</td>
                      <td className="py-3 text-right">
                        <span className="font-mono text-emerald-600">{t.conversionRate}%</span>
                      </td>
                      <td className="py-3 text-right text-muted-foreground font-mono">{t.avgTime}ms</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
