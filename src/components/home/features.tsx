"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Zap, Cpu, Globe, Lock, Layers } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "100% browser-side processing",
    description:
      "Your files are processed locally using WebAssembly. Nothing is uploaded, stored or logged.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Zap,
    title: "Built for sub-second speed",
    description:
      "Heavy operations run on Web Workers so the UI never freezes. Most tools finish in under 1 second.",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Cpu,
    title: "Enterprise-grade engines",
    description:
      "We use pdf-lib + PDF.js — the same libraries powering Mozilla and Adobe-quality outputs.",
    color: "from-violet-500 to-fuchsia-500",
  },
  {
    icon: Globe,
    title: "Works on any device",
    description:
      "Mobile-first interactions, full keyboard shortcuts, light & dark themes — beautiful everywhere.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Lock,
    title: "Privacy by design",
    description:
      "No accounts, no tracking, no email required. We're privacy-first because trust is earned.",
    color: "from-rose-500 to-pink-500",
  },
  {
    icon: Layers,
    title: "30+ tools, one ecosystem",
    description:
      "Compress, sign, convert, redact, sign, OCR — every workflow you need under a single roof.",
    color: "from-indigo-500 to-purple-500",
  },
];

export function FeaturesSection() {
  return (
    <section className="relative py-24">
      <div className="container">
        <FadeIn className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            A new standard for{" "}
            <span className="gradient-text">PDF productivity.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground sm:text-lg">
            Engineered with the same craft as Stripe, Linear and Figma — applied to PDFs.
          </p>
        </FadeIn>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.06 }}
              className="group relative overflow-hidden rounded-2xl border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div
                className={`absolute -top-px left-0 right-0 h-px bg-gradient-to-r ${f.color}`}
              />
              <div
                className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${f.color} shadow-md`}
              >
                <f.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
