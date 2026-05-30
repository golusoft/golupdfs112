"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Printer, Save, RefreshCw, FileText, Upload, CheckCircle, ShieldAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export function InvoiceGenerator() {
  const [logo, setLogo] = useState<string>("");
  const [companyName, setCompanyName] = useState("Acme Global Services");
  const [companyEmail, setCompanyEmail] = useState("finance@acmeglobal.com");
  const [companyAddress, setCompanyAddress] = useState("100 Innovation Way, Suite 500\nNew York, NY 10001");
  const [companyGstin, setCompanyGstin] = useState("");
  
  const [clientName, setClientName] = useState("Linear Operations");
  const [clientEmail, setClientEmail] = useState("accounts@linear.app");
  const [clientAddress, setClientAddress] = useState("456 Terminal Rd, Floor 3\nSan Francisco, CA 94107");
  const [clientGstin, setClientGstin] = useState("");

  const [invoiceNumber, setInvoiceNumber] = useState("INV-2026-0092");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [currency, setCurrency] = useState("$");
  const [discountPercent, setDiscountPercent] = useState(10);
  const [taxPercent, setTaxPercent] = useState(18); // Default GST slab
  const [paymentDetails, setPaymentDetails] = useState("Bank Name: Silicon Valley Bank\nAccount: 1234-5678-9012\nIFSC: SVB0000888\nUPI VPA: acme@upi");

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: "1", description: "API Integration Consulting", quantity: 8, rate: 150 },
    { id: "2", description: "Enterprise Cloud Infrastructure Implementation", quantity: 1, rate: 4500 }
  ]);

  // Set default dates safely on client-side to prevent hydration mismatch
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const due = new Date();
    due.setDate(due.getDate() + 14);
    const dueStr = due.toISOString().split("T")[0];
    setInvoiceDate(today);
    setDueDate(dueStr);

    // Load from LocalStorage if draft exists
    try {
      const saved = localStorage.getItem("golu_invoice_draft");
      if (saved) {
        const draft = JSON.parse(saved);
        setCompanyName(draft.companyName || "");
        setCompanyEmail(draft.companyEmail || "");
        setCompanyAddress(draft.companyAddress || "");
        setCompanyGstin(draft.companyGstin || "");
        setClientName(draft.clientName || "");
        setClientEmail(draft.clientEmail || "");
        setClientAddress(draft.clientAddress || "");
        setClientGstin(draft.clientGstin || "");
        setInvoiceNumber(draft.invoiceNumber || "");
        setCurrency(draft.currency || "$");
        setDiscountPercent(draft.discountPercent || 0);
        setTaxPercent(draft.taxPercent || 18);
        setPaymentDetails(draft.paymentDetails || "");
        setItems(draft.items || []);
        if (draft.logo) setLogo(draft.logo);
      }
    } catch {}
  }, []);

  const handleSaveDraft = () => {
    try {
      const payload = {
        companyName, companyEmail, companyAddress, companyGstin,
        clientName, clientEmail, clientAddress, clientGstin,
        invoiceNumber, currency, discountPercent, taxPercent, paymentDetails, items, logo
      };
      localStorage.setItem("golu_invoice_draft", JSON.stringify(payload));
      toast.success("Draft saved successfully!", { description: "Autoloads on your next visit." });
    } catch {
      toast.error("Failed to save draft locally.");
    }
  };

  const handleReset = () => {
    localStorage.removeItem("golu_invoice_draft");
    setCompanyName("Acme Global Services");
    setCompanyEmail("finance@acmeglobal.com");
    setCompanyAddress("100 Innovation Way, Suite 500\nNew York, NY 10001");
    setCompanyGstin("");
    setClientName("Linear Operations");
    setClientEmail("accounts@linear.app");
    setClientAddress("456 Terminal Rd, Floor 3\nSan Francisco, CA 94107");
    setClientGstin("");
    setInvoiceNumber("INV-2026-0092");
    setCurrency("$");
    setDiscountPercent(10);
    setTaxPercent(18);
    setLogo("");
    setPaymentDetails("Bank Name: Silicon Valley Bank\nAccount: 1234-5678-9012\nIFSC: SVB0000888\nUPI VPA: acme@upi");
    setItems([
      { id: "1", description: "API Integration Consulting", quantity: 8, rate: 150 },
      { id: "2", description: "Enterprise Cloud Infrastructure Implementation", quantity: 1, rate: 4500 }
    ]);
    toast.info("Invoice state reset to default.");
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 800000) {
        toast.error("Image too large. Please upload a logo smaller than 800 KB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) setLogo(uploadEvent.target.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: "Custom Service / Deliverable Description",
      quantity: 1,
      rate: 1000
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) {
      toast.error("An invoice must contain at least one line item.");
      return;
    }
    setItems(items.filter(i => i.id !== id));
  };

  const handleItemChange = (id: string, field: keyof InvoiceItem, val: any) => {
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

  // Automated Calculations
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
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Subtotal</span>
          <p className="text-lg font-black font-mono text-foreground">
            {currency}{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="p-4 rounded-2xl border bg-card/30 backdrop-blur-md space-y-1">
          <span className="text-[10px] uppercase font-bold text-emerald-500 tracking-wider">Discount Savings</span>
          <p className="text-lg font-black font-mono text-emerald-400">
            {currency}{discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="p-4 rounded-2xl border bg-card/30 backdrop-blur-md space-y-1">
          <span className="text-[10px] uppercase font-bold text-amber-500 tracking-wider">Taxes / GST</span>
          <p className="text-lg font-black font-mono text-amber-400">
            {currency}{taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="p-4 rounded-2xl border bg-card/30 backdrop-blur-md space-y-1 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <span className="text-[10px] uppercase font-bold text-primary tracking-wider">Gross Invoice Value</span>
          <p className="text-lg font-black font-mono text-primary">
            {currency}{finalTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 no-print">
        {/* 1. BUILDER PANEL (Left 7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-border/60 bg-card/40 backdrop-blur-md">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" /> Invoice Configurator
                </h2>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={handleReset}>
                    <RefreshCw className="h-3.5 w-3.5 mr-1" /> Reset
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleSaveDraft}>
                    <Save className="h-3.5 w-3.5 mr-1" /> Save Draft
                  </Button>
                </div>
              </div>

              {/* Header: Logo & Serial */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Company Logo</Label>
                  <div className="flex items-center gap-3">
                    {logo && <img src={logo} alt="Company Logo" className="h-10 w-10 object-contain rounded border" />}
                    <div className="relative flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        id="invoice-logo"
                        className="hidden"
                        onChange={handleLogoUpload}
                      />
                      <Button
                        variant="outline"
                        className="w-full text-xs h-9 cursor-pointer"
                        onClick={() => document.getElementById("invoice-logo")?.click()}
                      >
                        <Upload className="h-3.5 w-3.5 mr-1.5" /> Upload Image
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inv-num">Invoice Reference ID</Label>
                  <Input
                    id="inv-num"
                    value={invoiceNumber}
                    onChange={e => setInvoiceNumber(e.target.value)}
                  />
                </div>
              </div>

              {/* Billing addresses */}
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Seller */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-1 text-primary">From (Seller)</h3>
                  <div className="space-y-2">
                    <Input placeholder="Company Name" value={companyName} onChange={e => setCompanyName(e.target.value)} />
                    <Input placeholder="Billing Email" value={companyEmail} onChange={e => setCompanyEmail(e.target.value)} />
                    <textarea
                      placeholder="Seller Corporate Address"
                      rows={3}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus:ring-1 focus:ring-primary"
                      value={companyAddress}
                      onChange={e => setCompanyAddress(e.target.value)}
                    />
                    <Input placeholder="Seller GSTIN (Optional)" value={companyGstin} onChange={e => setCompanyGstin(e.target.value)} />
                  </div>
                </div>

                {/* Buyer */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-1 text-amber-500">To (Client)</h3>
                  <div className="space-y-2">
                    <Input placeholder="Client Business Name" value={clientName} onChange={e => setClientName(e.target.value)} />
                    <Input placeholder="Client Email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} />
                    <textarea
                      placeholder="Client Billing Address"
                      rows={3}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus:ring-1 focus:ring-primary"
                      value={clientAddress}
                      onChange={e => setClientAddress(e.target.value)}
                    />
                    <Input placeholder="Client GSTIN (Optional)" value={clientGstin} onChange={e => setClientGstin(e.target.value)} />
                  </div>
                </div>
              </div>

              {/* Dates & Currency */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="date-inv">Invoice Issue Date</Label>
                  <Input id="date-inv" type="date" value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date-due">Payment Due Date</Label>
                  <Input id="date-due" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency Segment</Label>
                  <select
                    id="currency"
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none"
                    value={currency}
                    onChange={e => setCurrency(e.target.value)}
                  >
                    <option value="$">$ USD (Dollar)</option>
                    <option value="₹">₹ INR (Rupee)</option>
                    <option value="€">€ EUR (Euro)</option>
                    <option value="£">£ GBP (Pound)</option>
                    <option value="AED">AED (Dirham)</option>
                  </select>
                </div>
              </div>

              {/* Line items table */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold border-b pb-1">Billing Line Items</h3>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-2 items-center flex-wrap sm:flex-nowrap">
                      <div className="flex-[3] min-w-[200px]">
                        <Input
                          placeholder="Deliverable description..."
                          value={item.description}
                          onChange={e => handleItemChange(item.id, "description", e.target.value)}
                        />
                      </div>
                      <div className="w-16">
                        <Input
                          type="number"
                          placeholder="Qty"
                          value={item.quantity === 0 ? "" : item.quantity}
                          onChange={e => handleItemChange(item.id, "quantity", e.target.value)}
                        />
                      </div>
                      <div className="w-24">
                        <Input
                          type="number"
                          placeholder="Rate"
                          value={item.rate === 0 ? "" : item.rate}
                          onChange={e => handleItemChange(item.id, "rate", e.target.value)}
                        />
                      </div>
                      <div className="w-20 text-right font-mono text-sm pr-2">
                        {currency}{(item.quantity * item.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive shrink-0"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full text-xs h-8" onClick={handleAddItem}>
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add Line Item
                </Button>
              </div>

              {/* Discounts, Taxes, Payment Instructions */}
              <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t">
                <div className="space-y-2">
                  <Label htmlFor="disc">Discount Percentage (%)</Label>
                  <Input
                    id="disc"
                    type="number"
                    min={0}
                    max={100}
                    value={discountPercent === 0 ? "" : discountPercent}
                    onChange={e => setDiscountPercent(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax">Standard Tax / GST Slab (%)</Label>
                  <select
                    id="tax"
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none"
                    value={taxPercent}
                    onChange={e => setTaxPercent(parseFloat(e.target.value) || 0)}
                  >
                    <option value={0}>0% Tax Exempt</option>
                    <option value={5}>5% GST</option>
                    <option value={12}>12% GST</option>
                    <option value={18}>18% GST (Standard Services)</option>
                    <option value={28}>28% GST</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Payment Details / Bank Coordinates</Label>
                <textarea
                  rows={3}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none"
                  value={paymentDetails}
                  onChange={e => setPaymentDetails(e.target.value)}
                />
              </div>

              <Button size="lg" className="w-full" onClick={() => window.print()}>
                <Printer className="h-4 w-4 mr-2" /> Print / Save as PDF
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 2. REAL-TIME PREVIEW PANEL (Right 5 cols) */}
        <div className="lg:col-span-5 hidden lg:block">
          <div className="sticky top-28 border rounded-2xl bg-white text-zinc-900 shadow-xl overflow-hidden min-h-[640px] flex flex-col p-8 font-sans justify-between">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-start border-b pb-6">
                <div>
                  {logo ? (
                    <img src={logo} alt="Logo" className="max-h-12 max-w-[120px] object-contain mb-3" />
                  ) : (
                    <div className="h-10 w-10 bg-zinc-100 rounded flex items-center justify-center font-bold text-zinc-400 text-xs mb-3">Logo</div>
                  )}
                  <h1 className="text-base font-bold text-zinc-800 tracking-tight">{companyName}</h1>
                  {companyGstin && <p className="text-[10px] text-zinc-400 font-mono mt-0.5">GSTIN: {companyGstin}</p>}
                  <p className="text-[10px] text-zinc-500 whitespace-pre-line mt-1">{companyAddress}</p>
                  <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{companyEmail}</p>
                </div>
                <div className="text-right">
                  <h2 className="text-xl font-black uppercase text-zinc-400 tracking-wider">INVOICE</h2>
                  <p className="text-xs font-bold text-zinc-800 mt-2">{invoiceNumber}</p>
                  <div className="mt-4 text-[10px] text-zinc-500 space-y-0.5">
                    <p>Date: <span className="font-semibold text-zinc-700">{invoiceDate}</span></p>
                    <p>Due Date: <span className="font-semibold text-zinc-700">{dueDate}</span></p>
                  </div>
                </div>
              </div>

              {/* Client Meta */}
              <div className="py-4 border-b">
                <h3 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">Billed To</h3>
                <h4 className="text-xs font-bold text-zinc-800">{clientName}</h4>
                {clientGstin && <p className="text-[9px] text-zinc-400 font-mono mt-0.5">GSTIN: {clientGstin}</p>}
                <p className="text-[10px] text-zinc-500 whitespace-pre-line mt-0.5">{clientAddress}</p>
                <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{clientEmail}</p>
              </div>

              {/* Table */}
              <div className="py-4">
                <table className="w-full text-[10px]">
                  <thead>
                    <tr className="border-b-2 pb-2 text-zinc-400 font-semibold text-left">
                      <th className="pb-2 w-[55%]">Description</th>
                      <th className="pb-2 text-center w-[10%]">Qty</th>
                      <th className="pb-2 text-right w-[15%]">Rate</th>
                      <th className="pb-2 text-right w-[20%]">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-b text-zinc-700">
                        <td className="py-2.5 font-medium text-zinc-800 leading-normal">{item.description}</td>
                        <td className="py-2.5 text-center">{item.quantity}</td>
                        <td className="py-2.5 text-right font-mono">{currency}{item.rate.toLocaleString()}</td>
                        <td className="py-2.5 text-right font-bold text-zinc-800 font-mono">
                          {currency}{(item.quantity * item.rate).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Calculations & payment details */}
            <div className="space-y-4 pt-4 border-t">
              <div className="grid grid-cols-2 gap-4 text-[9px] text-zinc-500">
                <div>
                  <h4 className="font-semibold text-zinc-400 uppercase mb-1">Payment Instructions</h4>
                  <p className="whitespace-pre-line leading-relaxed font-mono">{paymentDetails}</p>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-zinc-500">
                    <span>Subtotal</span>
                    <span className="font-mono">{currency}{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                  {discountPercent > 0 && (
                    <div className="flex justify-between text-zinc-500">
                      <span>Discount ({discountPercent}%)</span>
                      <span className="font-mono">-{currency}{discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}
                  {taxPercent > 0 && (
                    <div className="flex justify-between text-zinc-500">
                      <span>Tax / GST ({taxPercent}%)</span>
                      <span className="font-mono">{currency}{taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs font-bold text-zinc-800 pt-1.5 border-t">
                    <span>Balance Due</span>
                    <span className="font-mono text-zinc-950 text-sm">{currency}{finalTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. INVISIBLE COMPONENT STYLED STRICTLY FOR PRINTER MEDIA OUTLET */}
      <div className="print-only text-zinc-900 bg-white min-h-screen p-12 flex flex-col font-sans justify-between" style={{ display: "none" }}>
        <div className="space-y-6">
          <div className="flex justify-between items-start border-b pb-6">
            <div>
              {logo && <img src={logo} alt="Logo" className="max-h-14 max-w-[140px] object-contain mb-3" />}
              <h1 className="text-xl font-bold tracking-tight">{companyName}</h1>
              {companyGstin && <p className="text-[10px] text-zinc-400 font-mono">GSTIN: {companyGstin}</p>}
              <p className="text-xs text-zinc-500 whitespace-pre-line mt-1">{companyAddress}</p>
              <p className="text-xs text-zinc-500 font-mono">{companyEmail}</p>
            </div>
            <div className="text-right">
              <h2 className="text-3xl font-black uppercase text-zinc-300 tracking-wider">TAX INVOICE</h2>
              <p className="text-lg font-bold text-zinc-800 mt-2">{invoiceNumber}</p>
              <div className="mt-4 text-xs text-zinc-500 space-y-0.5">
                <p>Date: <span className="font-semibold text-zinc-700">{invoiceDate}</span></p>
                <p>Due Date: <span className="font-semibold text-zinc-700">{dueDate}</span></p>
              </div>
            </div>
          </div>

          <div className="py-6 border-b grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Billed To</h3>
              <h4 className="text-sm font-bold text-zinc-800">{clientName}</h4>
              {clientGstin && <p className="text-[10px] text-zinc-400 font-mono">GSTIN: {clientGstin}</p>}
              <p className="text-xs text-zinc-500 whitespace-pre-line mt-1">{clientAddress}</p>
              <p className="text-xs text-zinc-500 font-mono">{clientEmail}</p>
            </div>
          </div>

          <div className="py-8">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b-2 pb-2 text-zinc-400 font-semibold text-left">
                  <th className="pb-2 w-[55%]">Description</th>
                  <th className="pb-2 text-center w-[10%]">Qty</th>
                  <th className="pb-2 text-right w-[15%]">Rate</th>
                  <th className="pb-2 text-right w-[20%]">Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b text-zinc-700">
                    <td className="py-3 font-medium text-zinc-800 leading-normal">{item.description}</td>
                    <td className="py-3 text-center">{item.quantity}</td>
                    <td className="py-3 text-right font-mono">{currency}{item.rate.toLocaleString()}</td>
                    <td className="py-3 text-right font-bold text-zinc-800 font-mono">
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
            <h4 className="font-semibold text-zinc-400 uppercase mb-1">Payment Instructions</h4>
            <p className="whitespace-pre-line leading-relaxed font-mono">{paymentDetails}</p>
          </div>
          <div className="space-y-1.5 text-xs max-w-xs ml-auto w-full">
            <div className="flex justify-between text-zinc-500">
              <span>Subtotal</span>
              <span className="font-mono">{currency}{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            {discountPercent > 0 && (
              <div className="flex justify-between text-zinc-500">
                <span>Discount ({discountPercent}%)</span>
                <span className="font-mono">-{currency}{discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            {taxPercent > 0 && (
              <div className="flex justify-between text-zinc-500">
                <span>Tax / GST ({taxPercent}%)</span>
                <span className="font-mono">{currency}{taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-zinc-800 pt-2 border-t">
              <span>Total Balance Due</span>
              <span className="font-mono text-zinc-950 text-base">{currency}{finalTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
