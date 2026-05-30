"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { ToolDropzone } from "./dropzone";
import { OptionsPanel } from "./options-panel";
import { ResultPanel } from "./result-panel";
import { processWithEngine } from "@/lib/pdf/processors";
import type { Tool } from "@/lib/tools";
import type { ProcessOptions, ProcessResult } from "@/lib/pdf/types";
import { useToolsStore } from "@/store/tools-store";
import { trackToolUse, trackUpload, trackConversion } from "@/lib/analytics";

import { BusinessToolRunner } from "./business/business-runner";

interface ToolRunnerProps {
  tool: Omit<Tool, "icon">;
}

type Stage = "idle" | "configuring" | "processing" | "done" | "error";

export function ToolRunner({ tool }: ToolRunnerProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [options, setOptions] = useState<ProcessOptions>({});
  const [stage, setStage] = useState<Stage>("idle");
  const [progress, setProgress] = useState({ value: 0, message: "" });
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const consumeQueuedFiles = useToolsStore((s) => s.consumeQueuedFiles);
  const trackUse = useToolsStore((s) => s.trackUse);

  // Pull queued files routed from homepage upload
  useEffect(() => {
    const queued = consumeQueuedFiles();
    if (queued?.length) {
      const filtered = queued.filter((f) =>
        tool.accept.some((a) => {
          if (a.endsWith("/*")) return f.type.startsWith(a.replace("/*", "/"));
          return f.type === a;
        })
      );
      if (filtered.length) {
        setFiles(filtered.slice(0, tool.maxFiles));
        setStage("configuring");
      }
    }
  }, [consumeQueuedFiles, tool.accept, tool.maxFiles]);

  // Track tool usage when files are added
  useEffect(() => {
    if (files.length > 0 && stage === "idle") setStage("configuring");
    if (files.length === 0 && stage === "configuring") setStage("idle");
  }, [files, stage]);

  // GA4 Upload Event Tracking
  const [lastTrackedCount, setLastTrackedCount] = useState(0);
  useEffect(() => {
    if (files.length > 0 && files.length !== lastTrackedCount) {
      trackUpload(tool.slug, files.length);
      setLastTrackedCount(files.length);
    } else if (files.length === 0) {
      setLastTrackedCount(0);
    }
  }, [files, tool.slug, lastTrackedCount]);

  if (tool.category === "business") {
    return <BusinessToolRunner slug={tool.slug} />;
  }

  const run = async () => {
    if (!files.length) return;
    setStage("processing");
    setProgress({ value: 0, message: "Starting" });
    setError(null);
    try {
      // GA4 Track Tool Use Event (Execution Start)
      trackToolUse(tool.slug, tool.shortName);

      const r = await processWithEngine(tool.engine, files, options, (p, m) =>
        setProgress({ value: Math.round(p), message: m || "" })
      );
      setResult(r);
      setStage("done");
      trackUse(tool.slug, tool.shortName);

      // GA4 Track Conversion Event (Successful Execution Completion)
      trackConversion(tool.slug, "tool_success");

      toast.success(`${tool.shortName} complete`, {
        description: `Output: ${r.filename}`,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setError(msg);
      setStage("configuring");
      toast.error("Something went wrong", { description: msg });
    }
  };

  const reset = () => {
    setFiles([]);
    setOptions({});
    setResult(null);
    setStage("idle");
    setError(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <AnimatePresence mode="wait">
          {stage === "done" && result ? (
            <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ResultPanel result={result} onReset={reset} toolSlug={tool.slug} />
            </motion.div>
          ) : stage === "processing" ? (
            <motion.div key="proc" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="p-8 text-center">
                <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
                <h3 className="mt-4 font-display text-xl font-semibold">Processing your file…</h3>
                <p className="mt-1 text-sm text-muted-foreground">{progress.message || "Working in your browser"}</p>
                <div className="mx-auto mt-6 max-w-sm">
                  <Progress value={progress.value} />
                  <p className="mt-2 text-xs text-muted-foreground">{progress.value}%</p>
                </div>
              </Card>
            </motion.div>
          ) : (
            <motion.div key="drop" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ToolDropzone
                files={files}
                onFiles={setFiles}
                accept={tool.accept}
                maxFiles={tool.maxFiles}
                multiple={tool.maxFiles > 1}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="lg:col-span-2">
        <Card className="sticky top-24 p-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Options
            </h3>
          </div>
          <div className="mt-4">
            <OptionsPanel tool={tool} options={options} setOptions={setOptions} />
          </div>
          {error && (
            <p className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </p>
          )}
          <Button
            variant="gradient"
            size="lg"
            disabled={files.length === 0 || stage === "processing"}
            className="mt-6 w-full"
            onClick={run}
          >
            {stage === "processing" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Processing…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Run {tool.shortName}
              </>
            )}
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            🔒 100% browser-side · no upload
          </p>
        </Card>
      </div>
    </div>
  );
}
