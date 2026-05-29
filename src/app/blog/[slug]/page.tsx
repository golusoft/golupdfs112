export const dynamic = "force-dynamic";

import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock, Calendar, User, ArrowLeft, ChevronRight, CheckCircle, Shield } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";
import { getDbPostBySlug } from "@/lib/admin/mock-blog-data";
import { BlogViewsTracker } from "@/components/blog/views-tracker";
import Link from "next/link";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Dynamic Metadata Compilation
// ─────────────────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getDbPostBySlug(slug);
  
  if (!post) {
    return buildMetadata({
      title: "Not Found",
      description: "Document not found.",
      path: `/blog/${slug}`,
      noindex: true
    });
  }

  return buildMetadata({
    title: post.title,
    description: post.excerpt || post.meta_description,
    path: `/blog/${slug}`,
    ogImage: post.image_url,
    keywords: post.keywords
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Custom Markdown to HTML Compiler
// ─────────────────────────────────────────────────────────────────────────────

function parseMarkdown(md: string): React.ReactNode[] {
  const lines = md.split("\n");
  const parsed: React.ReactNode[] = [];
  
  let inList = false;
  let listItems: string[] = [];
  
  const flushList = (key: number) => {
    if (listItems.length > 0) {
      parsed.push(
        <ul key={`ul-${key}`} className="my-6 list-disc pl-6 space-y-2 text-muted-foreground leading-relaxed">
          {listItems.map((item, index) => (
            <li key={index} dangerouslySetInnerHTML={{ __html: parseInline(item) }} />
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  const parseInline = (text: string) => {
    return text
      // Bold Markdown **text**
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
      // Custom deep anchor links
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-primary hover:underline font-medium">$1</a>');
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Headers
    if (trimmed.startsWith("# ")) {
      flushList(index);
      parsed.push(
        <h1 key={index} className="font-display text-3xl font-extrabold text-foreground mt-8 mb-4 leading-tight">
          {trimmed.replace("# ", "")}
        </h1>
      );
    } else if (trimmed.startsWith("## ")) {
      flushList(index);
      parsed.push(
        <h2 key={index} className="font-display text-2xl font-bold text-foreground mt-8 mb-4 border-b pb-2 leading-tight">
          {trimmed.replace("## ", "")}
        </h2>
      );
    } else if (trimmed.startsWith("### ")) {
      flushList(index);
      parsed.push(
        <h3 key={index} className="font-display text-lg font-bold text-foreground mt-6 mb-3 leading-snug">
          {trimmed.replace("### ", "")}
        </h3>
      );
    }
    // Lists
    else if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
      inList = true;
      listItems.push(trimmed.substring(2));
    }
    // Divider
    else if (trimmed === "---") {
      flushList(index);
      parsed.push(<hr key={index} className="my-8 border-muted/80" />);
    }
    // Blank Line
    else if (trimmed === "") {
      flushList(index);
    }
    // Table (simple layout parser)
    else if (trimmed.startsWith("|")) {
      flushList(index);
      if (trimmed.includes("---")) return; // skip header lines divider
      const cells = trimmed.split("|").map(c => c.trim()).filter(c => c !== "");
      parsed.push(
        <div key={index} className="flex gap-4 p-3 border-b hover:bg-muted/10 font-mono text-xs text-muted-foreground">
          {cells.map((cell, idx) => (
            <span key={idx} className="flex-1" dangerouslySetInnerHTML={{ __html: parseInline(cell) }} />
          ))}
        </div>
      );
    }
    // Paragraph
    else {
      flushList(index);
      parsed.push(
        <p
          key={index}
          className="my-5 text-muted-foreground leading-relaxed text-pretty"
          dangerouslySetInnerHTML={{ __html: parseInline(trimmed) }}
        />
      );
    }
  });

  flushList(lines.length);
  return parsed;
}

// ─────────────────────────────────────────────────────────────────────────────
// Readers Render Page
// ─────────────────────────────────────────────────────────────────────────────

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getDbPostBySlug(slug);

  if (!post) notFound();

  const formattedDate = post.published_at 
    ? new Date(post.published_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "Draft Guide";

  return (
    <>
      <Navbar />
      
      {/* Structural JSON-LD Injection */}
      {post.schema_markup && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(post.schema_markup) }}
        />
      )}

      <main className="relative pt-32 pb-24 min-h-screen bg-background overflow-hidden">
        {/* Sleek Mesh Gradient Circles background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -z-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 -z-10 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none animate-float" />

        <div className="container max-w-4xl">
          {/* Breadcrumb row */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-8 select-none font-mono">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground truncate max-w-[200px]">{post.title}</span>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Badge variant="glass">{post.category}</Badge>
              <Badge variant="outline" className="font-mono text-[10px]"><Shield className="h-3 w-3 mr-1 text-emerald-500" /> SECURED LOCAL</Badge>
            </div>
            
            <h1 className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl text-foreground text-pretty">
              {post.title}
            </h1>

            {/* Author card row */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-t border-b text-xs text-muted-foreground">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-500 to-fuchsia-500 flex items-center justify-center font-bold text-white text-[10px]">
                    GP
                  </div>
                  <span className="font-semibold text-foreground">{post.author}</span>
                </div>
                <span className="h-4 w-px bg-muted hidden sm:inline" />
                <div className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {formattedDate}</div>
                <span className="h-4 w-px bg-muted hidden sm:inline" />
                <div className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {post.read_time} read</div>
              </div>
              <BlogViewsTracker slug={slug} initialViews={post.views_30d || 0} />
            </div>

            {/* Featured Image display */}
            {post.image_url && (
              <div className="rounded-2xl border bg-muted/20 overflow-hidden relative aspect-video max-h-[460px] my-8 shadow-xl">
                <img
                  src={post.image_url}
                  alt={post.image_alt || post.title}
                  className="object-cover w-full h-full"
                />
                {post.image_caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur border-t px-4 py-2.5 text-[11px] text-muted-foreground text-center">
                    {post.image_caption}
                  </div>
                )}
              </div>
            )}

            {/* Core Markdown compiled content */}
            <article className="prose prose-invert max-w-none pt-4 text-pretty">
              {parseMarkdown(post.content)}
            </article>

            {/* Conversion CTA Block */}
            <div className="mt-16 rounded-2xl border border-primary/20 bg-gradient-to-br from-card to-primary/5 p-6 md:p-8 text-center space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-xl pointer-events-none" />
              <div className="max-w-xl mx-auto space-y-3">
                <Badge variant="glass">🔥 GoluPDFs Professional Tools</Badge>
                <h3 className="font-display font-extrabold text-2xl text-foreground">Done reading? Run compression locally.</h3>
                <p className="text-sm text-muted-foreground">
                  Stop uploading your private PDFs to insecure cloud servers. Combine, compress, or sign files inside your browser completely sandboxed.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Button asChild variant="gradient" size="default">
                  <Link href="/tools">
                    Launch PDF Tools Catalog <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="default">
                  <Link href="/">
                    Back to Home
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
