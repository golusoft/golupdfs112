export const dynamic = "force-dynamic";

import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Breadcrumbs } from "@/components/tools/breadcrumbs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Map, 
  ChevronRight, 
  ArrowRight,
  BookOpen, 
  FileSpreadsheet, 
  CreditCard, 
  Zap, 
  ShieldCheck, 
  Globe,
  Settings,
  HelpCircle,
  Clock
} from "lucide-react";
import { TOOLS } from "@/lib/tools";
import { SEO_PAGES } from "@/lib/seo-pages";
import { SITE, buildMetadata } from "@/lib/seo";
import { getDbPosts } from "@/lib/admin/mock-blog-data";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Sitemap Directory — All PDF Tools & Guides",
    description: "Access the complete directory of GoluPDFs. 30+ browser-side PDF tools, 390+ programmatic document extraction templates, and professional step-by-step guides.",
    path: "/sitemap"
  });
}

export default async function SitemapPage() {
  const now = new Date();
  
  // Group programmatic pages
  const bankPages = SEO_PAGES.filter(
    (p) => p.slug.startsWith("extract-") && 
    p.slug.endsWith("-statement-pdf-to-excel") && 
    !p.slug.includes("-cc-") && 
    !p.slug.includes("amex") && 
    !p.slug.includes("card") && 
    !p.slug.includes("discover") && 
    !p.slug.includes("freedom") && 
    !p.slug.includes("visa")
  );

  const cardPages = SEO_PAGES.filter(
    (p) => p.slug.startsWith("extract-") && 
    p.slug.endsWith("-statement-pdf-to-excel") && 
    (p.slug.includes("-cc-") || p.slug.includes("amex") || p.slug.includes("card") || p.slug.includes("discover") || p.slug.includes("freedom") || p.slug.includes("visa"))
  );

  const invoicePages = SEO_PAGES.filter((p) => p.slug.startsWith("extract-") && p.slug.endsWith("-invoice-pdf-to-excel"));
  const utilityPages = SEO_PAGES.filter((p) => p.slug.startsWith("extract-") && p.slug.endsWith("-bill-pdf-to-excel"));
  const industryPages = SEO_PAGES.filter((p) => p.slug.startsWith("templates/"));
  const generalPages = SEO_PAGES.filter((p) => !p.slug.startsWith("extract-") && !p.slug.startsWith("templates/"));

  // Fetch blog posts from DB
  let blogPosts: any[] = [];
  try {
    const posts = await getDbPosts();
    blogPosts = posts.filter((p) => !!p.published_at);
  } catch (err) {
    console.error("Failed to load blog posts for sitemap page:", err);
  }

  return (
    <>
      <Navbar />

      <main className="relative pt-28 pb-20 bg-background min-h-screen overflow-hidden">
        {/* Mesh Background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -z-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 -z-10 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl pointer-events-none animate-float" />

        <div className="container max-w-7xl">
          {/* Breadcrumbs */}
          <div className="mb-6 select-none font-mono">
            <Breadcrumbs items={[{ label: "Sitemap Directory" }]} />
          </div>

          {/* Header */}
          <div className="max-w-3xl space-y-4 mb-12">
            <Badge variant="glass" className="font-mono text-xs gap-1.5 py-1 px-3">
              <Map className="h-3.5 w-3.5 text-primary" /> Complete Directory
            </Badge>
            <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl text-foreground text-pretty leading-none">
              GoluPDFs Sitemap & Page Directory
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Explore all our secure, in-browser PDF utilities, custom transaction parsing templates, and step-by-step document management guides. Everything processes 100% locally.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-12">
            {/* Left side groups */}
            <div className="md:col-span-8 space-y-10">
              
              {/* Category 1: Core PDF Tools */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b pb-2 border-border/40">
                  <Badge variant="outline" className="font-bold border-primary/20 text-primary">01</Badge>
                  <h2 className="font-display text-xl font-bold text-foreground">Core PDF Workspace Tools</h2>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {TOOLS.map((t) => (
                    <Link
                      key={t.slug}
                      href={`/tools/${t.slug}`}
                      className="group p-4 rounded-xl border bg-card/40 hover:bg-card/90 border-border/30 hover:border-primary/20 shadow-sm transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                            {t.name}
                          </span>
                          {t.badge && (
                            <Badge variant={t.badge === "ai" ? "gradient" : "outline"} className="text-[9px] uppercase py-0 px-1 font-mono">
                              {t.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                          {t.description}
                        </p>
                      </div>
                      <div className="mt-3 flex items-center gap-1 text-[10px] font-mono text-primary group-hover:underline">
                        Launch Tool <ChevronRight className="h-3 w-3" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Category 2: Bank Statement Converters */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b pb-2 border-border/40">
                  <Badge variant="outline" className="font-bold border-primary/20 text-primary">02</Badge>
                  <h2 className="font-display text-xl font-bold text-foreground">Bank Statement Extractor Guides ({bankPages.length})</h2>
                </div>
                <div className="grid gap-2.5 sm:grid-cols-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {bankPages.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/${p.slug}`}
                      className="text-xs text-muted-foreground hover:text-primary hover:underline transition-colors flex items-center gap-1.5 p-1 rounded hover:bg-accent/40"
                    >
                      <FileSpreadsheet className="h-3.5 w-3.5 text-primary/50 shrink-0" />
                      <span className="truncate">{p.h1}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Category 3: Credit Card Extractor Guides */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b pb-2 border-border/40">
                  <Badge variant="outline" className="font-bold border-primary/20 text-primary">03</Badge>
                  <h2 className="font-display text-xl font-bold text-foreground">Credit Card Statement Extractor Guides ({cardPages.length})</h2>
                </div>
                <div className="grid gap-2.5 sm:grid-cols-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                  {cardPages.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/${p.slug}`}
                      className="text-xs text-muted-foreground hover:text-primary hover:underline transition-colors flex items-center gap-1.5 p-1 rounded hover:bg-accent/40"
                    >
                      <CreditCard className="h-3.5 w-3.5 text-violet-500/50 shrink-0" />
                      <span className="truncate">{p.h1}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Category 4: Invoice Extractor Guides */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b pb-2 border-border/40">
                  <Badge variant="outline" className="font-bold border-primary/20 text-primary">04</Badge>
                  <h2 className="font-display text-xl font-bold text-foreground">Invoice & Platform Extractor Guides ({invoicePages.length})</h2>
                </div>
                <div className="grid gap-2.5 sm:grid-cols-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                  {invoicePages.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/${p.slug}`}
                      className="text-xs text-muted-foreground hover:text-primary hover:underline transition-colors flex items-center gap-1.5 p-1 rounded hover:bg-accent/40"
                    >
                      <FileText className="h-3.5 w-3.5 text-blue-500/50 shrink-0" />
                      <span className="truncate">{p.h1}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Category 5: Utility Bill Extractor Guides */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b pb-2 border-border/40">
                  <Badge variant="outline" className="font-bold border-primary/20 text-primary">05</Badge>
                  <h2 className="font-display text-xl font-bold text-foreground">Utility & Bill Extractor Guides ({utilityPages.length})</h2>
                </div>
                <div className="grid gap-2.5 sm:grid-cols-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                  {utilityPages.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/${p.slug}`}
                      className="text-xs text-muted-foreground hover:text-primary hover:underline transition-colors flex items-center gap-1.5 p-1 rounded hover:bg-accent/40"
                    >
                      <Zap className="h-3.5 w-3.5 text-amber-500/50 shrink-0" />
                      <span className="truncate">{p.h1}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Category 6: Industry PDF Workflows */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b pb-2 border-border/40">
                  <Badge variant="outline" className="font-bold border-primary/20 text-primary">06</Badge>
                  <h2 className="font-display text-xl font-bold text-foreground">Industry Workflows & Document Templates ({industryPages.length})</h2>
                </div>
                <div className="grid gap-2.5 sm:grid-cols-2 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                  {industryPages.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/${p.slug}`}
                      className="text-xs text-muted-foreground hover:text-primary hover:underline transition-colors flex items-center gap-1.5 p-1 rounded hover:bg-accent/40"
                    >
                      <Globe className="h-3.5 w-3.5 text-emerald-500/50 shrink-0" />
                      <span className="truncate">{p.h1}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Category 7: General PDF Resizers & Comparisons */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b pb-2 border-border/40">
                  <Badge variant="outline" className="font-bold border-primary/20 text-primary">07</Badge>
                  <h2 className="font-display text-xl font-bold text-foreground">General PDF Guides & Competitor Comparisons</h2>
                </div>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {generalPages.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/${p.slug}`}
                      className="text-xs text-muted-foreground hover:text-primary hover:underline transition-colors flex items-center gap-1.5 p-1 rounded hover:bg-accent/40"
                    >
                      <HelpCircle className="h-3.5 w-3.5 text-amber-500/50 shrink-0" />
                      <span className="truncate">{p.h1}</span>
                    </Link>
                  ))}
                </div>
              </div>

            </div>

            {/* Right side widgets (Blogs, Stats, Info) */}
            <aside className="md:col-span-4 space-y-6">
              
              {/* Dynamic Blogs List */}
              <Card className="border-primary/10 bg-gradient-to-br from-card to-primary/5">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" /> Latest Blog Guides
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-5">
                  {blogPosts.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No blog posts available.</p>
                  ) : (
                    <ul className="space-y-3.5">
                      {blogPosts.map((post) => {
                        const dateStr = post.published_at
                          ? new Date(post.published_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric"
                            })
                          : "Guide";
                        return (
                          <li key={post.slug} className="group border-b border-border/30 pb-3 last:border-b-0 last:pb-0">
                            <Link href={`/blog/${post.slug}`} className="block">
                              <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                                {post.title}
                              </span>
                              <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-muted-foreground font-mono">
                                <Clock className="h-3 w-3" /> {dateStr}
                              </div>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </CardContent>
              </Card>

              {/* Security info card */}
              <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-500" />
                  <h3 className="text-sm font-semibold text-foreground">100% In-Browser Privacy</h3>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  GoluPDFs uses high-performance client-side WebAssembly rendering to modify your files. No documents are uploaded to our web servers, ensuring compliance with data privacy regulations.
                </p>
              </div>

              {/* Site Stats details */}
              <Card className="border-border/30 bg-card/20">
                <CardContent className="p-5 space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Settings className="h-4 w-4" /> Indexing Overview
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="rounded-lg bg-background/50 border p-2.5">
                      <p className="text-xs text-muted-foreground">PDF tools</p>
                      <p className="text-lg font-bold mt-0.5">{TOOLS.length}</p>
                    </div>
                    <div className="rounded-lg bg-background/50 border p-2.5">
                      <p className="text-xs text-muted-foreground">SEO Pages</p>
                      <p className="text-lg font-bold mt-0.5">{SEO_PAGES.length}</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground text-center font-mono">
                    Last Site Manifest compilation: {now.toLocaleDateString("en-US")}
                  </p>
                </CardContent>
              </Card>

            </aside>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
