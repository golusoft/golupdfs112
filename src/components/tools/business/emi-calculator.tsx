"use client";

import { useState } from "react";
import { LayoutGrid, Printer, RefreshCw, Sparkles, TrendingUp, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface AmortizationRow {
  period: number;
  emi: number;
  principal: number;
  interest: number;
  endingBalance: number;
}

export function EmiCalculator() {
  const [principal, setPrincipal] = useState(500000);
  const [interestRate, setInterestRate] = useState(9.5);
  const [tenure, setTenure] = useState(5);
  const [tenureUnit, setTenureUnit] = useState<"years" | "months">("years");
  const [extraPayment, setExtraPayment] = useState<number>(0); // SaaS prepayment simulation

  // Math variables
  const n = tenureUnit === "years" ? tenure * 12 : tenure;
  const r = interestRate / (12 * 100);

  let emi = 0;
  let totalPayment = 0;
  let totalInterest = 0;
  const schedule: AmortizationRow[] = [];

  if (principal > 0 && interestRate > 0 && n > 0) {
    if (r === 0) {
      emi = principal / n;
    } else {
      emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }
    totalPayment = emi * n;
    totalInterest = totalPayment - principal;

    // Build amortization schedule considering custom prepayments
    let balance = principal;
    for (let i = 1; i <= n; i++) {
      if (balance <= 0) break;
      const interestPaid = balance * r;
      // Prepayment added on top of standard principal component
      let principalPaid = emi - interestPaid + extraPayment;
      if (principalPaid > balance) {
        principalPaid = balance;
      }
      balance = Math.max(0, balance - principalPaid);
      schedule.push({
        period: i,
        emi: interestPaid + principalPaid,
        principal: principalPaid,
        interest: interestPaid,
        endingBalance: balance,
      });
    }
  }

  const handleReset = () => {
    setPrincipal(500000);
    setInterestRate(9.5);
    setTenure(5);
    setTenureUnit("years");
    setExtraPayment(0);
    toast.info("EMI parameters reset.");
  };

  const principalShare = totalPayment > 0 ? (principal / totalPayment) * 100 : 0;
  const interestShare = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* SaaS Executive Metrics Dashboard */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <div className="p-4 rounded-2xl border bg-card/30 backdrop-blur-md space-y-1 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <span className="text-[10px] uppercase font-bold text-primary tracking-wider">Monthly Loan EMI</span>
          <p className="text-lg font-black font-mono text-primary">
            ${emi.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="p-4 rounded-2xl border bg-card/30 backdrop-blur-md space-y-1">
          <span className="text-[10px] uppercase font-bold text-amber-500 tracking-wider">Interest Burden</span>
          <p className="text-lg font-black font-mono text-amber-400">
            ${totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="p-4 rounded-2xl border bg-card/30 backdrop-blur-md space-y-1">
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Total Principal</span>
          <p className="text-lg font-black font-mono text-zinc-300">
            ${principal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </div>
        <div className="p-4 rounded-2xl border bg-card/30 backdrop-blur-md space-y-1 border-emerald-500/20 bg-emerald-500/10">
          <span className="text-[10px] uppercase font-bold text-emerald-500 tracking-wider">Total Repayment Value</span>
          <p className="text-lg font-black font-mono text-emerald-400">
            ${totalPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Main split screen workspace */}
      <div className="grid gap-6 lg:grid-cols-12 no-print">
        {/* Editor Form Panel */}
        <div className="lg:col-span-5">
          <Card className="border-border/60 bg-card/40 backdrop-blur-md h-full flex flex-col justify-between">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <LayoutGrid className="h-5 w-5 text-primary" /> Loan Configurator
                </h2>
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <RefreshCw className="h-3.5 w-3.5 mr-1" /> Reset
                </Button>
              </div>

              {/* Inputs */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emi-principal">Loan Principal Amount ($ / ₹)</Label>
                  <Input
                    id="emi-principal"
                    type="number"
                    value={principal === 0 ? "" : principal}
                    onChange={(e) => setPrincipal(parseFloat(e.target.value) || 0)}
                    className="text-base font-mono"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="emi-rate">Interest Rate (% p.a.)</Label>
                    <Input
                      id="emi-rate"
                      type="number"
                      step="0.1"
                      value={interestRate === 0 ? "" : interestRate}
                      onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                      className="text-base font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Loan Tenure</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={tenure === 0 ? "" : tenure}
                        onChange={(e) => setTenure(parseFloat(e.target.value) || 0)}
                        className="font-mono text-base flex-1"
                      />
                      <select
                        className="flex h-9 w-20 rounded-md border border-input bg-background px-2 py-1 text-xs focus:outline-none"
                        value={tenureUnit}
                        onChange={(e) => setTenureUnit(e.target.value as any)}
                      >
                        <option value="years">Yrs</option>
                        <option value="months">Mths</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Prepayments slider/input */}
                <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-3">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="emi-extra" className="text-primary font-semibold flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4" /> Prepayment Simulator
                    </Label>
                    <span className="text-[10px] text-muted-foreground font-mono">Accelerates amortization</span>
                  </div>
                  <div className="space-y-2">
                    <Input
                      id="emi-extra"
                      type="number"
                      placeholder="Extra payment per month..."
                      value={extraPayment === 0 ? "" : extraPayment}
                      onChange={(e) => setExtraPayment(parseFloat(e.target.value) || 0)}
                      className="font-mono text-sm"
                    />
                    <p className="text-[10px] leading-relaxed text-zinc-400">
                      Adding extra payments monthly reduces the ending balance faster, saving you massive interest charges and shortening the actual loan tenure.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live visualization screen */}
        <div className="lg:col-span-7">
          <Card className="border-border/60 bg-card/40 backdrop-blur-md h-full flex flex-col justify-between">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Amortization Insights & Schedule
                </h3>
                <Button size="sm" onClick={() => window.print()}>
                  <Printer className="h-3.5 w-3.5 mr-1" /> Print Schedule
                </Button>
              </div>

              {/* Graphical share visualizer */}
              {totalPayment > 0 && (
                <div className="space-y-3">
                  <div className="flex justify-between text-xs text-muted-foreground font-mono">
                    <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-primary" /> Principal Paid ({principalShare.toFixed(0)}%)</span>
                    <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Interest Paid ({interestShare.toFixed(0)}%)</span>
                  </div>
                  <div className="h-5 w-full rounded-2xl overflow-hidden flex bg-zinc-800">
                    <div className="bg-primary h-full transition-all duration-300" style={{ width: `${principalShare}%` }} />
                    <div className="bg-gradient-to-r from-amber-500 to-amber-600 h-full transition-all duration-300" style={{ width: `${interestShare}%` }} />
                  </div>
                </div>
              )}

              {/* Prepayments savings report */}
              {extraPayment > 0 && schedule.length > 0 && (
                <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-1.5 text-xs">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5" /> Amortization acceleration report
                  </span>
                  <p className="text-zinc-300 leading-normal">
                    With an extra monthly contribution of <strong className="text-emerald-400 font-mono">${extraPayment}</strong>, your loan will be fully paid off in <strong className="text-emerald-400 font-mono">{schedule.length} months</strong> instead of the scheduled {n} months.
                  </p>
                </div>
              )}

              {/* Amortization schedule table preview */}
              {schedule.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs uppercase font-bold text-muted-foreground border-b pb-1">Repayment Schedule Overview</h4>
                  <div className="max-h-56 overflow-y-auto border rounded-xl bg-zinc-950/15">
                    <table className="w-full text-[11px] text-left">
                      <thead className="sticky top-0 bg-background border-b text-zinc-500 font-medium">
                        <tr>
                          <th className="py-2 pl-4 text-center w-12">Month</th>
                          <th className="py-2 text-right w-24">EMI Paid</th>
                          <th className="py-2 text-right w-24">Principal</th>
                          <th className="py-2 text-right w-24">Interest</th>
                          <th className="py-2 text-right pr-4">Ending Bal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40 font-mono text-zinc-300">
                        {schedule.slice(0, 60).map((row) => (
                          <tr key={row.period} className="hover:bg-zinc-800/10">
                            <td className="py-2 pl-4 text-center text-zinc-400">{row.period}</td>
                            <td className="py-2 text-right">${row.emi.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                            <td className="py-2 text-right text-emerald-400">${row.principal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                            <td className="py-2 text-right text-amber-500">${row.interest.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                            <td className="py-2 text-right pr-4 text-zinc-400">${row.endingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 3. Printed output layout (A4 formatted) */}
      <div className="print-only text-zinc-900 bg-white min-h-screen p-12 flex flex-col font-sans" style={{ display: "none" }}>
        <div className="flex justify-between items-start border-b pb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">LOAN AMORTIZATION SCHEDULE</h1>
            <p className="text-xs text-zinc-500 mt-1 font-mono">GoluPDFs Business Utilities</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold uppercase text-zinc-400 tracking-wider">EMI SUMMARY SHEET</h2>
            <p className="text-[10px] text-zinc-500 mt-1 font-mono">Principal: ${principal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            <p className="text-[10px] text-zinc-500 font-mono">Interest Rate: {interestRate}% p.a.</p>
            <p className="text-[10px] text-zinc-500 font-mono">Tenure: {tenure} {tenureUnit}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 py-6 border-b text-xs text-zinc-800">
          <div className="p-4 border bg-zinc-50 rounded-xl">
            <span className="font-semibold text-zinc-400 block mb-1">Monthly Installment (EMI)</span>
            <span className="font-bold font-mono text-zinc-900 text-lg">${emi.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="p-4 border bg-zinc-50 rounded-xl">
            <span className="font-semibold text-zinc-400 block mb-1">Interest Cost</span>
            <span className="font-bold font-mono text-zinc-900 text-lg">${totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="p-4 border bg-zinc-50 rounded-xl">
            <span className="font-semibold text-zinc-400 block mb-1">Total Loan Repayment</span>
            <span className="font-bold font-mono text-zinc-900 text-lg">${totalPayment.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        <div className="flex-1 py-8">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b bg-zinc-50 text-zinc-500 font-semibold">
                <th className="py-2.5 pl-4 text-center w-16">Period</th>
                <th className="py-2.5 text-right w-32">EMI Paid</th>
                <th className="py-2.5 text-right w-32">Principal Paid</th>
                <th className="py-2.5 text-right w-32">Interest Paid</th>
                <th className="py-2.5 text-right pr-4">Ending Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y font-mono text-zinc-700">
              {schedule.map((row) => (
                <tr key={row.period}>
                  <td className="py-2 pl-4 text-center text-zinc-500">{row.period}</td>
                  <td className="py-2 text-right">${row.emi.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="py-2 text-right text-emerald-600">${row.principal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="py-2 text-right text-amber-600">${row.interest.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="py-2 text-right pr-4">${row.endingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t mt-12 pt-6 text-[10px] text-zinc-400 flex justify-between items-center font-mono">
          <p>Generated dynamically via golupdf.online</p>
          <p>100% private, server-free calculations</p>
        </div>
      </div>
    </div>
  );
}
