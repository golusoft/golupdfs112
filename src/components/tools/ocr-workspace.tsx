"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ScanText, 
  Download, 
  Loader2, 
  Trash2, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  Search, 
  RefreshCw, 
  Globe, 
  FileJson, 
  Clock, 
  Sparkles,
  FileText,
  AlertTriangle,
  AlignLeft,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getPdfJs } from "@/lib/pdf/pdfjs";
import { createWorker } from "tesseract.js";
import type { Tool } from "@/lib/tools";
import { ToolDropzone } from "./dropzone";

interface OcrPageData {
  pageNumber: number;
  text: string;
  confidence: number;
  wordCount: number;
  charCount: number;
}

interface OcrWorkspaceProps {
  tool: Omit<Tool, "icon">;
  files: File[];
  setFiles: (files: File[]) => void;
  onReset: () => void;
}

export function OcrWorkspace({ tool, files, setFiles, onReset }: OcrWorkspaceProps) {
  // Config state
  const [language, setLanguage] = useState<string>("eng");
  const [loading, setLoading] = useState(false);
  const [pdfThumbnail, setPdfThumbnail] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  // Scanning state
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanLogs, setScanLogs] = useState<string[]>([]);

  // Result state
  const [ocrPages, setOcrPages] = useState<OcrPageData[]>([]);
  const [activeTab, setActiveTab] = useState<number>(0); // 0 = Merged All, 1+ = Page Index
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");
  const [processingTime, setProcessingTime] = useState(0);
  const [copied, setCopied] = useState(false);

  // Text-to-Speech state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Fetch/Render PDF details on upload
  useEffect(() => {
    async function initPdfDetails() {
      if (!files.length) return;
      setLoading(true);
      setOcrPages([]);
      try {
        const file = files[0];
        const pdfjs = await getPdfJs();
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
        setTotalPages(pdfDoc.numPages);

        // Render first page thumbnail
        const page = await pdfDoc.getPage(1);
        const viewport = page.getViewport({ scale: 0.4 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          await page.render({ canvasContext: ctx, viewport }).promise;
          setPdfThumbnail(canvas.toDataURL("image/jpeg", 0.8));
        }
      } catch (err: any) {
        console.error(err);
        toast.error("Failed to read PDF document details.");
      } finally {
        setLoading(false);
      }
    }
    initPdfDetails();
  }, [files]);

  // Cleanup SpeechSynthesis on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Main OCR Scanning process
  const startOcrScan = async () => {
    if (!files.length) return;
    setScanning(true);
    setScanProgress(0);
    setScanLogs(["Loading Tesseract WebAssembly core...", `Selected language model: ${language.toUpperCase()}`]);
    const startTime = performance.now();

    try {
      const file = files[0];
      const pdfjs = await getPdfJs();
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;

      // Handle Tesseract Language mapping
      // Support mixed language mapping: eng+hin as standard string
      const selectedLang = language;
      const worker = await createWorker(selectedLang);

      setScanLogs(prev => [...prev, "OCR engine initialized successfully.", "Starting document page scan loop..."]);
      const extractedPages: OcrPageData[] = [];

      for (let pNum = 1; pNum <= pdfDoc.numPages; pNum++) {
        setScanProgress(Math.floor(((pNum - 1) / pdfDoc.numPages) * 100));
        setScanLogs(prev => [...prev, `Rendering page ${pNum} of ${pdfDoc.numPages} to high-DPI canvas...`]);

        const page = await pdfDoc.getPage(pNum);
        // Render at scale 2.0 for higher DPI texture and optimal OCR character reading
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          await page.render({ canvasContext: ctx, viewport }).promise;
          setScanLogs(prev => [...prev, `Executing OCR characters extraction on page ${pNum}...`]);

          const { data } = (await worker.recognize(canvas)) as any;
          const text = data.text || "";
          const confidence = data.confidence || 0;
          const words = data.words || [];

          extractedPages.push({
            pageNumber: pNum,
            text: text.trim(),
            confidence: Math.round(confidence),
            wordCount: words.length,
            charCount: text.length
          });

          setScanLogs(prev => [
            ...prev,
            `Page ${pNum} extraction complete. Word count: ${words.length}, Confidence: ${Math.round(confidence)}%`
          ]);
        }
      }

      await worker.terminate();
      setOcrPages(extractedPages);
      setActiveTab(0); // Select merged view
      setProcessingTime(Math.round((performance.now() - startTime) / 1000));
      setScanProgress(100);
      toast.success("OCR Text extraction completed successfully!");
    } catch (err: any) {
      console.error(err);
      setScanLogs(prev => [...prev, `CRITICAL ERROR during scan: ${err.message}`]);
      toast.error(`OCR processing failed: ${err.message}`);
    } finally {
      setScanning(false);
    }
  };

  // Aggregated text helpers
  const getMergedText = () => {
    return ocrPages.map(p => p.text).filter(Boolean).join("\n\n");
  };

  const getActiveText = () => {
    if (activeTab === 0) return getMergedText();
    return ocrPages[activeTab - 1]?.text || "";
  };

  const updateActiveText = (newText: string) => {
    if (activeTab === 0) {
      // In merged view, we distribute modifications if single page
      if (ocrPages.length === 1) {
        setOcrPages([{ ...ocrPages[0], text: newText }]);
      } else {
        toast.info("To edit specific page content, select that page tab.");
      }
    } else {
      setOcrPages(prev => prev.map((p, idx) => idx === activeTab - 1 ? { ...p, text: newText, charCount: newText.length } : p));
    }
  };

  // Text Cleanups & Transforms
  const handleRemoveLineBreaks = () => {
    const activeText = getActiveText();
    const cleaned = activeText
      .replace(/([^\n])\n([^\n])/g, "$1 $2")
      .replace(/\s+/g, " ")
      .trim();
    updateActiveText(cleaned);
    toast.success("Single line breaks joined successfully.");
  };

  const handleFixWhitespace = () => {
    const activeText = getActiveText();
    const cleaned = activeText.replace(/[ \t]+/g, " ").trim();
    updateActiveText(cleaned);
    toast.success("Spacing and whitespace cleaned.");
  };

  const handleUppercase = () => {
    updateActiveText(getActiveText().toUpperCase());
  };

  const handleLowercase = () => {
    updateActiveText(getActiveText().toLowerCase());
  };

  // Copy Clipboard
  const handleCopy = () => {
    const text = getActiveText();
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  // File Exports
  const downloadTextFile = (format: "txt" | "md" | "json") => {
    const activeText = getActiveText();
    if (!activeText && format !== "json") {
      toast.warning("No text extracted to download.");
      return;
    }

    let blob: Blob;
    let extension = format;
    const baseName = files[0].name.replace(/\.[^/.]+$/, "");

    if (format === "json") {
      const payload = {
        documentName: files[0].name,
        processingTimeSeconds: processingTime,
        totalPages: ocrPages.length,
        averageConfidence: Math.round(ocrPages.reduce((sum, p) => sum + p.confidence, 0) / ocrPages.length),
        totalWords: ocrPages.reduce((sum, p) => sum + p.wordCount, 0),
        pages: ocrPages.map(p => ({
          pageNumber: p.pageNumber,
          confidence: p.confidence,
          wordCount: p.wordCount,
          charCount: p.charCount,
          text: p.text
        }))
      };
      blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
    } else {
      blob = new Blob([activeText], { type: "text/plain;charset=utf-8" });
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${baseName}-ocr-output.${extension}`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
      a.remove();
    }, 1000);
  };

  // Text-To-Speech Read Aloud
  const toggleSpeech = () => {
    if (!window.speechSynthesis) {
      toast.error("Text-to-Speech is not supported in this browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const text = getActiveText();
    if (!text) {
      toast.warning("No text to read aloud.");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const hasHindi = /[\u0900-\u097F]/.test(text);
    if (hasHindi) {
      utterance.lang = "hi-IN";
    } else {
      utterance.lang = "en-US";
    }

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    speechUtteranceRef.current = utterance;
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Search Match Highlighter
  const renderHighlightedPreview = () => {
    const text = getActiveText();
    if (!text) {
      return <p className="text-muted-foreground italic">No text found on this page.</p>;
    }
    if (!searchQuery.trim()) {
      return <pre className="whitespace-pre-wrap font-sans text-sm text-zinc-300 leading-relaxed">{text}</pre>;
    }

    const escapedQuery = searchQuery.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    const regex = new RegExp(`(${escapedQuery})`, "gi");
    const parts = text.split(regex);

    return (
      <pre className="whitespace-pre-wrap font-sans text-sm text-zinc-300 leading-relaxed">
        {parts.map((part, index) => 
          regex.test(part) ? (
            <mark key={index} className="bg-amber-500/40 text-amber-200 font-semibold px-0.5 rounded border border-amber-500/30">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </pre>
    );
  };

  // Compute overall stats
  const totalExtractedWords = ocrPages.reduce((sum, p) => sum + p.wordCount, 0);
  const totalExtractedChars = ocrPages.reduce((sum, p) => sum + p.charCount, 0);
  const averageConfidence = ocrPages.length > 0 
    ? Math.round(ocrPages.reduce((sum, p) => sum + p.confidence, 0) / ocrPages.length)
    : 0;

  // Check if OCR failed to find any text
  const noTextDetected = ocrPages.length > 0 && totalExtractedWords === 0;

  // Reset workspace
  const handleFullReset = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setOcrPages([]);
    setSearchQuery("");
    setScanProgress(0);
    setScanLogs([]);
    onReset();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <AnimatePresence mode="wait">
        {/* Stage 1: File dropped but not processed yet */}
        {ocrPages.length === 0 && !scanning && (
          <motion.div
            key="config"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="grid gap-6 lg:grid-cols-12"
          >
            {/* Left Column: File Details & Language config */}
            <div className="lg:col-span-5 space-y-6">
              <Card className="p-6 border-border/60 bg-card/40 backdrop-blur-md">
                <div className="flex items-center gap-2 border-b pb-4 mb-6">
                  <ScanText className="h-5 w-5 text-primary animate-pulse" />
                  <h2 className="text-lg font-bold">OCR Language & Engine</h2>
                </div>

                <div className="space-y-6">
                  {/* Language Selector */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-zinc-300 flex items-center gap-1.5">
                      <Globe className="h-4 w-4 text-primary" /> Recognition Language
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setLanguage("eng")}
                        className={`p-3 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1.5 ${
                          language === "eng"
                            ? "bg-primary/10 border-primary text-primary"
                            : "bg-background/40 border-border/60 text-muted-foreground hover:bg-background/80"
                        }`}
                      >
                        <span className="text-xl">🇬🇧</span>
                        <span>English Only</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setLanguage("hin")}
                        className={`p-3 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1.5 ${
                          language === "hin"
                            ? "bg-primary/10 border-primary text-primary"
                            : "bg-background/40 border-border/60 text-muted-foreground hover:bg-background/80"
                        }`}
                      >
                        <span className="text-xl">🇮🇳</span>
                        <span>Hindi Only</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setLanguage("eng+hin")}
                        className={`p-3 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1.5 ${
                          language === "eng+hin"
                            ? "bg-primary/10 border-primary text-primary"
                            : "bg-background/40 border-border/60 text-muted-foreground hover:bg-background/80"
                        }`}
                      >
                        <span className="text-xl">🔄</span>
                        <span>English+Hindi</span>
                      </button>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      * Selecting the exact language matching your document drastically improves extraction accuracy.
                    </p>
                  </div>

                  {/* Thumbnail / Info Card */}
                  {files.length > 0 && (
                    <div className="p-4 rounded-xl border bg-background/30 flex gap-4 items-center">
                      {pdfThumbnail ? (
                        <img
                          src={pdfThumbnail}
                          alt="First page"
                          className="h-16 w-12 object-cover rounded border bg-zinc-950"
                        />
                      ) : (
                        <div className="h-16 w-12 bg-zinc-900 rounded border flex items-center justify-center">
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate text-zinc-200">{files[0].name}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {totalPages} {totalPages === 1 ? "page" : "pages"} · {(files[0].size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    variant="gradient"
                    size="lg"
                    className="w-full"
                    disabled={loading || !files.length}
                    onClick={startOcrScan}
                  >
                    <Sparkles className="h-4 w-4 mr-2" /> Start OCR Text Extraction
                  </Button>
                </div>
              </Card>
            </div>

            {/* Right Column: Dropzone */}
            <div className="lg:col-span-7 h-full">
              <ToolDropzone
                files={files}
                onFiles={setFiles}
                accept={tool.accept}
                maxFiles={tool.maxFiles}
                multiple={false}
              />
            </div>
          </motion.div>
        )}

        {/* Stage 2: Processing state */}
        {scanning && (
          <motion.div
            key="scanning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-xl mx-auto"
          >
            <Card className="p-8 border-border/40 bg-card/30 backdrop-blur-md space-y-6">
              <div className="text-center space-y-2">
                <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
                <h3 className="text-xl font-bold font-display">Extracting Document Text...</h3>
                <p className="text-sm text-muted-foreground">Running 100% locally in your browser sandbox</p>
              </div>

              <div className="space-y-2">
                <Progress value={scanProgress} />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Progress</span>
                  <span>{scanProgress}%</span>
                </div>
              </div>

              {/* Progress logs */}
              <div className="rounded-xl border bg-black/60 p-4 font-mono text-[10px] text-emerald-400 h-40 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-zinc-800">
                {scanLogs.map((log, idx) => (
                  <div key={idx} className="flex gap-1.5 items-start">
                    <ChevronRight className="h-3 w-3 mt-0.5 text-zinc-500 shrink-0" />
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Stage 3: Scanning Done */}
        {ocrPages.length > 0 && !scanning && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid gap-6 lg:grid-cols-12"
          >
            {/* Left: Statistics & Custom formatting tools */}
            <div className="lg:col-span-4 space-y-6">
              {/* Telemetry card */}
              <Card className="p-5 border-border/60 bg-card/40 backdrop-blur-md space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b pb-2">
                  OCR Engine Metrics
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-zinc-950/40 rounded-xl border space-y-1">
                    <span className="text-[10px] text-muted-foreground block">Pages</span>
                    <span className="text-base font-black font-mono text-zinc-200">{ocrPages.length}</span>
                  </div>
                  <div className="p-3 bg-zinc-950/40 rounded-xl border space-y-1">
                    <span className="text-[10px] text-muted-foreground block">Confidence</span>
                    <span className={`text-base font-black font-mono ${
                      averageConfidence > 85 ? "text-emerald-400" : averageConfidence > 60 ? "text-amber-400" : "text-rose-400"
                    }`}>{averageConfidence}%</span>
                  </div>
                  <div className="p-3 bg-zinc-950/40 rounded-xl border space-y-1">
                    <span className="text-[10px] text-muted-foreground block">Extracted Words</span>
                    <span className="text-base font-black font-mono text-zinc-200">{totalExtractedWords.toLocaleString()}</span>
                  </div>
                  <div className="p-3 bg-zinc-950/40 rounded-xl border space-y-1">
                    <span className="text-[10px] text-muted-foreground block">Scan Time</span>
                    <span className="text-base font-black font-mono text-zinc-200">{processingTime}s</span>
                  </div>
                </div>

                <div className="p-3 bg-zinc-950/40 rounded-xl border flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">Total Characters</span>
                  <span className="text-xs font-bold font-mono text-zinc-300">{totalExtractedChars.toLocaleString()}</span>
                </div>
              </Card>

              {/* Formatting & Controls card */}
              <Card className="p-5 border-border/60 bg-card/40 backdrop-blur-md space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b pb-2">
                  Formatting Actions
                </h3>

                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-xs text-zinc-300 hover:text-white"
                    onClick={handleRemoveLineBreaks}
                    disabled={totalExtractedWords === 0}
                  >
                    <AlignLeft className="h-3.5 w-3.5 mr-2 text-primary" /> Join Line Breaks into Paragraphs
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-xs text-zinc-300 hover:text-white"
                    onClick={handleFixWhitespace}
                    disabled={totalExtractedWords === 0}
                  >
                    <AlignLeft className="h-3.5 w-3.5 mr-2 text-primary" /> Remove Extra Whitespaces
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs text-zinc-300 hover:text-white"
                      onClick={handleUppercase}
                      disabled={totalExtractedWords === 0}
                    >
                      UPPERCASE
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs text-zinc-300 hover:text-white"
                      onClick={handleLowercase}
                      disabled={totalExtractedWords === 0}
                    >
                      lowercase
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Speech reader */}
              <Card className="p-5 border-border/60 bg-card/40 backdrop-blur-md space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b pb-2">
                  Speech Synthesizer
                </h3>
                <Button
                  variant={isSpeaking ? "destructive" : "outline"}
                  size="sm"
                  className="w-full justify-center text-xs"
                  onClick={toggleSpeech}
                  disabled={totalExtractedWords === 0}
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="h-4 w-4 mr-2" /> Stop Reading Aloud
                    </>
                  ) : (
                    <>
                      <Volume2 className="h-4 w-4 mr-2 text-primary" /> Read Text Aloud
                    </>
                  )}
                </Button>
              </Card>

              {/* Reset/Cancel */}
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                onClick={handleFullReset}
              >
                <RefreshCw className="h-3.5 w-3.5 mr-2" /> Reset & Clear Workspace
              </Button>
            </div>

            {/* Right: Main Editor and Exports */}
            <div className="lg:col-span-8 space-y-6">
              {noTextDetected ? (
                /* Failure Handling: Empty Text Warning banner */
                <Card className="p-8 border-destructive/30 bg-destructive/10 text-center space-y-4">
                  <AlertTriangle className="h-12 w-12 text-destructive mx-auto animate-bounce" />
                  <h3 className="text-lg font-bold text-destructive">No Readable Text Detected</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    No readable text found in this document. Please ensure the document is not a blank sheet, has high contrast characters, and the language selector matches the page.
                  </p>
                </Card>
              ) : (
                /* Extracted Text Viewer */
                <Card className="border-border/60 bg-card/40 backdrop-blur-md overflow-hidden flex flex-col h-full min-h-[500px]">
                  {/* Editor Header controls */}
                  <div className="p-4 border-b bg-muted/20 flex flex-wrap gap-4 items-center justify-between">
                    {/* View Switchers */}
                    <div className="flex rounded-lg border bg-zinc-950 p-1">
                      <button
                        onClick={() => setViewMode("edit")}
                        className={`px-3 py-1 rounded text-xs font-bold transition ${
                          viewMode === "edit"
                            ? "bg-primary/20 text-primary"
                            : "text-muted-foreground hover:text-white"
                        }`}
                      >
                        Edit Editor
                      </button>
                      <button
                        onClick={() => setViewMode("preview")}
                        className={`px-3 py-1 rounded text-xs font-bold transition ${
                          viewMode === "preview"
                            ? "bg-primary/20 text-primary"
                            : "text-muted-foreground hover:text-white"
                        }`}
                      >
                        Search Preview
                      </button>
                    </div>

                    {/* Search query (Only when in preview mode) */}
                    {viewMode === "preview" && (
                      <div className="relative max-w-xs w-full">
                        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                        <input
                          type="text"
                          placeholder="Search keyword..."
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                          className="pl-8 pr-3 py-1.5 text-xs w-full rounded-md border border-input bg-zinc-950 focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                    )}

                    {/* Copier */}
                    <Button variant="ghost" size="sm" onClick={handleCopy} className="text-xs text-muted-foreground hover:text-zinc-200">
                      {copied ? <Check className="h-3.5 w-3.5 mr-1 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                      {copied ? "Copied" : "Copy"}
                    </Button>
                  </div>

                  {/* Page-by-page tabs selectors */}
                  {ocrPages.length > 1 && (
                    <div className="p-2 border-b bg-muted/10 flex gap-1 overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-800">
                      <button
                        onClick={() => setActiveTab(0)}
                        className={`px-3 py-1 rounded text-[10px] font-bold shrink-0 transition ${
                          activeTab === 0
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : "bg-background/40 border border-border/40 text-muted-foreground hover:text-white"
                        }`}
                      >
                        All Pages ({ocrPages.length})
                      </button>
                      {ocrPages.map((page, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveTab(idx + 1)}
                          className={`px-3 py-1 rounded text-[10px] font-bold shrink-0 transition ${
                            activeTab === idx + 1
                              ? "bg-primary/10 text-primary border border-primary/20"
                              : "bg-background/40 border border-border/40 text-muted-foreground hover:text-white"
                          }`}
                        >
                          Page {page.pageNumber} ({page.confidence}%)
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Text Container Body */}
                  <div className="flex-1 p-6 min-h-[360px] bg-black/40 flex flex-col justify-stretch">
                    {viewMode === "edit" ? (
                      <textarea
                        value={getActiveText()}
                        onChange={e => updateActiveText(e.target.value)}
                        className="w-full flex-1 min-h-[340px] bg-transparent text-sm font-sans text-zinc-200 resize-none border-0 focus:ring-0 focus:outline-none leading-relaxed"
                        placeholder="Extracted text will appear here. You can edit it directly."
                      />
                    ) : (
                      <div className="w-full flex-1 min-h-[340px] overflow-y-auto">
                        {renderHighlightedPreview()}
                      </div>
                    )}
                  </div>

                  {/* Export Footer */}
                  <div className="p-4 border-t bg-muted/20 flex flex-wrap gap-2 items-center justify-between">
                    <span className="text-[10px] text-muted-foreground font-mono">
                      Words: {totalExtractedWords} · Chars: {totalExtractedChars}
                    </span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => downloadTextFile("txt")} className="text-xs">
                        <FileText className="h-3.5 w-3.5 mr-1 text-primary" /> Plain Text (.txt)
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => downloadTextFile("md")} className="text-xs">
                        <FileText className="h-3.5 w-3.5 mr-1 text-primary" /> Markdown (.md)
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => downloadTextFile("json")} className="text-xs">
                        <FileJson className="h-3.5 w-3.5 mr-1 text-amber-400" /> Structure (.json)
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
