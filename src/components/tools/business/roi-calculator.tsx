"use client";

import { useState } from "react";
import { GitCompare, Copy, Check, RefreshCw, Sparkles, TrendingUp, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function RoiCalculator() {
  const [invested, setInvested] = useState(25000);
  const [returned, setReturned] = useState(45000);
  const [tenure, setTenure] = useState(4);
  const [tenureUnit, setTenureUnit] = useState<"years" | "months">("years");
  const [copied, setCopied] = useState(false);

  const netGain = returned - invested;
  const simpleRoi = invested > 0 ? (netGain / invested) * 100 : 0;
  const multiple = invested > 0 ? returned / invested : 0;

  // CAGR math
  const tenureYears = tenureUnit === "years" ? tenure : tenure / 12;
  let annualizedRoi = 0;
  if (invested > 0 && returned > 0 && tenureYears > 0) {
    annualizedRoi = (Math.pow(returned / invested, 1 / tenureYears) - 1) * 100;
  }

  const handleCopy = () => {
    const text = `SaaS ROI Performance Audit (golupdf.online):\n` +
      `Initial Investment: $${invested.toLocaleString(undefined, { minimumFractionDigits: 2 })}\n` +
      `Total Returned Value: $${returned.toLocaleString(undefined, { minimumFractionDigits: 2 })}\n` +
      `Net Capital Gains: $${netGain.toLocaleString(undefined, { minimumFractionDigits: 2 })}\n` +
      `Simple ROI Rate: ${simpleRoi.toFixed(2)}%\n` +
      `Investment Multiple: ${multiple.toFixed(2)}x\n` +
      `Investment Period: ${tenure} ${tenureUnit}\n` +
      `Compound Annualized ROI (CAGR): ${annualizedRoi.toFixed(2)}%`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("ROI performance details copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setInvested(25000);
    setReturned(45000);
    setTenure(4);
    setTenureUnit("years");
    toast.info("Calculator reset.");
  };

  const principalRatio = returned > 0 ? Math.min(100, (invested / returned) * 100) : 0;
  const profitRatio = returned > 0 ? Math.min(100, (netGain / returned) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* SaaS Executive Metrics Panel */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <div className="p-4 rounded-2xl border bg-card/30 backdrop-blur-md space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Net Capital Gain</span>
          <p className={`text-lg font-black font-mono ${netGain >= 0 ? "text-emerald-400" : "text-destructive"}`}>
            {netGain < 0 ? "-" : ""}${Math.abs(netGain).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="p-4 rounded-2xl border bg-card/30 backdrop-blur-md space-y-1">
          <span className="text-[10px] uppercase font-bold text-primary tracking-wider">Simple ROI</span>
          <p className="text-lg font-black font-mono text-primary">
            {simpleRoi.toFixed(2)}%
          </p>
        </div>
        <div className="p-4 rounded-2xl border bg-card/30 backdrop-blur-md space-y-1">
          <span className="text-[10px] uppercase font-bold text-amber-500 tracking-wider">Investment Multiple</span>
          <p className="text-lg font-black font-mono text-amber-400">
            {multiple.toFixed(2)}x
          </p>
        </div>
        <div className="p-4 rounded-2xl border bg-card/30 backdrop-blur-md space-y-1 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
          <span className="text-[10px] uppercase font-bold text-emerald-500 tracking-wider">Annualized Return (CAGR)</span>
          <p className="text-lg font-black font-mono text-emerald-400">
            {annualizedRoi.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Main split screen workspace */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Editor Form Panel */}
        <div className="lg:col-span-6">
          <Card className="border-border/60 bg-card/40 backdrop-blur-md h-full flex flex-col justify-between">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <GitCompare className="h-5 w-5 text-primary" /> Capital Allocation Configurator
                </h2>
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <RefreshCw className="h-3.5 w-3.5 mr-1" /> Reset
                </Button>
              </div>

              {/* Inputs */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="amt-invested">Initial Amount Invested ($ / ₹)</Label>
                  <Input
                    id="amt-invested"
                    type="number"
                    value={invested === 0 ? "" : invested}
                    onChange={(e) => setInvested(parseFloat(e.target.value) || 0)}
                    className="text-base font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amt-returned">Total Amount Returned ($ / ₹)</Label>
                  <Input
                    id="amt-returned"
                    type="number"
                    value={returned === 0 ? "" : returned}
                    onChange={(e) => setReturned(parseFloat(e.target.value) || 0)}
                    className="text-base font-mono"
                  />
                </div>
              </div>

              {/* Investment Period */}
              <div className="space-y-2">
                <Label>Investment Tenure</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={tenure === 0 ? "" : tenure}
                    onChange={(e) => setTenure(parseFloat(e.target.value) || 0)}
                    className="font-mono text-base flex-1"
                  />
                  <select
                    className="flex h-9 w-28 rounded-md border border-input bg-background px-2 py-1 text-xs focus:outline-none"
                    value={tenureUnit}
                    onChange={(e) => setTenureUnit(e.target.value as any)}
                  >
                    <option value="years">Years</option>
                    <option value="months">Months</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Visual analysis screen */}
        <div className="lg:col-span-6">
          <Card className="border-border/60 bg-card/40 backdrop-blur-md h-full flex flex-col justify-between">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Performance Analysis & Charts
                </h3>
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 mr-1.5 text-emerald-400" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 mr-1.5" /> Copy Analysis
                    </>
                  )}
                </Button>
              </div>

              {/* Dynamic growth bar visualizer */}
              {invested > 0 && netGain > 0 && (
                <div className="space-y-3">
                  <div className="flex justify-between text-xs text-muted-foreground font-mono">
                    <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-primary" /> Principal ({principalRatio.toFixed(0)}%)</span>
                    <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Capital Growth (+{simpleRoi.toFixed(0)}%)</span>
                  </div>
                  <div className="h-5 w-full rounded-2xl overflow-hidden flex bg-zinc-800">
                    <div className="bg-primary h-full transition-all duration-300" style={{ width: `${principalRatio}%` }} />
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full transition-all duration-300" style={{ width: `${profitRatio}%` }} />
                  </div>
                </div>
              )}

              {/* Annualized Compound Insight box */}
              {annualizedRoi > 0 && (
                <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-primary flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5" /> Annualized Compounding Insight
                  </span>
                  <p className="text-sm text-zinc-300 mt-1 leading-relaxed">
                    This investment compound grew at a stable rate of <strong className="text-emerald-400 font-mono">{annualizedRoi.toFixed(2)}%</strong> per year, yielding an investment multiple of <strong className="text-zinc-200 font-mono">{multiple.toFixed(2)}x</strong> over your {tenure} {tenureUnit} tenure.
                  </p>
                </div>
              )}

              {/* Statement details */}
              <div className="border rounded-2xl bg-zinc-950/20 p-5 space-y-3 text-xs text-zinc-300 font-sans">
                <h4 className="text-xs uppercase font-bold text-muted-foreground border-b pb-1.5 flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-400" /> Capital Growth Audit
                </h4>
                <div className="flex justify-between">
                  <span>Initial Capital Outlay (Principal):</span>
                  <span className="font-mono font-bold">${invested.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Final Value Extracted:</span>
                  <span className="font-mono font-bold text-zinc-200">${returned.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-1.5 border-t border-dashed">
                  <span>Net Growth (Capital Gain):</span>
                  <span className={`font-mono font-bold text-sm ${netGain >= 0 ? "text-emerald-400" : "text-destructive"}`}>
                    ${netGain.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
