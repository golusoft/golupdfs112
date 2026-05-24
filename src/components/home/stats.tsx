"use client";

import { AnimatedCounter } from "@/components/motion/animated-counter";
import { FadeIn } from "@/components/motion/fade-in";

const STATS = [
  { value: 12, suffix: "M+", label: "PDFs processed", color: "from-brand-500 to-cyan-500" },
  { value: 380, suffix: "K", label: "Active monthly users", color: "from-violet-500 to-fuchsia-500" },
  { value: 30, suffix: "+", label: "Premium tools", color: "from-emerald-500 to-teal-500" },
  { value: 99.9, suffix: "%", label: "Uptime SLA", color: "from-amber-500 to-orange-500", isFloat: true },
];

export function StatsSection() {
  return (
    <section className="relative py-24">
      <div
        className="absolute inset-x-0 top-1/2 -z-10 mx-auto h-[400px] w-[80%] -translate-y-1/2 bg-gradient-to-r from-brand-500/10 via-violet-500/10 to-fuchsia-500/10 blur-3xl"
        aria-hidden
      />
      <div className="container">
        <FadeIn className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Numbers that tell <span className="gradient-text">the story.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground sm:text-lg">
            Built for scale. Trusted globally. Loved by professionals.
          </p>
        </FadeIn>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <div className="glass relative overflow-hidden rounded-2xl p-6 text-center">
                <div className={`absolute inset-x-0 -top-px h-px bg-gradient-to-r ${s.color}`} />
                <p className="font-display text-4xl font-bold sm:text-5xl">
                  <span className={`bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>
                    <AnimatedCounter
                      value={s.isFloat ? Math.floor(s.value) : s.value}
                      suffix={s.isFloat ? `.${Math.round((s.value % 1) * 10)}${s.suffix}` : s.suffix}
                    />
                  </span>
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
