import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CATEGORIES, type Tool } from "@/lib/tools";
import { cn } from "@/lib/utils";

export function RelatedTools({ tools }: { tools: Tool[] }) {
  if (!tools.length) return null;
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {tools.map((t) => (
        <Link
          key={t.slug}
          href={`/tools/${t.slug}`}
          className="group flex items-center gap-3 rounded-xl border bg-card p-3 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
        >
          <span
            className={cn(
              "grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gradient-to-br shadow",
              CATEGORIES[t.category].color
            )}
          >
            <t.icon className="h-4 w-4 text-white" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">{t.shortName}</p>
            <p className="line-clamp-1 text-xs text-muted-foreground">{t.tagline}</p>
          </div>
          <ArrowRight className="h-4 w-4 -translate-x-1 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-primary" />
        </Link>
      ))}
    </div>
  );
}
