import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { buildMetadata } from "@/lib/seo";
import { Shield, Lock, EyeOff, Cookie, Scale, HelpCircle, User, Sparkles } from "lucide-react";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy — 100% Local PDF Processing",
  description:
    "How GoluPDFs protects your document privacy: short answer — we never upload your files. All conversions and modifications happen locally in your browser.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="relative pt-32 pb-24 overflow-hidden bg-background">
        {/* Decorative background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="container max-w-6xl px-4 sm:px-6">
          
          {/* Header Area */}
          <div className="max-w-3xl mb-16">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold tracking-wider text-primary uppercase backdrop-blur-md">
              <Shield className="h-3.5 w-3.5 text-primary" />
              DATA PROTECTION
            </span>
            <h1 className="mt-6 font-display text-balance text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl text-foreground">
              Privacy Policy
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">Last updated: May 31, 2026</p>
            <p className="mt-6 text-pretty text-lg text-muted-foreground">
              At GoluPDFs, your privacy is our absolute priority. We have engineered our PDF utility platform with a strict "privacy-by-design" architecture, ensuring that your sensitive documents never leave your local device.
            </p>
          </div>

          {/* Grid Layout: Sticky TOC + Content */}
          <div className="grid gap-12 lg:grid-cols-12 items-start">
            
            {/* Sticky Table of Contents (Left 4 Cols) */}
            <aside className="lg:col-span-4 lg:sticky lg:top-32 space-y-6">
              <div className="rounded-2xl border border-primary/10 bg-card/60 p-6 backdrop-blur-md shadow-lg">
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 font-display">
                  Table of Contents
                </h3>
                <nav className="space-y-1">
                  {[
                    { id: "core-promise", label: "Our Core Promise" },
                    { id: "what-we-collect", label: "What We Do Collect" },
                    { id: "what-we-never", label: "What We Never Collect" },
                    { id: "third-party", label: "Third-Party Services" },
                    { id: "international-laws", label: "International Compliance" },
                    { id: "data-retention", label: "Data Retention & Rights" },
                    { id: "policy-changes", label: "Changes to This Policy" },
                  ].map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="block py-2 px-3 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Secure Shield Badge */}
              <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-5 flex items-start gap-3">
                <Lock className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-500 uppercase tracking-wider">100% Zero-Upload</h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Our WebAssembly toolset processes all document conversions, signs, splits, and refactors entirely inside your local sandbox.
                  </p>
                </div>
              </div>
            </aside>

            {/* Privacy Policy Detailed Text (Right 8 Cols) */}
            <div className="lg:col-span-8 space-y-12 text-muted-foreground text-base sm:text-lg leading-relaxed text-pretty">
              
              <section id="core-promise" className="scroll-mt-32 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                  <Shield className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground font-display">
                  1. Our Core Promise
                </h2>
                <p>
                  The fundamental architectural design of GoluPDFs is simple: **We do not collect, view, process, store, or transmit any document files you import.**
                </p>
                <p>
                  Every single tool on this website (such as compress, convert, merge, visual organize, redact, or sign PDFs) executes entirely in your browser using local client-side Javascript and WebAssembly scripts. The files do not travel across the internet, ensuring an absolute buffer against data security breaches.
                </p>
              </section>

              <section id="what-we-collect" className="scroll-mt-32 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                  <Cookie className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground font-display">
                  2. What We Do Collect
                </h2>
                <p>
                  To keep our platform secure, highly performant, and completely free, we collect limited, non-identifying technical usage data:
                </p>
                <ul className="ml-5 list-disc space-y-2 text-sm leading-relaxed">
                  <li>
                    <strong className="text-foreground">Anonymous Aggregate Metrics:</strong> We use Google Analytics 4 (GA4) with strict IP anonymization to track aggregate metrics like page views, tool run counts, and average interaction times.
                  </li>
                  <li>
                    <strong className="text-foreground">Anonymous Error Reporting:</strong> In the event of a client-side execution crash, we receive anonymous telemetry logging the technical script error so we can fix bugs quickly.
                  </li>
                  <li>
                    <strong className="text-foreground">Essential Cookies:</strong> Strictly necessary cookies are utilized for storing theme preferences (light/dark mode) and security verification (for administrator access dashboards). If Google AdSense is enabled, cookies are used for aggregate ad personalization metrics.
                  </li>
                </ul>
              </section>

              <section id="what-we-never" className="scroll-mt-32 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                  <EyeOff className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground font-display">
                  3. What We Never Collect
                </h2>
                <p>
                  Our system is programmed with a hardware-level data barrier. Under no circumstances do we ever collect, access, or share:
                </p>
                <ul className="ml-5 list-disc space-y-2 text-sm leading-relaxed">
                  <li>The textual or visual content of your uploaded PDFs, images, or input datasets.</li>
                  <li>Original filenames, extensions, metadata, or document authors.</li>
                  <li>Personally identifiable data (such as emails or physical addresses) from anonymous visitors using our tools.</li>
                  <li>Real-time IP addresses (all traffic logs are anonymized immediately at the server gateway).</li>
                </ul>
              </section>

              <section id="third-party" className="scroll-mt-32 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                  <HelpCircle className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground font-display">
                  4. Third-Party Services
                </h2>
                <p>
                  To keep GoluPDFs hosted on premium servers globally, we utilize high-fidelity services that conform to data safety standards:
                </p>
                <ul className="ml-5 list-disc space-y-2 text-sm leading-relaxed">
                  <li>
                    <strong className="text-foreground">Hosting Infrastructure:</strong> Vercel hosting platform processes public page routing under advanced security protocols.
                  </li>
                  <li>
                    <strong className="text-foreground">Database Storage:</strong> Supabase stores secure metadata logs, system telemetry, and optional feedback submitted directly by users.
                  </li>
                  <li>
                    <strong className="text-foreground">Advertising:</strong> Google AdSense serves personalized or contextual advertising blocks to keep our premium toolset 100% free for everyone.
                  </li>
                </ul>
              </section>

              <section id="international-laws" className="scroll-mt-32 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                  <Scale className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground font-display">
                  5. International Compliance (GDPR, CCPA & COPPA)
                </h2>
                <p>
                  Even though we operate globally from Bihar, India, we strictly comply with all major data protection frameworks:
                </p>
                <ul className="ml-5 list-disc space-y-2 text-sm leading-relaxed">
                  <li>
                    <strong className="text-foreground">GDPR (Europe):</strong> The data controller for anonymous visitors using the tools is GoluPDFs. Because no personal data is uploaded, processed, or held by us, no data processing agreement is required for individual PDF operations.
                  </li>
                  <li>
                    <strong className="text-foreground">CCPA (California):</strong> GoluPDFs does not sell, lease, or rent any of your personal information to third-party data aggregators.
                  </li>
                  <li>
                    <strong className="text-foreground">COPPA (Children):</strong> Our website is built for visitors of all age groups, including students. Because we collect zero private personal data, our system matches the COPPA child privacy guidelines perfectly.
                  </li>
                </ul>
              </section>

              <section id="data-retention" className="scroll-mt-32 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                  <User className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground font-display">
                  6. Your Data Rights & Support
                </h2>
                <p>
                  You have the right to inspect, limit, or delete any data we possess relating to you. If you have submitted feedback, comments, or technical bug logs and wish to delete them permanently from our systems, please contact Golu Kumar directly at:
                </p>
                <p className="font-semibold text-foreground">
                  Email: <a className="text-primary hover:underline" href="mailto:lgdemon402lkr@gmail.com">lgdemon402lkr@gmail.com</a>
                </p>
                <p>
                  All deletion and compliance requests are resolved in less than 24 to 48 business hours.
                </p>
              </section>

              <section id="policy-changes" className="scroll-mt-32 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground font-display">
                  7. Changes to This Privacy Policy
                </h2>
                <p>
                  We may revise this Privacy Policy periodically to reflect enhancements to our client-side WebAssembly tools or security configurations. Any material changes will be actively updated on this page with a revised "Last updated" date.
                </p>
              </section>

            </div>

          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
