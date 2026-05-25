"use client";

import React from "react";
import { GitCommit, GitBranch, ArrowRight, Award, Network, Anchor } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TopicalAuthorityMapProps {
  posts: any[];
}

export function TopicalAuthorityMap({ posts }: TopicalAuthorityMapProps) {
  // Group posts by Topic Cluster
  const clusters: Record<string, { pillar: any; spokes: any[] }> = {};

  posts.forEach((post) => {
    const clusterName = post.topic_cluster || "Compression Tools";
    if (!clusters[clusterName]) {
      clusters[clusterName] = { pillar: null, spokes: [] };
    }

    if (post.is_pillar) {
      clusters[clusterName].pillar = post;
    } else {
      clusters[clusterName].spokes.push(post);
    }
  });

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-card to-violet-500/5 border-violet-500/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Network className="h-5 w-5 text-violet-500" />
            <CardTitle>Topical Hub & Spoke Tree Map</CardTitle>
          </div>
          <CardDescription>
            GoluPDFs semantic search graph mapping out high-authority Pillar hubs and supporting spoke articles linked contextually to drive ranking authority.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {Object.keys(clusters).map((clusterName) => {
            const cluster = clusters[clusterName];
            const hasPillar = !!cluster.pillar;

            return (
              <div key={clusterName} className="rounded-xl border bg-background/40 p-5 space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
                    <GitBranch className="h-4 w-4 text-primary" /> {clusterName} Cluster
                  </h3>
                  <Badge variant="glass">Topical Coverage: Excellent</Badge>
                </div>

                <div className="flex flex-col lg:flex-row items-center gap-6 py-4 justify-center">
                  {/* Pillar Hub Container */}
                  <div className="w-full lg:w-72">
                    {hasPillar ? (
                      <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 text-center space-y-3 relative group hover:shadow-lg transition-all">
                        <Badge variant="glass" className="absolute -top-2.5 left-1/2 -translate-x-1/2 font-mono text-[9px] uppercase tracking-wider text-emerald-500">
                          <Award className="h-3 w-3 mr-1" /> Pillar Hub
                        </Badge>
                        <h4 className="font-bold text-sm text-foreground mt-2 line-clamp-2 leading-tight">{cluster.pillar.title}</h4>
                        <p className="text-[11px] text-muted-foreground font-mono">SEO Score: {cluster.pillar.seo_score}/100</p>
                        <div className="text-[10px] text-primary bg-primary/10 border border-primary/20 rounded px-2 py-1 inline-block font-mono">
                          {cluster.spokes.length} Spokes Linked
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-xl border border-dashed p-6 text-center text-muted-foreground text-xs space-y-2">
                        <p>No Pillar Page generated for this cluster.</p>
                        <Badge variant="secondary" className="cursor-pointer">Generate Pillar Now</Badge>
                      </div>
                    )}
                  </div>

                  {/* Flow Arrow (desktop) */}
                  <div className="hidden lg:flex flex-col items-center justify-center text-muted-foreground/40 gap-1 select-none">
                    <span className="text-[10px] font-mono text-violet-500 uppercase tracking-widest font-bold">Link Juice</span>
                    <ArrowRight className="h-6 w-6 text-primary stroke-[1.5]" />
                    <Anchor className="h-3.5 w-3.5 text-primary" />
                  </div>

                  {/* Spokes Grid Container */}
                  <div className="flex-1 w-full grid gap-3 sm:grid-cols-2">
                    {cluster.spokes.length === 0 ? (
                      <div className="col-span-2 text-center py-6 text-xs text-muted-foreground border rounded-lg border-dashed">
                        No supporting spoke articles have been created under this cluster yet.
                      </div>
                    ) : (
                      cluster.spokes.map((spoke) => (
                        <div key={spoke.id} className="rounded-lg border bg-card/60 p-3 hover:border-primary/30 transition-all flex flex-col justify-between">
                          <div className="space-y-1">
                            <h5 className="font-semibold text-xs leading-snug line-clamp-2 text-foreground">{spoke.title}</h5>
                            <p className="text-[10px] text-muted-foreground">{spoke.excerpt.substring(0, 75)}...</p>
                          </div>
                          <div className="flex items-center justify-between mt-3 text-[9px] font-mono">
                            <span className="text-emerald-500 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              <GitCommit className="h-3 w-3" /> Spokes Linked
                            </span>
                            <span className="text-muted-foreground">SEO: {spoke.seo_score}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
