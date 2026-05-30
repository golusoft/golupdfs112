"use client";

import { useState } from "react";
import { Combine, Copy, Check, RefreshCw, Sparkles, AlertCircle, ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function ProfitMarginCalculator() {
  const [cost, setCost] = useState(80);
  const [revenue, setRevenue] = useState(120);
  const [targetMargin, setTargetMargin] = useState(35);
  const [volume, setVolume] = useState(500); // business batch volume
  const [copied, setCopied] = useState(false);

  const grossProfit = revenue - cost;
  const marginPercent = revenue > 0 ? (grossProfit / revenue) * 100 : 0;
  const markupPercent = cost > 0 ? (grossProfit / cost) * 100 : 0;

  // Batch Volume metrics
  const batchCost = cost * volume;
  const batchRevenue = revenue * volume;
  const batchProfit = grossProfit * volume;

  // target pricing logic
  const targetRevenue = targetMargin < 100 ? cost / (1 - targetMargin / 100) : 0;
  const targetProfit = targetRevenue - cost;

  const handleCopy = () => {
    const text = `SaaS Profit Margin Analysis (golupdf.online):\n` +
      `Unit Cost Price: $${cost.toLocaleString(undefined, { minimumFractionDigits: 2 })}\n` +
      `Unit Selling Price: $${revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}\n` +
      `Unit Gross Profit: $${grossProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}\n` +
      `Gross Profit Margin: ${marginPercent.toFixed(2)}%\n` +
      `Product Markup: ${markupPercent.toFixed(2)}%\n\n` +
      `Batch Volume Simulation (${volume} units):\n` +
      `Total Cost: $${batchCost.toLocaleString()}\n` +
      `Total Revenue: $${batchRevenue.toLocaleString()}\n` +
      `Total Net Profit: $${batchProfit.toLocaleString()}\n\n` +
      `Pricing Target (${targetMargin}% Margin Target):\n` +
      `Recommended Price per unit: $${targetRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Margin analysis breakdown copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setCost(80);
    setRevenue(120);
    setTargetMargin(35);
    setVolume(500);
    toast.info("Pricing calculator reset.");
  };

  const costRatio = revenue > 0 ? Math.min(100, Math.max(0, (cost / revenue) * 100)) : 0;
  const profitRatio = revenue > 0 ? Math.min(100, Math.max(0, (grossProfit / revenue) * 100)) : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* SaaS Executive Metrics Panel */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <div className="p-4 rounded-2xl border bg-card/30 backdrop-blur-md space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Unit Gross Profit</span>
          <p className={`text-lg font-black font-mono ${grossProfit >= 0 ? "text-emerald-400" : "text-destructive"}`}>
            {grossProfit < 0 ? "-" : ""}${Math.abs(grossProfit).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="p-4 rounded-2xl border bg-card/30 backdrop-blur-md space-y-1">
          <span className="text-[10px] uppercase font-bold text-primary tracking-wider">Profit Margin</span>
          <p className="text-lg font-black font-mono text-primary">
            {marginPercent.toFixed(2)}%
          </p>
        </div>
        <div className="p-4 rounded-2xl border bg-card/30 backdrop-blur-md space-y-1">
          <span className="text-[10px] uppercase font-bold text-amber-500 tracking-wider">Product Markup</span>
          <p className="text-lg font-black font-mono text-amber-400">
            {markupPercent.toFixed(2)}%
          </p>
        </div>
        <div className="p-4 rounded-2xl border bg-card/30 backdrop-blur-md space-y-1 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
          <span className="text-[10px] uppercase font-bold text-emerald-500 tracking-wider">Batch Gross Profit</span>
          <p className="text-lg font-black font-mono text-emerald-400">
            ${batchProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
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
                  <Combine className="h-5 w-5 text-primary" /> Pricing Configurator
                </h2>
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <RefreshCw className="h-3.5 w-3.5 mr-1" /> Reset
                </Button>
              </div>

              {/* Inputs */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="cost-price">Cost Price per unit ($ / ₹)</Label>
                  <Input
                    id="cost-price"
                    type="number"
                    value={cost === 0 ? "" : cost}
                    onChange={(e) => setCost(parseFloat(e.target.value) || 0)}
                    className="text-lg font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="selling-price">Selling Price / Revenue ($ / ₹)</Label>
                  <Input
                    id="selling-price"
                    type="number"
                    value={revenue === 0 ? "" : revenue}
                    onChange={(e) => setRevenue(parseFloat(e.target.value) || 0)}
                    className="text-lg font-mono"
                  />
                </div>
              </div>

              {/* Sales Volume Simulation */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="volume-size">Batch Sales Volume (Units)</Label>
                  <span className="text-[10px] text-muted-foreground font-mono">For bulk simulations</span>
                </div>
                <Input
                  id="volume-size"
                  type="number"
                  value={volume === 0 ? "" : volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value) || 0)}
                  className="font-mono text-base"
                />
              </div>

              {/* Target pricing target */}
              <div className="space-y-2">
                <Label htmlFor="target-margin">Target Profit Margin Goal (%)</Label>
                <Input
                  id="target-margin"
                  type="number"
                  max={99}
                  min={1}
                  value={targetMargin === 0 ? "" : targetMargin}
                  onChange={(e) => setTargetMargin(Math.min(99, Math.max(1, parseFloat(e.target.value) || 0)))}
                  className="font-mono text-base"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Visual analytics screen */}
        <div className="lg:col-span-6">
          <Card className="border-border/60 bg-card/40 backdrop-blur-md h-full flex flex-col justify-between">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Pricing Insights & Visualizer
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

              {/* Visual cost vs margin shares */}
              {revenue > 0 && grossProfit >= 0 && (
                <div className="space-y-3">
                  <div className="flex justify-between text-xs text-muted-foreground font-mono">
                    <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-zinc-500" /> Cost Share ({costRatio.toFixed(0)}%)</span>
                    <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Profit Share ({profitRatio.toFixed(0)}%)</span>
                  </div>
                  <div className="h-5 w-full rounded-2xl overflow-hidden flex bg-zinc-800">
                    <div className="bg-zinc-500 h-full transition-all duration-300" style={{ width: `${costRatio}%` }} />
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full transition-all duration-300" style={{ width: `${profitRatio}%` }} />
                  </div>
                </div>
              )}

              {/* Target Price simulator result */}
              {targetRevenue > 0 && (
                <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-primary flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5" /> Target Price recommendation
                  </span>
                  <p className="text-xl font-black font-mono text-emerald-400 mt-1">
                    ${targetRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-[10px] text-zinc-400">
                    Requires a Gross Profit of ${targetProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })} per unit to hit a {targetMargin}% margin.
                  </p>
                </div>
              )}

              {/* Batch metrics breakdown */}
              <div className="border rounded-2xl bg-zinc-950/20 p-5 space-y-3 text-xs text-zinc-300 font-sans">
                <h4 className="text-xs uppercase font-bold text-muted-foreground border-b pb-1.5 flex items-center gap-1.5">
                  <ShoppingBag className="h-3.5 w-3.5 text-indigo-400" /> Batch Forecast ({volume.toLocaleString()} units)
                </h4>
                <div className="flex justify-between">
                  <span>Total Capital Expended (Cost):</span>
                  <span className="font-mono font-bold">${batchCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Revenue Generated:</span>
                  <span className="font-mono font-bold text-zinc-200">${batchRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-1.5 border-t border-dashed">
                  <span>Net Return / Batch Earnings:</span>
                  <span className={`font-mono font-bold text-sm ${batchProfit >= 0 ? "text-emerald-400" : "text-destructive"}`}>
                    ${batchProfit.toLocaleString()}
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
