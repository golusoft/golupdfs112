"use client";

import { use, useEffect, useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { 
  FileText, 
  Sparkles, 
  ShieldAlert, 
  Printer, 
  BookOpen, 
  Download, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  HelpCircle,
  FileSpreadsheet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

interface AnalysisStats {
  pages: number;
  words: number;
  images: number;
  tables: number;
  links: number;
  fonts: number;
  score: number;
  summary: string;
  risks: { level: "high" | "medium" | "info"; msg: string }[];
  recommendations: { title: string; desc: string; toolUrl: string; btnLabel: string }[];
}

interface ReportData {
  filename: string;
  stats: AnalysisStats;
  created_at?: string;
}

interface ReportPageProps {
  params: Promise<{ id: string }>;
}

export default function ReportPage({ params }: ReportPageProps) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch Report stats from Supabase or parse local base64 fallback
  useEffect(() => {
    async function fetchReport() {
      setLoading(true);
      setError(null);
      try {
        if (id === "local") {
          const dataParam = searchParams.get("data");
          if (!dataParam) throw new Error("No report parameters provided.");
          const decoded = JSON.parse(atob(dataParam));
          setData(decoded);
          setLoading(false);
          return;
        }

        const client = createSupabaseBrowserClient();
        if (!client) {
          throw new Error("Supabase is not configured on this environment.");
        }

        const { data: row, error: fetchErr } = await client
          .from("pdf_reports")
          .select("*")
          .eq("id", id)
          .single();

        if (fetchErr || !row) {
          throw new Error("Report not found in database.");
        }

        setData({
          filename: row.filename,
          stats: row.stats,
          created_at: new Date(row.created_at).toLocaleString()
        });
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load document analysis report.");
      } finally {
        setLoading(false);
      }
    }
    fetchReport();
  }, [id, searchParams]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-[70vh] flex flex-col items-center justify-center pt-28">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <h3 className="font-semibold text-lg">Retrieving analysis report...</h3>
          <p className="text-sm text-muted-foreground">Reading structural metrics from database</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <Navbar />
        <div className="min-h-[70vh] flex flex-col items-center justify-center pt-28 max-w-sm mx-auto text-center space-y-4">
          <ShieldAlert className="h-12 w-12 text-destructive mx-auto" />
          <h3 className="font-semibold text-lg">Failed to load report</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{error || "Document report details are unavailable."}</p>
          <Button asChild className="w-full">
            <Link href="/ai/pdf-analyzer">
              Run New Scan
            </Link>
          </Button>
        </div>
        <Footer />
      </>
    );
  }

  const { filename, stats, created_at } = data;

  return (
    <>
      <Navbar />

      <main className="pt-28 pb-16 min-h-screen">
        <section className="container max-w-4xl space-y-8">
          {/* Executive Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-6 border-border/40 gap-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                🔒 Public Secure Audit
              </span>
              <h1 className="font-display text-2xl font-extrabold mt-2 truncate max-w-[320px] sm:max-w-lg">
                Report: {filename}
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Analyzed on: {created_at || new Date().toLocaleString()}
              </p>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto no-print">
              <Button size="sm" variant="outline" className="w-full sm:w-auto" onClick={() => window.print()}>
                <Printer className="h-4 w-4" /> Print / Save PDF
              </Button>
              <Button size="sm" asChild className="w-full sm:w-auto">
                <Link href="/ai/pdf-analyzer">
                  Analyze Another
                </Link>
              </Button>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
            {[
              { label: "Pages Count", val: stats.pages, icon: BookOpen, color: "text-blue-500 bg-blue-500/10" },
              { label: "Words Count", val: stats.words, icon: FileText, color: "text-violet-500 bg-violet-500/10" },
              { label: "Image Assets", val: stats.images, icon: Printer, color: "text-emerald-500 bg-emerald-500/10" },
              { label: "Table Grids", val: stats.tables, icon: FileSpreadsheet, color: "text-amber-500 bg-amber-500/10" },
              { label: "Hyperlinks", val: stats.links, icon: ExternalLink, color: "text-rose-500 bg-rose-500/10" },
              { label: "Embedded Fonts", val: stats.fonts, icon: HelpCircle, color: "text-cyan-500 bg-cyan-500/10" }
            ].map((card, i) => (
              <Card key={i} className="p-4 flex flex-col justify-between border-border/40 bg-card/25 shadow-md">
                <div className={`p-2 rounded-lg w-fit ${card.color}`}>
                  <card.icon className="h-4 w-4" />
                </div>
                <div className="mt-4">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{card.label}</span>
                  <p className="text-lg font-bold font-display mt-0.5">{card.val}</p>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Shield Score */}
            <Card className="p-6 md:col-span-1 border-border/40 bg-card/25 shadow-lg flex flex-col items-center justify-between">
              <div className="text-center w-full border-b pb-3 border-border/20">
                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Privacy Index</h3>
              </div>

              <div className="relative h-32 w-32 flex items-center justify-center my-6">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="56" stroke="currentColor" className="text-muted/10" strokeWidth="10" fill="transparent" />
                  <circle cx="64" cy="64" r="56" stroke="currentColor" className={stats.score > 70 ? "text-emerald-500" : stats.score > 40 ? "text-amber-500" : "text-destructive"} strokeWidth="10" fill="transparent"
                    strokeDasharray={351.86}
                    strokeDashoffset={351.86 - (351.86 * stats.score) / 100}
                  />
                </svg>
                <span className="absolute text-2xl font-black font-display">{stats.score}%</span>
              </div>

              <div className="text-center w-full border-t pt-3 border-border/20">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Assessment:</span>
                <p className={`font-semibold text-sm mt-0.5 ${stats.score > 70 ? "text-emerald-500" : "text-amber-500"}`}>
                  {stats.score > 70 ? "Compliant" : "Risk Factors Identified"}
                </p>
              </div>
            </Card>

            {/* AI Insights & Summary */}
            <Card className="p-6 md:col-span-2 border-border/40 bg-card/25 shadow-lg space-y-4">
              <div>
                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">AI Intelligence Overview</h3>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-primary/10 bg-primary/5 text-xs leading-relaxed text-foreground">
                  <strong className="block text-primary text-xs mb-1">📝 Document Summary:</strong>
                  {stats.summary}
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">GDPR Risk Checklist:</span>
                  {stats.risks.length === 0 ? (
                    <div className="flex gap-2 items-center text-xs text-emerald-500 py-1">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Zero tracking tags or timezone leaks detected in document catalogs.</span>
                    </div>
                  ) : (
                    stats.risks.map((risk, i) => (
                      <div key={i} className={`flex gap-2 items-start text-xs p-2 rounded border border-border/10 ${
                        risk.level === "high" ? "bg-rose-500/5 text-rose-500" : "bg-amber-500/5 text-amber-500"
                      }`}>
                        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                        <span>{risk.msg}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* AI Recommendations */}
          {stats.recommendations.length > 0 && (
            <Card className="p-6 border-border/40 bg-card/25 shadow-lg space-y-4 no-print">
              <div>
                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Recommended Actions</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Optimize this document instantly using GoluPDF browser tools</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {stats.recommendations.map((rec, i) => (
                  <div key={i} className="p-4 border rounded-xl bg-card border-border/40 flex flex-col justify-between">
                    <div>
                      <h4 className="font-semibold text-sm flex items-center gap-1.5">
                        <Sparkles className="h-4 w-4 text-primary" /> {rec.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1 leading-normal">{rec.desc}</p>
                    </div>
                    <Button asChild size="sm" className="mt-4 w-fit" variant="secondary">
                      <Link href={rec.toolUrl}>
                        {rec.btnLabel} <ArrowRight className="ml-1.5 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Privacy statement footer */}
          <div className="text-center text-xs text-muted-foreground pt-6 border-t border-border/20">
            <p>🔒 Document metadata parsed locally using WebAssembly engines. GoluPDF never stores files on cloud servers.</p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
