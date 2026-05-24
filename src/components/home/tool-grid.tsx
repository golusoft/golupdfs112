"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TOOLS, CATEGORIES } from "@/lib/tools";
import { FadeIn } from "@/components/motion/fade-in";

export function ToolGrid() {
  return (
    <section id="tools" className="relative py-24">
      <div className="container">
        <FadeIn className="mx-auto max-w-3xl text-center">
          <Badge variant="glass" className="mb-4">
            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-primary" /> 30 PROFESSIONAL TOOLS
          </Badge>
          <h2 className="font-display text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Every PDF tool you'll{" "}
            <span className="gradient-text">ever need.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground sm:text-lg">
            From compression to AI summaries — a complete PDF ecosystem, beautifully designed and
            blazing fast.
          </p>
        </FadeIn>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {TOOLS.map((t, i) => (
            <motion.div
              key={t.slug}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 8) * 0.05, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={`/tools/${t.slug}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10"
              >
                <div
                  className={`absolute inset-0 -z-10 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-[0.06] ${CATEGORIES[t.category].color}`}
                />
                <div className="flex items-start justify-between">
                  <div
                    className={`relative grid h-11 w-11 place-items-center overflow-hidden rounded-xl bg-gradient-to-br shadow-md transition-transform duration-300 group-hover:scale-110 ${CATEGORIES[t.category].color}`}
                  >
                    <t.icon className="h-5 w-5 text-white" />
                  </div>
                  {t.badge && (
                    <Badge
                      variant={t.badge === "ai" ? "gradient" : "secondary"}
                      className="text-[10px] uppercase"
                    >
                      {t.badge}
                    </Badge>
                  )}
                </div>
                <h3 className="mt-4 text-base font-semibold leading-tight">{t.shortName}</h3>
                <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">{t.tagline}</p>
                <div className="mt-auto flex items-center justify-between pt-4 text-xs font-medium text-muted-foreground">
                  <span className="capitalize">{CATEGORIES[t.category].label}</span>
                  <span className="flex items-center gap-1 text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    Open <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
