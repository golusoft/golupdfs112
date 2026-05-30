"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Printer, RefreshCw, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface GstInvoiceItem {
  id: string;
  description: string;
  hsn: string;
  quantity: number;
  rate: number;
  gstRate: number; // custom per line item
}

export function GstInvoiceGenerator() {
  const [companyName, setCompanyName] = useState("Raj Traders");
  const [companyGstin, setCompanyGstin] = useState("29ABCDE1234F1Z5");
  const [companyAddress, setCompanyAddress] = useState("10, Commercial Street, Bangalore, KA");
  
  const [clientName, setClientName] = useState("Karan Logistics");
  const [clientGstin, setClientGstin] = useState("27FGHJK5678A2Z0");
  const [clientAddress, setClientAddress] = useState("Sector 15, Industrial Hub, Pune, MH");

  const [invoiceNumber, setInvoiceNumber] = useState("TAX-2026-104");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [stateOfSupply, setStateOfSupply] = useState<"intra" | "inter">("inter"); // Pune to Bangalore is Maharashtra to Karnataka (inter-state!)
  const [currency, setCurrency] = useState("₹");
  const [paymentDetails, setPaymentDetails] = useState("Bank: HDFC Bank Ltd\nAccount: 50200012345678\nIFSC: HDFC0000123\nUPI ID: rajtraders@hdfcbank");

  const [items, setItems] = useState<GstInvoiceItem[]>([
    { id: "1", description: "Stainless Steel Bolts", hsn: "7318", quantity: 500, rate: 12, gstRate: 18 },
    { id: "2", description: "Industrial Grade Nuts", hsn: "7318", quantity: 500, rate: 8, gstRate: 18 }
  ]);

  useEffect(() => {
    setInvoiceDate(new Date().toISOString().split("T")[0]);
  }, []);

  const handleAddItem = () => {
    const newItem: GstInvoiceItem = {
      id: Date.now().toString(),
      description: "GST Taxable Item / Service Description",
      hsn: "9983", // standard software/consulting SAC code
      quantity: 1,
      rate: 1000,
      gstRate: 18
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) {
      toast.error("Tax invoice must have at least one line item.");
      return;
    }
    setItems(items.filter(i => i.id !== id));
  };

  const handleItemChange = (id: string, field: keyof GstInvoiceItem, val: any) => {
    setItems(items.map(i => {
      if (i.id === id) {
        let parsed = val;
        if (field === "quantity" || field === "rate" || field === "gstRate") {
          parsed = parseFloat(val) || 0;
        }
        return { ...i, [field]: parsed };
      }
      return i;
    }));
  };

  const handleReset = () => {
    setCompanyName("Raj Traders");
    setCompanyGstin("29ABCDE1234F1Z5");
    setCompanyAddress("10, Commercial Street, Bangalore, KA");
    setClientName("Karan Logistics");
    setClientGstin("27FGHJK5678A2Z0");
    setClientAddress("Sector 15, Industrial Hub, Pune, MH");
    setInvoiceNumber("TAX-2026-104");
    setStateOfSupply("inter");
    setPaymentDetails("Bank: HDFC Bank Ltd\nAccount: 50200012345678\nIFSC: HDFC0000123\nUPI ID: rajtraders@hdfcbank");
    setItems([
      { id: "1", description: "Stainless Steel Bolts", hsn: "7318", quantity: 500, rate: 12, gstRate: 18 },
      { id: "2", description: "Industrial Grade Nuts", hsn: "7318", quantity: 500, rate: 8, gstRate: 18 }
    ]);
    toast.info("GST Tax Invoice fields reset.");
  };

  // Calculations
  const subtotal = items.reduce((s, i) => s + (i.quantity * i.rate), 0);
  const totalGst = items.reduce((s, i) => s + ((i.quantity * i.rate) * (i.gstRate / 100)), 0);
  const finalTotal = subtotal + totalGst;

  // Split CGST/SGST/IGST based on supply type
  const cgst = stateOfSupply === "intra" ? totalGst / 2 : 0;
  const sgst = stateOfSupply === "intra" ? totalGst / 2 : 0;
  const igst = stateOfSupply === "inter" ? totalGst : 0;

  return (
    <>
      {/* SaaS Executive Metrics Grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6 no-print">
        <div className="p-4 rounded-2xl border bg-card/30 backdrop-blur-md space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Taxable Subtotal</span>
          <p className="text-lg font-black font-mono text-foreground">
            {currency}{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="p-4 rounded-2xl border bg-card/30 backdrop-blur-md space-y-1">
          <span className="text-[10px] uppercase font-bold text-amber-500 tracking-wider">CGST (Central Tax)</span>
          <p className="text-lg font-black font-mono text-amber-400">
            {currency}{cgst.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="p-4 rounded-2xl border bg-card/30 backdrop-blur-md space-y-1">
          <span className="text-[10px] uppercase font-bold text-indigo-500 tracking-wider">SGST / IGST Tax</span>
          <p className="text-lg font-black font-mono text-indigo-400">
            {currency}{(sgst + igst).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="p-4 rounded-2xl border bg-card/30 backdrop-blur-md space-y-1 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <span className="text-[10px] uppercase font-bold text-primary tracking-wider">Grand Total (Incl. GST)</span>
          <p className="text-lg font-black font-mono text-primary">
            {currency}{finalTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 no-print">
        {/* 1. Editor */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-border/60 bg-card/40 backdrop-blur-md">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" /> Tax Invoice Builder
                </h2>
                <Button size="sm" variant="outline" onClick={handleReset}>
                  <RefreshCw className="h-3.5 w-3.5 mr-1" /> Reset
                </Button>
              </div>

              {/* General invoice metadata */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Tax Invoice Number</Label>
                  <Input value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Invoice Issue Date</Label>
                  <Input type="date" value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>State of Supply</Label>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none"
                    value={stateOfSupply}
                    onChange={e => setStateOfSupply(e.target.value as any)}
                  >
                    <option value="intra">Intra-State (CGST + SGST)</option>
                    <option value="inter">Inter-State (IGST)</option>
                  </select>
                </div>
              </div>

              {/* Parties with GSTIN */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-1 text-primary">From (Supplier)</h3>
                  <Input placeholder="Supplier Legal Name" value={companyName} onChange={e => setCompanyName(e.target.value)} />
                  <Input placeholder="Supplier GSTIN (15 chars)" maxLength={15} className="font-mono text-xs uppercase" value={companyGstin} onChange={e => setCompanyGstin(e.target.value.toUpperCase())} />
                  <textarea
                    placeholder="Supplier address"
                    rows={2}
                    className="w-full rounded-md border px-3 py-2 text-sm bg-background"
                    value={companyAddress}
                    onChange={e => setCompanyAddress(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-1 text-amber-500">To (Recipient)</h3>
                  <Input placeholder="Recipient Legal Name" value={clientName} onChange={e => setClientName(e.target.value)} />
                  <Input placeholder="Recipient GSTIN" maxLength={15} className="font-mono text-xs uppercase" value={clientGstin} onChange={e => setClientGstin(e.target.value.toUpperCase())} />
                  <textarea
                    placeholder="Recipient address"
                    rows={2}
                    className="w-full rounded-md border px-3 py-2 text-sm bg-background"
                    value={clientAddress}
                    onChange={e => setClientAddress(e.target.value)}
                  />
                </div>
              </div>

              {/* GST Items table with HSN codes */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold border-b pb-1">Taxable Items & HSN Codes</h3>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-2 items-center flex-wrap sm:flex-nowrap border-b pb-2 sm:border-0 sm:pb-0">
                      <div className="flex-[2] min-w-[150px]">
                        <Input
                          placeholder="Item details"
                          value={item.description}
                          onChange={e => handleItemChange(item.id, "description", e.target.value)}
                        />
                      </div>
                      <div className="w-20 shrink-0">
                        <Input
                          placeholder="HSN/SAC"
                          value={item.hsn}
                          onChange={e => handleItemChange(item.id, "hsn", e.target.value)}
                        />
                      </div>
                      <div className="w-16 shrink-0">
                        <Input
                          type="number"
                          placeholder="Qty"
                          value={item.quantity === 0 ? "" : item.quantity}
                          onChange={e => handleItemChange(item.id, "quantity", e.target.value)}
                        />
                      </div>
                      <div className="w-24 shrink-0">
                        <Input
                          type="number"
                          placeholder="Rate"
                          value={item.rate === 0 ? "" : item.rate}
                          onChange={e => handleItemChange(item.id, "rate", e.target.value)}
                        />
                      </div>
                      <div className="w-20 shrink-0">
                        <select
                          className="flex h-9 w-full rounded-md border border-input bg-background px-1 py-1 text-xs focus-visible:outline-none"
                          value={item.gstRate}
                          onChange={e => handleItemChange(item.id, "gstRate", e.target.value)}
                        >
                          <option value={5}>5%</option>
                          <option value={12}>12%</option>
                          <option value={18}>18%</option>
                          <option value={28}>28%</option>
                        </select>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full text-xs h-8" onClick={handleAddItem}>
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add GST Item
                </Button>
              </div>

              {/* Payment Details */}
              <div className="space-y-2">
                <Label>Payment Coordinates (Bank/UPI)</Label>
                <textarea
                  rows={2}
                  className="w-full rounded-md border px-3 py-2 text-sm bg-background"
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

        {/* 2. Live preview */}
        <div className="lg:col-span-5 hidden lg:block">
          <div className="sticky top-28 border rounded-2xl bg-white text-zinc-900 shadow-xl p-8 min-h-[640px] flex flex-col font-sans text-xs justify-between">
            <div className="space-y-6">
              {/* header */}
              <div className="flex justify-between items-start border-b pb-4">
                <div>
                  <h2 className="text-sm font-black uppercase text-zinc-400 tracking-wider">TAX INVOICE</h2>
                  <h1 className="text-base font-bold text-zinc-800 mt-2">{companyName}</h1>
                  <p className="text-[10px] text-zinc-400 font-mono font-semibold">GSTIN: {companyGstin}</p>
                  <p className="text-[10px] text-zinc-500 whitespace-pre-line mt-1">{companyAddress}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-xs font-bold text-zinc-800">Invoice: {invoiceNumber}</p>
                  <p className="text-[10px] text-zinc-500 font-mono">Date: {invoiceDate}</p>
                  <p className="text-[10px] text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded inline-block font-mono">
                    {stateOfSupply === "intra" ? "Intra-State Supply" : "Inter-State Supply"}
                  </p>
                </div>
              </div>

              {/* recipient */}
              <div className="py-4 border-b">
                <h3 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">Details of Recipient</h3>
                <h4 className="text-xs font-bold text-zinc-800">{clientName}</h4>
                <p className="text-[10px] text-zinc-400 font-mono font-semibold">GSTIN: {clientGstin}</p>
                <p className="text-[10px] text-zinc-500 whitespace-pre-line mt-0.5">{clientAddress}</p>
              </div>

              {/* table */}
              <div className="py-4">
                <table className="w-full text-[10px]">
                  <thead>
                    <tr className="border-b text-zinc-500 font-semibold bg-zinc-50">
                      <th className="py-2 text-left pl-2">Description</th>
                      <th className="py-2 text-center">HSN</th>
                      <th className="py-2 text-center w-8">Qty</th>
                      <th className="py-2 text-right">Rate</th>
                      <th className="py-2 text-center">GST</th>
                      <th className="py-2 text-right pr-2">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-b text-zinc-700">
                        <td className="py-2.5 pl-2 font-medium text-zinc-800 leading-normal">{item.description}</td>
                        <td className="py-2.5 text-center font-mono text-[9px]">{item.hsn}</td>
                        <td className="py-2.5 text-center">{item.quantity}</td>
                        <td className="py-2.5 text-right font-mono">{currency}{item.rate.toLocaleString()}</td>
                        <td className="py-2.5 text-center font-mono">{item.gstRate}%</td>
                        <td className="py-2.5 text-right font-bold text-zinc-800 font-mono pr-2">
                          {currency}{(item.quantity * item.rate).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Calculations & payment */}
            <div className="border-t pt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-[9px] text-zinc-500">
                <div>
                  <h4 className="font-semibold text-zinc-400 uppercase mb-1">Payment Instructions</h4>
                  <p className="whitespace-pre-line leading-relaxed font-mono">{paymentDetails}</p>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-zinc-500">
                    <span>Taxable Value</span>
                    <span className="font-mono">{currency}{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                  {cgst > 0 && (
                    <div className="flex justify-between text-zinc-500">
                      <span>Central Tax (CGST)</span>
                      <span className="font-mono">{currency}{cgst.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}
                  {sgst > 0 && (
                    <div className="flex justify-between text-zinc-500">
                      <span>State Tax (SGST)</span>
                      <span className="font-mono">{currency}{sgst.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}
                  {igst > 0 && (
                    <div className="flex justify-between text-zinc-500">
                      <span>Integrated Tax (IGST)</span>
                      <span className="font-mono">{currency}{igst.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs font-bold text-zinc-800 pt-1.5 border-t">
                    <span>Grand Total</span>
                    <span className="font-mono text-zinc-950 text-sm">{currency}{finalTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Printed output */}
      <div className="print-only text-zinc-900 bg-white min-h-screen p-12 flex flex-col font-sans text-xs justify-between" style={{ display: "none" }}>
        <div className="space-y-6">
          <div className="flex justify-between items-start border-b pb-4">
            <div>
              <h2 className="text-sm font-black uppercase text-zinc-400 tracking-wider">TAX INVOICE</h2>
              <h1 className="text-lg font-bold text-zinc-800 mt-2">{companyName}</h1>
              <p className="text-[10px] text-zinc-400 font-mono font-semibold">GSTIN: {companyGstin}</p>
              <p className="text-[10px] text-zinc-500 whitespace-pre-line mt-1">{companyAddress}</p>
            </div>
            <div className="text-right space-y-1">
              <p className="text-xs font-bold text-zinc-800">Invoice: {invoiceNumber}</p>
              <p className="text-[10px] text-zinc-500 font-mono">Date: {invoiceDate}</p>
              <p className="text-[10px] text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded inline-block font-mono">
                {stateOfSupply === "intra" ? "Intra-State Supply (CGST+SGST)" : "Inter-State Supply (IGST)"}
              </p>
            </div>
          </div>

          <div className="py-4 border-b">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Details of Recipient</h3>
            <h4 className="text-sm font-bold text-zinc-800">{clientName}</h4>
            <p className="text-[10px] text-zinc-400 font-mono font-semibold">GSTIN: {clientGstin}</p>
            <p className="text-[10px] text-zinc-500 whitespace-pre-line mt-1">{clientAddress}</p>
          </div>

          <div className="py-6">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b text-zinc-500 font-semibold bg-zinc-50">
                  <th className="py-2 text-left pl-2">Description</th>
                  <th className="py-2 text-center">HSN</th>
                  <th className="py-2 text-center w-12">Qty</th>
                  <th className="py-2 text-right">Rate</th>
                  <th className="py-2 text-center">GST %</th>
                  <th className="py-2 text-right pr-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b text-zinc-700">
                    <td className="py-3 pl-2 font-medium text-zinc-800 leading-normal">{item.description}</td>
                    <td className="py-3 text-center font-mono text-[9px]">{item.hsn}</td>
                    <td className="py-3 text-center">{item.quantity}</td>
                    <td className="py-3 text-right font-mono">{currency}{item.rate.toLocaleString()}</td>
                    <td className="py-3 text-center font-mono">{item.gstRate}%</td>
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
            <h4 className="font-semibold text-zinc-400 uppercase mb-1">Payment Instructions</h4>
            <p className="whitespace-pre-line leading-relaxed font-mono">{paymentDetails}</p>
          </div>
          <div className="space-y-1.5 text-xs max-w-xs ml-auto w-full">
            <div className="flex justify-between text-zinc-500">
              <span>Subtotal (Taxable Value)</span>
              <span className="font-mono">{currency}{subtotal.toLocaleString()}</span>
            </div>
            {cgst > 0 && (
              <div className="flex justify-between text-zinc-500">
                <span>Central Tax (CGST)</span>
                <span className="font-mono">{currency}{cgst.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            {sgst > 0 && (
              <div className="flex justify-between text-zinc-500">
                <span>State Tax (SGST)</span>
                <span className="font-mono">{currency}{sgst.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            {igst > 0 && (
              <div className="flex justify-between text-zinc-800 font-semibold">
                <span>Integrated Tax (IGST)</span>
                <span className="font-mono">{currency}{igst.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-zinc-800 pt-2 border-t">
              <span>Grand Total</span>
              <span className="font-mono text-zinc-950 text-base">{currency}{finalTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
