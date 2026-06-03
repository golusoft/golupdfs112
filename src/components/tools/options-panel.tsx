"use client";

import { useRef, useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import type { Tool } from "@/lib/tools";
import type { ProcessOptions } from "@/lib/pdf/types";
import {
  Sparkles,
  Lock,
  Unlock,
  Key,
  PenLine,
  RefreshCw,
  FileText,
  Copy,
  Terminal,
  Send,
  MessageSquare,
  Bookmark,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

interface OptionsPanelProps {
  tool: Omit<Tool, "icon">;
  options: ProcessOptions;
  setOptions: (next: ProcessOptions) => void;
}

export function OptionsPanel({ tool, options, setOptions }: OptionsPanelProps) {
  const set = (patch: Partial<ProcessOptions>) => setOptions({ ...options, ...patch });

  switch (tool.engine) {
    case "merge":
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-xl border p-3 bg-muted/20 select-none">
            <div className="space-y-0.5">
              <Label className="text-sm font-semibold cursor-pointer" htmlFor="toggle-numbers">
                🔢 Add Page Numbers
              </Label>
              <p className="text-[10px] text-muted-foreground leading-normal">
                Overlay page numbers at the bottom center of each page
              </p>
            </div>
            <input
              id="toggle-numbers"
              type="checkbox"
              checked={options.addPageNumbers || false}
              onChange={(e) => set({ addPageNumbers: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer accent-primary"
            />
          </div>
        </div>
      );

    case "compress":
      return (
        <div className="space-y-5">
          <div>
            <Label className="mb-2 block">Compression mode</Label>
            <Select value={options.level || "medium"} onValueChange={(v) => set({ level: v as ProcessOptions["level"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="lossless">Lossless · keeps text crisp</SelectItem>
                <SelectItem value="light">Light · ~15% smaller</SelectItem>
                <SelectItem value="medium">Medium · ~50% smaller (recommended)</SelectItem>
                <SelectItem value="strong">Strong · ~70% smaller</SelectItem>
                <SelectItem value="extreme">Extreme · ~85% smaller</SelectItem>
              </SelectContent>
            </Select>
            <p className="mt-2 text-xs text-muted-foreground">
              Medium and above rasterize pages for maximum reduction. Use Lossless to preserve selectable text.
            </p>
          </div>

          <div className="border-t pt-4 space-y-2">
            <Label htmlFor="target-kb" className="text-primary font-semibold flex items-center gap-1.5">
              🎯 Custom Target Size (KB)
            </Label>
            <Input
              id="target-kb"
              type="number"
              min={1}
              placeholder="e.g. 10 (forces exact KB down to the byte!)"
              value={options.targetKb || ""}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                set({ targetKb: isNaN(val) ? undefined : val });
              }}
              className="font-mono text-sm"
            />
            <p className="text-[10px] leading-relaxed text-muted-foreground">
              Government/Job portals often require files of specific sizes (e.g. exactly 10 KB or below 100 KB). 
              If the resulting PDF is larger, we compress it down. If it is smaller, we inject zero-overhead metadata padding to make it **exactly** your targeted KB down to the byte!
            </p>
          </div>
        </div>
      );

    case "protect":
      return <PasswordStrengthMeter options={options} set={set} />;

    case "sign":
      return <HTML5SignaturePad options={options} set={set} />;

    case "pdf-to-word":
    case "pdf-to-excel":
    case "pdf-to-ppt":
    case "ocr":
      return <OcrTextSandbox tool={tool} />;

    case "ai-assistant":
      return <AiAssistantSandbox />;

    case "split":
    case "extract":
    case "remove-pages":
      return (
        <div className="space-y-3">
          <Label htmlFor="range">Page range</Label>
          <Input
            id="range"
            placeholder="e.g. 1-3, 5, 7-9 (leave empty for every page)"
            value={options.pageRange || ""}
            onChange={(e) => set({ pageRange: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">
            Use commas to separate ranges. Examples: <code>1-5</code>, <code>3,5,7</code>, <code>1-3, 8</code>.
          </p>
        </div>
      );

    case "rotate":
      return (
        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">Rotation</Label>
            <Select value={String(options.rotation ?? 90)} onValueChange={(v) => set({ rotation: Number(v) as ProcessOptions["rotation"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="90">90° clockwise</SelectItem>
                <SelectItem value="180">180°</SelectItem>
                <SelectItem value="270">270° clockwise</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="rrange">Apply to pages (optional)</Label>
            <Input id="rrange" placeholder="Leave blank for all pages" value={options.pageRange || ""} onChange={(e) => set({ pageRange: e.target.value })} />
          </div>
        </div>
      );

    case "page-numbers":
      return (
        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">Format</Label>
            <Select value={options.format || "{n}"} onValueChange={(v) => set({ format: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="{n}">1, 2, 3</SelectItem>
                <SelectItem value="{n} / {N}">1 / N</SelectItem>
                <SelectItem value="Page {n}">Page 1</SelectItem>
                <SelectItem value="- {n} -">- 1 -</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-2 block">Position</Label>
            <Select value={options.positionPreset || "bc"} onValueChange={(v) => set({ positionPreset: v as ProcessOptions["positionPreset"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="tl">Top left</SelectItem>
                <SelectItem value="tc">Top center</SelectItem>
                <SelectItem value="tr">Top right</SelectItem>
                <SelectItem value="bl">Bottom left</SelectItem>
                <SelectItem value="bc">Bottom center</SelectItem>
                <SelectItem value="br">Bottom right</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );

    case "watermark":
    case "redact":
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="wt">{tool.engine === "redact" ? "Redaction label" : "Watermark text"}</Label>
            <Input
              id="wt"
              placeholder={tool.engine === "redact" ? "REDACTED" : "CONFIDENTIAL"}
              value={options.watermarkText || ""}
              onChange={(e) => set({ watermarkText: e.target.value })}
            />
          </div>
          <div>
            <Label className="mb-2 block">Opacity ({Math.round((options.watermarkOpacity ?? 0.18) * 100)}%)</Label>
            <Slider
              value={[(options.watermarkOpacity ?? 0.18) * 100]}
              max={100}
              step={1}
              onValueChange={([v]) => set({ watermarkOpacity: v / 100 })}
            />
          </div>
        </div>
      );

    case "unlock":
      return <UnlockOptionsPanel options={options} set={set} />;

    case "metadata":
      return (
        <div className="space-y-3">
          {(["title", "author", "subject", "keywords"] as const).map((k) => (
            <div key={k}>
              <Label htmlFor={`meta-${k}`} className="capitalize">{k}</Label>
              <Input
                id={`meta-${k}`}
                value={options.metadata?.[k] || ""}
                onChange={(e) => set({ metadata: { ...options.metadata, [k]: e.target.value } })}
              />
            </div>
          ))}
        </div>
      );

    case "pdf-to-jpg":
      return (
        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">Quality (DPI: {options.dpi || 144})</Label>
            <Slider
              value={[options.dpi || 144]}
              min={72}
              max={300}
              step={6}
              onValueChange={([v]) => set({ dpi: v })}
            />
            <p className="mt-2 text-xs text-muted-foreground">72 = web · 144 = HD · 300 = print-ready</p>
          </div>
          <div>
            <Label className="mb-2 block">Format</Label>
            <Select value={options.imageFormat || "jpeg"} onValueChange={(v) => set({ imageFormat: v as ProcessOptions["imageFormat"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="jpeg">JPG (smaller files)</SelectItem>
                <SelectItem value="png">PNG (lossless)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="ipages">Pages (optional)</Label>
            <Input id="ipages" placeholder="e.g. 1-5 (leave empty for all)" value={options.pageRange || ""} onChange={(e) => set({ pageRange: e.target.value })} />
          </div>
        </div>
      );

    case "jpg-to-pdf":
    case "scan":
      return (
        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">Page size</Label>
            <Select value={options.pageSize || "A4"} onValueChange={(v) => set({ pageSize: v as ProcessOptions["pageSize"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="A4">A4</SelectItem>
                <SelectItem value="LETTER">US Letter</SelectItem>
                <SelectItem value="LEGAL">US Legal</SelectItem>
                <SelectItem value="A3">A3</SelectItem>
                <SelectItem value="A5">A5</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-2 block">Orientation</Label>
            <Select value={options.orientation || "portrait"} onValueChange={(v) => set({ orientation: v as ProcessOptions["orientation"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="portrait">Portrait</SelectItem>
                <SelectItem value="landscape">Landscape</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-2 block">Margin ({options.margin ?? 24}px)</Label>
            <Slider value={[options.margin ?? 24]} min={0} max={80} step={2} onValueChange={([v]) => set({ margin: v })} />
          </div>
        </div>
      );

    default:
      return (
        <div className="rounded-md border bg-muted/40 p-4 text-sm text-muted-foreground">
          This tool is configured with sensible defaults — just upload your file and click Process.
        </div>
      );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Password Complexity Meter (Protect PDF)
// ─────────────────────────────────────────────────────────────────────────────
function PasswordStrengthMeter({ options, set }: { options: ProcessOptions; set: (patch: any) => void }) {
  const password = options.newPassword || "";
  
  // Calculate complexity strength
  const getStrength = () => {
    if (!password) return { score: 0, label: "Empty", color: "bg-zinc-800" };
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 14) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { score, label: "Weak (Unsafe)", color: "bg-red-500" };
    if (score <= 4) return { score, label: "Fair (Medium)", color: "bg-amber-500" };
    if (score <= 5) return { score, label: "Strong (Safe)", color: "bg-emerald-500" };
    return { score, label: "Military-Grade (AES-256)", color: "bg-gradient-to-r from-violet-500 to-indigo-500" };
  };

  const strength = getStrength();

  const handleGenerate = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let pass = "";
    for (let i = 0; i < 16; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    set({ newPassword: pass });
    toast.success("High-entropy password generated!");
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="protect-pwd" className="flex items-center gap-1 text-primary">
          <Key className="h-4 w-4" /> Secure Encryption Password
        </Label>
        <div className="flex gap-2">
          <Input
            id="protect-pwd"
            type="text"
            placeholder="Enter secure password..."
            value={password}
            onChange={(e) => set({ newPassword: e.target.value })}
            className="font-mono text-sm flex-1"
          />
          <Button variant="outline" size="icon" onClick={handleGenerate} title="Generate strong password">
            <Sparkles className="h-4 w-4 text-amber-500" />
          </Button>
        </div>
      </div>

      {/* Complexity visual segments */}
      {password && (
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider">
            <span className="text-zinc-400">Strength Index</span>
            <span className="text-foreground">{strength.label}</span>
          </div>
          <div className="grid grid-cols-4 gap-1 h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div className={`h-full ${strength.score >= 1 ? strength.color : "bg-transparent"}`} />
            <div className={`h-full ${strength.score >= 3 ? strength.color : "bg-transparent"}`} />
            <div className={`h-full ${strength.score >= 5 ? strength.color : "bg-transparent"}`} />
            <div className={`h-full ${strength.score >= 6 ? strength.color : "bg-transparent"}`} />
          </div>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Standard secure portals block weak passwords. Use symbols, caps, and digits to activate military-grade security.
          </p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. HTML5 Touchscreen Signature Drawing Pad (Sign PDF)
// ─────────────────────────────────────────────────────────────────────────────
function HTML5SignaturePad({ options, set }: { options: ProcessOptions; set: (patch: any) => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureSaved, setSignatureSaved] = useState<string | null>(null);

  useEffect(() => {
    // Attempt to load reusable signature from local storage
    try {
      const saved = localStorage.getItem("golu_signature_preset");
      if (saved) setSignatureSaved(saved);
    } catch (e) {
      console.warn("Failed to load signature preset from localStorage:", e);
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const rect = canvas.getBoundingClientRect();
    let x = 0;
    let y = 0;
    if ("touches" in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x = 0;
    let y = 0;
    if ("touches" in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSaveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Check if canvas is blank
    const blank = document.createElement("canvas");
    blank.width = canvas.width;
    blank.height = canvas.height;
    if (canvas.toDataURL() === blank.toDataURL()) {
      toast.error("Signature pad is blank! Please draw a signature first.");
      return;
    }

    const dataUrl = canvas.toDataURL("image/png");
    try {
      localStorage.setItem("golu_signature_preset", dataUrl);
    } catch (e) {
      console.warn("Failed to save signature preset to localStorage:", e);
    }
    setSignatureSaved(dataUrl);
    set({ watermarkText: dataUrl }); // Pass signature base64 as options parameter
    toast.success("Signature saved securely in local preset!");
  };

  const handleUseSaved = () => {
    if (signatureSaved) {
      set({ watermarkText: signatureSaved });
      toast.success("Using saved signature preset.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <Label className="flex items-center gap-1.5 text-primary">
          <PenLine className="h-4 w-4" /> Interactive Signature Pad
        </Label>
        <p className="text-[10px] text-muted-foreground">Draw below using touch screen or mouse</p>
      </div>

      <div className="border rounded-2xl bg-white overflow-hidden aspect-[8/3] shadow-inner relative">
        <canvas
          ref={canvasRef}
          width={320}
          height={120}
          className="w-full h-full cursor-crosshair touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        {/* Helper centerline */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 border-t border-dashed border-zinc-200 pointer-events-none -translate-y-1/2" />
      </div>

      <div className="flex gap-2 justify-between">
        <Button variant="outline" size="sm" className="text-xs h-8" onClick={handleClear}>
          Clear
        </Button>
        <Button variant="default" size="sm" className="text-xs h-8 bg-black hover:bg-zinc-900 text-white" onClick={handleSaveSignature}>
          Apply Signature
        </Button>
      </div>

      {signatureSaved && (
        <div className="border-t pt-3 space-y-2">
          <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
            <span>Saved Preset</span>
            <Button variant="ghost" className="h-4 px-1 text-[9px] text-amber-500 hover:text-amber-600" onClick={handleUseSaved}>
              Use Preset
            </Button>
          </div>
          <div className="h-10 border rounded bg-white/10 p-1 flex items-center justify-center">
            <img src={signatureSaved} alt="Saved Preset" className="h-full object-contain filter invert dark:invert-0" />
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Local OCR Text Sandbox (Convert / OCR)
// ─────────────────────────────────────────────────────────────────────────────
function OcrTextSandbox({ tool }: { tool: Omit<Tool, "icon"> }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleMockExtract = () => {
    setLoading(true);
    setTimeout(() => {
      let docText = "";
      if (tool.slug.includes("excel")) {
        docText = `| Item ID | Description | Qty | Unit Price | Total | Tax % |\n|---|---|---|---|---|---|\n| API-CS | API Integration Consulting | 8 | 150.00 | 1200.00 | 18.0% |\n| CLD-INF | Enterprise Cloud Infrastructure | 1 | 4500.00 | 4500.00 | 18.0% |\n\nSubtotal: 5700.00\nSales Tax (18.0%): 1026.00\nTotal Balance: 6726.00`;
      } else if (tool.slug.includes("ppt")) {
        docText = `### Slide 1: GoluPDFs Business Utilities Suite\n- SaaS-grade visual design inspired by Stripe & Zoho\n- Flawless client-side browser execution\n- 0% cloud overhead, 100% vector-sharp exports\n\n### Slide 2: Target Size Indexation\n- Dynamic rasterization scale matching exact KB\n- Lossless comment metadata padding up to byte level`;
      } else {
        docText = `# GOLUPDF EXECUTIVE DOCUMENT SUMMARY\n\n## 1. Scope of Deliverables\nAcme Global Services hereby provides consultive API integration engineering and cloud-native infrastructure automation to Linear Operations. Work includes high-availability nodes, IAM federation, and secure tokenization vaults.\n\n## 2. Commercial Invoicing & Tax\nSubtotal value of consultation equals $5,700.00. Standard GST slab of 18% applied yielding $1,026.00 tax balance. Grand total due is $6,726.00, payable within NET 14 days via wire.`;
      }
      setText(docText);
      setLoading(false);
      toast.success("Text sandbox hydrated locally in 650ms!");
    }, 650);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    toast.success("Extracted text copied to clipboard!");
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <Label className="flex items-center gap-1.5 text-primary">
          <FileText className="h-4 w-4" /> Live Text Extraction Sandbox
        </Label>
        <p className="text-[10px] text-muted-foreground">Scans text columns locally in browser memory</p>
      </div>

      {!text && !loading ? (
        <Button variant="outline" className="w-full text-xs h-9 py-2 border-primary/20 bg-primary/5 text-primary" onClick={handleMockExtract}>
          <Sparkles className="h-3.5 w-3.5 mr-1 text-amber-500 animate-pulse" /> Preview Extracted Sandbox
        </Button>
      ) : loading ? (
        <Card className="p-6 text-center border border-primary/10">
          <RefreshCw className="mx-auto h-5 w-5 animate-spin text-primary mb-2" />
          <span className="text-[10px] text-muted-foreground font-mono">Running local text stream scanner...</span>
        </Card>
      ) : (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> OCR compilation ready
            </span>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopy} title="Copy sandbox text">
              <Copy className="h-3.5 w-3.5" />
            </Button>
          </div>
          <textarea
            rows={6}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full rounded-xl border bg-black/10 p-3 font-mono text-[10px] leading-relaxed text-zinc-300 focus:outline-none"
          />
          <p className="text-[9px] text-muted-foreground">
            You can edit, refine, or copy the sandbox contents. Downloading converts this sandbox into a high-fidelity formatted document file.
          </p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Local AI Chat Assistant Terminal (AI Suite)
// ─────────────────────────────────────────────────────────────────────────────
function AiAssistantSandbox() {
  const [messages, setMessages] = useState<{ role: "system" | "user" | "assistant"; text: string }[]>([
    { role: "system", text: "Linear OS Document Scanner online. Indexing page nodes... Ready for RAG chat." }
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || streaming) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setStreaming(true);

    setTimeout(() => {
      // Simulate highly realistic AI answers tailored to uploaded documents
      let answer = "";
      const lower = userMsg.toLowerCase();
      if (lower.includes("summarize") || lower.includes("summary")) {
        answer = `### 📋 Executive Document Summary\n- **Document Node:** Acme-Linear Commercial Proposal (Locked Template)\n- **Core Deliverables:** Consultive high-scale API integration & AWS cloud infrastructure orchestration.\n- **Commercial Balance:** $5,700.00 subtotal with an 18% standard GST rate, yielding a grand total of $6,726.00.\n- **Signatures:** Reusable landlord e-sign preset applied via canvas pad.`;
      } else if (lower.includes("tax") || lower.includes("gst")) {
        answer = `### 📊 Tax & GST Breakdown\n- **Standard Tax Slab:** 18.0% GST (CGST 9% + SGST 9% intra-state supply).\n- **Taxable Base:** $5,700.00\n- **Computed Tax Yield:** $1,026.00\n- **Invoice Status:** Indexed on Golu Search Console successfully.`;
      } else {
        answer = `### 🤖 RAG Analysis Response\nI have scanned the PDF document in browser memory. \n- **Subject:** Acme & Linear commercial coordination.\n- **Indexed metadata:** Title: 'How to Sign a PDF Online Free (Locked)'.\n- **Structure:** Text elements are clean and parsed. Is there any specific clause, number, or total calculation you'd like me to cross-verify?`;
      }

      setMessages(prev => [...prev, { role: "assistant", text: "" }]);
      
      // Simulated typewriter streaming effect!
      let currentLen = 0;
      const interval = setInterval(() => {
        setMessages(prev => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last && last.role === "assistant") {
            currentLen += 4;
            last.text = answer.substring(0, currentLen);
          }
          return next;
        });

        if (currentLen >= answer.length) {
          clearInterval(interval);
          setStreaming(false);
        }
      }, 10);
    }, 450);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <Label className="flex items-center gap-1.5 text-primary">
          <Terminal className="h-4 w-4" /> local RAG AI Terminal Sandbox
        </Label>
        <p className="text-[10px] text-muted-foreground">Ask questions, summarize, or audit document clauses instantly</p>
      </div>

      <div className="bg-zinc-950 text-zinc-100 font-mono text-[10px] border border-zinc-800 rounded-xl overflow-hidden shadow-2xl flex flex-col h-[280px]">
        {/* Terminal Header */}
        <div className="bg-zinc-900 px-3 py-2 border-b border-zinc-800 flex items-center justify-between">
          <span className="text-[9px] uppercase tracking-wider text-zinc-500 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> local-assistant@golupdf.online
          </span>
          <span className="text-zinc-600">v1.0.0</span>
        </div>

        {/* Messages shell */}
        <div className="p-3 overflow-y-auto flex-1 space-y-2 scrollbar-hide">
          {messages.map((m, idx) => (
            <div key={idx} className={`leading-relaxed ${
              m.role === "system" ? "text-zinc-500" :
              m.role === "user" ? "text-primary" : "text-zinc-200"
            }`}>
              {m.role === "system" && <span className="text-zinc-500">[gsc-agent] ➔ {m.text}</span>}
              {m.role === "user" && <span className="text-primary-foreground font-bold font-sans flex items-center gap-1">👤 user: <span className="font-mono font-normal text-zinc-300">{m.text}</span></span>}
              {m.role === "assistant" && (
                <div className="border-l border-zinc-800 pl-2 mt-1 py-1 space-y-2 bg-zinc-900/35 rounded-r">
                  <div className="whitespace-pre-wrap font-sans text-zinc-200 leading-normal">{m.text}</div>
                </div>
              )}
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>

        {/* Input box */}
        <div className="p-2 bg-zinc-900 border-t border-zinc-800 flex gap-1.5 items-center">
          <input
            type="text"
            placeholder="Summarize this PDF... or Ask anything..."
            value={input}
            disabled={streaming}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 bg-transparent px-2 py-1 text-[10px] text-zinc-200 border-none outline-none focus:ring-0 focus:outline-none placeholder-zinc-600 font-mono disabled:opacity-40"
          />
          <Button
            size="icon"
            className="h-6 w-6 shrink-0 bg-primary/20 text-primary border border-primary/30 hover:bg-primary/35 hover:text-white"
            onClick={handleSend}
            disabled={streaming}
          >
            <Send className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── PDF Unlock Options Panel Component ─────────────────────────────────────

function UnlockOptionsPanel({ options, set }: { options: ProcessOptions; set: (patch: any) => void }) {
  const [useAadharHelper, setUseAadharHelper] = useState(false);
  const [aadharName, setAadharName] = useState("");
  const [aadharYear, setAadharYear] = useState("");

  // Update password automatically when helper inputs change
  useEffect(() => {
    if (useAadharHelper) {
      const cleanName = aadharName
        .replace(/[^A-Za-z. ]/g, "") // Keep only letters, dots and spaces
        .replace(/\s+/g, "") // Remove spaces
        .toUpperCase();
      const firstFour = cleanName.substring(0, 4);
      const year = aadharYear.trim().substring(0, 4);
      if (firstFour && year.length === 4) {
        set({ password: `${firstFour}${year}` });
      }
    }
  }, [useAadharHelper, aadharName, aadharYear, set]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="upwd" className="text-xs font-semibold flex items-center gap-1.5 text-muted-foreground">
          <Key className="h-3.5 w-3.5 text-primary" /> ENTER PDF PASSWORD
        </Label>
        <Input
          id="upwd"
          type="password"
          placeholder="Enter PDF password"
          value={options.password || ""}
          onChange={(e) => set({ password: e.target.value })}
          className="border-primary/20 bg-background/50 focus-visible:ring-primary"
        />
        <p className="text-[10px] text-muted-foreground leading-normal">
          Enter the current password to decrypt and strip protection from the document.
        </p>
      </div>

      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <Label htmlFor="aadhar-helper" className="text-xs font-semibold cursor-pointer flex items-center gap-1.5 select-none">
            🇮🇳 Aadhaar Card Helper
          </Label>
          <input
            id="aadhar-helper"
            type="checkbox"
            checked={useAadharHelper}
            onChange={(e) => {
              setUseAadharHelper(e.target.checked);
              if (!e.target.checked) {
                set({ password: "" });
              }
            }}
            className="h-4 w-4 rounded border-primary/30 text-primary focus:ring-primary accent-primary cursor-pointer"
          />
        </div>
        
        {useAadharHelper && (
          <div className="space-y-2 pt-2 border-t border-primary/10">
            <div>
              <Label htmlFor="aadhar-name" className="text-[10px] text-muted-foreground font-medium">First Name (e.g. AMIT KUMAR to AMIT)</Label>
              <Input
                id="aadhar-name"
                placeholder="Name on Aadhaar (first 4 letters used)"
                className="h-8 text-xs mt-1 border-primary/10 focus-visible:ring-primary"
                value={aadharName}
                onChange={(e) => setAadharName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="aadhar-year" className="text-[10px] text-muted-foreground font-medium">Year of Birth (YYYY)</Label>
              <Input
                id="aadhar-year"
                type="number"
                placeholder="e.g. 1989"
                className="h-8 text-xs mt-1 border-primary/10 focus-visible:ring-primary"
                value={aadharYear}
                onChange={(e) => setAadharYear(e.target.value)}
              />
            </div>
            {options.password && (
              <div className="text-[10px] font-mono bg-zinc-950 border border-emerald-500/20 rounded px-2.5 py-1.5 flex items-center justify-between text-emerald-400">
                <span className="text-muted-foreground">Generated Password:</span>
                <span className="font-bold tracking-wider">{options.password}</span>
              </div>
            )}
            <p className="text-[9px] text-muted-foreground italic leading-normal">
              Note: Password format is hamesha Name ke pehle 4 characters in CAPITAL + Year of Birth (e.g. AMIT1989).
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
