"use client";

import React, { useState } from "react";
import { Sparkles, BookOpen, FileText, CheckCircle, HelpCircle, Loader2, AlertCircle, Eye, MousePointerClick, ArrowUpRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface DashboardOverviewProps {
  postsCount: number;
  draftsCount: number;
  keywordsCount: number;
  avgSeoScore: number;
  logs: any[];
  insights: any[];
  onTriggerAgent: (keyword: string) => Promise<void>;
  onTriggerResearch: (topic: string) => Promise<void>;
  loading: boolean;
}

export function DashboardOverview({
  postsCount,
  draftsCount,
  keywordsCount,
  avgSeoScore,
  logs,
  insights,
  onTriggerAgent,
  onTriggerResearch,
  loading
}: DashboardOverviewProps) {
  const [researchTopic, setResearchTopic] = useState("PDF office productivity");
  const [researchLoading, setResearchLoading] = useState(false);
  const [customKeyword, setCustomKeyword] = useState("how to split pdf pages without adobe acrobat");

  const handleResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!researchTopic.trim()) return;
    setResearchLoading(true);
    try {
      await onTriggerResearch(researchTopic);
      toast.success("Keyword research compiled and cataloged!");
    } catch (err: any) {
      toast.error(err.message || "Failed to research keywords");
    } finally {
      setResearchLoading(false);
    }
  };

  const handleRunAgent = async () => {
    if (!customKeyword.trim()) return;
    try {
      await onTriggerAgent(customKeyword);
    } catch (err: any) {
      // handled in parent
    }
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Platform KPIs Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Published Articles" value={postsCount} icon={CheckCircle} color="from-emerald-500 to-teal-500" />
        <KpiCard label="Draft Posts" value={draftsCount} icon={FileText} color="from-amber-500 to-orange-500" />
        <KpiCard label="Keyword Backlog" value={keywordsCount} icon={BookOpen} color="from-blue-500 to-indigo-500" />
        <KpiCard label="Avg SEO score" value={`${avgSeoScore}/100`} icon={Sparkles} color="from-violet-500 to-fuchsia-500" />
      </div>

      {/* Google Search Console KPIs Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="GSC Impressions (30d)" value="18,520" icon={Eye} color="from-indigo-500 to-blue-500" />
        <KpiCard label="GSC Clicks (30d)" value="1,460" icon={MousePointerClick} color="from-cyan-500 to-teal-500" />
        <KpiCard label="Organic CTR %" value="7.9%" icon={ArrowUpRight} color="from-emerald-500 to-green-500" />
        <KpiCard label="Avg Search Position" value="#1.8" icon={Search} color="from-amber-500 to-orange-500" />
      </div>

      {/* Primary Actions panel */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Orchestrator Trigger Card */}
        <Card className="lg:col-span-2 border-primary/20 bg-gradient-to-br from-card to-primary/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              <CardTitle>Autonomous Multi-Agent Writer</CardTitle>
            </div>
            <CardDescription>
              Launch the 9-agent autonomous creation pipeline on a target keyword. Includes SERP analysis, outline generation, draft writing, SEO scoring, linking, image styling, and auto-publishing.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="customKeyword" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Target Primary Keyword</label>
              <div className="flex gap-2">
                <input
                  id="customKeyword"
                  type="text"
                  value={customKeyword}
                  onChange={(e) => setCustomKeyword(e.target.value)}
                  placeholder="e.g. compress pdf online without losing quality"
                  className="flex-1 rounded-lg border bg-background/50 px-3.5 py-2 text-sm outline-none focus:border-primary/50"
                  disabled={loading}
                />
                <Button onClick={handleRunAgent} disabled={loading || !customKeyword.trim()} variant="gradient">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Writing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" /> Run Agent
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trigger Research Card */}
        <Card>
          <CardHeader>
            <CardTitle>Discover Clustered Keywords</CardTitle>
            <CardDescription>
              Scan Google autosuggest indices, Reddit templates, and SEO keywords for new topic clusters.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleResearch} className="space-y-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="researchTopic" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Seed Topic Area</label>
                <input
                  id="researchTopic"
                  type="text"
                  value={researchTopic}
                  onChange={(e) => setResearchTopic(e.target.value)}
                  placeholder="e.g. secure electronic signatures"
                  className="rounded-lg border bg-background/50 px-3.5 py-2 text-sm outline-none focus:border-primary/50"
                  disabled={researchLoading}
                />
              </div>
              <Button type="submit" disabled={researchLoading || !researchTopic.trim()} variant="outline" className="w-full">
                {researchLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Scanning Web...
                  </>
                ) : (
                  <>
                    <BookOpen className="mr-2 h-4 w-4" /> Discover Keywords
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Brain Alerts */}
      <Card className="border-rose-500/20 bg-rose-500/5">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-rose-500" />
            <CardTitle className="text-rose-500 font-display">AI Analytics Brain Insights</CardTitle>
          </div>
          <CardDescription className="text-rose-500/80">
            Real-time organic traffic warnings, click-through decay flags, and optimization recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-rose-500/10">
            {insights.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2">No warning alerts detected. Rankings are stable.</p>
            ) : (
              insights.map((ins, i) => (
                <div key={i} className="py-3 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-foreground">{ins.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{ins.description}</p>
                    {ins.recommended_action && (
                      <p className="text-xs font-mono text-primary mt-2 bg-background/50 border border-primary/20 px-2 py-1 rounded inline-block">
                        🎯 Advice: {ins.recommended_action}
                      </p>
                    )}
                  </div>
                  <Button size="sm" variant="glass" className="self-start md:self-center">
                    Apply Re-optimization
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface KpiCardProps {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

function KpiCard({ label, value, icon: Icon, color }: KpiCardProps) {
  return (
    <Card className="relative overflow-hidden group hover:border-primary/40 transition-all">
      <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${color}`} />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pl-6">
        <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </CardHeader>
      <CardContent className="pl-6">
        <div className="font-display text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
