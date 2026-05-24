"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Download, RotateCcw, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatBytes } from "@/lib/utils";
import type { ProcessResult } from "@/lib/pdf/types";
import { trackDownload } from "@/lib/analytics";

interface ResultPanelProps {
  result: ProcessResult;
  onReset: () => void;
  toolSlug?: string;
}

export function ResultPanel({ result, onReset, toolSlug }: ResultPanelProps) {
  useEffect(() => {
    // Auto-trigger confetti-style celebration via parent toast (handled outside)
  }, []);

  const downloadOne = (blob: Blob, filename: string) => {
    // GA4 Track Download Event
    if (toolSlug) {
      trackDownload(toolSlug, filename);
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
      a.remove();
    }, 1000);
  };

  const reduction =
    result.stats?.reductionPct !== undefined
      ? `${result.stats.reductionPct}%`
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border bg-card p-6 sm:p-8 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
        className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-xl shadow-emerald-500/30"
      >
        <CheckCircle2 className="h-8 w-8" />
      </motion.div>
      <h3 className="font-display text-2xl font-bold">All done!</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Your file is ready to download — processed entirely on your device.
      </p>

      <div className="my-6 flex flex-wrap items-center justify-center gap-2">
        <Badge variant="secondary">{formatBytes(result.bytes)}</Badge>
        {reduction && (
          <Badge variant="gradient">▼ {reduction} smaller</Badge>
        )}
        {result.files && result.files.length > 1 && (
          <Badge variant="glass">{result.files.length} files</Badge>
        )}
      </div>

      {result.stats?.note && (
        <p className="mx-auto mb-5 max-w-md rounded-md border bg-muted/40 p-3 text-xs text-muted-foreground">
          ℹ {result.stats.note}
        </p>
      )}

      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button
          variant="gradient"
          size="lg"
          onClick={() => downloadOne(result.blob, result.filename)}
        >
          <Download className="h-4 w-4" /> Download
        </Button>
        {result.files && result.files.length > 1 && (
          <Button
            variant="outline"
            size="lg"
            onClick={() =>
              result.files?.forEach((f, i) =>
                setTimeout(() => downloadOne(f.blob, f.filename), i * 200)
              )
            }
          >
            <FileDown className="h-4 w-4" /> Download all individually
          </Button>
        )}
        <Button variant="ghost" size="lg" onClick={onReset}>
          <RotateCcw className="h-4 w-4" /> Process another
        </Button>
      </div>
    </motion.div>
  );
}
