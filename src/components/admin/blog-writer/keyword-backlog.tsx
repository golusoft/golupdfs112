"use client";

import React, { useState } from "react";
import { Check, Sparkles, Trash2, ArrowUpRight, Search, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface KeywordBacklogProps {
  keywords: any[];
  onUpdateStatus: (id: number, status: string) => Promise<void>;
  onDeleteKeyword: (id: number) => Promise<void>;
  onAddManualKeyword: (keyword: string, cluster: string) => Promise<void>;
  onTriggerAgent: (keyword: string) => Promise<void>;
  agentLoading: boolean;
}

export function KeywordBacklog({
  keywords,
  onUpdateStatus,
  onDeleteKeyword,
  onAddManualKeyword,
  onTriggerAgent,
  agentLoading
}: KeywordBacklogProps) {
  const [newKeyword, setNewKeyword] = useState("");
  const [newCluster, setNewCluster] = useState("Compression Tools");
  const [addLoading, setAddLoading] = useState(false);
  const [actingId, setActingId] = useState<number | null>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyword.trim()) return;
    setAddLoading(true);
    try {
      await onAddManualKeyword(newKeyword, newCluster);
      setNewKeyword("");
      toast.success("Keyword added manually!");
    } catch (e: any) {
      toast.error(e.message || "Failed to add keyword");
    } finally {
      setAddLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    setActingId(id);
    try {
      await onUpdateStatus(id, "approved");
      toast.success("Keyword approved! Daily cron will prioritize this post.");
    } catch (e: any) {
      toast.error("Failed to approve");
    } finally {
      setActingId(null);
    }
  };

  const handleRunAgent = async (keyword: string) => {
    try {
      await onTriggerAgent(keyword);
    } catch (e) {}
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Remove this keyword from backlog?")) return;
    try {
      await onDeleteKeyword(id);
      toast.success("Keyword opportunity deleted.");
    } catch (e: any) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Manual Keyword Form */}
      <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-3 rounded-xl border bg-card p-4 items-end">
        <div className="flex-1 space-y-1">
          <label htmlFor="newKeyword" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Manual Target Keyword</label>
          <input
            id="newKeyword"
            type="text"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            placeholder="e.g. compress high resolution scans online"
            className="w-full rounded-lg border bg-background/50 px-3.5 py-2 text-sm outline-none focus:border-primary/50"
            disabled={addLoading}
          />
        </div>
        <div className="w-full md:w-56 space-y-1">
          <label htmlFor="newCluster" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Topic Cluster</label>
          <select
            id="newCluster"
            value={newCluster}
            onChange={(e) => setNewCluster(e.target.value)}
            className="w-full rounded-lg border bg-background/50 px-3.5 py-2 text-sm outline-none focus:border-primary/50 text-foreground"
            disabled={addLoading}
          >
            <option value="Compression Tools">Compression Tools</option>
            <option value="Digital Signatures">Digital Signatures</option>
            <option value="Document Joining">Document Joining</option>
            <option value="Text Extraction OCR">Text Extraction OCR</option>
            <option value="PDF Security">PDF Security</option>
          </select>
        </div>
        <Button type="submit" disabled={addLoading || !newKeyword.trim()} className="w-full md:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Keyword
        </Button>
      </form>

      {/* Keywords Backlog List */}
      <div className="overflow-x-auto rounded-xl border bg-card">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <th className="px-6 py-4">Target Keyword & Intent</th>
              <th className="px-6 py-4">Difficulty</th>
              <th className="px-6 py-4">Search Volume</th>
              <th className="px-6 py-4">Cluster</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {keywords.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                  No keyword ideas in database. Use "Discover Keywords" on dashboard overview!
                </td>
              </tr>
            ) : (
              keywords.map((kw) => {
                const isActing = actingId === kw.id;
                
                // Difficulty bar coloring
                let difficultyColor = "bg-emerald-500";
                if (kw.difficulty >= 60) difficultyColor = "bg-rose-500";
                else if (kw.difficulty >= 35) difficultyColor = "bg-amber-500";

                return (
                  <tr key={kw.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-foreground flex items-center gap-1">
                          {kw.keyword} <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="bg-muted px-2 py-0.5 rounded text-[10px] text-muted-foreground capitalize font-mono font-medium">{kw.intent}</span>
                          <span className="text-[10px] text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded font-mono font-semibold">Score: {kw.opportunity_score}/100</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-24 space-y-1">
                        <div className="flex justify-between text-[10px] font-mono font-bold text-muted-foreground">
                          <span>SD: {kw.difficulty}</span>
                          <span>{kw.difficulty < 35 ? "Easy" : kw.difficulty < 60 ? "Med" : "Hard"}</span>
                        </div>
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                          <div className={`h-full ${difficultyColor}`} style={{ width: `${kw.difficulty}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono font-medium text-foreground">
                      {kw.search_volume.toLocaleString()} /mo
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary" className="font-normal text-muted-foreground capitalize">{kw.topic_cluster}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          kw.status === "published" ? "glass" :
                          kw.status === "generating" ? "glass" :
                          kw.status === "approved" ? "default" : "secondary"
                        }
                        className="capitalize"
                      >
                        {kw.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        {kw.status === "discovered" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8"
                            onClick={() => handleApprove(kw.id)}
                            disabled={isActing}
                          >
                            <Check className="h-3.5 w-3.5 mr-1" /> Approve
                          </Button>
                        )}
                        {kw.status !== "published" && kw.status !== "generating" && (
                          <Button
                            size="sm"
                            variant="gradient"
                            className="h-8"
                            onClick={() => handleRunAgent(kw.keyword)}
                            disabled={agentLoading}
                          >
                            <Sparkles className="h-3.5 w-3.5 mr-1" /> Write
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 text-rose-500 hover:bg-rose-500/10"
                          onClick={() => handleDelete(kw.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
