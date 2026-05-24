"use client";

import { useDropzone, type Accept } from "react-dropzone";
import { motion } from "framer-motion";
import { UploadCloud, FileText, X, ArrowRight } from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { formatBytes, cn } from "@/lib/utils";

interface ToolDropzoneProps {
  files: File[];
  onFiles: (files: File[]) => void;
  accept: string[];
  maxFiles: number;
  multiple?: boolean;
}

export function ToolDropzone({ files, onFiles, accept, maxFiles, multiple = true }: ToolDropzoneProps) {
  const acceptObj: Accept = useMemo(() => {
    const obj: Accept = {};
    for (const a of accept) {
      if (a === "image/*") obj["image/*"] = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
      else if (a === "application/pdf") obj["application/pdf"] = [".pdf"];
      else obj[a] = [];
    }
    return obj;
  }, [accept]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: (dropped) => {
      const merged = multiple ? [...files, ...dropped].slice(0, maxFiles) : dropped.slice(0, 1);
      onFiles(merged);
    },
    accept: acceptObj,
    multiple: multiple && maxFiles > 1,
    maxFiles,
    noClick: files.length > 0,
  });

  if (files.length === 0) {
    return (
      <motion.div
        {...(getRootProps() as object)}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className={cn(
          "relative cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed bg-card/50 p-10 text-center transition-all sm:p-16 backdrop-blur-sm",
          isDragActive
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "hover:border-primary/60 hover:bg-card/80"
        )}
      >
        <input {...getInputProps()} />
        <div className="absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]">
          <div className="absolute -top-10 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-500/30 blur-3xl" />
          <div className="absolute -bottom-10 right-10 h-56 w-56 rounded-full bg-fuchsia-500/25 blur-3xl" />
        </div>

        <motion.div
          animate={isDragActive ? { y: -6, scale: 1.05 } : { y: 0, scale: 1 }}
          transition={{ type: "spring", damping: 15 }}
          className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 via-violet-500 to-fuchsia-500 text-white shadow-2xl shadow-primary/30"
        >
          <UploadCloud className="h-9 w-9" />
        </motion.div>
        <h3 className="font-display text-2xl font-bold sm:text-3xl">
          {isDragActive ? "Drop files to begin" : "Drop your files here"}
        </h3>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          or click to browse — up to {maxFiles} {maxFiles > 1 ? "files" : "file"}
        </p>
        <Button variant="gradient" size="lg" className="mt-6" onClick={open}>
          Choose files <ArrowRight className="h-4 w-4" />
        </Button>
        <p className="mt-5 text-xs text-muted-foreground">
          🔒 Your files never leave your device — processing happens in your browser.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="rounded-2xl border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium">
          {files.length} {files.length === 1 ? "file" : "files"} selected
        </p>
        <Button variant="ghost" size="sm" onClick={open}>
          + Add more
        </Button>
      </div>
      <ul className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {files.map((f, i) => (
          <motion.li
            key={`${f.name}-${i}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className="flex items-center gap-3 rounded-xl border bg-background/50 p-3"
          >
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-brand-500/15 to-fuchsia-500/15">
              <FileText className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{f.name}</p>
              <p className="text-xs text-muted-foreground">{formatBytes(f.size)}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onFiles(files.filter((_, idx) => idx !== i))}
              aria-label={`Remove ${f.name}`}
            >
              <X className="h-4 w-4" />
            </Button>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
