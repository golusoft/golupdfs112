"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, Clock, X, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CATEGORIES, type Tool, type ToolCategory } from "@/lib/tools";
import { useToolsStore } from "@/store/tools-store";
import { cn } from "@/lib/utils";

const ALL: ToolCategory | "all" = "all";

interface ToolsBrowserProps {
  tools: Tool[];
}

export function ToolsBrowser({ tools }: ToolsBrowserProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const initialCat = (searchParams.get("category") as ToolCategory) || ALL;
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<ToolCategory | "all">(initialCat);

  const recent = useToolsStore((s) => s.recent);
  const recentTools = useMemo(
    () =>
      recent
        .map((r) => tools.find((t) => t.slug === r.slug))
        .filter((t): t is Tool => Boolean(t))
        .slice(0, 5),
    [recent, tools]
  );

  // Sync URL state
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (category !== ALL) params.set("category", category);
    const search = params.toString();
    router.replace(`${pathname}${search ? `?${search}` : ""}`, { scroll: false });
  }, [query, category, pathname, router]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return tools.filter((t) => {
      if (category !== ALL && t.category !== category) return false;
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        t.shortName.toLowerCase().includes(q) ||
        t.tagline.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.features.some((f) => f.toLowerCase().includes(q))
      );
    });
  }, [tools, query, category]);

  const grouped = useMemo(() => {
    if (category !== ALL) return { [category]: filtered } as Record<string, Tool[]>;
    const groups: Record<string, Tool[]> = {};
    for (const t of filtered) {
      (groups[t.category] ||= []).push(t);
    }
    return groups;
  }, [filtered, category]);

  return (
    <div>
      {/* Search bar */}
      <div className="sticky top-20 z-30 mx-auto max-w-2xl">
        <div className="glass-strong rounded-2xl p-2 shadow-xl">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus
              placeholder="Search 30+ tools — try ‘compress’, ‘sign’, ‘to word’…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-12 border-0 bg-transparent pl-11 pr-10 text-base shadow-none focus-visible:ring-0"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-accent"
                aria-label="Clear search"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category pills */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
        <CategoryPill
          active={category === ALL}
          onClick={() => setCategory(ALL)}
          color="from-foreground to-foreground"
          label={`All · ${tools.length}`}
        />
        {(Object.keys(CATEGORIES) as ToolCategory[]).map((c) => {
          const count = tools.filter((t) => t.category === c).length;
          return (
            <CategoryPill
              key={c}
              active={category === c}
              onClick={() => setCategory(c)}
              color={CATEGORIES[c].color}
              label={`${CATEGORIES[c].label} · ${count}`}
            />
          );
        })}
      </div>

      {/* Recent (only when no filter) */}
      {category === ALL && !query && recentTools.length > 0 && (
        <section className="mt-12">
          <div className="mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Recently used</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {recentTools.map((t) => (
              <ToolCard key={t.slug} tool={t} compact />
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mt-20 max-w-md text-center"
        >
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-muted">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-display text-2xl font-bold">No tools matched.</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Try a different keyword, or browse all tools.
          </p>
          <Button variant="outline" className="mt-6" onClick={() => { setQuery(""); setCategory(ALL); }}>
            Reset filters
          </Button>
        </motion.div>
      )}

      {/* Grouped tools */}
      <div className="mt-12 space-y-14">
        <AnimatePresence mode="popLayout">
          {(Object.keys(grouped) as ToolCategory[]).map((cat, ci) => (
            <motion.section
              key={cat}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: ci * 0.04 }}
            >
              <div className="mb-5 flex items-center gap-3">
                <span className={cn("h-3 w-3 rounded-full bg-gradient-to-r", CATEGORIES[cat].color)} />
                <h2 className="font-display text-2xl font-bold">{CATEGORIES[cat].label}</h2>
                <span className="text-sm text-muted-foreground">{CATEGORIES[cat].description}</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {grouped[cat].map((t) => (
                  <ToolCard key={t.slug} tool={t} />
                ))}
              </div>
            </motion.section>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function CategoryPill({
  active,
  onClick,
  label,
  color,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  color: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition-all",
        active
          ? "border-primary/40 bg-primary/10 text-foreground shadow-sm"
          : "bg-background/60 backdrop-blur-md text-muted-foreground hover:text-foreground hover:border-foreground/20"
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full bg-gradient-to-r", color)} />
      {label}
    </button>
  );
}

function ToolCard({ tool, compact = false }: { tool: Tool; compact?: boolean }) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.25 }}>
      <Link
        href={`/tools/${tool.slug}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10"
      >
        <div
          className={cn(
            "absolute inset-0 -z-10 bg-gradient-to-br opacity-0 transition-opacity group-hover:opacity-[0.06]",
            CATEGORIES[tool.category].color
          )}
        />
        <div className="flex items-start justify-between">
          <div
            className={cn(
              "grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br shadow-md transition-transform group-hover:scale-110",
              CATEGORIES[tool.category].color
            )}
          >
            <tool.icon className="h-5 w-5 text-white" />
          </div>
          {tool.badge && (
            <Badge variant={tool.badge === "ai" ? "gradient" : "secondary"} className="text-[10px] uppercase">
              {tool.badge === "ai" && <Sparkles className="h-2.5 w-2.5" />}
              {tool.badge}
            </Badge>
          )}
        </div>
        <h3 className="mt-4 text-base font-semibold leading-tight">{tool.shortName}</h3>
        {!compact && (
          <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">{tool.tagline}</p>
        )}
        <div className="mt-auto flex items-center justify-between pt-4 text-xs font-medium text-muted-foreground">
          <span className="capitalize">{CATEGORIES[tool.category].label}</span>
          <span className="flex items-center gap-1 text-primary opacity-0 transition-opacity group-hover:opacity-100">
            Open <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
