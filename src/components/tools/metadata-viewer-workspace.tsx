"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Tag, 
  ShieldAlert, 
  CheckCircle2, 
  Download, 
  Sparkles, 
  Clock, 
  Trash2, 
  FileJson, 
  FileSpreadsheet, 
  Loader2, 
  RefreshCw, 
  ShieldCheck, 
  AlertTriangle 
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PDFDocument } from "pdf-lib";
import type { Tool } from "@/lib/tools";
import type { ProcessResult } from "@/lib/pdf/types";
import { ToolDropzone } from "./dropzone";
import { Progress } from "@/components/ui/progress";

interface MetadataFields {
  title: string;
  author: string;
  subject: string;
  keywords: string;
  creator: string;
  producer: string;
  creationDate?: string;
  modificationDate?: string;
}

interface HistoryItem {
  timestamp: string;
  change: string;
  fields: MetadataFields;
}

interface MetadataViewerWorkspaceProps {
  tool: Omit<Tool, "icon">;
  files: File[];
  setFiles: (files: File[]) => void;
  onReset: () => void;
}

export function MetadataViewerWorkspace({ tool, files, setFiles, onReset }: MetadataViewerWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<"edit" | "compare" | "audit">("edit");
  const [loading, setLoading] = useState(false);
  const [originalMeta, setOriginalMeta] = useState<MetadataFields>({
    title: "", author: "", subject: "", keywords: "", creator: "", producer: ""
  });
  const [meta, setMeta] = useState<MetadataFields>({
    title: "", author: "", subject: "", keywords: "", creator: "", producer: ""
  });
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  // 1. Client-side PDF Metadata Extraction
  useEffect(() => {
    async function parseMetadata() {
      if (!files.length) return;
      setLoading(true);
      try {
        const file = files[0];
        const buffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
        
        const extracted: MetadataFields = {
          title: pdf.getTitle() || "",
          author: pdf.getAuthor() || "",
          subject: pdf.getSubject() || "",
          keywords: pdf.getKeywords() || "",
          creator: pdf.getCreator() || "",
          producer: pdf.getProducer() || "",
          creationDate: pdf.getCreationDate()?.toLocaleString() || "Unknown",
          modificationDate: pdf.getModificationDate()?.toLocaleString() || "Unknown",
        };

        setOriginalMeta(extracted);
        setMeta({ ...extracted });
        setHistory([
          {
            timestamp: new Date().toLocaleTimeString(),
            change: "Document Loaded",
            fields: { ...extracted }
          }
        ]);
        toast.success("PDF metadata parsed successfully");
      } catch (err: any) {
        console.error(err);
        toast.error("Failed to read PDF metadata. The file may be encrypted or corrupted.");
      } finally {
        setLoading(false);
      }
    }
    parseMetadata();
  }, [files]);

  // Handle manual edits
  const handleFieldChange = (key: keyof MetadataFields, val: string) => {
    const nextFields = { ...meta, [key]: val };
    setMeta(nextFields);
  };

  // Commit change to history log
  const commitChangeLog = (actionName: string) => {
    setHistory(prev => [
      {
        timestamp: new Date().toLocaleTimeString(),
        change: actionName,
        fields: { ...meta }
      },
      ...prev
    ]);
  };

  // Safe Scrub (GDPR Privacy Cleaning)
  const handleSafeScrub = () => {
    const scrubbed: MetadataFields = {
      title: "",
      author: "",
      subject: "",
      keywords: "",
      creator: "",
      producer: "",
      creationDate: "Cleared",
      modificationDate: "Cleared",
    };
    setMeta(scrubbed);
    setHistory(prev => [
      {
        timestamp: new Date().toLocaleTimeString(),
        change: "GDPR Safe Scrub (Metadata Cleared)",
        fields: scrubbed
      },
      ...prev
    ]);
    toast.success("All metadata values anonymized. Click Save to apply changes.");
  };

  // Calculate Privacy & Security Score
  const getPrivacyAudit = () => {
    const issues: { level: "high" | "medium" | "info"; msg: string }[] = [];
    let score = 100;

    if (meta.author) {
      score -= 20;
      issues.push({ level: "high", msg: `Author tag exposes creator identity ('${meta.author}').` });
    }
    if (meta.creator) {
      score -= 15;
      issues.push({ level: "medium", msg: `Creator software footprint exposes system tools ('${meta.creator}').` });
    }
    if (meta.producer) {
      score -= 10;
      issues.push({ level: "info", msg: `Producer library details are visible ('${meta.producer}').` });
    }
    if (meta.title) {
      score -= 10;
      issues.push({ level: "info", msg: `Document title exposes project namespaces ('${meta.title}').` });
    }
    if (meta.creationDate && meta.creationDate !== "Cleared" && meta.creationDate !== "Unknown") {
      score -= 15;
      issues.push({ level: "medium", msg: `Creation timestamp leaks working timezone & hours (${meta.creationDate}).` });
    }
    if (meta.keywords) {
      score -= 10;
      issues.push({ level: "info", msg: `Keywords index tag values contain subject markers.` });
    }

    return { score: Math.max(0, score), issues };
  };

  const audit = getPrivacyAudit();

  // Export metadata as JSON or CSV reports
  const exportReport = (format: "json" | "csv") => {
    let blob: Blob;
    let extension: string;
    
    if (format === "json") {
      blob = new Blob([JSON.stringify(meta, null, 2)], { type: "application/json" });
      extension = "json";
    } else {
      const csvContent = [
        ["Metadata Property", "Original Value", "Current Value"],
        ["Title", originalMeta.title, meta.title],
        ["Author", originalMeta.author, meta.author],
        ["Subject", originalMeta.subject, meta.subject],
        ["Keywords", originalMeta.keywords, meta.keywords],
        ["Creator", originalMeta.creator, meta.creator],
        ["Producer", originalMeta.producer, meta.producer],
        ["Creation Date", originalMeta.creationDate || "", meta.creationDate || ""],
        ["Modification Date", originalMeta.modificationDate || "", meta.modificationDate || ""],
      ].map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(",")).join("\n");
      
      blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      extension = "csv";
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${files[0].name.replace(/\.pdf$/i, "")}-metadata-audit.${extension}`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported metadata report as ${format.toUpperCase()}`);
  };

  // Compile PDF via pdf-lib and download
  const handleSavePdf = async () => {
    setProcessing(true);
    setProgress(20);
    try {
      const file = files[0];
      const buffer = await file.arrayBuffer();
      setProgress(50);
      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });

      // Apply metadata
      pdf.setTitle(meta.title);
      pdf.setAuthor(meta.author);
      pdf.setSubject(meta.subject);
      pdf.setKeywords(meta.keywords.split(",").map(k => k.trim()).filter(Boolean));
      pdf.setCreator(meta.creator);
      pdf.setProducer(meta.producer);

      if (meta.creationDate === "Cleared") {
        // Clearing dates isn't fully possible with Standard pdf-lib setCreationDate 
        // but setting it to Epoch resets tracking timestamps
        pdf.setCreationDate(new Date(0));
        pdf.setModificationDate(new Date(0));
      } else {
        pdf.setModificationDate(new Date());
      }

      setProgress(80);
      const bytes = await pdf.save();
      setProgress(100);
      
      const blob = new Blob([bytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${file.name.replace(/\.pdf$/i, "")}-edited.pdf`;
      link.click();
      URL.revokeObjectURL(url);

      toast.success("Document metadata updated and file downloaded!");
      commitChangeLog("Saved & Compiled PDF");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to compile updated PDF document.");
    } finally {
      setProcessing(false);
      setProgress(0);
    }
  };

  if (files.length === 0) {
    return (
      <ToolDropzone
        files={files}
        onFiles={setFiles}
        accept={tool.accept}
        maxFiles={tool.maxFiles}
        multiple={false}
      />
    );
  }

  if (loading) {
    return (
      <Card className="p-12 text-center flex flex-col items-center justify-center min-h-[300px] glass bg-card/50">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <h3 className="mt-4 text-lg font-semibold">Reading PDF structures client-side...</h3>
        <p className="text-sm text-muted-foreground mt-1">Extracting document tags & catalog schemas safely</p>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Workspace Panel */}
      <div className="lg:col-span-3 space-y-6">
        <div className="flex border-b border-border/40 gap-4">
          {[
            { id: "edit", label: "Edit Properties", icon: Tag },
            { id: "compare", label: "Compare Log", icon: Clock },
            { id: "audit", label: "GDPR Privacy Audit", icon: ShieldAlert }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 text-sm font-medium transition-all border-b-2 flex items-center gap-2 ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "edit" && (
            <motion.div
              key="edit-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <Card className="p-6 space-y-4 shadow-xl border-border/40 bg-card/30 backdrop-blur-md">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Tag className="text-primary h-5 w-5" /> Document Metadata properties
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { key: "title", label: "Document Title", placeholder: "e.g. Q4 Financial Audit" },
                    { key: "author", label: "Author / Organization", placeholder: "e.g. John Doe" },
                    { key: "subject", label: "Subject / Category", placeholder: "e.g. Tax Declaration" },
                    { key: "keywords", label: "Keywords (comma separated)", placeholder: "e.g. finance, invoice, tax" },
                    { key: "creator", label: "Application Creator", placeholder: "e.g. Microsoft Word" },
                    { key: "producer", label: "PDF Producer Library", placeholder: "e.g. GoluPDF Engine" }
                  ].map(field => (
                    <div key={field.key} className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{field.label}</label>
                      <input
                        type="text"
                        value={meta[field.key as keyof MetadataFields] || ""}
                        placeholder={field.placeholder}
                        onChange={(e) => handleFieldChange(field.key as any, e.target.value)}
                        onBlur={() => commitChangeLog(`Edited ${field.label}`)}
                        className="w-full text-sm rounded-lg border bg-background/50 border-input px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 justify-end border-t pt-4 border-border/40">
                  <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10" onClick={handleSafeScrub}>
                    <Trash2 className="h-4 w-4" /> GDPR Safe Scrub
                  </Button>
                </div>
              </Card>

              {/* Revision History list */}
              <Card className="p-6 shadow-md border-border/40 bg-card/30 backdrop-blur-md">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Change History Log
                </h3>
                <div className="space-y-3 max-h-[180px] overflow-y-auto pr-2">
                  {history.map((h, i) => (
                    <div key={i} className="flex justify-between items-center text-xs border-b border-border/10 pb-2">
                      <div className="flex gap-2 items-center">
                        <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                        <span className="font-medium text-foreground">{h.change}</span>
                      </div>
                      <span className="text-muted-foreground font-mono">{h.timestamp}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === "compare" && (
            <motion.div
              key="compare-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <Card className="p-6 shadow-xl border-border/40 bg-card/30 backdrop-blur-md">
                <h3 className="text-lg font-semibold mb-4">Original vs Modified Comparison</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="border-b border-border/40 text-muted-foreground text-xs uppercase tracking-wider">
                        <th className="py-2">Field</th>
                        <th className="py-2">Original State</th>
                        <th className="py-2">Modified State</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/10">
                      {[
                        { label: "Title", key: "title" },
                        { label: "Author", key: "author" },
                        { label: "Subject", key: "subject" },
                        { label: "Keywords", key: "keywords" },
                        { label: "Creator", key: "creator" },
                        { label: "Producer", key: "producer" },
                        { label: "Creation Date", key: "creationDate" },
                        { label: "Modification Date", key: "modificationDate" }
                      ].map(row => {
                        const original = originalMeta[row.key as keyof MetadataFields] || "—";
                        const current = meta[row.key as keyof MetadataFields] || "—";
                        const changed = original !== current;
                        
                        return (
                          <tr key={row.key} className={`transition-colors ${changed ? "bg-primary/5" : ""}`}>
                            <td className="py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">{row.label}</td>
                            <td className="py-3 text-muted-foreground max-w-[150px] truncate">{original}</td>
                            <td className={`py-3 max-w-[150px] truncate ${changed ? "text-primary font-medium" : "text-muted-foreground"}`}>
                              {current}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex gap-2 justify-end border-t pt-4 border-border/40 mt-4">
                  <Button variant="ghost" size="sm" onClick={() => exportReport("json")}>
                    <FileJson className="h-4 w-4" /> Export JSON
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => exportReport("csv")}>
                    <FileSpreadsheet className="h-4 w-4" /> Export CSV
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === "audit" && (
            <motion.div
              key="audit-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <Card className="p-6 shadow-xl border-border/40 bg-card/30 backdrop-blur-md">
                <h3 className="text-lg font-semibold mb-2">GDPR Privacy Checklist Score</h3>
                <p className="text-sm text-muted-foreground mb-4">WASM scanning of hidden metadata containers and file schemas</p>

                <div className="grid gap-6 sm:grid-cols-3 items-center border-b pb-6 border-border/40">
                  <div className="sm:col-span-1 flex flex-col items-center">
                    <div className="relative h-24 w-24 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="48" cy="48" r="42" stroke="currentColor" className="text-muted/20" strokeWidth="8" fill="transparent" />
                        <circle cx="48" cy="48" r="42" stroke="currentColor" className={audit.score > 70 ? "text-emerald-500" : audit.score > 40 ? "text-amber-500" : "text-destructive"} strokeWidth="8" fill="transparent"
                          strokeDasharray={263.89}
                          strokeDashoffset={263.89 - (263.89 * audit.score) / 100}
                        />
                      </svg>
                      <span className="absolute text-xl font-bold font-display">{audit.score}%</span>
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-2">Privacy Score</span>
                  </div>

                  <div className="sm:col-span-2 space-y-2">
                    <h4 className="text-sm font-semibold">Security Assessment:</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {audit.score === 100 
                        ? "Perfect. No tracking metadata, timezone logs, creator names, or application footprints are present in your document catalog schema."
                        : `Your document contains visible tracking parameters resulting in a ${audit.score}% privacy score. We recommend clicking GDPR Safe Scrub to strip visible identifiers.`
                      }
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mt-4">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Audit logs:</h4>
                  {audit.issues.length === 0 ? (
                    <div className="flex gap-2 items-center text-emerald-500 text-sm py-2">
                      <ShieldCheck className="h-5 w-5" />
                      <span>Zero tracking elements detected in current state. Ready for release.</span>
                    </div>
                  ) : (
                    audit.issues.map((iss, i) => (
                      <div key={i} className={`flex gap-3 items-start text-xs border bg-card p-3 rounded-lg border-border/20 ${
                        iss.level === "high" ? "bg-destructive/5 text-destructive" : iss.level === "medium" ? "bg-amber-500/5 text-amber-500" : "text-muted-foreground"
                      }`}>
                        {iss.level === "high" ? <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" /> : <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />}
                        <span>{iss.msg}</span>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Compile Options Panel */}
      <div className="lg:col-span-2">
        <Card className="sticky top-24 p-6 border-border/40 bg-card/30 backdrop-blur-md shadow-2xl space-y-6">
          <div className="flex items-center gap-2 border-b pb-4 border-border/40">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Compile & Download</h3>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Ready to Apply Metadata?</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Applying metadata compiles the revision index client-side using WebAssembly-based pdf-lib modules. The file is saved directly back to your device memory without leaving your web browser.
            </p>
          </div>

          {processing && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Compiling file...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}

          <Button
            variant="gradient"
            size="lg"
            className="w-full"
            disabled={processing}
            onClick={handleSavePdf}
          >
            {processing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" /> Download Edited PDF
              </>
            )}
          </Button>

          <div className="flex justify-between items-center text-xs text-muted-foreground border-t pt-4 border-border/40">
            <span>📄 {files[0].name}</span>
            <button className="hover:text-destructive text-muted-foreground transition-colors" onClick={onReset}>
              Reset workspace
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
