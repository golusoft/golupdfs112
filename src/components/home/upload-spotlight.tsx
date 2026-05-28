"use client";

import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { Upload, FileText, Image as ImageIcon, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToolsStore } from "@/store/tools-store";

const QUICK = [
  { label: "Compress", slug: "compress-pdf", color: "from-rose-500 to-pink-500" },
  { label: "Merge", slug: "merge-pdf", color: "from-blue-500 to-cyan-500" },
  { label: "Split", slug: "split-pdf", color: "from-violet-500 to-fuchsia-500" },
  { label: "PDF → JPG", slug: "pdf-to-jpg", color: "from-emerald-500 to-teal-500" },
  { label: "PDF → Word", slug: "pdf-to-word", color: "from-amber-500 to-orange-500" },
  { label: "Sign", slug: "sign-pdf", color: "from-indigo-500 to-purple-500" },
];

export function UploadSpotlight() {
  const router = useRouter();
  const setQueuedFiles = useToolsStore((s) => s.setQueuedFiles);

  const handleFiles = (files: File[]) => {
    if (!files.length) return;
    setQueuedFiles(files);
    // Default smart-route: PDF → compress, image → jpg-to-pdf
    const isImage = files[0].type.startsWith("image/");
    router.push(isImage ? "/tools/jpg-to-pdf" : "/tools/compress-pdf");
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFiles,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".jpg", ".jpeg", ".png", ".webp"],
    },
    multiple: true,
    noClick: false,
  });

  return (
    <section className="relative -mt-16 pb-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          {...(getRootProps() as object)}
          className={`group relative mx-auto max-w-4xl cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed bg-background/60 p-10 backdrop-blur-xl transition-all sm:p-14 ${
            isDragActive
              ? "border-primary bg-primary/5 scale-[1.01]"
              : "border-border hover:border-primary/60 hover:bg-background/80"
          }`}
        >
          <input {...getInputProps()} aria-label="Upload PDF or image file" />

          <div className="absolute inset-0 -z-10 opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]">
            <div className="absolute -top-10 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-500/30 blur-3xl" />
            <div className="absolute -bottom-10 right-10 h-56 w-56 rounded-full bg-fuchsia-500/25 blur-3xl" />
          </div>

          <div className="text-center">
            <motion.div
              animate={isDragActive ? { y: -10, scale: 1.05 } : { y: 0, scale: 1 }}
              transition={{ type: "spring", damping: 15 }}
              className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 via-violet-500 to-fuchsia-500 text-white shadow-2xl shadow-primary/30"
            >
              <Upload className="h-7 w-7" />
            </motion.div>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">
              {isDragActive ? "Drop your files here" : "Drop a PDF or image to get started"}
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground sm:text-base">
              We'll route you to the right tool automatically. Files never leave your device.
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
              {QUICK.map((q) => (
                <Button
                  key={q.slug}
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/tools/${q.slug}`);
                  }}
                  className="group/btn rounded-full"
                >
                  <span
                    className={`mr-1 h-2 w-2 rounded-full bg-gradient-to-r ${q.color}`}
                    aria-hidden
                  />
                  {q.label}
                  <ArrowRight className="h-3 w-3 -translate-x-1 opacity-0 transition-all group-hover/btn:translate-x-0 group-hover/btn:opacity-100" />
                </Button>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" /> PDF
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ImageIcon className="h-3.5 w-3.5" /> JPG · PNG · WEBP
              </span>
              <Badge variant="glass" className="gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Local processing
              </Badge>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
