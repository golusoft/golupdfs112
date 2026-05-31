import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { buildMetadata } from "@/lib/seo";
import { Scale, ShieldAlert, Cpu, Heart, Coins, Gavel, HelpCircle, FileText } from "lucide-react";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service — Legal Policy Agreements",
  description:
    "Terms of Service for GoluPDFs. Learn about our local-sandbox disclaimer, acceptable use guidelines, liability limitations, and governing laws.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="relative pt-32 pb-24 overflow-hidden bg-background">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="container max-w-6xl px-4 sm:px-6">
          
          {/* Header Area */}
          <div className="max-w-3xl mb-16">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold tracking-wider text-primary uppercase backdrop-blur-md">
              <Scale className="h-3.5 w-3.5 text-primary" />
              LEGAL AGREEMENT
            </span>
            <h1 className="mt-6 font-display text-balance text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl text-foreground">
              Terms of Service
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">Last updated: May 31, 2026</p>
            <p className="mt-6 text-pretty text-lg text-muted-foreground">
              Welcome to GoluPDFs. These Terms of Service govern your access to and use of our in-browser PDF utilities, website features, and related applications. Please read these terms carefully.
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
                    { id: "acceptance", label: "1. Acceptance of Terms" },
                    { id: "services", label: "2. Description of Services" },
                    { id: "acceptable-use", label: "3. Acceptable Use Policy" },
                    { id: "local-sandbox", label: "4. Browser-Side Sandbox" },
                    { id: "liability", label: "5. Limitation of Liability" },
                    { id: "intellectual-prop", label: "6. Intellectual Property" },
                    { id: "governing-law", label: "7. Governing Law" },
                    { id: "contact-support", label: "8. Support & Inquiries" },
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

              {/* Legal Disclaimer Badge */}
              <div className="rounded-2xl border border-amber-500/10 bg-amber-500/5 p-5 flex items-start gap-3">
                <ShieldAlert className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider">Warranty Disclaimer</h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    GoluPDFs is provided "as is" and "as available". We provide no explicit warranty regarding uptime, compatibility, or data integrity.
                  </p>
                </div>
              </div>
            </aside>

            {/* Terms Detailed Text (Right 8 Cols) */}
            <div className="lg:col-span-8 space-y-12 text-muted-foreground text-base sm:text-lg leading-relaxed text-pretty">
              
              <section id="acceptance" className="scroll-mt-32 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                  <FileText className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground font-display">
                  1. Acceptance of Terms
                </h2>
                <p>
                  By accessing, browsing, or utilizing GoluPDFs (located at golupdf.online), you explicitly acknowledge that you have read, understood, and agree to be legally bound by these Terms of Service, along with our Privacy Policy.
                </p>
                <p>
                  If you do not agree with any portion of these agreements, you are strictly advised to immediately cease all usage of our tools and services.
                </p>
              </section>

              <section id="services" className="scroll-mt-32 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                  <Cpu className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground font-display">
                  2. Description of Services
                </h2>
                <p>
                  GoluPDFs provides a comprehensive catalog of client-side PDF utility engines (such as compress, merge, split, encrypt, redact, sign, and convert utilities) along with business calculation worksheets like rent receipts and invoice templates.
                </p>
                <p>
                  While we strive to ensure 99.9% application accessibility and complete script correctness, we make no guarantees that the tools will be uninterrupted, error-free, or compatible with all web browser specifications. GoluPDFs reserves the right to modify, add, or deprecate any tool at any time without prior notice.
                </p>
              </section>

              <section id="acceptable-use" className="scroll-mt-32 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground font-display">
                  3. Acceptable Use Policy
                </h2>
                <p>
                  You agree to use GoluPDFs solely for legitimate, lawful purposes. You are strictly prohibited from using our website to:
                </p>
                <ul className="ml-5 list-disc space-y-2 text-sm leading-relaxed">
                  <li>Process copyrighted publications, books, or trademarked material without explicit legal ownership or permissions.</li>
                  <li>Circumvent PDF security permissions, crack digital rights management (DRM) encryptions, or hack document passwords.</li>
                  <li>Upload malicious code, worms, active viruses, or perform script-injection attacks against our hosting infrastructure.</li>
                  <li>Incorporate our local core utilities into bots or scrapers to perform automated bulk processing that degrades CDN services.</li>
                </ul>
              </section>

              <section id="local-sandbox" className="scroll-mt-32 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                  <Heart className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground font-display">
                  4. Browser-Side Sandbox Disclaimer
                </h2>
                <p>
                  **GoluPDFs operates completely server-free.** All document imports, edits, image compressions, and visual restructuring occur strictly inside the temporary sandbox memory of your local web browser.
                </p>
                <blockquote className="border-l-4 border-amber-500 bg-amber-500/5 rounded-r-xl p-5 my-6 italic text-foreground text-sm">
                  "Because we never upload, store, or create backup copies of your document files on our backend servers, GoluPDFs is incapable of recovering any files that are lost, modified, or corrupted during browser crashes or network resets. You are solely responsible for maintaining local copies of your original files."
                </blockquote>
              </section>

              <section id="liability" className="scroll-mt-32 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                  <Coins className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground font-display">
                  5. Limitation of Liability
                </h2>
                <p>
                  To the maximum extent permitted by applicable law, GoluPDFs and its creator (Golu Kumar) shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, loss of data, document corruption, or other intangible losses arising from your use or inability to use our platform tools.
                </p>
              </section>

              <section id="intellectual-prop" className="scroll-mt-32 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                  <Scale className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground font-display">
                  6. Intellectual Property Rights
                </h2>
                <p>
                  All website source codes, layouts, custom text scripts, brand marks, logos, CSS styles, and structural configurations are the exclusive intellectual property of GoluPDFs and are protected under Indian and international copyright laws.
                </p>
                <p>
                  You are permitted to use our compiled browser-side tools for personal, educational, or commercial activities, but you may not duplicate, reverse engineer, or sell our core processors without written consent.
                </p>
              </section>

              <section id="governing-law" className="scroll-mt-32 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                  <Gavel className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground font-display">
                  7. Governing Law & Jurisdiction
                </h2>
                <p>
                  These Terms of Service shall be governed by, construed, and enforced in accordance with the laws of India. Any legal disputes, claims, or actions arising from the use of our services shall be subject to the exclusive jurisdiction of the state courts located in Bihar, India.
                </p>
              </section>

              <section id="contact-support" className="scroll-mt-32 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                  <HelpCircle className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground font-display">
                  8. Support & Inquiries
                </h2>
                <p>
                  If you have any questions, clarifications, legal feedback, or security concerns regarding these Terms of Service, please get in touch with Golu Kumar at:
                </p>
                <p className="font-semibold text-foreground">
                  Email: <a className="text-primary hover:underline" href="mailto:lgdemon402lkr@gmail.com">lgdemon402lkr@gmail.com</a>
                </p>
                <p>
                  All requests and communications are addressed diligently in less than 24 to 48 business hours.
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
