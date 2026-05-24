import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CtaSection } from "@/components/home/cta";
import { StatsSection } from "@/components/home/stats";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About — Privacy-first PDF tools",
  description:
    "GoluPDFs is a small team of designers and engineers building the modern PDF studio. Privacy-first, browser-based, and proudly independent.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-16">
        <div className="container max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs font-medium backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            ABOUT GOLUPDFS
          </span>
          <h1 className="mt-5 font-display text-balance text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
            We're building the <span className="gradient-text">modern PDF studio.</span>
          </h1>
          <p className="mt-6 text-pretty text-lg text-muted-foreground sm:text-xl">
            GoluPDFs is an independent product crafted by a small team of designers and engineers who
            believe PDF tools have stayed stuck in 2010 — slow, ugly, and built around your data.
          </p>
          <p className="mt-4 text-pretty text-muted-foreground sm:text-lg">
            Our north star is simple: make every PDF workflow feel as good as the best apps in the
            world (Linear, Stripe, Figma, Vercel) — while keeping your files private. That means
            zero uploads, zero accounts, and a relentless focus on speed and craft.
          </p>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {[
              { v: "2024", l: "Founded" },
              { v: "100%", l: "Browser-side" },
              { v: "30+", l: "Premium tools" },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl border bg-card p-5 text-center">
                <p className="font-display text-4xl font-bold gradient-text">{s.v}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
        <StatsSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
