"use client";

import { useEffect, useState, useRef } from "react";
import { 
  EyeOff, 
  Trash2, 
  Sparkles, 
  Printer, 
  Calculator, 
  Download, 
  Loader2, 
  Layers, 
  CheckSquare, 
  Square,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { getPdfJs } from "@/lib/pdf/pdfjs";
import { PDFDocument } from "pdf-lib";
import type { Tool } from "@/lib/tools";
import { ToolDropzone } from "./dropzone";

interface PageAnalysis {
  pageIndex: number; // 0-indexed
  pageNumber: number; // 1-indexed
  blankRatio: number; // percentage of white/transparent pixels (0-100)
  isBlank: boolean;
  isNearBlank: boolean;
  isDuplicate: boolean;
  duplicateOf?: number; // pageNumber it duplicates
  thumbnailUrl: string;
  selected: boolean;
}

interface BlankPageDetectorWorkspaceProps {
  tool: Omit<Tool, "icon">;
  files: File[];
  setFiles: (files: File[]) => void;
  onReset: () => void;
}

export function BlankPageDetectorWorkspace({ tool, files, setFiles, onReset }: BlankPageDetectorWorkspaceProps) {
  const [pages, setPages] = useState<PageAnalysis[]>([]);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [threshold, setThreshold] = useState<number[]>([98.5]); // sensitivity threshold
  
  // Print cost calculator params
  const [costPerPage, setCostPerPage] = useState(0.08); // e.g. $0.08
  const [cartridgeCost, setCartridgeCost] = useState(45.0); // e.g. $45
  const [pagesPerCartridge, setPagesPerCartridge] = useState(500);

  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Initial Load: Read document structure and render basic low-res previews
  useEffect(() => {
    async function loadPreviews() {
      if (!files.length) return;
      setLoading(true);
      try {
        const file = files[0];
        const pdfjs = await getPdfJs();
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
        const totalPages = pdfDoc.numPages;
        
        const initialList: PageAnalysis[] = [];
        for (let i = 1; i <= totalPages; i++) {
          initialList.push({
            pageIndex: i - 1,
            pageNumber: i,
            blankRatio: 0,
            isBlank: false,
            isNearBlank: false,
            isDuplicate: false,
            thumbnailUrl: "",
            selected: false
          });
        }
        setPages(initialList);
        
        // Asynchronously render thumbnails for better perceived speed
        for (let i = 1; i <= totalPages; i++) {
          const page = await pdfDoc.getPage(i);
          const viewport = page.getViewport({ scale: 0.25 });
          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            await page.render({ canvasContext: ctx, viewport }).promise;
            const thumbUrl = canvas.toDataURL("image/jpeg", 0.7);
            setPages(prev => prev.map(p => p.pageNumber === i ? { ...p, thumbnailUrl: thumbUrl } : p));
          }
        }

        toast.success(`Document loaded: ${totalPages} pages found.`);
      } catch (err: any) {
        console.error(err);
        toast.error("Failed to load PDF pages.");
      } finally {
        setLoading(false);
      }
    }
    loadPreviews();
  }, [files]);

  // 2. Perform Client-Side Canvas Scanning for Blankness & Duplicates
  const handleScan = async () => {
    if (!files.length || pages.length === 0) return;
    setScanning(true);
    setScanProgress(0);
    try {
      const file = files[0];
      const pdfjs = await getPdfJs();
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
      const totalPages = pdfDoc.numPages;

      const pageHashes: { pageNum: number; hash: string }[] = [];
      const updatedList: PageAnalysis[] = [...pages];

      for (let i = 1; i <= totalPages; i++) {
        setScanProgress(Math.round((i / totalPages) * 100));
        
        const page = await pdfDoc.getPage(i);
        // Render at scale 0.4 for speed & memory control
        const viewport = page.getViewport({ scale: 0.4 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) continue;

        await page.render({ canvasContext: ctx, viewport }).promise;
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        // Perform blankness analysis
        let whitePixels = 0;
        const totalPixels = imgData.width * imgData.height;
        for (let idx = 0; idx < data.length; idx += 4) {
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          const a = data[idx + 3];
          
          // Check if pixel is white, transparent or extremely light color (above 245)
          if (a === 0 || (r > 242 && g > 242 && b > 242)) {
            whitePixels++;
          }
        }

        const whiteRatio = (whitePixels / totalPixels) * 100;
        const isBlankVal = whiteRatio >= threshold[0];
        const isNearBlankVal = !isBlankVal && whiteRatio >= threshold[0] - 2;

        // Generate a visual layout signature hash for duplicates checking
        // Sample 16 coordinate blocks across the canvas
        let sampleHash = "";
        const cols = 4;
        const rows = 4;
        const colW = Math.floor(canvas.width / cols);
        const rowH = Math.floor(canvas.height / rows);
        for (let rIdx = 0; rIdx < rows; rIdx++) {
          for (let cIdx = 0; cIdx < cols; cIdx++) {
            const pixelX = cIdx * colW + Math.floor(colW / 2);
            const pixelY = rIdx * rowH + Math.floor(rowH / 2);
            const dataOffset = (pixelY * canvas.width + pixelX) * 4;
            const luminance = Math.round(
              0.299 * data[dataOffset] + 0.587 * data[dataOffset + 1] + 0.114 * data[dataOffset + 2]
            );
            sampleHash += luminance > 200 ? "1" : "0";
          }
        }

        let isDuplicateVal = false;
        let duplicateOfVal: number | undefined;

        // Compare against previous page signatures
        if (!isBlankVal) {
          const match = pageHashes.find(ph => ph.hash === sampleHash);
          if (match) {
            isDuplicateVal = true;
            duplicateOfVal = match.pageNum;
          } else {
            pageHashes.push({ pageNum: i, hash: sampleHash });
          }
        }

        const index = i - 1;
        updatedList[index] = {
          ...updatedList[index],
          blankRatio: whiteRatio,
          isBlank: isBlankVal,
          isNearBlank: isNearBlankVal,
          isDuplicate: isDuplicateVal,
          duplicateOf: duplicateOfVal,
          selected: isBlankVal || isDuplicateVal // auto-select blank and duplicate items
        };
      }

      setPages(updatedList);
      toast.success("Document scan complete! Auto-selected blanks and duplicates.");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed scanning page canvas layers.");
    } finally {
      setScanning(false);
    }
  };

  // Toggle selection checkbox
  const togglePageSelect = (pageNum: number) => {
    setPages(prev => prev.map(p => p.pageNumber === pageNum ? { ...p, selected: !p.selected } : p));
  };

  // Auto-select all flagged pages
  const selectAllFlagged = () => {
    setPages(prev => prev.map(p => ({
      ...p,
      selected: p.isBlank || p.isNearBlank || p.isDuplicate
    })));
  };

  // Clear selections
  const clearAllSelections = () => {
    setPages(prev => prev.map(p => ({ ...p, selected: false })));
  };

  // 3. Compile optimized PDF by excluding selected pages
  const handleRemovePages = async () => {
    const selectedIndices = pages.filter(p => p.selected).map(p => p.pageIndex);
    if (selectedIndices.length === 0) {
      toast.error("No pages selected for removal.");
      return;
    }

    setLoading(true);
    try {
      const file = files[0];
      const buffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
      
      const totalPages = pdf.getPageCount();
      const keepPages: number[] = [];
      for (let i = 0; i < totalPages; i++) {
        if (!selectedIndices.includes(i)) {
          keepPages.push(i);
        }
      }

      if (keepPages.length === 0) {
        toast.error("Cannot delete all pages of the document.");
        return;
      }

      const cleanPdf = await PDFDocument.create();
      const copied = await cleanPdf.copyPages(pdf, keepPages);
      copied.forEach(p => cleanPdf.addPage(p));
      
      const bytes = await cleanPdf.save();
      const blob = new Blob([bytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = `${file.name.replace(/\.pdf$/i, "")}-optimized.pdf`;
      link.click();
      URL.revokeObjectURL(url);

      toast.success(`Removed ${selectedIndices.length} pages. Optimized file downloaded!`);
      
      // Sync workspace files listing
      setPages(prev => prev.filter(p => !p.selected).map((p, i) => ({ ...p, pageIndex: i, pageNumber: i + 1, selected: false })));
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to build clean PDF document.");
    } finally {
      setLoading(false);
    }
  };

  // 4. Financial Calculations: Cost & Cartridge Savings
  const getCalculatedSavings = () => {
    const selectedCount = pages.filter(p => p.selected).length;
    
    // Page printing cost savings
    const pageSavings = selectedCount * costPerPage;
    
    // Ink cost savings
    const cartridgePercent = (selectedCount / pagesPerCartridge) * 100;
    const inkSavings = (selectedCount / pagesPerCartridge) * cartridgeCost;

    // Environmental metrics
    const paperGrams = selectedCount * 4.5; // ~4.5g per A4 sheet
    const carbonGrams = selectedCount * 6; // ~6g CO2 per sheet printed

    return {
      pagesDeleted: selectedCount,
      dollarSavings: pageSavings + inkSavings,
      sheetsSaved: selectedCount,
      inkVolumeSaved: cartridgePercent.toFixed(2),
      carbonSavings: carbonGrams.toFixed(1)
    };
  };

  const savings = getCalculatedSavings();

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

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Visual Pages Grid */}
      <div className="lg:col-span-3 space-y-6">
        <Card className="p-6 shadow-xl border-border/40 bg-card/30 backdrop-blur-md space-y-4">
          <div className="flex justify-between items-center flex-wrap gap-3 border-b pb-4 border-border/40">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <EyeOff className="text-primary h-5 w-5" /> Visual Page Map Grid
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">Toggle pages to select for deletion</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" className="text-xs" onClick={selectAllFlagged}>
                Select Flagged
              </Button>
              <Button size="sm" variant="ghost" className="text-xs" onClick={clearAllSelections}>
                Clear All
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
              <p className="text-sm text-muted-foreground">Rendering previews...</p>
            </div>
          ) : scanning ? (
            <div className="flex flex-col justify-center items-center py-20 space-y-4 max-w-sm mx-auto">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <div className="text-center w-full">
                <p className="text-sm font-semibold">Scanning canvas pixel buffers...</p>
                <p className="text-xs text-muted-foreground mt-1">Page {Math.round((scanProgress / 100) * pages.length)} of {pages.length}</p>
              </div>
              <Progress value={scanProgress} className="w-full" />
            </div>
          ) : (
            <div ref={containerRef} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[500px] overflow-y-auto pr-2 pb-4">
              {pages.map((p) => {
                const isFlagged = p.isBlank || p.isNearBlank || p.isDuplicate;
                let borderTheme = "border-border/40";
                let tagTheme = "bg-muted text-muted-foreground";
                let label = `Page ${p.pageNumber}`;

                if (p.selected) {
                  borderTheme = "border-destructive ring-2 ring-destructive/30";
                }

                if (p.isBlank) {
                  tagTheme = "bg-rose-500/10 text-rose-500 border border-rose-500/20";
                  label = "Blank";
                } else if (p.isDuplicate) {
                  tagTheme = "bg-violet-500/10 text-violet-500 border border-violet-500/20";
                  label = `Duplicate of P.${p.duplicateOf}`;
                } else if (p.isNearBlank) {
                  tagTheme = "bg-amber-500/10 text-amber-500 border border-amber-500/20";
                  label = "Near-Blank";
                }

                return (
                  <div
                    key={p.pageNumber}
                    onClick={() => togglePageSelect(p.pageNumber)}
                    className={`relative cursor-pointer flex flex-col items-center bg-zinc-950/5 dark:bg-white/[0.02] p-2 rounded-xl border transition-all ${borderTheme}`}
                  >
                    <div className="absolute top-3 left-3 z-10">
                      {p.selected ? (
                        <div className="rounded-md bg-destructive text-white p-0.5 shadow-md">
                          <CheckSquare className="h-4 w-4" />
                        </div>
                      ) : (
                        <div className="rounded-md bg-background/80 text-muted-foreground p-0.5 border border-border/40">
                          <Square className="h-4 w-4" />
                        </div>
                      )}
                    </div>

                    <div className="w-full h-36 flex items-center justify-center overflow-hidden rounded-lg bg-background/50 border border-border/20 mb-2 relative">
                      {p.thumbnailUrl ? (
                        <img src={p.thumbnailUrl} alt={`Page ${p.pageNumber}`} className="max-h-full max-w-full object-contain" />
                      ) : (
                        <div className="animate-pulse h-10 w-16 bg-muted/40 rounded" />
                      )}
                    </div>

                    <div className="w-full flex justify-between items-center text-[10px]">
                      <span className="font-semibold text-muted-foreground">P. {p.pageNumber}</span>
                      {isFlagged && (
                        <span className={`px-1.5 py-0.5 rounded-full font-bold ${tagTheme}`}>
                          {label}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Control panel and cost analysis */}
      <div className="lg:col-span-2 space-y-6">
        {/* Threshold Adjustment */}
        <Card className="p-6 shadow-xl border-border/40 bg-card/30 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 border-b pb-3 border-border/40">
            <Calculator className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Scan Configurations</h3>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-muted-foreground">Blankness Sensitivity</span>
              <span>{threshold[0].toFixed(1)}%</span>
            </div>
            <Slider
              value={threshold}
              onValueChange={setThreshold}
              min={90}
              max={99.9}
              step={0.1}
              className="py-2"
            />
            <p className="text-[10px] text-muted-foreground leading-normal">
              Controls white pixel ratio. 95% detects pages with light stamps or lines. 99% scans for purely blank files.
            </p>
          </div>

          <Button 
            className="w-full"
            variant="outline"
            onClick={handleScan}
            disabled={scanning || loading}
          >
            {scanning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Scanning...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Scan for Blanks & Duplicates
              </>
            )}
          </Button>
        </Card>

        {/* Cost & Ink Savings Estimator */}
        <Card className="p-6 shadow-xl border-border/40 bg-card/30 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 border-b pb-3 border-border/40">
            <Printer className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Print Cost Calculator</h3>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Printing Cost / Page</label>
              <input
                type="number"
                value={costPerPage}
                step={0.01}
                onChange={(e) => setCostPerPage(Number(e.target.value))}
                className="w-full rounded-md border border-input bg-background/50 px-2 py-1 outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Cartridge Cost</label>
              <input
                type="number"
                value={cartridgeCost}
                step={1.0}
                onChange={(e) => setCartridgeCost(Number(e.target.value))}
                className="w-full rounded-md border border-input bg-background/50 px-2 py-1 outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Dynamic Savings Scoreboard */}
          <div className="rounded-xl bg-primary/5 p-4 border border-primary/10 grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Sheets Saved</span>
              <p className="text-xl font-bold font-display text-primary mt-0.5">{savings.sheetsSaved}</p>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Est. Cost Saved</span>
              <p className="text-xl font-bold font-display text-primary mt-0.5">${savings.dollarSavings.toFixed(2)}</p>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Ink Volume Saved</span>
              <p className="text-xs font-bold text-foreground mt-1">{savings.inkVolumeSaved}%</p>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">CO2 Saved</span>
              <p className="text-xs font-bold text-foreground mt-1">{savings.carbonSavings}g</p>
            </div>
          </div>

          {/* Action Trigger */}
          <Button
            variant="gradient"
            size="lg"
            className="w-full text-sm font-semibold"
            disabled={savings.pagesDeleted === 0 || loading || scanning}
            onClick={handleRemovePages}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Compiling...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" /> Remove Selected Pages
              </>
            )}
          </Button>

          <div className="flex justify-between items-center text-xs text-muted-foreground border-t pt-4 border-border/40 mt-2">
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
