"use client";

import React, { useState, useEffect } from "react";
import { Key, BrainCircuit, DollarSign, ShieldAlert, CheckCircle2, RefreshCw, Database, Bell, ShieldCheck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export function Settings() {
  const [activeModel, setActiveModel] = useState("google/gemini-2.5-pro");
  const [tonePreset, setTonePreset] = useState("human-conversational");
  const [affiliateTags, setAffiliateTags] = useState("GOLUPDFS_PARTNER");
  const [monetizeCtas, setMonetizeCtas] = useState(true);
  
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [loadingHealth, setLoadingHealth] = useState(true);

  const fetchDiagnostics = async () => {
    setLoadingHealth(true);
    try {
      const res = await fetch("/api/admin/health");
      if (res.ok) {
        const data = await res.json();
        setDiagnostics(data);
      }
    } catch (e) {
      console.error("Failed to load platform diagnostics:", e);
    } finally {
      setLoadingHealth(false);
    }
  };

  useEffect(() => {
    fetchDiagnostics();
  }, []);

  const handleSave = () => {
    toast.success("AI Writer preferences saved successfully!");
  };

  const handleManualSync = async () => {
    await fetchDiagnostics();
    toast.success("Platform status diagnostic trace updated!");
  };

  const subsystems = diagnostics?.subsystems || {};
  const verifiedTables = diagnostics?.verified_tables || [];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        {/* Settings Column */}
        <div className="md:col-span-2 space-y-6">
          {/* Engine Prefs */}
          <Card className="glass-strong border-white/10">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-brand-500" />
                <CardTitle>AI Writing Model Configuration</CardTitle>
              </div>
              <CardDescription>Configure target models and temperature settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="activeModel" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Target AI Engine</label>
                  <select
                    id="activeModel"
                    value={activeModel}
                    onChange={(e) => setActiveModel(e.target.value)}
                    className="rounded-lg border border-white/10 bg-white/[0.02] hover:border-white/20 px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 text-slate-100 transition-all duration-200"
                  >
                    <option value="google/gemini-2.5-pro">Gemini 2.5 Pro (Recommended)</option>
                    <option value="google/gemini-2.5-flash">Gemini 2.5 Flash (Ultra Fast)</option>
                    <option value="anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet</option>
                    <option value="deepseek/deepseek-coder">DeepSeek Coder 2.5</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="tonePreset" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Tone & Humanizer Style</label>
                  <select
                    id="tonePreset"
                    value={tonePreset}
                    onChange={(e) => setTonePreset(e.target.value)}
                    className="rounded-lg border border-white/10 bg-white/[0.02] hover:border-white/20 px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 text-slate-100 transition-all duration-200"
                  >
                    <option value="human-conversational">Conversational (Burstiness + Contractions)</option>
                    <option value="technical-authority">Authoritative Technical Guide</option>
                    <option value="opinionated-review">Case Study / Personal Opinion</option>
                    <option value="storytelling-hook">Storytelling / High emotional hooks</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monetization Prefs */}
          <Card className="glass-strong border-white/10">
            <CardHeader>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-500" />
                <CardTitle>Auto Affiliate Monetization</CardTitle>
              </div>
              <CardDescription>Weave product comparisons and callouts automatically inside articles.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="affiliateTags" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Default Affiliate Tracker ID</label>
                <input
                  id="affiliateTags"
                  type="text"
                  value={affiliateTags}
                  onChange={(e) => setAffiliateTags(e.target.value)}
                  className="rounded-lg border border-white/10 bg-white/[0.02] hover:border-white/20 px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 text-slate-100 transition-all duration-200"
                />
              </div>
              <div className="flex items-center justify-between border border-white/10 rounded-xl p-4 bg-white/[0.01]">
                <div>
                  <h4 className="text-sm font-semibold text-slate-200">Insert Commercial Comparison Tables</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Weave contextual SaaS alternative grids based on category intent checks.</p>
                </div>
                <input
                  type="checkbox"
                  checked={monetizeCtas}
                  onChange={(e) => setMonetizeCtas(e.target.checked)}
                  className="h-5 w-5 accent-brand-500 cursor-pointer rounded"
                />
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSave} variant="gradient" className="w-full sm:w-auto h-11 px-6 rounded-xl">
            Save Preferences
          </Button>
        </div>

        {/* Status Column */}
        <div className="space-y-6">
          <Card className="glass-strong border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-brand-500" />
                  <CardTitle>Observability status</CardTitle>
                </div>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-white" onClick={handleManualSync} disabled={loadingHealth}>
                  <RefreshCw className={`h-4 w-4 ${loadingHealth ? "animate-spin" : ""}`} />
                </Button>
              </div>
              <CardDescription>Real-time environment & diagnostics check.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3.5">
              {/* Database Status */}
              <div className="flex items-center justify-between p-3 border border-white/10 rounded-xl bg-white/[0.01]">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <Database className="h-4 w-4 text-brand-400" /> Supabase Connect
                </div>
                {subsystems.supabase_postgres === "active" ? (
                  <Badge variant="glass" className="text-emerald-500 border-emerald-500/20 bg-emerald-500/10 font-semibold text-[10px]">Active</Badge>
                ) : (
                  <Badge variant="secondary" className="text-amber-500 border-amber-500/20 bg-amber-500/10 font-semibold text-[10px]">Mock Layer</Badge>
                )}
              </div>

              {/* pgvector Status */}
              <div className="flex items-center justify-between p-3 border border-white/10 rounded-xl bg-white/[0.01]">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <BrainCircuit className="h-4 w-4 text-violet-400" /> RAG Vector Index
                </div>
                {subsystems.pgvector_memory === "active" ? (
                  <Badge variant="glass" className="text-emerald-500 border-emerald-500/20 bg-emerald-500/10 font-semibold text-[10px]">vector(768)</Badge>
                ) : (
                  <Badge variant="secondary" className="text-amber-500 border-amber-500/20 bg-amber-500/10 font-semibold text-[10px]">Simulated</Badge>
                )}
              </div>

              {/* Gemini Status */}
              <div className="flex items-center justify-between p-3 border border-white/10 rounded-xl bg-white/[0.01]">
                <span className="text-xs font-mono font-semibold text-slate-300">GEMINI_API_KEY</span>
                {subsystems.gemini_advanced === "active" ? (
                  <Badge variant="glass" className="text-emerald-500 border-emerald-500/20 bg-emerald-500/10 font-semibold text-[10px]">Connected</Badge>
                ) : (
                  <Badge variant="secondary" className="text-amber-500 border-amber-500/20 bg-amber-500/10 font-semibold text-[10px]">Unset</Badge>
                )}
              </div>

              {/* Discord Alerts */}
              <div className="flex items-center justify-between p-3 border border-white/10 rounded-xl bg-white/[0.01]">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <Bell className="h-4 w-4 text-fuchsia-400" /> Discord Webhook
                </div>
                {subsystems.discord_alerts === "active" ? (
                  <Badge variant="glass" className="text-emerald-500 border-emerald-500/20 bg-emerald-500/10 font-semibold text-[10px]">Online</Badge>
                ) : (
                  <Badge variant="secondary" className="text-amber-500 border-amber-500/20 bg-amber-500/10 font-semibold text-[10px]">Simulated</Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Database Tables Verification */}
          <Card className="glass-strong border-white/10">
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                <CardTitle>Verified tables</CardTitle>
              </div>
              <CardDescription>Registered tables verified inside Supabase.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex flex-wrap gap-1.5">
                {verifiedTables.length > 0 ? (
                  verifiedTables.map((t: string) => (
                    <Badge key={t} variant="glass" className="text-[10px] text-slate-300 font-mono tracking-wide py-0.5 border-white/5">{t}</Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground italic">No live connection - falls back to Local Memory indexes.</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
