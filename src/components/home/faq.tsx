"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";

const FAQS = [
  {
    q: "Are GoluPDFs tools really free?",
    a: "Yes — every tool is 100% free. No watermarks, no daily limits, no signup. We make our money from optional premium features and ethical ads.",
  },
  {
    q: "Are my documents safe?",
    a: "Your files never leave your device. Every tool runs entirely in your browser using WebAssembly-grade libraries (pdf-lib, PDF.js). We have no servers to hack — there's nothing to upload.",
  },
  {
    q: "How does GoluPDFs compare to Adobe Acrobat?",
    a: "We offer 90% of Acrobat's most-used features, with a faster modern UI, better mobile support, and zero subscription fees. Heavy editing of complex form documents is still better in Acrobat.",
  },
  {
    q: "Can I use GoluPDFs offline?",
    a: "Yes. Once a tool page loads, you can disconnect from the internet and continue working — the entire processing happens locally.",
  },
  {
    q: "Do you support API access for businesses?",
    a: "An API is on our roadmap. For now, you can embed our tools in your workflows via iframe with custom branding. Reach out for enterprise needs.",
  },
  {
    q: "Which file formats are supported?",
    a: "PDF, DOCX, XLSX, PPTX, JPG, PNG, WEBP, EPUB and MOBI across our 30 tools. We add new formats every month.",
  },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="relative py-24">
      <div className="container max-w-3xl">
        <FadeIn className="text-center">
          <h2 className="font-display text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Frequently asked questions
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground sm:text-lg">
            Everything you need to know — and a few things you didn't.
          </p>
        </FadeIn>

        <div className="mt-12 space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="overflow-hidden rounded-2xl border bg-card"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                >
                  <span className="font-medium">{f.q}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-full border"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
