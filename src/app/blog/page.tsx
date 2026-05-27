export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Sparkles } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { buildMetadata } from "@/lib/seo";
import { getDbPosts } from "@/lib/admin/mock-blog-data";

export const metadata: Metadata = buildMetadata({
  title: "Blog — PDF guides & best practices",
  description:
    "Tutorials, deep dives and best practices for working with PDFs — from compression to digital signing.",
  path: "/blog",
});

const STATIC_POSTS = [
  {
    slug: "best-pdf-compressor-2026",
    title: "The best free PDF compressor in 2026",
    excerpt: "We tested 12 popular compressors against 50 real-world PDFs. Here's what won.",
    tag: "Guide",
    readTime: "8 min",
    date: "May 2026",
  },
  {
    slug: "compress-pdf-to-100kb",
    title: "How to compress a PDF to 100 KB without losing quality",
    excerpt: "A practical walkthrough of the settings that actually matter for tiny PDFs.",
    tag: "Tutorial",
    readTime: "6 min",
    date: "May 2026",
  },
  {
    slug: "merge-vs-combine-pdf",
    title: "Merge vs combine: how PDF tools differ (and when to use each)",
    excerpt: "Two terms, subtly different workflows. Choosing the right one saves hours.",
    tag: "Guide",
    readTime: "5 min",
    date: "April 2026",
  },
  {
    slug: "pdf-privacy-explained",
    title: "Browser-side vs server-side PDF tools: a privacy guide",
    excerpt: "Why local processing matters — and how to verify a tool is really browser-based.",
    tag: "Privacy",
    readTime: "7 min",
    date: "April 2026",
  },
  {
    slug: "esign-vs-digital-signature",
    title: "Electronic signature vs digital signature: what's the difference?",
    excerpt: "ESIGN, eIDAS, and PKI — explained for non-lawyers in plain English.",
    tag: "Legal",
    readTime: "9 min",
    date: "March 2026",
  },
  {
    slug: "ocr-best-practices",
    title: "OCR best practices for clean, searchable PDFs",
    excerpt: "From scanning resolution to language packs — a primer on getting OCR right.",
    tag: "Tutorial",
    readTime: "11 min",
    date: "March 2026",
  },
];

export default async function BlogPage() {
  const dbPosts = await getDbPosts();
  
  // Map dynamic posts to fit layout
  const dynamicPosts = dbPosts.map(p => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    tag: p.category || "Guide",
    readTime: p.read_time,
    date: p.published_at ? new Date(p.published_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Draft",
    isDynamic: true
  }));

  // Deduplicate and combine, prioritizing dynamic posts
  const combined = [...dynamicPosts];
  STATIC_POSTS.forEach(s => {
    if (!combined.some(c => c.slug === s.slug)) {
      combined.push({
        slug: s.slug,
        title: s.title,
        excerpt: s.excerpt,
        tag: s.tag,
        readTime: s.readTime,
        date: s.date,
        isDynamic: false
      });
    }
  });

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24 relative overflow-hidden bg-background">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="glass" className="mb-4">
              GOLUPDFS BLOG
            </Badge>
            <h1 className="font-display text-balance text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl text-foreground">
              PDF wisdom, served fresh.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-muted-foreground sm:text-lg">
              Guides, deep dives and best practices from the team building GoluPDFs.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {combined.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
              >
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant={p.isDynamic ? "glass" : "secondary"}>{p.tag}</Badge>
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" /> {p.readTime}
                  </span>
                  {p.isDynamic && (
                    <span className="text-[10px] text-primary font-mono ml-auto flex items-center gap-0.5"><Sparkles className="h-3 w-3" /> AI</span>
                  )}
                </div>
                <h3 className="mt-4 font-display text-xl font-bold leading-tight group-hover:text-primary transition-colors">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{p.excerpt}</p>
                <div className="mt-auto flex items-center justify-between pt-5 text-xs text-muted-foreground">
                  <span>{p.date}</span>
                  <span className="flex items-center gap-1 text-primary opacity-0 transition-opacity group-hover:opacity-100 font-semibold">
                    Read <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

