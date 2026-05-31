import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { buildMetadata } from "@/lib/seo";
import { Cookie, ShieldAlert, Cpu, Heart, Coins, Eye, HelpCircle } from "lucide-react";

export const metadata: Metadata = buildMetadata({
  title: "Cookie Policy — Data and Browser Tracking Preferences",
  description:
    "GoluPDFs Cookie Policy. Learn about our theme preference tracking, Google Analytics 4, and Google AdSense configurations.",
  path: "/cookies",
});

export default function CookiesPage() {
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
              <Cookie className="h-3.5 w-3.5 text-primary" />
              COOKIE SETTINGS
            </span>
            <h1 className="mt-6 font-display text-balance text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl text-foreground">
              Cookie Policy
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">Last updated: May 31, 2026</p>
            <p className="mt-6 text-pretty text-lg text-muted-foreground">
              This Cookie Policy explains how GoluPDFs utilizes cookies and similar tracking web technologies to optimize our platform's speed, save user display preferences, and fund our free tools ecosystem.
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
                    { id: "what-are-cookies", label: "1. What Are Cookies?" },
                    { id: "how-we-use", label: "2. How We Use Cookies" },
                    { id: "types-of-cookies", label: "3. Types of Cookies We Use" },
                    { id: "manage-cookies", label: "4. Managing Preferences" },
                    { id: "contact-support", label: "5. Cookie Questions" },
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

              {/* Secure Cookie Shield Badge */}
              <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-5 flex items-start gap-3">
                <Eye className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-500 uppercase tracking-wider">No File Cookies</h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Cookies are mathematically isolated from your local PDF files. GoluPDFs never uses cookies to track or store your document contents.
                  </p>
                </div>
              </div>
            </aside>

            {/* Cookies Detailed Text (Right 8 Cols) */}
            <div className="lg:col-span-8 space-y-12 text-muted-foreground text-base sm:text-lg leading-relaxed text-pretty">
              
              <section id="what-are-cookies" className="scroll-mt-32 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                  <Cookie className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground font-display">
                  1. What Are Cookies?
                </h2>
                <p>
                  Cookies are miniature text data files placed directly on your computer or mobile device's storage directory by websites you visit. They are widely implemented to make online portals load faster, maintain user login states, and record navigational preferences.
                </p>
                <p>
                  Cookies may be **"Session Cookies"** (which automatically self-destruct when you close your web browser) or **"Persistent Cookies"** (which remain registered in your browser cache until they reach their pre-coded expiration date or are cleared manually).
                </p>
              </section>

              <section id="how-we-use" className="scroll-mt-32 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                  <Cpu className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground font-display">
                  2. How We Use Cookies
                </h2>
                <p>
                  GoluPDFs has a strict privacy blueprint. Because we operate all PDF restructuring client-side, we do not require accounts or user profiles.
                </p>
                <p>
                  Therefore, we do not implement cookies to identify your personal profile. We only employ cookies to preserve system theme choices (light/dark mode selections), prevent security bypasses in administrative dashboards, and serve targeted advertisements to cover Vercel CDN hosting costs.
                </p>
              </section>

              <section id="types-of-cookies" className="scroll-mt-32 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground font-display">
                  3. Types of Cookies We Use
                </h2>
                
                <div className="space-y-6">
                  {/* Essential Cookies */}
                  <div className="rounded-2xl border border-border/80 bg-card p-6">
                    <h3 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
                      <Heart className="h-4.5 w-4.5 text-primary shrink-0" />
                      A. Strictly Necessary & Preference Cookies
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      These cookies are essential to preserve website visual functionality. For example, they remember your theme selection (dark vs. light mode) and secure session configurations for admin-level operations. Disabling them will cause interface resets upon refresh.
                    </p>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="rounded-2xl border border-border/80 bg-card p-6">
                    <h3 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
                      <Cpu className="h-4.5 w-4.5 text-primary shrink-0" />
                      B. Performance & Analytics Cookies
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      We utilize Google Analytics 4 (GA4) cookies. These files provide anonymized aggregate data regarding which PDF tools are most popular, average page conversion speeds, and error occurrences. The data has strictly anonymized IPs and cannot trace individual users.
                    </p>
                  </div>

                  {/* Advertising Cookies */}
                  <div className="rounded-2xl border border-border/80 bg-card p-6">
                    <h3 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
                      <Coins className="h-4.5 w-4.5 text-primary shrink-0" />
                      C. Marketing & Advertising Cookies
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      To keep our high-fidelity tools completely free for everyone, we display Google AdSense advertisement slots. AdSense and its advertising partners use cookies to serve contextual ads based on aggregate content interests.
                    </p>
                  </div>
                </div>
              </section>

              <section id="manage-cookies" className="scroll-mt-32 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                  <Coins className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground font-display">
                  4. Managing Your Cookie Preferences
                </h2>
                <p>
                  Most web browsers automatically accept cookies, but you have the power to configure your browser parameters to reject cookies or prompt you before saving them.
                </p>
                <p>
                  You can clear your stored cookies at any time by going into your web browser's history setting menu and selecting **"Clear Cookies and Cache"**. 
                </p>
                <ul className="ml-5 list-disc space-y-2 text-sm leading-relaxed">
                  <li>
                    <strong className="text-foreground">Google Chrome:</strong> Settings → Privacy and Security → Cookies and other site data
                  </li>
                  <li>
                    <strong className="text-foreground">Apple Safari:</strong> Preferences → Privacy → Manage Website Data
                  </li>
                  <li>
                    <strong className="text-foreground">Mozilla Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data
                  </li>
                  <li>
                    <strong className="text-foreground">Microsoft Edge:</strong> Settings → Cookies and site permissions → Manage and delete cookies
                  </li>
                </ul>
              </section>

              <section id="contact-support" className="scroll-mt-32 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                  <HelpCircle className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground font-display">
                  5. Cookie Concerns & Support
                </h2>
                <p>
                  If you have any questions or security concerns regarding GoluPDFs' cookie policy, please reach out to Golu Kumar directly:
                </p>
                <p className="font-semibold text-foreground">
                  Email: <a className="text-primary hover:underline" href="mailto:lgdemon402lkr@gmail.com">lgdemon402lkr@gmail.com</a>
                </p>
                <p>
                  Our support is dedicated to answering legal or structural inquiries within 24 to 48 business hours.
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
