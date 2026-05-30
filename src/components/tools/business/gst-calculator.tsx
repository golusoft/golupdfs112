"use client";

import { useState } from "react";
import { Hash, Copy, Check, Info, Award, Briefcase, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export function GstCalculator() {
  const [calcMode, setCalcMode] = useState<"add" | "remove">("add");
  const [amount, setAmount] = useState(15000);
  const [gstRate, setGstRate] = useState(18);
  const [customRate, setCustomRate] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const activeRate = customRate !== "" ? parseFloat(customRate) || 0 : gstRate;

  // GST Calculations
  let basePrice = 0;
  let gstAmount = 0;
  let totalPrice = 0;

  if (calcMode === "add") {
    basePrice = amount;
    gstAmount = amount * (activeRate / 100);
    totalPrice = amount + gstAmount;
  } else {
    basePrice = amount / (1 + activeRate / 100);
    gstAmount = amount - basePrice;
    totalPrice = amount;
  }

  const cgst = gstAmount / 2;
  const sgst = gstAmount / 2;

  const handleCopy = () => {
    const text = `GST Tax Breakdown (golupdf.online):\n` +
      `Mode: ${calcMode === "add" ? "GST Exclusive (Add)" : "GST Inclusive (Remove)"}\n` +
      `Original Amount: ₹${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}\n` +
      `Tax Rate Selected: ${activeRate}%\n` +
      `Base Price (Net): ₹${basePrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}\n` +
      `CGST (Central): ₹${cgst.toLocaleString(undefined, { minimumFractionDigits: 2 })}\n` +
      `SGST (State): ₹${sgst.toLocaleString(undefined, { minimumFractionDigits: 2 })}\n` +
      `Total GST: ₹${gstAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}\n` +
      `Total Invoice Value: ₹${totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("GST breakdown copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setCalcMode("add");
    setAmount(15000);
    setGstRate(18);
    setCustomRate("");
    toast.info("Calculator reset.");
  };

  // Base price share calculation for chart
  const baseRatio = totalPrice > 0 ? (basePrice / totalPrice) * 100 : 0;
  const taxRatio = totalPrice > 0 ? (gstAmount / totalPrice) * 100 : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* SaaS Executive Dashboard Analytics cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <div className="p-4 rounded-2xl border bg-card/30 backdrop-blur-md space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Base Net Price</span>
          <p className="text-lg font-black font-mono text-foreground">
            ₹{basePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="p-4 rounded-2xl border bg-card/30 backdrop-blur-md space-y-1">
          <span className="text-[10px] uppercase font-bold text-amber-500 tracking-wider">CGST (Central)</span>
          <p className="text-lg font-black font-mono text-amber-400">
            ₹{cgst.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="p-4 rounded-2xl border bg-card/30 backdrop-blur-md space-y-1">
          <span className="text-[10px] uppercase font-bold text-indigo-500 tracking-wider">SGST (State)</span>
          <p className="text-lg font-black font-mono text-indigo-400">
            ₹{sgst.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="p-4 rounded-2xl border bg-card/30 backdrop-blur-md space-y-1 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
          <span className="text-[10px] uppercase font-bold text-emerald-500 tracking-wider">Gross Invoice Total</span>
          <p className="text-lg font-black font-mono text-emerald-400">
            ₹{totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Main SaaS split screen workspace */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Editor Form block */}
        <div className="lg:col-span-6">
          <Card className="border-border/60 bg-card/40 backdrop-blur-md h-full flex flex-col justify-between">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Hash className="h-5 w-5 text-primary" /> Tax Engine Configuration
                </h2>
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <RefreshCw className="h-3.5 w-3.5 mr-1" /> Reset
                </Button>
              </div>

              {/* Mode Selector Tab */}
              <div className="space-y-2">
                <Label>Calculation Mode</Label>
                <Tabs value={calcMode} onValueChange={(val) => setCalcMode(val as any)} className="w-full">
                  <TabsList className="grid grid-cols-2 w-full">
                    <TabsTrigger value="add">Add GST (Exclusive)</TabsTrigger>
                    <TabsTrigger value="remove">Remove GST (Inclusive)</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Amount input */}
              <div className="space-y-2">
                <Label htmlFor="gst-amount">
                  {calcMode === "add" ? "Transaction Net Amount (₹)" : "Total Invoice Amount inclusive of Tax (₹)"}
                </Label>
                <Input
                  id="gst-amount"
                  type="number"
                  value={amount === 0 ? "" : amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  className="text-lg font-mono"
                />
              </div>

              {/* Tax Slab Selection */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Tax Slabs / Rates (%)</Label>
                  <span className="text-[10px] text-muted-foreground font-mono">Current: {activeRate}%</span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {[5, 12, 18, 28].map((rate) => (
                    <Button
                      key={rate}
                      type="button"
                      variant={gstRate === rate && customRate === "" ? "default" : "outline"}
                      onClick={() => {
                        setGstRate(rate);
                        setCustomRate("");
                      }}
                      className="font-bold font-mono h-9 text-xs"
                    >
                      {rate}%
                    </Button>
                  ))}
                  <Input
                    placeholder="Custom %"
                    type="number"
                    value={customRate}
                    onChange={(e) => setCustomRate(e.target.value)}
                    className="font-mono text-xs h-9 text-center border-dashed"
                  />
                </div>
              </div>

              {/* Indian GST Slabs Directory Info */}
              <div className="p-4 rounded-xl border bg-zinc-950/20 text-xs text-muted-foreground space-y-2 leading-relaxed">
                <p className="font-semibold text-zinc-300 flex items-center gap-1">
                  <Info className="h-3.5 w-3.5 text-primary" /> India Statutory Slabs Reference:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-[11px]">
                  <li><strong>5% Slab</strong>: Essential goods (packaged foods, basic textiles).</li>
                  <li><strong>12% Slab</strong>: Processed foods, books, standard utilities.</li>
                  <li><strong>18% Slab</strong>: Professional services, software products, electronics, business consulting.</li>
                  <li><strong>28% Slab</strong>: Luxury items, motor vehicles, high-end entertainment.</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live visualization and summary panel */}
        <div className="lg:col-span-6">
          <Card className="border-border/60 bg-card/40 backdrop-blur-md h-full flex flex-col justify-between">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Tax Breakdown & Visualizer
                </h3>
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 mr-1.5 text-emerald-400" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 mr-1.5" /> Copy Invoice Details
                    </>
                  )}
                </Button>
              </div>

              {/* Graphical Share Visualizer */}
              {totalPrice > 0 && (
                <div className="space-y-4">
                  <div className="h-6 w-full rounded-2xl overflow-hidden flex bg-zinc-800">
                    <div className="bg-gradient-to-r from-primary/80 to-primary h-full transition-all duration-300" style={{ width: `${baseRatio}%` }} />
                    <div className="bg-gradient-to-r from-amber-500 to-indigo-500 h-full transition-all duration-300" style={{ width: `${taxRatio}%` }} />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground font-mono">
                    <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-primary" /> Base Net ({baseRatio.toFixed(0)}%)</span>
                    <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> GST Tax Burden ({taxRatio.toFixed(0)}%)</span>
                  </div>
                </div>
              )}

              {/* Complete statement sheet */}
              <div className="border rounded-2xl bg-zinc-950/20 p-5 space-y-4">
                <h4 className="text-xs uppercase font-bold text-muted-foreground border-b pb-1.5">GSTR-1 Invoice Preview</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">GST Treatment:</span>
                    <span className="font-semibold text-zinc-300">Intra-State supply (CGST + SGST applied)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Original Transaction Amount:</span>
                    <span className="font-mono font-bold text-zinc-300">₹{amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base Sales Price (Excl. Tax):</span>
                    <span className="font-mono font-bold text-zinc-300">₹{basePrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between pt-1.5 border-t border-dashed">
                    <span className="text-muted-foreground">CGST (Central Tax Component - {activeRate / 2}%):</span>
                    <span className="font-mono text-zinc-300">₹{cgst.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">SGST (State Tax Component - {activeRate / 2}%):</span>
                    <span className="font-mono text-zinc-300">₹{sgst.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t font-semibold text-sm">
                    <span className="text-foreground">Total Transaction Value:</span>
                    <span className="font-mono text-emerald-400">₹{totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
