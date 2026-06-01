export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { buildMetadata } from "@/lib/seo";
import { getDbPosts } from "@/lib/admin/mock-blog-data";
import { BlogPortal, type BlogPortalPost } from "@/components/blog/blog-portal";

export const metadata: Metadata = buildMetadata({
  title: "Blog — PDF Guides & Document Blueprints",
  description:
    "Masterclass tutorials, deep-dives and secure local best practices for working with PDFs — from compression to digital signing.",
  path: "/blog",
});

const STATIC_POSTS = [
  {
    slug: "best-pdf-compressor-2026",
    title: "The Best Free PDF Compressor in 2026",
    excerpt: "We tested 12 popular compressors against 50 real-world PDFs. Here is what won and why browser-side compression is a security must.",
    tag: "Guide",
    readTime: "8 min",
    publishedAt: "2026-05-01T10:00:00Z",
    views: 12450
  },
  {
    slug: "compress-pdf-to-100kb",
    title: "How to Compress a PDF to 100 KB Without Losing Quality",
    excerpt: "Need a tiny PDF for an online job board or passport portal? Learn how to compress PDFs under 100 KB using advanced sub-sampling locally.",
    tag: "Tutorial",
    readTime: "6 min",
    publishedAt: "2026-05-10T12:00:00Z",
    views: 8320
  },
  {
    slug: "merge-vs-combine-pdf",
    title: "Merge vs Combine: How PDF Tools Differ (And When to Use Each)",
    excerpt: "Two terms, subtly different workflows. Choosing the right file consolidation method saves hours and keeps your vectors sharp.",
    tag: "Guide",
    readTime: "5 min",
    publishedAt: "2026-04-15T09:00:00Z",
    views: 3120
  },
  {
    slug: "pdf-privacy-explained",
    title: "Browser-side vs Server-side PDF Tools: A Complete Privacy Guide",
    excerpt: "Why local sandbox processing matters — and how to verify a tool is really browser-based using Chrome DevTools.",
    tag: "Privacy",
    readTime: "7 min",
    publishedAt: "2026-04-05T14:30:00Z",
    views: 4500
  },
  {
    slug: "esign-vs-digital-signature",
    title: "Electronic Signature vs Digital Signature: What's the Difference?",
    excerpt: "ESIGN Act, eIDAS, and PKI cryptography guidelines — explained for non-lawyers in plain, simple English.",
    tag: "Legal",
    readTime: "9 min",
    publishedAt: "2026-03-22T11:15:00Z",
    views: 2900
  },
  {
    slug: "ocr-best-practices",
    title: "OCR Best Practices for Clean, Searchable PDFs",
    excerpt: "From original scanning resolution levels to local language packs — a complete primer on getting browser-side OCR right.",
    tag: "Tutorial",
    readTime: "11 min",
    publishedAt: "2026-03-10T16:00:00Z",
    views: 6100
  },
];

export default async function BlogPage() {
  const dbPosts = await getDbPosts();
  
  // 1. Map dynamic database/mock posts to unified portal format
  const dynamicPosts: BlogPortalPost[] = dbPosts.map(p => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    tag: p.category || "Guide",
    readTime: p.read_time,
    date: p.published_at 
      ? new Date(p.published_at).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }) 
      : "Draft Guide",
    views: p.views_30d || 0,
    isDynamic: true,
    publishedAt: p.published_at || new Date().toISOString()
  }));

  // 2. Map static posts to portal format, ensuring deduplication
  const combinedPosts = [...dynamicPosts];
  
  STATIC_POSTS.forEach(s => {
    if (!combinedPosts.some(c => c.slug === s.slug)) {
      combinedPosts.push({
        slug: s.slug,
        title: s.title,
        excerpt: s.excerpt,
        tag: s.tag,
        readTime: s.readTime,
        date: new Date(s.publishedAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
        views: s.views,
        isDynamic: false,
        publishedAt: s.publishedAt
      });
    }
  });

  // 3. Strict chronological sorting: Newest posts ALWAYS go at the very top!
  combinedPosts.sort((a, b) => {
    const timeA = new Date(a.publishedAt).getTime();
    const timeB = new Date(b.publishedAt).getTime();
    return timeB - timeA;
  });

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24 relative overflow-hidden bg-background">
        {/* Ambient mesh background effects */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-10 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="container">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <Badge variant="glass" className="mb-4 uppercase tracking-widest text-[10px] font-bold">
              GoluPDFs Masterclass
            </Badge>
            <h1 className="font-display text-balance text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl text-foreground">
              Document secrets, served fresh.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-muted-foreground sm:text-lg">
              High-fidelity E-E-A-T guides, secure local tools showcases, and financial planning blueprints.
            </p>
          </div>

          {/* Interactive Blog Portal rendering search, filters, featured hero, and news updates */}
          <BlogPortal initialPosts={combinedPosts} />
        </div>
      </main>
      <Footer />
    </>
  );
}
