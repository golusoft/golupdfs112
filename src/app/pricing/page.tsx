import type { Metadata } from "next";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Pricing — Free forever",
  description:
    "GoluPDFs is free forever for individuals. Premium plans for power users and teams are coming soon.",
  path: "/pricing",
});

const PLANS = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    description: "Everything you need for personal PDF workflows.",
    features: [
      "All 30+ tools — unlimited",
      "Files up to 200 MB",
      "Browser-side processing",
      "No watermarks, no signup",
      "Light & dark themes",
    ],
    cta: { label: "Start free", href: "/tools" },
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$8",
    cadence: "/ month",
    description: "For power users who want server-side speed and AI features.",
    features: [
      "Everything in Free",
      "Server-side OCR & PDF→Office",
      "AI Assistant (chat with PDFs)",
      "Files up to 2 GB",
      "Priority processing",
      "API access (5,000 req/mo)",
    ],
    cta: { label: "Coming soon", href: "/contact" },
    highlighted: true,
  },
  {
    name: "Teams",
    price: "Custom",
    cadence: "",
    description: "For agencies, enterprises and high-volume workflows.",
    features: [
      "Everything in Pro",
      "Unlimited team members",
      "SSO & SCIM provisioning",
      "Custom retention policies",
      "Dedicated support",
      "On-prem deployment option",
    ],
    cta: { label: "Talk to sales", href: "/contact" },
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="glass" className="mb-4">
              <Sparkles className="h-3 w-3" /> SIMPLE, HONEST PRICING
            </Badge>
            <h1 className="font-display text-balance text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
              Free forever for everyone.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-pretty text-muted-foreground sm:text-lg">
              GoluPDFs is and will always be free for individual use. Pro plans unlock heavier
              server-side workflows, AI features and the API.
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-6xl gap-5 lg:grid-cols-3">
            {PLANS.map((p) => (
              <div
                key={p.name}
                className={`relative flex flex-col rounded-3xl border bg-card p-7 transition-all hover:-translate-y-1 hover:shadow-xl ${
                  p.highlighted
                    ? "gradient-border bg-gradient-to-b from-card to-primary/5 shadow-2xl shadow-primary/10"
                    : ""
                }`}
              >
                {p.highlighted && (
                  <Badge variant="gradient" className="absolute -top-3 left-1/2 -translate-x-1/2">
                    Most popular
                  </Badge>
                )}
                <h3 className="font-display text-xl font-bold">{p.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
                <p className="mt-6 flex items-baseline gap-1">
                  <span className="font-display text-5xl font-extrabold">{p.price}</span>
                  {p.cadence && <span className="text-sm text-muted-foreground">{p.cadence}</span>}
                </p>
                <ul className="mt-6 space-y-3 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild variant={p.highlighted ? "gradient" : "outline"} className="mt-7">
                  <Link href={p.cta.href}>{p.cta.label}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
