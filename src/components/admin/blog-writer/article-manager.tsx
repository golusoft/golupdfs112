"use client";

import React, { useState } from "react";
import { Eye, Trash2, Globe, Clock, CheckCircle, ChevronDown, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CircularProgress } from "@/components/admin/ui/circular-progress";
import { toast } from "sonner";
import Link from "next/link";

interface ArticleManagerProps {
  posts: any[];
  onPublish: (slug: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function ArticleManager({ posts, onPublish, onDelete }: ArticleManagerProps) {
  const [publishingSlug, setPublishingSlug] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const handlePublish = async (slug: string) => {
    setPublishingSlug(slug);
    try {
      await onPublish(slug);
      toast.success("Article syndicated and published dynamically!");
    } catch (e: any) {
      toast.error(e.message || "Failed to publish");
    } finally {
      setPublishingSlug(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article? This action is permanent.")) return;
    try {
      await onDelete(id);
      toast.success("Article draft deleted.");
    } catch (e: any) {
      toast.error(e.message || "Failed to delete");
    }
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl border bg-card">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <th className="px-6 py-4">Title & Details</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">SEO Score</th>
              <th className="px-6 py-4">Traffic (30d)</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                  No articles generated yet. Run the Autonomous Agent above to start!
                </td>
              </tr>
            ) : (
              posts.map((post) => {
                const isPublished = !!post.published_at;
                const isSelected = selectedPostId === post.id;
                
                return (
                  <React.Fragment key={post.id}>
                    <tr className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4 max-w-md">
                        <div className="flex flex-col gap-1">
                          <h4 className="font-semibold text-foreground leading-snug">{post.title}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-1">{post.excerpt}</p>
                          <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted-foreground">
                            <span className="bg-muted px-2 py-0.5 rounded text-foreground font-medium">{post.category}</span>
                            <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {post.read_time}</span>
                            <span>By {post.author}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {isPublished ? (
                          <Badge variant="glass" className="inline-flex items-center gap-1 text-emerald-500">
                            <Globe className="h-3 w-3" /> Published
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="inline-flex items-center gap-1">
                            <Clock className="h-3 w-3" /> Draft
                          </Badge>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col items-center justify-center gap-1 cursor-pointer" onClick={() => setSelectedPostId(isSelected ? null : post.id)}>
                          <CircularProgress value={post.seo_score} size={48} strokeWidth={4} />
                          <span className="text-[10px] text-muted-foreground flex items-center gap-0.5 select-none hover:text-primary">
                            Details <ChevronDown className={`h-2.5 w-2.5 transition-transform ${isSelected ? "rotate-180" : ""}`} />
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium text-foreground">{post.views_30d.toLocaleString()} Views</span>
                          <span className="text-muted-foreground text-[10px]">{post.clicks_30d} Clicks · {post.ctr_30d}% CTR</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end items-center gap-2">
                          {isPublished ? (
                            <Button asChild size="sm" variant="outline" className="h-8">
                              <Link href={`/blog/${post.slug}`} target="_blank">
                                <Eye className="h-3.5 w-3.5 mr-1" /> View
                              </Link>
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="gradient"
                              className="h-8"
                              onClick={() => handlePublish(post.slug)}
                              disabled={publishingSlug === post.slug}
                            >
                              <Globe className="h-3.5 w-3.5 mr-1" /> Publish
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" className="h-8 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10" onClick={() => handleDelete(post.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                    {isSelected && (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 bg-muted/30 border-t border-b">
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                            <ScoreDetailCard label="Keyword Density" score={post.seo_score_details?.keyword_density || 80} />
                            <ScoreDetailCard label="Headings structure" score={post.seo_score_details?.structure_score || 80} />
                            <ScoreDetailCard label="Readability index" score={post.seo_score_details?.readability_score || 80} />
                            <ScoreDetailCard label="Link authority" score={post.seo_score_details?.link_score || 80} />
                            <ScoreDetailCard label="CTR Optimization" score={post.seo_score_details?.ctr_score || 80} />
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ScoreDetailCard({ label, score }: { label: string; score: number }) {
  let scoreColor = "text-rose-500 border-rose-500/20 bg-rose-500/5";
  if (score >= 80) scoreColor = "text-emerald-500 border-emerald-500/20 bg-emerald-500/5";
  else if (score >= 50) scoreColor = "text-amber-500 border-amber-500/20 bg-amber-500/5";

  return (
    <div className={`p-3 rounded-lg border flex flex-col items-center justify-center ${scoreColor}`}>
      <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider mb-1 text-center leading-tight">{label}</span>
      <span className="font-display font-bold text-lg font-mono">{score}</span>
    </div>
  );
}
