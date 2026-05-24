"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingParticles } from "@/components/motion/floating-particles";

export function CtaSection() {
  return (
    <section className="relative py-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-violet-600 to-fuchsia-600 px-6 py-16 text-center text-white sm:px-12 sm:py-20"
        >
          <FloatingParticles count={14} />
          <div className="absolute inset-0 grid-pattern opacity-10 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" aria-hidden />
          <div className="absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" aria-hidden />

          <div className="relative">
            <Sparkles className="mx-auto mb-4 h-7 w-7 opacity-80" />
            <h2 className="font-display text-balance text-4xl font-bold tracking-tight sm:text-5xl">
              Ready to make PDFs feel modern?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-white/85 sm:text-lg">
              Start with the most-loved tool. No signup. No waiting. Just polished output.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="xl" className="bg-white text-foreground shadow-2xl hover:bg-white/90">
                <Link href="/tools">
                  Browse all 30 tools <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="xl" className="border border-white/30 text-white hover:bg-white/10">
                <Link href="/tools/compress-pdf">Try Compress PDF →</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
