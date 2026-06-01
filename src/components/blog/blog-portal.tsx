"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Clock, Sparkles, Eye, Search, BookOpen, Mail, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export interface BlogPortalPost {
  slug: string;
  title: string;
  excerpt: string;
  tag: string;
  readTime: string;
  date: string;
  views: number;
  isDynamic: boolean;
  publishedAt: string;
}

interface BlogPortalProps {
  initialPosts: BlogPortalPost[];
}

export function BlogPortal({ initialPosts }: BlogPortalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");
  
  // Real-time posts state to handle client-side view count updates
  const [posts, setPosts] = useState<BlogPortalPost[]>(initialPosts);

  // Fetch real-time views client-side for all posts on mount via optimized batch same-origin endpoint!
  useEffect(() => {
    async function fetchRealViews() {
      try {
        const slugsParam = initialPosts.map(p => p.slug).join(",");
        const res = await fetch(`/api/views?slugs=${slugsParam}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.results) {
            const updatedPosts = initialPosts.map(post => {
              const viewCount = data.results[post.slug];
              return {
                ...post,
                views: typeof viewCount === "number" && viewCount > 0 ? viewCount : post.views
              };
            });
            setPosts(updatedPosts);
          }
        }
      } catch (e) {
        console.warn("Could not retrieve real-time batch views:", e);
      }
    }

    if (initialPosts.length > 0) {
      fetchRealViews();
    }
  }, [initialPosts]);

  // Extract unique categories for filter badges
  const categories = useMemo(() => {
    const list = new Set<string>();
    posts.forEach((p) => {
      if (p.tag) list.add(p.tag);
    });
    return ["All", ...Array.from(list)];
  }, [posts]);

  // Filter posts dynamically in real-time
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory =
        selectedCategory === "All" || post.tag === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, selectedCategory]);

  // Designate the newest pillar post as the "Featured Hero Post"
  const featuredPost = useMemo(() => {
    if (posts.length === 0) return null;
    return posts[0];
  }, [posts]);

  // Filter out the featured post from the grid if we are displaying all categories
  const gridPosts = useMemo(() => {
    if (!featuredPost) return filteredPosts;
    if (searchQuery !== "" || selectedCategory !== "All") return filteredPosts;
    return filteredPosts.filter((p) => p.slug !== featuredPost.slug);
  }, [filteredPosts, featuredPost, searchQuery, selectedCategory]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes("@")) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <div className="space-y-12">
      {/* ───────────────────────────────────────────────────────────────────────
          1. Hero Search & Filter Row
          ─────────────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card/40 backdrop-blur-md p-4 rounded-2xl border border-muted shadow-lg max-w-4xl mx-auto">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search masterclass guides..."
            className="pl-10 h-10 bg-background/50 border-muted focus-visible:ring-primary/40 rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Category Scroll Container */}
        <div className="flex gap-1.5 overflow-x-auto w-full md:w-auto py-1 scrollbar-none justify-start md:justify-end">
          {categories.slice(0, 6).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                selectedCategory === category
                  ? "bg-primary text-white shadow-md shadow-primary/20 scale-105"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"
              }`}
            >
              {category === "All" ? "⭐ All Topics" : category}
            </button>
          ))}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────────────────
          2. Premium Featured Pillar Section (Always Newest Guide)
          ─────────────────────────────────────────────────────────────────────── */}
      {featuredPost && searchQuery === "" && selectedCategory === "All" && (
        <div className="relative group overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 p-8 transition-all duration-300 hover:border-primary/40 hover:shadow-2xl">
          {/* Decorative Background Illumination */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/15 transition-colors duration-300" />
          <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="grid gap-6 md:grid-cols-12 relative z-10 items-center">
            <div className="md:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <Badge variant="glass" className="bg-primary/10 text-primary border-primary/20 font-semibold px-3 py-1">
                  🔥 FEATURED PILLAR GUIDE
                </Badge>
                <Badge variant="outline" className="font-mono text-[10px] py-0.5 border-emerald-500/20 bg-emerald-500/5 text-emerald-400">
                  <BookOpen className="h-3 w-3 mr-1" /> 100% SEO STRATEGIC
                </Badge>
              </div>

              <h2 className="font-display text-3xl font-extrabold sm:text-4xl text-foreground group-hover:text-primary transition-colors duration-300 tracking-tight leading-[1.1]">
                <Link href={`/blog/${featuredPost.slug}`}>
                  {featuredPost.title}
                </Link>
              </h2>
              
              <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 md:line-clamp-4">
                {featuredPost.excerpt}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-2">
                <div className="flex items-center gap-1.5 bg-muted/40 rounded-full px-3 py-1 border">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{featuredPost.readTime}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-muted/40 rounded-full px-3 py-1 border">
                  <Eye className="h-3.5 w-3.5 text-brand-500 animate-pulse" />
                  <span className="font-mono font-semibold text-foreground">
                    {featuredPost.views.toLocaleString()}
                  </span>
                  <span>views</span>
                </div>
                <span className="text-[11px] font-mono text-muted-foreground/80">{featuredPost.date}</span>
              </div>

              <div className="pt-4">
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all duration-200 text-white shadow-lg shadow-primary/20 bg-gradient-to-r from-brand-600 via-violet-600 to-fuchsia-600 hover:shadow-primary/40 hover:-translate-y-px h-10 px-5"
                >
                  Read Masterclass Guide <ArrowRight className="h-4 w-4 ml-1 animate-pulse" />
                </Link>
              </div>
            </div>

            <div className="md:col-span-5 flex justify-center">
              <div className="w-full aspect-video md:aspect-[4/3] rounded-2xl border bg-muted/20 overflow-hidden relative shadow-lg group-hover:shadow-xl transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-60 pointer-events-none" />
                <div className="absolute inset-0 flex items-center justify-center font-display font-extrabold text-foreground/20 text-6xl select-none">
                  GP
                </div>
                <div className="absolute bottom-4 left-4 right-4 bg-background/80 backdrop-blur border rounded-xl p-3 text-[11px] text-muted-foreground leading-snug">
                  <span className="font-semibold text-foreground block mb-0.5">Local Sandboxed Processing</span>
                  Zero cloud servers, zero watermarks, infinite scalability.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────────
          3. Grid Layout & Subscription Widget
          ─────────────────────────────────────────────────────────────────────── */}
      <div>
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20 bg-card/20 rounded-3xl border border-dashed border-muted">
            <BookOpen className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-foreground">No masterclass guides found</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
              We couldn't find any articles matching your search query. Try adjusting your filters.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gridPosts.map((p, idx) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-xl"
              >
                {/* Visual Top Bar */}
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant={p.isDynamic ? "glass" : "secondary"} className="font-semibold">
                    {p.tag}
                  </Badge>
                  <span className="inline-flex items-center gap-1 text-muted-foreground select-none">
                    <Clock className="h-3 w-3" /> {p.readTime}
                  </span>
                  
                  {p.isDynamic && (
                    <span className="text-[10px] text-primary font-semibold font-mono ml-auto flex items-center gap-0.5 select-none">
                      <Sparkles className="h-3 w-3 animate-pulse" /> E-E-A-T
                    </span>
                  )}
                </div>

                {/* Title & Excerpt */}
                <h3 className="mt-4 font-display text-xl font-bold leading-tight group-hover:text-primary transition-colors duration-300">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                  {p.excerpt}
                </p>

                {/* Footer Section */}
                <div className="mt-auto pt-6 flex items-center justify-between border-t border-muted/50 text-[11px] text-muted-foreground font-mono">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1 bg-muted/40 border px-2 py-0.5 rounded-full select-none">
                      <Eye className="h-3.5 w-3.5 text-brand-500 animate-pulse" /> {p.views.toLocaleString()}
                    </span>
                    <span>{p.date}</span>
                  </div>
                  <span className="flex items-center gap-1 text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100 font-semibold font-sans text-xs">
                    Read <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            ))}

            {/* ─────────────────────────────────────────────────────────────────
                4. High-Converting Newsletter Subscription Card in Grid
                ───────────────────────────────────────────────────────────────── */}
            {gridPosts.length >= 2 && (
              <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-violet-500/5 p-6 shadow-md justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-primary shadow-inner">
                      <Mail className="h-4 w-4" />
                    </span>
                    <span className="text-xs font-semibold text-foreground uppercase tracking-wider font-mono">VIRAL UPDATES</span>
                  </div>
                  <h3 className="font-display text-xl font-bold leading-tight text-foreground">Get Private Document Hacks</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Subscribe to receive advanced, serverless, and private document processing blueprints compiled by founder Golu Kumar.
                  </p>
                </div>

                <div className="pt-6">
                  {subscribed ? (
                    <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl text-xs font-medium animate-fade-in">
                      <CheckCircle className="h-4 w-4 shrink-0" />
                      <span>Subscribed! Check your inbox soon.</span>
                    </div>
                  ) : (
                    <form onSubmit={handleSubscribe} className="space-y-2">
                      <Input
                        type="email"
                        placeholder="yourname@email.com"
                        required
                        className="h-9 text-xs bg-background/50 border-muted rounded-xl"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <button
                        type="submit"
                        className="w-full h-9 rounded-xl text-xs font-semibold transition-all duration-200 text-white bg-primary hover:bg-primary/95 shadow-md shadow-primary/15"
                      >
                        Subscribe Free
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
