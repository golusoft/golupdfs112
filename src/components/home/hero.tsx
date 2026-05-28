"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FloatingParticles } from "@/components/motion/floating-particles";
import { TOOLS } from "@/lib/tools";

const FLOATING_TOOLS = TOOLS.filter((t) => t.badge === "popular").slice(0, 6);

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden pt-32 pb-24 sm:pt-40 sm:pb-32">
      {/* Background mesh */}
      <div className="absolute inset-0 bg-mesh-1 opacity-70" aria-hidden />
      <div className="absolute inset-0 dot-pattern opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" aria-hidden />
      <FloatingParticles count={22} />

      {/* Glow blobs */}
      <div
        className="absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-500/30 via-violet-500/30 to-fuchsia-500/30 blur-3xl"
        aria-hidden
      />

      <div className="container relative">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border bg-background/60 px-4 py-1.5 text-xs font-medium backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-muted-foreground">Now with</span>
            <span className="gradient-text font-semibold">AI PDF Assistant</span>
            <span className="text-muted-foreground">— in beta</span>
            <ArrowRight className="h-3 w-3 text-muted-foreground" />
          </motion.div>

          <h1 className="font-display text-balance text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-[5.25rem]">
            The modern{" "}
            <span className="relative inline-block">
              <span className="gradient-text">PDF Studio</span>
              <span className="absolute -bottom-2 left-0 right-0 h-1.5 rounded-full bg-gradient-to-r from-brand-500 via-violet-500 to-fuchsia-500" />
            </span>
            <br />
            built for the web.
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl">
            30+ professional PDF tools that run privately in your browser. No uploads, no
            watermarks, no signups. Just speed.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild variant="gradient" size="xl" className="w-full sm:w-auto">
              <Link href="/tools">
                <Sparkles className="h-4 w-4" />
                Browse all 30 tools
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="xl" className="w-full sm:w-auto">
              <Link href="/tools/compress-pdf">Try Compress PDF</Link>
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500" /> 100% browser-side
            </span>
            <span className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" /> Sub-second processing
            </span>
            <span className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-amber-500 text-amber-500" /> 4.9 / 5 from 12,000+ users
            </span>
          </div>
        </div>

        {/* Floating tool orbs */}
        <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden>
          {FLOATING_TOOLS.map((t, i) => {
            const positions = [
              { top: "18%", left: "6%" },
              { top: "10%", right: "6%" },
              { top: "55%", left: "3%" },
              { top: "62%", right: "4%" },
              { top: "32%", left: "10%" },
              { top: "30%", right: "10%" },
            ];
            const pos = positions[i] || positions[0];
            return (
              <motion.div
                key={t.slug}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.3 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                style={pos as React.CSSProperties}
                className="absolute"
              >
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
                  className="glass flex items-center gap-3 rounded-2xl px-4 py-3 shadow-xl"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-brand-500/20 to-fuchsia-500/20">
                    <t.icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold leading-none">{t.shortName}</p>
                    <p className="mt-1 text-[10px] text-muted-foreground">{t.category}</p>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <Marquee />
    </section>
  );
}

function Marquee() {
  const items = ["Adobe", "Stripe", "Notion", "Linear", "Vercel", "Figma", "Dropbox", "Slack", "Canva", "Atlassian"];
  return (
    <div className="relative mt-24">
      <p className="mb-6 text-center text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
        Trusted by teams at
      </p>
      <div className="relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex shrink-0 items-center gap-16 pr-16"
        >
          {[...items, ...items].map((b, i) => (
            <span key={i} className="text-2xl font-bold text-muted-foreground/40 grayscale">
              {b}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
