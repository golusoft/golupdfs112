"use client";

import { useEffect, useState } from "react";
import { Trash2, RotateCw, ArrowLeft, ArrowRight, RefreshCw, Eye, CheckCircle2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getPdfJs } from "@/lib/pdf/pdfjs";
import { toast } from "sonner";

interface PageItem {
  id: string;
  pageNumber: number; // 1-indexed original page number
  rotation: number; // 0 | 90 | 180 | 270
  thumbnailUrl: string;
  deleted: boolean;
}

interface VisualPageGridProps {
  file: File;
  onStateChange: (state: { order: number[]; rotations: Record<number, number>; deletedPages: number[] }) => void;
}

export function VisualPageGrid({ file, onStateChange }: VisualPageGridProps) {
  const [pages, setPages] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadThumbnails() {
      setLoading(true);
      setProgress(0);
      try {
        const pdfjs = await getPdfJs();
        const buffer = await file.arrayBuffer();
        const pdfDoc = await pdfjs.getDocument({ data: new Uint8Array(buffer) }).promise;
        const total = pdfDoc.numPages;
        const items: PageItem[] = [];

        for (let i = 1; i <= total; i++) {
          if (!active) return;
          setProgress(Math.round((i / total) * 100));

          // Render thumbnail page to canvas
          const page = await pdfDoc.getPage(i);
          const viewport = page.getViewport({ scale: 0.4 }); // high performance compact scale
          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            await page.render({ canvasContext: ctx, viewport }).promise;
            const url = canvas.toDataURL("image/jpeg", 0.7);
            items.push({
              id: `${i}-${Date.now()}`,
              pageNumber: i,
              rotation: 0,
              thumbnailUrl: url,
              deleted: false,
            });
          }
        }

        if (active) {
          setPages(items);
          toast.success("PDF pages loaded visually!", { description: `Rendered ${total} page thumbnails locally.` });
        }
      } catch (err: any) {
        console.error("Failed to load PDF thumbnails:", err);
        toast.error("Visual manager failed to render PDF thumbnails.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadThumbnails();

    return () => {
      active = false;
    };
  }, [file]);

  // Sync state back to parent component
  useEffect(() => {
    const activePages = pages.filter((p) => !p.deleted);
    const order = activePages.map((p) => p.pageNumber);
    const deletedPages = pages.filter((p) => p.deleted).map((p) => p.pageNumber);
    const rotations: Record<number, number> = {};
    pages.forEach((p) => {
      if (p.rotation > 0) {
        rotations[p.pageNumber] = p.rotation;
      }
    });

    onStateChange({ order, rotations, deletedPages });
  }, [pages, onStateChange]);

  const handleRotate = (id: string) => {
    setPages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, rotation: (p.rotation + 90) % 360 } : p))
    );
  };

  const handleDeleteToggle = (id: string) => {
    setPages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, deleted: !p.deleted } : p))
    );
  };

  const handleMove = (index: number, direction: "left" | "right") => {
    if (direction === "left" && index === 0) return;
    if (direction === "right" && index === pages.length - 1) return;

    const targetIndex = direction === "left" ? index - 1 : index + 1;
    const nextPages = [...pages];
    const temp = nextPages[index];
    nextPages[index] = nextPages[targetIndex];
    nextPages[targetIndex] = temp;

    setPages(nextPages);
  };

  if (loading) {
    return (
      <Card className="p-8 text-center bg-card/40 backdrop-blur-md border border-border/40">
        <RefreshCw className="mx-auto h-8 w-8 animate-spin text-primary mb-4" />
        <h3 className="font-display text-lg font-bold">Building Visual Page Architect…</h3>
        <p className="text-xs text-muted-foreground mt-1">Rasterizing pages into secure in-browser thumbnails ({progress}%)</p>
        <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-4 max-w-xs mx-auto overflow-hidden">
          <div className="bg-primary h-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b pb-2">
        <div>
          <h3 className="text-sm font-bold flex items-center gap-1.5">
            <Eye className="h-4 w-4 text-primary" /> Visual Document Canvas
          </h3>
          <p className="text-[10px] text-muted-foreground">Click to rotate, delete, or shift pages in real-time</p>
        </div>
        <span className="text-[10px] font-mono bg-primary/10 border border-primary/20 text-primary px-2 py-0.5 rounded-full">
          {pages.filter((p) => !p.deleted).length} / {pages.length} Pages Keep
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[460px] overflow-y-auto pr-1">
        {pages.map((p, index) => (
          <div
            key={p.id}
            className={`relative border rounded-xl overflow-hidden group bg-background/40 transition-all ${
              p.deleted ? "border-destructive/30 opacity-40 bg-destructive/5" : "border-border/60 hover:border-primary/40 shadow-sm"
            }`}
          >
            {/* Page number badge */}
            <div className="absolute top-2 left-2 z-10 bg-black/60 backdrop-blur-md text-[9px] font-bold text-white px-2 py-0.5 rounded-full">
              P. {p.pageNumber}
            </div>

            {/* Thumbnail Canvas Frame */}
            <div className="aspect-[3/4] grid place-items-center bg-zinc-950/20 p-3 overflow-hidden">
              <img
                src={p.thumbnailUrl}
                alt={`Page ${p.pageNumber}`}
                className="max-h-full max-w-full object-contain shadow transition-transform duration-300 border border-zinc-200/10 rounded"
                style={{ transform: `rotate(${p.rotation}deg)` }}
              />
            </div>

            {/* Action Bar Overlay */}
            <div className="p-1.5 border-t bg-card/60 backdrop-blur-md flex items-center justify-between gap-1">
              <div className="flex gap-0.5">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-foreground disabled:opacity-30"
                  disabled={index === 0 || p.deleted}
                  onClick={() => handleMove(index, "left")}
                  title="Move Left"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-foreground disabled:opacity-30"
                  disabled={index === pages.length - 1 || p.deleted}
                  onClick={() => handleMove(index, "right")}
                  title="Move Right"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="flex gap-0.5">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-amber-500 disabled:opacity-30"
                  disabled={p.deleted}
                  onClick={() => handleRotate(p.id)}
                  title="Rotate Page"
                >
                  <RotateCw className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-6 w-6 ${p.deleted ? "text-emerald-500 hover:text-emerald-600" : "text-muted-foreground hover:text-destructive"}`}
                  onClick={() => handleDeleteToggle(p.id)}
                  title={p.deleted ? "Restore Page" : "Delete Page"}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
