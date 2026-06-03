"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { 
  Trash2, 
  RotateCw, 
  ArrowLeft, 
  ArrowRight, 
  RefreshCw, 
  Eye, 
  CheckCircle2, 
  ShieldAlert, 
  ChevronUp, 
  ChevronDown, 
  Undo2, 
  Redo2, 
  Plus, 
  ArrowUpDown, 
  Maximize2,
  Trash,
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getPdfJs } from "@/lib/pdf/pdfjs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PageItem {
  id: string;
  type: "page" | "blank";
  fileIndex: number; // 0-indexed index in files array (-1 for blank)
  fileName: string; // source filename
  pageNumber: number; // 1-indexed original page number (-1 for blank)
  rotation: number; // 0 | 90 | 180 | 270
  thumbnailUrl: string;
  deleted: boolean;
}

interface VisualPageGridProps {
  files: File[];
  onStateChange: (state: { 
    order: number[]; 
    rotations: Record<number, number>; 
    deletedPages: number[];
    mergePageMap?: { type?: "page" | "blank"; fileIndex: number; pageNumber: number; rotation?: number }[];
  }) => void;
}

interface LazyPageImageProps {
  src: string;
  alt: string;
  rotation: number;
}

/**
 * Lazy loading page image component using Intersection Observer.
 * Prevents memory bloating and UI lags on large documents.
 */
function LazyPageImage({ src, alt, rotation }: LazyPageImageProps) {
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "150px" }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center bg-zinc-950/5 relative min-h-[120px]">
      {visible ? (
        <img
          src={src}
          alt={alt}
          className="max-h-full max-w-full object-contain shadow transition-transform duration-300 border border-zinc-200/10 rounded"
          style={{ transform: `rotate(${rotation}deg)` }}
        />
      ) : (
        <div className="animate-pulse flex flex-col items-center justify-center gap-1">
          <div className="h-2 w-12 bg-muted/40 rounded-full" />
          <div className="h-1.5 w-8 bg-muted/30 rounded-full" />
        </div>
      )}
    </div>
  );
}

export function VisualPageGrid({ files, onStateChange }: VisualPageGridProps) {
  const [pages, setPages] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  // Undo / Redo stacks
  const [history, setHistory] = useState<PageItem[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Multi-select tracking
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Zoom Modal state
  const [zoomPage, setZoomPage] = useState<PageItem | null>(null);

  // Key to identify workspace instance
  const workspaceKey = useMemo(() => {
    if (!files.length) return "";
    return "golu_pdf_merge_workspace_" + files.map((f) => `${f.name}-${f.size}`).join("_");
  }, [files]);

  // Load from files array
  useEffect(() => {
    let active = true;

    async function loadAllThumbnails() {
      setLoading(true);
      setProgress(0);
      try {
        // Attempt to load workspace from local storage first to resume session
        if (workspaceKey) {
          const cached = localStorage.getItem(workspaceKey);
          if (cached) {
            try {
              const parsed = JSON.parse(cached) as PageItem[];
              if (Array.isArray(parsed) && parsed.length > 0) {
                setPages(parsed);
                setHistory([parsed]);
                setHistoryIndex(0);
                setLoading(false);
                toast.success("Resumed previously saved merging workspace session!");
                return;
              }
            } catch (e) {
              console.warn("Cached workspace parsing failed:", e);
            }
          }
        }

        const pdfjs = await getPdfJs();
        const items: PageItem[] = [];

        for (let fIdx = 0; fIdx < files.length; fIdx++) {
          if (!active) return;
          const file = files[fIdx];
          const buffer = await file.arrayBuffer();
          const pdfDoc = await pdfjs.getDocument({ data: new Uint8Array(buffer) }).promise;
          const total = pdfDoc.numPages;

          for (let i = 1; i <= total; i++) {
            if (!active) return;
            
            // Map overall rendering progress
            const fileProgress = Math.round(
              ((fIdx + i / total) / files.length) * 100
            );
            setProgress(fileProgress);

            const page = await pdfDoc.getPage(i);
            const viewport = page.getViewport({ scale: 0.45 });
            const canvas = document.createElement("canvas");
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              await page.render({ canvasContext: ctx, viewport }).promise;
              const url = canvas.toDataURL("image/jpeg", 0.75);
              items.push({
                id: `page-${fIdx}-${i}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                type: "page",
                fileIndex: fIdx,
                fileName: file.name,
                pageNumber: i,
                rotation: 0,
                thumbnailUrl: url,
                deleted: false,
              });
            }
          }
        }

        if (active) {
          setPages(items);
          setHistory([items]);
          setHistoryIndex(0);
          toast.success("Document pages compiled visually!", {
            description: `Loaded ${items.length} page thumbnails locally in sandboxed memory.`,
          });
        }
      } catch (err: any) {
        console.error("Failed to load PDF thumbnails:", err);
        toast.error("Visual manager failed to render PDF thumbnails.");
      } finally {
        if (active) setLoading(false);
      }
    }

    if (files.length > 0) {
      loadAllThumbnails();
    } else {
      setPages([]);
      setLoading(false);
    }

    return () => {
      active = false;
    };
  }, [files, workspaceKey]);

  // Sync workspace auto-save
  useEffect(() => {
    if (workspaceKey && pages.length > 0) {
      localStorage.setItem(workspaceKey, JSON.stringify(pages));
    }
  }, [pages, workspaceKey]);

  // Sync state parameters to parent options config
  useEffect(() => {
    const activePages = pages.filter((p) => !p.deleted);
    
    // Fallback options values (only for first file to keep backward compatible)
    const order = activePages.filter(p => p.fileIndex === 0).map((p) => p.pageNumber);
    const deletedPages = pages.filter((p) => p.fileIndex === 0 && p.deleted).map((p) => p.pageNumber);
    const rotations: Record<number, number> = {};
    pages.forEach((p) => {
      if (p.fileIndex === 0 && p.rotation > 0) {
        rotations[p.pageNumber] = p.rotation;
      }
    });

    // Unified merge page map array
    const mergePageMap = activePages.map(p => ({
      type: p.type,
      fileIndex: p.fileIndex,
      pageNumber: p.pageNumber,
      rotation: p.rotation
    }));

    onStateChange({ order, rotations, deletedPages, mergePageMap });
  }, [pages, onStateChange]);

  // Helper to commit state changes and save history
  const commitChange = (nextPages: PageItem[]) => {
    setPages(nextPages);
    const nextHistory = history.slice(0, historyIndex + 1);
    setHistory([...nextHistory, nextPages]);
    setHistoryIndex(nextHistory.length);
  };

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const prevIdx = historyIndex - 1;
      setHistoryIndex(prevIdx);
      setPages(history[prevIdx]);
      toast.success("Action undone");
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      setPages(history[nextIdx]);
      toast.success("Action redone");
    }
  }, [history, historyIndex]);

  // Keyboard controls for Undo/Redo (Ctrl+Z, Ctrl+Y)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey) {
        if (e.key === "z" || e.key === "Z") {
          e.preventDefault();
          handleUndo();
        } else if (e.key === "y" || e.key === "Y") {
          e.preventDefault();
          handleRedo();
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleUndo, handleRedo]);

  // Actions
  const handleRotate = (id: string) => {
    const next = pages.map((p) => 
      p.id === id ? { ...p, rotation: (p.rotation + 90) % 360 as 0 | 90 | 180 | 270 } : p
    );
    commitChange(next);
  };

  const handleDeleteToggle = (id: string) => {
    const next = pages.map((p) => 
      p.id === id ? { ...p, deleted: !p.deleted } : p
    );
    commitChange(next);
  };

  const handleMove = (index: number, direction: "left" | "right") => {
    if (direction === "left" && index === 0) return;
    if (direction === "right" && index === pages.length - 1) return;

    const targetIdx = direction === "left" ? index - 1 : index + 1;
    const next = [...pages];
    const temp = next[index];
    next[index] = next[targetIdx];
    next[targetIdx] = temp;
    commitChange(next);
  };

  const handleInsertBlankPage = (atIndex?: number) => {
    const blankItem: PageItem = {
      id: `blank-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      type: "blank",
      fileIndex: -1,
      fileName: "Blank Page",
      pageNumber: -1,
      rotation: 0,
      thumbnailUrl: "",
      deleted: false,
    };

    let next = [...pages];
    if (typeof atIndex === "number") {
      next.splice(atIndex, 0, blankItem);
    } else {
      next.push(blankItem);
    }
    commitChange(next);
    toast.success("Blank page inserted!");
  };

  const handleReverseOrder = () => {
    const next = [...pages].reverse();
    commitChange(next);
    toast.success("Page ordering reversed!");
  };

  // Multi-select management
  const handleSelectToggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextSelected = new Set(selectedIds);
    if (nextSelected.has(id)) {
      nextSelected.delete(id);
    } else {
      nextSelected.add(id);
    }
    setSelectedIds(nextSelected);
  };

  const handleClearSelection = () => {
    setSelectedIds(new Set());
  };

  const handleDeleteSelected = () => {
    if (selectedIds.size === 0) return;
    const next = pages.map((p) => 
      selectedIds.has(p.id) ? { ...p, deleted: true } : p
    );
    commitChange(next);
    setSelectedIds(new Set());
    toast.success(`Deleted ${selectedIds.size} selected pages`);
  };

  const handleRotateSelected = () => {
    if (selectedIds.size === 0) return;
    const next = pages.map((p) => 
      selectedIds.has(p.id) ? { ...p, rotation: (p.rotation + 90) % 360 as 0 | 90 | 180 | 270 } : p
    );
    commitChange(next);
    setSelectedIds(new Set());
    toast.success(`Rotated ${selectedIds.size} selected pages`);
  };

  const handleClearWorkspace = () => {
    if (workspaceKey) {
      localStorage.removeItem(workspaceKey);
    }
    // Reload original thumbnails
    window.location.reload();
  };

  if (loading) {
    return (
      <Card className="p-8 text-center bg-card/40 backdrop-blur-md border border-border/40">
        <RefreshCw className="mx-auto h-8 w-8 animate-spin text-primary mb-4" />
        <h3 className="font-display text-lg font-bold">Building Dynamic Visual Workspace…</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Compiling document structures and caching thumbnails ({progress}%)
        </p>
        <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-4 max-w-xs mx-auto overflow-hidden">
          <div className="bg-primary h-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* 1. Global Workspace Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 border-border/40 select-none">
        <div className="space-y-0.5">
          <h3 className="text-sm font-bold flex items-center gap-1.5">
            <Eye className="h-4 w-4 text-primary" /> Visual Compiler Workspace
          </h3>
          <p className="text-[10px] text-muted-foreground">
            Arrange document flows visually. Press Ctrl+Z to undo.
          </p>
        </div>

        {/* Undo/Redo & Global Layout utilities */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="h-3.5 w-3.5" />
          </Button>

          <span className="h-4 w-px bg-muted mx-1" />

          <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => handleInsertBlankPage()}>
            <Plus className="h-3 w-3" /> Blank Page
          </Button>
          <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={handleReverseOrder}>
            <ArrowUpDown className="h-3 w-3" /> Reverse Order
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10" 
            onClick={handleClearWorkspace}
            title="Reset to default file upload state"
          >
            Reset Workspace
          </Button>
        </div>
      </div>

      {/* 2. Selection Mode Actions Drawer */}
      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between bg-primary/10 border border-primary/20 rounded-xl p-2.5 text-xs animate-in slide-in-from-top-1.5 duration-200 select-none">
          <span className="font-semibold text-primary font-mono ml-2">
            Selected {selectedIds.size} page{selectedIds.size > 1 ? "s" : ""}
          </span>
          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={handleRotateSelected}>
              <RotateCw className="h-3 w-3" /> Rotate Selected
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-xs text-destructive hover:bg-destructive/10 border-destructive/20 gap-1" onClick={handleDeleteSelected}>
              <Trash2 className="h-3 w-3" /> Delete Selected
            </Button>
            <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground" onClick={handleClearSelection}>
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* 3. Infinite Pages Grid Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[460px] overflow-y-auto pr-1">
        {pages.map((p, index) => {
          const isSelected = selectedIds.has(p.id);
          return (
            <div
              key={p.id}
              onClick={(e) => handleSelectToggle(p.id, e)}
              className={cn(
                "relative border rounded-xl overflow-hidden group bg-background/40 cursor-pointer select-none transition-all duration-200",
                p.deleted 
                  ? "border-destructive/30 opacity-30 bg-destructive/5 hover:opacity-50" 
                  : isSelected
                  ? "border-primary ring-2 ring-primary/25 bg-primary/5 shadow-md shadow-primary/10"
                  : "border-border/60 hover:border-primary/40 shadow-sm"
              )}
            >
              {/* Origin badge */}
              <div className="absolute top-2 left-2 z-10 bg-black/60 backdrop-blur-md text-[9px] font-bold text-white px-2 py-0.5 rounded-full flex items-center gap-1 max-w-[130px] truncate">
                {p.type === "blank" ? (
                  <span>Spacer</span>
                ) : (
                  <>
                    <span>P. {p.pageNumber}</span>
                    {files.length > 1 && (
                      <span className="text-zinc-400 border-l border-zinc-500 pl-1 font-normal truncate max-w-[60px]">
                        {p.fileName}
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Selection indicator mark */}
              {isSelected && (
                <div className="absolute top-2 right-2 z-10 bg-primary text-white rounded-full p-0.5">
                  <CheckCircle2 className="h-3 w-3" />
                </div>
              )}

              {/* Thumbnail Container frame */}
              <div className="aspect-[3/4] grid place-items-center bg-zinc-950/20 p-3 overflow-hidden relative">
                {p.type === "blank" ? (
                  <div className="w-full h-full border-2 border-dashed border-muted-foreground/30 bg-background/80 rounded flex flex-col items-center justify-center p-2 select-none">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Blank Page</span>
                    <span className="text-[8px] text-muted-foreground/60 text-center mt-0.5">Spacer page</span>
                  </div>
                ) : (
                  <LazyPageImage
                    src={p.thumbnailUrl}
                    alt={`${p.fileName} Page ${p.pageNumber}`}
                    rotation={p.rotation}
                  />
                )}
              </div>

              {/* Page action drawer overlay */}
              <div className="p-1.5 border-t bg-card/60 backdrop-blur-md flex items-center justify-between gap-1" onClick={e => e.stopPropagation()}>
                <div className="flex gap-0.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-foreground disabled:opacity-30"
                    disabled={index === 0 || p.deleted}
                    onClick={() => handleMove(index, "left")}
                    title="Move Page Backward"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-foreground disabled:opacity-30"
                    disabled={index === pages.length - 1 || p.deleted}
                    onClick={() => handleMove(index, "right")}
                    title="Move Page Forward"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <div className="flex gap-0.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-primary"
                    onClick={() => setZoomPage(p)}
                    title="Enlarge Page Preview"
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-amber-500 disabled:opacity-30"
                    disabled={p.deleted}
                    onClick={() => handleRotate(p.id)}
                    title="Rotate 90° Clockwise"
                  >
                    <RotateCw className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-6 w-6",
                      p.deleted ? "text-emerald-500 hover:text-emerald-600" : "text-muted-foreground hover:text-destructive"
                    )}
                    onClick={() => handleDeleteToggle(p.id)}
                    title={p.deleted ? "Restore Page" : "Delete Page"}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Zoom Modal Preview Portal */}
      {zoomPage && (
        <div 
          className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-[9999] animate-in fade-in duration-200"
          onClick={() => setZoomPage(null)}
        >
          <div 
            className="relative max-w-lg w-full bg-card/90 border border-primary/20 p-6 rounded-2xl shadow-2xl flex flex-col items-center space-y-4 animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            <h4 className="font-display font-bold text-foreground text-center">
              {zoomPage.type === "blank" ? "Blank Space Page" : `${zoomPage.fileName} — Page ${zoomPage.pageNumber}`}
            </h4>
            
            <div className="w-full aspect-[3/4] max-h-[50vh] bg-zinc-950/20 rounded-xl flex items-center justify-center overflow-hidden border p-4">
              {zoomPage.type === "blank" ? (
                <div className="w-full h-full bg-background rounded-lg border border-dashed flex items-center justify-center">
                  <span className="text-muted-foreground font-semibold">Blank Document Spacer</span>
                </div>
              ) : (
                <img
                  src={zoomPage.thumbnailUrl}
                  alt="Zoom preview"
                  className="max-h-full max-w-full object-contain rounded shadow"
                  style={{ transform: `rotate(${zoomPage.rotation}deg)` }}
                />
              )}
            </div>

            <div className="flex gap-2 w-full justify-center">
              <Button 
                variant="outline"
                size="sm"
                onClick={() => {
                  handleRotate(zoomPage.id);
                  setZoomPage(prev => prev ? { ...prev, rotation: (prev.rotation + 90) % 360 } : null);
                }}
              >
                <RotateCw className="h-3.5 w-3.5 mr-1" /> Rotate
              </Button>
              <Button 
                variant="outline"
                size="sm"
                className="text-destructive hover:bg-destructive/10 border-destructive/20"
                onClick={() => {
                  handleDeleteToggle(zoomPage.id);
                  setZoomPage(null);
                }}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
              </Button>
              <Button 
                variant="secondary"
                size="sm"
                onClick={() => setZoomPage(null)}
              >
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
