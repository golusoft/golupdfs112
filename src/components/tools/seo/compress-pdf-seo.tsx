"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Check, X, Shield, Cpu, RefreshCw, Zap, Sliders, FileText, Sparkles, BookOpen } from "lucide-react";

/**
 * Premium SEO copy & visual sections for the Compress PDF page.
 * Targets high-volume keywords with balanced, readable typography and modern grid designs.
 */
export function CompressPdfSeoContent() {
  return (
    <div className="space-y-16 border-t border-muted/80 pt-16">
      {/* 1. Main Search Intent Block */}
      <section className="space-y-6">
        <h2 className="font-display text-3xl font-extrabold text-foreground tracking-tight sm:text-4xl">
          Compress PDF Online Free
        </h2>
        <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed space-y-4">
          <p>
            GoluPDFs offers a premium utility to <strong>compress PDF online free</strong> directly inside your web browser. 
            Unlike traditional platforms that compromise your privacy by transferring files to cloud servers, our 
            high-fidelity compression engine runs 100% locally. You can securely <strong>reduce PDF size</strong> on 
            any document without compromising text readability or vector sharpness.
          </p>
          <p>
            Whether you need to <strong>reduce PDF file size online</strong> for government application forms, university 
            submissions, or corporate email attachments, our tool provides byte-perfect target controls. Simply upload 
            your file, select your preferred preset, and watch our local compiler optimize image resolutions, subset 
            internal fonts, and strip legacy metadata in milliseconds.
          </p>
        </div>
      </section>

      {/* 2. Long-Tail Keyword Grid */}
      <section className="space-y-8">
        <div className="space-y-3">
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Targeted Size Presets &amp; Use Cases
          </h2>
          <p className="text-muted-foreground">
            Learn how GoluPDFs addresses specific file size requirements and document configurations.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Preset 1 */}
          <div className="rounded-2xl border border-muted bg-card/40 p-6 space-y-3 hover:border-primary/30 transition-all duration-300">
            <div className="h-9 w-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold font-mono text-xs">
              100K
            </div>
            <h3 className="font-display font-bold text-lg text-foreground">Compress PDF to 100KB</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Highly requested for passport applications, PAN cards, and government portals. Our engine uses downsampling 
              algorithms to target exactly 100KB while keeping text legible.
            </p>
          </div>

          {/* Preset 2 */}
          <div className="rounded-2xl border border-muted bg-card/40 p-6 space-y-3 hover:border-primary/30 transition-all duration-300">
            <div className="h-9 w-9 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400 font-bold font-mono text-xs">
              200K
            </div>
            <h3 className="font-display font-bold text-lg text-foreground">Compress PDF to 200KB</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Standard upload threshold for job portals (Naukri, LinkedIn) and university admissions. Shrinks image-heavy 
              resumes without creating fuzzy pixels.
            </p>
          </div>

          {/* Preset 3 */}
          <div className="rounded-2xl border border-muted bg-card/40 p-6 space-y-3 hover:border-primary/30 transition-all duration-300">
            <div className="h-9 w-9 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400 font-bold font-mono text-xs">
              500K
            </div>
            <h3 className="font-display font-bold text-lg text-foreground">Compress PDF to 500KB</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Perfect for multi-page tax sheets, corporate contracts, and financial reports. Allows for high-resolution graphics 
              while keeping the file compact.
            </p>
          </div>

          {/* Preset 4 */}
          <div className="rounded-2xl border border-muted bg-card/40 p-6 space-y-3 hover:border-primary/30 transition-all duration-300">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Check className="h-4 w-4" />
            </div>
            <h3 className="font-display font-bold text-lg text-foreground">Without Losing Quality</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Use our "Lossless Mode" to optimize raw structures, subset embedded fonts, and clean redundant objects 
              without re-compressing visual image streams.
            </p>
          </div>

          {/* Preset 5 */}
          <div className="rounded-2xl border border-muted bg-card/40 p-6 space-y-3 hover:border-primary/30 transition-all duration-300">
            <div className="h-9 w-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <FileText className="h-4 w-4" />
            </div>
            <h3 className="font-display font-bold text-lg text-foreground">Government Forms</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Tailored for UPSC, SSC, and NSDL portals. Re-scale documents to custom ratios that conform precisely 
              to strict byte boundaries.
            </p>
          </div>

          {/* Preset 6 */}
          <div className="rounded-2xl border border-muted bg-card/40 p-6 space-y-3 hover:border-primary/30 transition-all duration-300">
            <div className="h-9 w-9 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <Zap className="h-4 w-4" />
            </div>
            <h3 className="font-display font-bold text-lg text-foreground">Email Attachments</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Compress raw PDFs below 25MB limits. Instantly consolidate large visual folders into a single, light attachment 
              ready for Outlook or Gmail.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Comparison Section */}
      <section className="space-y-6">
        <div className="space-y-3">
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Why GoluPDF is Better Than Other PDF Compressors
          </h2>
          <p className="text-muted-foreground">
            A technical comparison highlighting GoluPDFs' unique offline-first, client-side safety model.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-muted bg-card/30">
          <table className="w-full min-w-[600px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-muted">
                <th className="p-4 font-bold text-foreground">Optimization Vector</th>
                <th className="p-4 font-bold text-primary">GoluPDFs (Local)</th>
                <th className="p-4 font-bold text-muted-foreground">Adobe Web</th>
                <th className="p-4 font-bold text-muted-foreground">iLovePDF / Smallpdf</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/30">
              <tr>
                <td className="p-4 font-medium text-foreground">Upload Required</td>
                <td className="p-4 text-emerald-400 flex items-center gap-1.5">
                  <X className="h-4 w-4 text-emerald-400" /> No (Processed locally)
                </td>
                <td className="p-4 text-muted-foreground">Yes (Server required)</td>
                <td className="p-4 text-muted-foreground">Yes (Server required)</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-foreground">File Privacy</td>
                <td className="p-4 text-emerald-400 flex items-center gap-1.5">
                  <Shield className="h-4 w-4 text-emerald-400" /> 100% Safe (WASM Sandbox)
                </td>
                <td className="p-4 text-muted-foreground">Medium (Cloud storage)</td>
                <td className="p-4 text-muted-foreground">Low (Server logs retained)</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-foreground">Processing Speed</td>
                <td className="p-4 text-emerald-400 flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-emerald-400" /> Instant (No upload lag)
                </td>
                <td className="p-4 text-muted-foreground">Slow (Queue &amp; upload dependent)</td>
                <td className="p-4 text-muted-foreground">Slow (Queue &amp; upload dependent)</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-foreground">Watermark Overlays</td>
                <td className="p-4 text-emerald-400 flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-emerald-400" /> None (100% Free)
                </td>
                <td className="p-4 text-muted-foreground">Paywalled</td>
                <td className="p-4 text-muted-foreground">Paywalled / Basic limitations</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-foreground">Daily Usage Limits</td>
                <td className="p-4 text-emerald-400 flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-emerald-400" /> Unlimited
                </td>
                <td className="p-4 text-muted-foreground">Restricted to 1-2 per day</td>
                <td className="p-4 text-muted-foreground">Restricted to 2 per day</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. Internal Link Cards */}
      <section className="space-y-6">
        <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
          Explore Other PDF Utilities
        </h2>
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {[
            { name: "Merge PDF", href: "/tools/merge-pdf", desc: "Combine pages visually" },
            { name: "Split PDF", href: "/tools/split-pdf", desc: "Extract dynamic pages" },
            { name: "PDF to Word", href: "/tools/pdf-to-word", desc: "Convert text patterns" },
            { name: "PDF to JPG", href: "/tools/pdf-to-jpg", desc: "Extract high-DPI images" },
            { name: "Resize PDF", href: "/tools/resize-pdf", desc: "Lock to custom KB limits" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group p-4 rounded-xl border border-muted bg-card/20 hover:bg-card/50 hover:border-primary/20 transition-all duration-300 space-y-1 block"
            >
              <div className="text-xs font-bold text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                <span>{item.name}</span>
                <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-4px] group-hover:translate-x-0" />
              </div>
              <p className="text-[10px] text-muted-foreground line-clamp-1">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Related Blog Articles */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 border-b border-muted/50 pb-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
            Related Masterclass Articles
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Article 1 */}
          <Link
            href="/blog/best-pdf-compressor-2026"
            className="group block p-5 rounded-2xl border border-muted bg-card/25 hover:border-primary/20 hover:bg-card/60 transition-all duration-300 space-y-2"
          >
            <div className="inline-flex items-center rounded-full bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 text-[10px] font-semibold">
              SEO GUIDE
            </div>
            <h3 className="font-display font-bold text-foreground group-hover:text-primary transition-colors">
              The Best Free PDF Compressor in 2026
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
              We tested 12 popular compressors against 50 real-world PDFs. Here is what won and why browser-side compression is a security must.
            </p>
          </Link>

          {/* Article 2 */}
          <Link
            href="/blog/compress-pdf-to-100kb"
            className="group block p-5 rounded-2xl border border-muted bg-card/25 hover:border-primary/20 hover:bg-card/60 transition-all duration-300 space-y-2"
          >
            <div className="inline-flex items-center rounded-full bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 text-[10px] font-semibold">
              TUTORIAL
            </div>
            <h3 className="font-display font-bold text-foreground group-hover:text-primary transition-colors">
              How to Compress a PDF to 100 KB Without Losing Quality
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
              Need a tiny PDF for an online job board or passport portal? Learn how to compress PDFs under 100 KB using advanced sub-sampling locally.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
