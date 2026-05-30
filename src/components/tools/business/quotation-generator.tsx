"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Printer, RefreshCw, FileSpreadsheet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface QuotationItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export function QuotationGenerator() {
  const [companyName, setCompanyName] = useState("Pro Builders Ltd");
  const [companyEmail, setCompanyEmail] = useState("contact@probuilders.com");
  const [companyAddress, setCompanyAddress] = useState("789 Industrial Area, Phase 2\nNew Delhi, DL 110020");
  
  const [customerName, setCustomerName] = useState("Dev Enterprises");
  const [customerEmail, setCustomerEmail] = useState("purchase@deventerprises.com");
  const [customerAddress, setCustomerAddress] = useState("Plot 12, Sector 5\nNoida, UP 201301");

  const [quoteNumber, setQuoteNumber] = useState("QT-2026-042");
  const [quoteDate, setQuoteDate] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [currency, setCurrency] = useState("₹");
  const [discountPercent, setDiscountPercent] = useState(5);
  const [taxPercent, setTaxPercent] = useState(18);
  const [terms, setTerms] = useState("1. Delivery within 7 business days from approval.\n2. 50% advance payment required upon quote sign-off.\n3. Taxes calculated dynamically at checkout.");

  const [items, setItems] = useState<QuotationItem[]>([
    { id: "1", description: "Structural Steel Frame Installation", quantity: 1, rate: 45000 },
    { id: "2", description: "Pre-construction Design Planning", quantity: 5, rate: 3200 }
  ]);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const valid = new Date();
    valid.setDate(valid.getDate() + 30);
    setQuoteDate(today);
    setValidUntil(valid.toISOString().split("T")[0]);
  }, []);

  const handleAddItem = () => {
    const newItem: QuotationItem = {
      id: Date.now().toString(),
      description: "Custom Product / Service Description",
      quantity: 1,
      rate: 1500
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) {
      toast.error("A quote must contain at least one line item.");
      return;
    }
    setItems(items.filter(i => i.id !== id));
  };

  const handleItemChange = (id: string, field: keyof QuotationItem, val: any) => {
    setItems(items.map(i => {
      if (i.id === id) {
        let parsed = val;
        if (field === "quantity" || field === "rate") {
          parsed = parseFloat(val) || 0;
        }
        return { ...i, [field]: parsed };
      }
      return i;
    }));
  };

  const handleReset = () => {
    setCompanyName("Pro Builders Ltd");
    setCompanyEmail("contact@probuilders.com");
    setCompanyAddress("789 Industrial Area, Phase 2\nNew Delhi, DL 110020");
    setCustomerName("Dev Enterprises");
    setCustomerEmail("purchase@deventerprises.com");
    setCustomerAddress("Plot 12, Sector 5\nNoida, UP 201301");
    setQuoteNumber("QT-2026-042");
    setCurrency("₹");
    setDiscountPercent(5);
    setTaxPercent(18);
    setTerms("1. Delivery within 7 business days from approval.\n2. 50% advance payment required upon quote sign-off.\n3. Taxes calculated dynamically at checkout.");
    setItems([
      { id: "1", description: "Structural Steel Frame Installation", quantity: 1, rate: 45000 },
      { id: "2", description: "Pre-construction Design Planning", quantity: 5, rate: 3200 }
    ]);
    toast.info("Quotation values reset.");
  };

  const subtotal = items.reduce((s, i) => s + (i.quantity * i.rate), 0);
  const discountAmount = subtotal * (discountPercent / 100);
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = taxableAmount * (taxPercent / 100);
  const finalTotal = taxableAmount + taxAmount;

  return (
    <>
      {/* SaaS Executive Metrics Grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6 no-print">
        <div className="p-4 rounded-2xl border bg-card/30 backdrop-blur-md space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Estimated Subtotal</span>
          <p className="text-lg font-black font-mono text-foreground">
            {currency}{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="p-4 rounded-2xl border bg-card/30 backdrop-blur-md space-y-1">
          <span className="text-[10px] uppercase font-bold text-emerald-500 tracking-wider">Promotional Discount</span>
          <p className="text-lg font-black font-mono text-emerald-400">
            {currency}{discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="p-4 rounded-2xl border bg-card/30 backdrop-blur-md space-y-1">
          <span className="text-[10px] uppercase font-bold text-amber-500 tracking-wider">Tax Provision</span>
          <p className="text-lg font-black font-mono text-amber-400">
            {currency}{taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="p-4 rounded-2xl border bg-card/30 backdrop-blur-md space-y-1 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <span className="text-[10px] uppercase font-bold text-primary tracking-wider">Estimated Total Cost</span>
          <p className="text-lg font-black font-mono text-primary">
            {currency}{finalTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 no-print">
        {/* 1. Configuration Panel */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-border/60 bg-card/40 backdrop-blur-md">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5 text-primary" /> Quote Information
                </h2>
                <Button size="sm" variant="outline" onClick={handleReset}>
                  <RefreshCw className="h-3.5 w-3.5 mr-1" /> Reset
                </Button>
              </div>

              {/* General Meta */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="q-num">Quote Reference Number</Label>
                  <Input id="q-num" value={quoteNumber} onChange={e => setQuoteNumber(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="q-curr">Currency</Label>
                  <select
                    id="q-curr"
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none"
                    value={currency}
                    onChange={e => setCurrency(e.target.value)}
                  >
                    <option value="₹">₹ INR (Rupee)</option>
                    <option value="$">$ USD (Dollar)</option>
                    <option value="€">€ EUR (Euro)</option>
                    <option value="£">£ GBP (Pound)</option>
                  </select>
                </div>
              </div>

              {/* Parties */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-1 text-primary">From (Company)</h3>
                  <Input placeholder="Company Name" value={companyName} onChange={e => setCompanyName(e.target.value)} />
                  <Input placeholder="Email" value={companyEmail} onChange={e => setCompanyEmail(e.target.value)} />
                  <textarea
                    placeholder="Company Address"
                    rows={2}
                    className="w-full rounded-md border px-3 py-2 text-sm bg-background"
                    value={companyAddress}
                    onChange={e => setCompanyAddress(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-1 text-amber-500">To (Customer)</h3>
                  <Input placeholder="Customer Name" value={customerName} onChange={e => setCustomerName(e.target.value)} />
                  <Input placeholder="Email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} />
                  <textarea
                    placeholder="Customer Address"
                    rows={2}
                    className="w-full rounded-md border px-3 py-2 text-sm bg-background"
                    value={customerAddress}
                    onChange={e => setCustomerAddress(e.target.value)}
                  />
                </div>
              </div>

              {/* Validity Dates */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Quote Date</Label>
                  <Input type="date" value={quoteDate} onChange={e => setQuoteDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Valid Until</Label>
                  <Input type="date" value={validUntil} onChange={e => setValidUntil(e.target.value)} />
                </div>
              </div>

              {/* Items */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold border-b pb-1">Items & Services</h3>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-2 items-center flex-wrap sm:flex-nowrap">
                      <div className="flex-[3] min-w-[200px]">
                        <Input
                          placeholder="Description"
                          value={item.description}
                          onChange={e => handleItemChange(item.id, "description", e.target.value)}
                        />
                      </div>
                      <div className="flex-1 min-w-[70px]">
                        <Input
                          type="number"
                          placeholder="Qty"
                          value={item.quantity === 0 ? "" : item.quantity}
                          onChange={e => handleItemChange(item.id, "quantity", e.target.value)}
                        />
                      </div>
                      <div className="flex-[1.5] min-w-[100px]">
                        <Input
                          type="number"
                          placeholder="Rate"
                          value={item.rate === 0 ? "" : item.rate}
                          onChange={e => handleItemChange(item.id, "rate", e.target.value)}
                        />
                      </div>
                      <div className="w-20 text-right font-mono text-sm pr-2">
                        {currency}{(item.quantity * item.rate).toLocaleString()}
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full text-xs h-8" onClick={handleAddItem}>
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add Line Item
                </Button>
              </div>

              {/* Terms and conditions */}
              <div className="space-y-2">
                <Label>Terms & Conditions</Label>
                <textarea
                  rows={2}
                  className="w-full rounded-md border px-3 py-2 text-sm bg-background focus:outline-none"
                  value={terms}
                  onChange={e => setTerms(e.target.value)}
                />
              </div>

              {/* Taxes and discount */}
              <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t">
                <div className="space-y-2">
                  <Label>Discount Percentage (%)</Label>
                  <Input
                    type="number"
                    value={discountPercent === 0 ? "" : discountPercent}
                    onChange={e => setDiscountPercent(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>GST / Tax Percentage (%)</Label>
                  <Input
                    type="number"
                    value={taxPercent === 0 ? "" : taxPercent}
                    onChange={e => setTaxPercent(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>

              <Button size="lg" className="w-full" onClick={() => window.print()}>
                <Printer className="h-4 w-4 mr-2" /> Print / Save as PDF
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 2. Visual Live Preview */}
        <div className="lg:col-span-5 hidden lg:block">
          <div className="sticky top-28 border rounded-2xl bg-white text-zinc-900 shadow-xl p-8 min-h-[640px] flex flex-col font-sans justify-between text-[10px]">
            <div className="space-y-4">
              <div className="flex justify-between items-start border-b pb-4">
                <div>
                  <h1 className="text-sm font-bold tracking-tight text-zinc-800">{companyName}</h1>
                  <p className="text-[10px] text-zinc-500 whitespace-pre-line mt-1">{companyAddress}</p>
                  <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{companyEmail}</p>
                </div>
                <div className="text-right">
                  <h2 className="text-sm font-black uppercase text-zinc-400 tracking-wider">QUOTATION</h2>
                  <p className="text-xs font-bold mt-2 text-zinc-800">{quoteNumber}</p>
                  <p className="text-[9px] text-zinc-500 mt-1">Date: {quoteDate}</p>
                  <p className="text-[9px] text-red-500 font-semibold mt-0.5">Valid Until: {validUntil}</p>
                </div>
              </div>

              <div className="py-4 border-b">
                <h3 className="text-[9px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">Prepared For</h3>
                <h4 className="text-xs font-bold text-zinc-800">{customerName}</h4>
                <p className="text-[10px] text-zinc-500 whitespace-pre-line mt-0.5">{customerAddress}</p>
                <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{customerEmail}</p>
              </div>

              <div className="py-2">
                <table className="w-full text-[10px]">
                  <thead>
                    <tr className="border-b bg-zinc-50 text-zinc-500 font-semibold text-left">
                      <th className="py-2 pl-2">Description</th>
                      <th className="py-2 text-center w-12">Qty</th>
                      <th className="py-2 text-right w-20">Rate</th>
                      <th className="py-2 text-right w-24 pr-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-b text-zinc-700">
                        <td className="py-2.5 pl-2 font-medium text-zinc-800 leading-normal">{item.description}</td>
                        <td className="py-2 text-center">{item.quantity}</td>
                        <td className="py-2 text-right font-mono">{currency}{item.rate.toLocaleString()}</td>
                        <td className="py-2 text-right font-bold text-zinc-800 font-mono pr-2">
                          {currency}{(item.quantity * item.rate).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Calculations and signoff */}
            <div className="border-t pt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-[9px] text-zinc-500">
                <div>
                  <h4 className="font-semibold text-zinc-400 mb-1">Terms & Conditions</h4>
                  <p className="whitespace-pre-line leading-relaxed font-mono">{terms}</p>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-zinc-500">
                    <span>Subtotal</span>
                    <span className="font-mono">{currency}{subtotal.toLocaleString()}</span>
                  </div>
                  {discountPercent > 0 && (
                    <div className="flex justify-between text-zinc-500">
                      <span>Discount ({discountPercent}%)</span>
                      <span className="font-mono">-{currency}{discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  {taxPercent > 0 && (
                    <div className="flex justify-between text-zinc-500">
                      <span>Tax / GST ({taxPercent}%)</span>
                      <span className="font-mono">{currency}{taxAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs font-bold text-zinc-800 pt-1.5 border-t">
                    <span>Estimated Total</span>
                    <span className="font-mono text-zinc-950 text-sm">{currency}{finalTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Printing Layout */}
      <div className="print-only text-zinc-900 bg-white min-h-screen p-12 flex flex-col font-sans justify-between text-xs" style={{ display: "none" }}>
        <div className="space-y-6">
          <div className="flex justify-between items-start border-b pb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{companyName}</h1>
              <p className="text-xs text-zinc-500 whitespace-pre-line mt-1">{companyAddress}</p>
              <p className="text-xs text-zinc-500 font-mono">{companyEmail}</p>
            </div>
            <div className="text-right">
              <h2 className="text-3xl font-black uppercase text-zinc-300 tracking-wider">ESTIMATE QUOTE</h2>
              <p className="text-lg font-bold mt-2">{quoteNumber}</p>
              <p className="text-[10px] text-zinc-500 mt-1">Date: {quoteDate}</p>
              <p className="text-[10px] text-red-500 font-semibold mt-0.5">Valid Until: {validUntil}</p>
            </div>
          </div>

          <div className="py-6 border-b">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Prepared For</h3>
            <h4 className="text-sm font-bold text-zinc-800">{customerName}</h4>
            <p className="text-xs text-zinc-500 whitespace-pre-line mt-1">{customerAddress}</p>
            <p className="text-xs text-zinc-500 font-mono">{customerEmail}</p>
          </div>

          <div className="py-8">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b bg-zinc-50 text-zinc-500 font-semibold">
                  <th className="py-2 text-left pl-2">Description</th>
                  <th className="py-2 text-center w-12">Qty</th>
                  <th className="py-2 text-right w-20">Rate</th>
                  <th className="py-2 text-right w-24 pr-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b text-zinc-700">
                    <td className="py-3 pl-2 font-medium text-zinc-800 leading-normal">{item.description}</td>
                    <td className="py-3 text-center">{item.quantity}</td>
                    <td className="py-3 text-right font-mono">{currency}{item.rate.toLocaleString()}</td>
                    <td className="py-3 text-right font-bold text-zinc-800 font-mono pr-2">
                      {currency}{(item.quantity * item.rate).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="border-t pt-6 grid grid-cols-2 gap-6 text-[10px] text-zinc-500">
          <div>
            <h4 className="font-semibold text-zinc-400 mb-1">Terms & Conditions</h4>
            <p className="text-zinc-500 whitespace-pre-line leading-relaxed">{terms}</p>
          </div>
          <div className="space-y-1.5 text-xs max-w-xs ml-auto w-full">
            <div className="flex justify-between text-zinc-500">
              <span>Subtotal</span>
              <span className="font-mono">{currency}{subtotal.toLocaleString()}</span>
            </div>
            {discountPercent > 0 && (
              <div className="flex justify-between text-zinc-500">
                <span>Discount ({discountPercent}%)</span>
                <span className="font-mono">-{currency}{discountAmount.toLocaleString()}</span>
              </div>
            )}
            {taxPercent > 0 && (
              <div className="flex justify-between text-zinc-500">
                <span>Tax / GST ({taxPercent}%)</span>
                <span className="font-mono">{currency}{taxAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-zinc-800 pt-2 border-t">
              <span>Estimated Total</span>
              <span className="font-mono text-zinc-950 text-base">{currency}{finalTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
