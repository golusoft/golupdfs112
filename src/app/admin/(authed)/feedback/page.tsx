import { Star } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { feedbackList } from "@/lib/admin/mock-data";

export default function AdminFeedbackPage() {
  const items = feedbackList();
  return (
    <Card>
      <CardHeader>
        <CardTitle>User feedback</CardTitle>
        <CardDescription>{items.length} entries · synced with Supabase</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {items.map((f) => (
            <li key={f.id} className="rounded-xl border bg-card/50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{f.author}</span>
                    <Badge
                      variant={
                        f.status === "new"
                          ? "gradient"
                          : f.status === "open"
                          ? "secondary"
                          : "outline"
                      }
                      className="capitalize"
                    >
                      {f.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {f.tool} · {f.date}
                  </p>
                </div>
                <div className="flex">
                  {Array.from({ length: f.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed">{f.message}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
