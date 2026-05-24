import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ToolsBarChart } from "@/components/admin/charts";
import { topTools } from "@/lib/admin/mock-data";
import { CATEGORIES, getToolBySlug } from "@/lib/tools";
import { cn, formatNumber } from "@/lib/utils";

export default function AdminToolsPage() {
  const data = topTools(30);
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tool usage breakdown</CardTitle>
          <CardDescription>Top 10 tools by daily runs in the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ToolsBarChart data={data.slice(0, 10).map((t) => ({ name: t.name, uses: t.uses }))} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All tools — performance</CardTitle>
          <CardDescription>Conversion rate = % of uploads that complete a successful run</CardDescription>
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
                      <td className="py-3 text-right text-muted-foreground">{t.avgTime}ms</td>
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
