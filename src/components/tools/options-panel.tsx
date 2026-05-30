"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Tool } from "@/lib/tools";
import type { ProcessOptions } from "@/lib/pdf/types";

interface OptionsPanelProps {
  tool: Omit<Tool, "icon">;
  options: ProcessOptions;
  setOptions: (next: ProcessOptions) => void;
}

export function OptionsPanel({ tool, options, setOptions }: OptionsPanelProps) {
  const set = (patch: Partial<ProcessOptions>) => setOptions({ ...options, ...patch });

  switch (tool.engine) {
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
    case "protect":
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="pwd">Password</Label>
            <Input id="pwd" type="password" placeholder="Set a strong password" value={options.newPassword || ""} onChange={(e) => set({ newPassword: e.target.value })} />
          </div>
          <p className="rounded-md border bg-muted/40 p-3 text-xs text-muted-foreground">
            ⚠ AES-256 encryption uses our server-side engine for true cryptographic protection. The browser-only flow currently flags metadata — full encryption coming with our WASM-qpdf release.
          </p>
        </div>
      );
    case "unlock":
      return (
        <div className="space-y-3">
          <Label htmlFor="upwd">Current password</Label>
          <Input id="upwd" type="password" placeholder="Enter PDF password" value={options.password || ""} onChange={(e) => set({ password: e.target.value })} />
        </div>
      );
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
