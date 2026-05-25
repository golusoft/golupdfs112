"use client";

import React, { useState } from "react";
import { Terminal, Clock, CheckCircle2, XCircle, Search, ChevronDown, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AgentLogsViewerProps {
  logs: any[];
}

export function AgentLogsViewer({ logs }: AgentLogsViewerProps) {
  const [selectedLogId, setSelectedLogId] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b pb-3">
        <div className="flex items-center gap-2">
          <Terminal className="h-5 w-5 text-primary" />
          <h3 className="font-display font-bold text-lg text-foreground">AI Generation Activity Logs</h3>
        </div>
        <Badge variant="secondary">Total Actions recorded: {logs.length}</Badge>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card">
        <div className="max-h-[600px] overflow-y-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground sticky top-0 backdrop-blur">
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Agent / Action</th>
                <th className="px-6 py-4">Target Query</th>
                <th className="px-6 py-4">Activity Description</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y font-mono text-xs">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground font-sans">
                    No activity logs recorded yet. Start generating articles to log tasks!
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const isSelected = selectedLogId === log.id;
                  const dateStr = new Date(log.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                  
                  // Agent Label Styling
                  let agentBadge = "bg-muted text-muted-foreground";
                  if (log.action === "research") agentBadge = "bg-indigo-500/10 text-indigo-500 border-indigo-500/20";
                  else if (log.action === "serp_scraping") agentBadge = "bg-blue-500/10 text-blue-500 border-blue-500/20";
                  else if (log.action === "outline") agentBadge = "bg-violet-500/10 text-violet-500 border-violet-500/20";
                  else if (log.action === "writer") agentBadge = "bg-amber-500/10 text-amber-500 border-amber-500/20";
                  else if (log.action === "humanizer") agentBadge = "bg-fuchsia-500/10 text-fuchsia-500 border-fuchsia-500/20";
                  else if (log.action === "image") agentBadge = "bg-pink-500/10 text-pink-500 border-pink-500/20";
                  else if (log.action === "linking") agentBadge = "bg-cyan-500/10 text-cyan-500 border-cyan-500/20";
                  else if (log.action === "publish") agentBadge = "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
                  else if (log.action === "old_articles_update") agentBadge = "bg-rose-500/10 text-rose-500 border-rose-500/20";

                  return (
                    <React.Fragment key={log.id}>
                      <tr className="hover:bg-muted/10 transition-colors">
                        <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                          {dateStr}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded border text-[10px] uppercase font-bold tracking-wider ${agentBadge}`}>
                            {log.action.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-foreground truncate max-w-[150px]">
                          {log.keyword || "Global Backlog"}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground font-sans max-w-sm truncate">
                          {log.details}
                        </td>
                        <td className="px-6 py-4">
                          {log.status === "success" ? (
                            <span className="text-emerald-500 flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> Success</span>
                          ) : (
                            <span className="text-rose-500 flex items-center gap-1"><XCircle className="h-4 w-4" /> Failed</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setSelectedLogId(isSelected ? null : log.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] border rounded bg-background hover:bg-muted font-sans font-bold"
                          >
                            Payload <ChevronDown className={`h-3 w-3 transition-transform ${isSelected ? "rotate-180" : ""}`} />
                          </button>
                        </td>
                      </tr>
                      {isSelected && (
                        <tr>
                          <td colSpan={6} className="px-6 py-4 bg-muted/40 border-t border-b">
                            <div className="space-y-2">
                              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Debugger Agent Metadata Output</p>
                              <pre className="rounded-lg bg-background p-4 text-[11px] overflow-x-auto text-primary border border-muted/80 max-h-60 leading-relaxed font-mono">
                                {JSON.stringify(log.payload || { details: log.details }, null, 2)}
                              </pre>
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
    </div>
  );
}
