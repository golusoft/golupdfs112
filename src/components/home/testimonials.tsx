"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";

const TESTIMONIALS = [
  {
    quote:
      "Replaced our entire Adobe Acrobat workflow for the legal team. The page organizer alone is worth the switch.",
    author: "Sarah Chen",
    role: "Operations Lead, Lattice",
    rating: 5,
  },
  {
    quote:
      "I compressed a 220 MB scanned report down to 12 MB without any visible quality loss. Pure magic.",
    author: "Marcus Wright",
    role: "Architect, Studio West",
    rating: 5,
  },
  {
    quote:
      "Privacy-first PDF tools that actually look beautiful — finally. Our compliance team approved this in minutes.",
    author: "Aditi Rao",
    role: "Privacy Officer, Vellum",
    rating: 5,
  },
  {
    quote:
      "The merge tool is the cleanest I've ever used. Drag, drop, done. We use it dozens of times daily.",
    author: "James O'Brien",
    role: "Sr. Designer, Frame.io",
    rating: 5,
  },
  {
    quote:
      "Signed three contracts in 2 minutes from my phone. Mobile UX is genuinely better than DocuSign.",
    author: "Priya Patel",
    role: "Founder, Northwood Capital",
    rating: 5,
  },
  {
    quote:
      "We migrated 14,000 PDFs through the bulk converter overnight. Zero errors, zero uploads. Insane.",
    author: "Diego Martinez",
    role: "DevOps, Helio",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="relative py-24">
      <div className="container">
        <FadeIn className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Loved by <span className="gradient-text">12,000+</span> professionals.
          </h2>
        </FadeIn>

        <div className="mt-14 columns-1 gap-5 md:columns-2 lg:columns-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.08 }}
              className="mb-5 break-inside-avoid rounded-2xl border bg-card p-6 transition-all hover:shadow-lg"
            >
              <Quote className="h-5 w-5 text-primary/40" />
              <div className="my-3 flex">
                {Array.from({ length: t.rating }).map((_, k) => (
                  <Star key={k} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <blockquote className="text-sm leading-relaxed">"{t.quote}"</blockquote>
              <figcaption className="mt-4 flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-fuchsia-500 text-xs font-semibold text-white">
                  {t.author
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.author}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
