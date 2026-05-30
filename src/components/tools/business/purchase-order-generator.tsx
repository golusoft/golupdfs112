"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Printer, RefreshCw, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface POItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  taxPercent: number;
}

export function PurchaseOrderGenerator() {
  const [buyerName, setBuyerName] = useState("Acme Corporation");
  const [buyerEmail, setBuyerEmail] = useState("procurement@acme.com");
  const [buyerPhone, setBuyerPhone] = useState("+1 (555) 123-4567");
  const [buyerAddress, setBuyerAddress] = useState("123 Corporate Blvd, Suite 400\nNew York, NY 10001");

  const [vendorName, setVendorName] = useState("Global Supplies Inc");
  const [vendorContact, setVendorContact] = useState("John Doe");
  const [vendorEmail, setVendorEmail] = useState("orders@globalsupplies.com");
  const [vendorPhone, setVendorPhone] = useState("+1 (555) 987-6543");
  const [vendorAddress, setVendorAddress] = useState("456 Logistics Way, Building B\nChicago, IL 60609");

  const [poNumber, setPoNumber] = useState("PO-2026-0089");
  const [poDate, setPoDate] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  
  const [shippingMethod, setShippingMethod] = useState("FedEx Ground");
  const [shippingTerms, setShippingTerms] = useState("FOB Destination");
  const [paymentTerms, setPaymentTerms] = useState("NET 30 Days");
  
  const [currency, setCurrency] = useState("$");
  const [shippingCost, setShippingCost] = useState(150); // SaaS addition
  const [instructions, setInstructions] = useState(
    "1. Please send two copies of the invoice.\n2. Enter this order in accordance with the prices, terms, and delivery dates specified.\n3. Notify us immediately if you are unable to ship as specified."
  );

  const [items, setItems] = useState<POItem[]>([
    { id: "1", description: "Premium Ergonomic Office Chairs", quantity: 10, rate: 250, taxPercent: 8 },
    { id: "2", description: "Mechanical Height-Adjustable Desks", quantity: 5, rate: 450, taxPercent: 8 }
  ]);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const delivery = new Date();
    delivery.setDate(delivery.getDate() + 14);
    setPoDate(today);
    setDeliveryDate(delivery.toISOString().split("T")[0]);
  }, []);

  const handleAddItem = () => {
    const newItem: POItem = {
      id: Date.now().toString(),
      description: "Enter product description or service name",
      quantity: 1,
      rate: 100,
      taxPercent: 8
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) {
      toast.error("A purchase order must contain at least one item.");
      return;
    }
    setItems(items.filter(i => i.id !== id));
  };

  const handleItemChange = (id: string, field: keyof POItem, val: any) => {
    setItems(items.map(i => {
      if (i.id === id) {
        let parsed = val;
        if (field === "quantity" || field === "rate" || field === "taxPercent") {
          parsed = parseFloat(val) || 0;
        }
        return { ...i, [field]: parsed };
      }
      return i;
    }));
  };

  const handleReset = () => {
    setBuyerName("Acme Corporation");
    setBuyerEmail("procurement@acme.com");
    setBuyerPhone("+1 (555) 123-4567");
    setBuyerAddress("123 Corporate Blvd, Suite 400\nNew York, NY 10001");
    setVendorName("Global Supplies Inc");
    setVendorContact("John Doe");
    setVendorEmail("orders@globalsupplies.com");
    setVendorPhone("+1 (555) 987-6543");
    setVendorAddress("456 Logistics Way, Building B\nChicago, IL 60609");
    setPoNumber("PO-2026-0089");
    setShippingMethod("FedEx Ground");
    setShippingTerms("FOB Destination");
    setPaymentTerms("NET 30 Days");
    setCurrency("$");
    setShippingCost(150);
    setInstructions(
      "1. Please send two copies of the invoice.\n2. Enter this order in accordance with the prices, terms, and delivery dates specified.\n3. Notify us immediately if you are unable to ship as specified."
    );
    setItems([
      { id: "1", description: "Premium Ergonomic Office Chairs", quantity: 10, rate: 250, taxPercent: 8 },
      { id: "2", description: "Mechanical Height-Adjustable Desks", quantity: 5, rate: 450, taxPercent: 8 }
    ]);
    toast.info("Purchase order fields reset.");
  };

  const subtotal = items.reduce((s, i) => s + (i.quantity * i.rate), 0);
  const totalTax = items.reduce((s, i) => s + (i.quantity * i.rate * (i.taxPercent / 100)), 0);
  const grandTotal = subtotal + totalTax + shippingCost;

  return (
    <>
      {/* SaaS Executive Dashboard Analytics cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6 no-print">
        <div className="p-4 rounded-2xl border bg-card/30 backdrop-blur-md space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Subtotal</span>
          <p className="text-lg font-black font-mono text-foreground">
            {currency}{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="p-4 rounded-2xl border bg-card/30 backdrop-blur-md space-y-1">
          <span className="text-[10px] uppercase font-bold text-amber-500 tracking-wider">Estimated Sales Tax</span>
          <p className="text-lg font-black font-mono text-amber-400">
            {currency}{totalTax.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="p-4 rounded-2xl border bg-card/30 backdrop-blur-md space-y-1">
          <span className="text-[10px] uppercase font-bold text-indigo-500 tracking-wider">Freight / Shipping</span>
          <p className="text-lg font-black font-mono text-indigo-400">
            {currency}{shippingCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="p-4 rounded-2xl border bg-card/30 backdrop-blur-md space-y-1 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <span className="text-[10px] uppercase font-bold text-primary tracking-wider">Grand Total Balance</span>
          <p className="text-lg font-black font-mono text-primary">
            {currency}{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
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
                  <FileText className="h-5 w-5 text-primary" /> Purchase Order Builder
                </h2>
                <Button size="sm" variant="outline" onClick={handleReset}>
                  <RefreshCw className="h-3.5 w-3.5 mr-1" /> Reset
                </Button>
              </div>

              {/* General Meta */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="po-num">PO Number</Label>
                  <Input id="po-num" value={poNumber} onChange={e => setPoNumber(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="po-curr">Currency</Label>
                  <select
                    id="po-curr"
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none"
                    value={currency}
                    onChange={e => setCurrency(e.target.value)}
                  >
                    <option value="$">$ USD (Dollar)</option>
                    <option value="₹">₹ INR (Rupee)</option>
                    <option value="€">€ EUR (Euro)</option>
                    <option value="£">£ GBP (Pound)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pay-terms">Payment Terms</Label>
                  <Input id="pay-terms" value={paymentTerms} onChange={e => setPaymentTerms(e.target.value)} />
                </div>
              </div>

              {/* Dates & Shipping */}
              <div className="grid gap-4 sm:grid-cols-4">
                <div className="space-y-2">
                  <Label>PO Date</Label>
                  <Input type="date" value={poDate} onChange={e => setPoDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Delivery Date</Label>
                  <Input type="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Shipping Method</Label>
                  <Input value={shippingMethod} onChange={e => setShippingMethod(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Shipping Terms</Label>
                  <Input value={shippingTerms} onChange={e => setShippingTerms(e.target.value)} />
                </div>
              </div>

              {/* Parties Info */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-1 text-primary">Buyer Company Details</h3>
                  <Input placeholder="Buyer Company Name" value={buyerName} onChange={e => setBuyerName(e.target.value)} />
                  <div className="grid gap-2 grid-cols-2">
                    <Input placeholder="Email" value={buyerEmail} onChange={e => setBuyerEmail(e.target.value)} />
                    <Input placeholder="Phone" value={buyerPhone} onChange={e => setBuyerPhone(e.target.value)} />
                  </div>
                  <textarea
                    placeholder="Buyer Corporate Address"
                    rows={2}
                    className="w-full rounded-md border px-3 py-2 text-sm bg-background"
                    value={buyerAddress}
                    onChange={e => setBuyerAddress(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-1 text-amber-500">Vendor Details</h3>
                  <Input placeholder="Vendor Company Name" value={vendorName} onChange={e => setVendorName(e.target.value)} />
                  <div className="grid gap-2 grid-cols-3">
                    <div className="col-span-1">
                      <Input placeholder="Contact Person" value={vendorContact} onChange={e => setVendorContact(e.target.value)} />
                    </div>
                    <div className="col-span-1">
                      <Input placeholder="Email" value={vendorEmail} onChange={e => setVendorEmail(e.target.value)} />
                    </div>
                    <div className="col-span-1">
                      <Input placeholder="Phone" value={vendorPhone} onChange={e => setVendorPhone(e.target.value)} />
                    </div>
                  </div>
                  <textarea
                    placeholder="Vendor Address"
                    rows={2}
                    className="w-full rounded-md border px-3 py-2 text-sm bg-background"
                    value={vendorAddress}
                    onChange={e => setVendorAddress(e.target.value)}
                  />
                </div>
              </div>

              {/* Line Items Table */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold border-b pb-1">Items & Deliverables</h3>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-2 items-center flex-wrap sm:flex-nowrap border-b sm:border-0 pb-3 sm:pb-0">
                      <div className="flex-[3] min-w-[200px]">
                        <Input
                          placeholder="Description / Product name"
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
                      <div className="w-20">
                        <Input
                          type="number"
                          placeholder="Tax %"
                          value={item.taxPercent === 0 ? "" : item.taxPercent}
                          onChange={e => handleItemChange(item.id, "taxPercent", e.target.value)}
                        />
                      </div>
                      <div className="w-24 text-right font-mono text-sm pr-2">
                        {currency}{(item.quantity * item.rate).toLocaleString(undefined, { minimumFractionDigits: 2 })}
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

              {/* Shipping costs & instructions */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Estimated Shipping / Freight Costs ($ / ₹)</Label>
                  <Input
                    type="number"
                    value={shippingCost === 0 ? "" : shippingCost}
                    onChange={e => setShippingCost(parseFloat(e.target.value) || 0)}
                    className="font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Special Instructions & Conditions</Label>
                  <textarea
                    rows={2}
                    className="w-full rounded-md border px-3 py-2 text-sm bg-background focus:outline-none"
                    value={instructions}
                    onChange={e => setInstructions(e.target.value)}
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
          <div className="sticky top-28 border rounded-2xl bg-white text-zinc-900 shadow-xl p-8 min-h-[640px] flex flex-col font-sans justify-between">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex justify-between items-start border-b pb-4">
                <div>
                  <h1 className="text-sm font-bold tracking-tight text-zinc-800">{buyerName}</h1>
                  <p className="text-[10px] text-zinc-500 whitespace-pre-line mt-1">{buyerAddress}</p>
                  <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{buyerEmail} • {buyerPhone}</p>
                </div>
                <div className="text-right">
                  <h2 className="text-sm font-black uppercase text-zinc-400 tracking-wider">PURCHASE ORDER</h2>
                  <p className="text-xs font-bold mt-2 text-zinc-800">{poNumber}</p>
                  <p className="text-[10px] text-zinc-500 mt-1">Date: {poDate}</p>
                  <p className="text-[10px] text-zinc-500 font-semibold mt-0.5">Delivery: {deliveryDate}</p>
                </div>
              </div>

              {/* Parties */}
              <div className="grid grid-cols-2 gap-4 py-3 border-b text-[10px]">
                <div>
                  <h3 className="font-semibold uppercase tracking-wider text-zinc-400 mb-1">Vendor</h3>
                  <h4 className="font-bold text-zinc-800">{vendorName}</h4>
                  <p className="text-zinc-500 mt-0.5">Attn: {vendorContact}</p>
                  <p className="text-zinc-500 whitespace-pre-line mt-0.5">{vendorAddress}</p>
                  <p className="text-zinc-500 font-mono mt-0.5">{vendorEmail} • {vendorPhone}</p>
                </div>
                <div className="border-l pl-4">
                  <h3 className="font-semibold uppercase tracking-wider text-zinc-400 mb-1">Ship To</h3>
                  <h4 className="font-bold text-zinc-800">{buyerName}</h4>
                  <p className="text-zinc-500 whitespace-pre-line mt-0.5">{buyerAddress}</p>
                  <p className="text-zinc-500 mt-1"><strong className="text-zinc-700">Ship Via:</strong> {shippingMethod}</p>
                  <p className="text-zinc-500"><strong className="text-zinc-700">FOB:</strong> {shippingTerms}</p>
                  <p className="text-zinc-500"><strong className="text-zinc-700">Terms:</strong> {paymentTerms}</p>
                </div>
              </div>

              {/* Line items table */}
              <div className="py-2">
                <table className="w-full text-[10px]">
                  <thead>
                    <tr className="border-b bg-zinc-50 text-zinc-500 font-semibold text-left">
                      <th className="py-2 pl-2">Description</th>
                      <th className="py-2 text-center w-10">Qty</th>
                      <th className="py-2 text-right w-16">Unit Price</th>
                      <th className="py-2 text-center w-10">Tax</th>
                      <th className="py-2 text-right w-20 pr-2">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-b text-zinc-700">
                        <td className="py-2 pl-2 font-medium text-zinc-800 leading-normal">{item.description}</td>
                        <td className="py-2 text-center">{item.quantity}</td>
                        <td className="py-2 text-right font-mono">{currency}{item.rate.toLocaleString()}</td>
                        <td className="py-2 text-center text-zinc-500">{item.taxPercent}%</td>
                        <td className="py-2 text-right font-bold text-zinc-800 font-mono pr-2">
                          {currency}{(item.quantity * item.rate).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Calculations Summary & Seal */}
            <div className="border-t pt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-[9px] text-zinc-500">
                <div>
                  <h4 className="font-semibold text-zinc-400 uppercase mb-1">Special Instructions</h4>
                  <p className="whitespace-pre-line leading-relaxed font-mono">{instructions}</p>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-zinc-500">
                    <span>Subtotal</span>
                    <span className="font-mono">{currency}{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                  {totalTax > 0 && (
                    <div className="flex justify-between text-zinc-500">
                      <span>Estimated Sales Tax</span>
                      <span className="font-mono">{currency}{totalTax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}
                  {shippingCost > 0 && (
                    <div className="flex justify-between text-zinc-500">
                      <span>Shipping & Freight</span>
                      <span className="font-mono">{currency}{shippingCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs font-bold text-zinc-800 pt-1.5 border-t">
                    <span>Grand Total</span>
                    <span className="font-mono text-zinc-950 text-sm">{currency}{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Printing Layout */}
      <div className="print-only text-zinc-900 bg-white min-h-screen p-12 flex flex-col font-sans justify-between" style={{ display: "none" }}>
        <div className="space-y-6">
          <div className="flex justify-between items-start border-b pb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{buyerName}</h1>
              <p className="text-xs text-zinc-500 whitespace-pre-line mt-1">{buyerAddress}</p>
              <p className="text-xs text-zinc-500 font-mono">{buyerEmail} • {buyerPhone}</p>
            </div>
            <div className="text-right">
              <h2 className="text-3xl font-black uppercase text-zinc-300 tracking-wider">PURCHASE ORDER</h2>
              <p className="text-lg font-bold mt-2">{poNumber}</p>
              <p className="text-[10px] text-zinc-500 mt-1">Date: {poDate}</p>
              <p className="text-[10px] text-zinc-500 font-semibold mt-0.5">Delivery Date: {deliveryDate}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 py-6 border-b text-xs text-zinc-800">
            <div>
              <h3 className="font-semibold uppercase tracking-wider text-zinc-400 mb-2">Vendor Details</h3>
              <h4 className="font-bold text-zinc-800">{vendorName}</h4>
              <p className="text-zinc-500 mt-0.5">Attn: {vendorContact}</p>
              <p className="text-zinc-500 whitespace-pre-line mt-0.5">{vendorAddress}</p>
              <p className="text-zinc-500 font-mono mt-0.5">{vendorEmail} • {vendorPhone}</p>
            </div>
            <div className="border-l pl-6">
              <h3 className="font-semibold uppercase tracking-wider text-zinc-400 mb-2">Ship To Address</h3>
              <h4 className="font-bold text-zinc-800">{buyerName}</h4>
              <p className="text-zinc-500 whitespace-pre-line mt-0.5">{buyerAddress}</p>
              <div className="mt-2 grid grid-cols-2 gap-1 text-[11px] text-zinc-600">
                <div><strong>Ship Via:</strong> {shippingMethod}</div>
                <div><strong>FOB Point:</strong> {shippingTerms}</div>
                <div className="col-span-2"><strong>Payment Terms:</strong> {paymentTerms}</div>
              </div>
            </div>
          </div>

          <div className="py-8">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b bg-zinc-50 text-zinc-500 font-semibold">
                  <th className="py-2 text-left pl-2">Description</th>
                  <th className="py-2 text-center w-12">Qty</th>
                  <th className="py-2 text-right w-24">Unit Price</th>
                  <th className="py-2 text-center w-16">Tax Rate</th>
                  <th className="py-2 text-right w-28 pr-2">Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b text-zinc-700">
                    <td className="py-3 pl-2 font-medium text-zinc-800 leading-normal">{item.description}</td>
                    <td className="py-3 text-center">{item.quantity}</td>
                    <td className="py-3 text-right font-mono">{currency}{item.rate.toLocaleString()}</td>
                    <td className="py-3 text-center text-zinc-500">{item.taxPercent}%</td>
                    <td className="py-3 text-right font-bold text-zinc-800 font-mono pr-2">
                      {currency}{(item.quantity * item.rate).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="border-t pt-6 grid grid-cols-2 gap-8 text-[10px] text-zinc-500">
          <div>
            <h4 className="font-semibold text-zinc-400 mb-1">Special Instructions & Conditions</h4>
            <p className="text-zinc-500 whitespace-pre-line leading-relaxed">{instructions}</p>
          </div>
          <div className="space-y-1.5 text-xs max-w-xs ml-auto w-full">
            <div className="flex justify-between text-zinc-500">
              <span>Subtotal</span>
              <span className="font-mono">{currency}{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            {totalTax > 0 && (
              <div className="flex justify-between text-zinc-500">
                <span>Estimated Sales Tax</span>
                <span className="font-mono">{currency}{totalTax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            {shippingCost > 0 && (
              <div className="flex justify-between text-zinc-500">
                <span>Shipping & Freight</span>
                <span className="font-mono">{currency}{shippingCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-zinc-800 pt-2 border-t">
              <span>Grand Total</span>
              <span className="font-mono text-zinc-950 text-base">{currency}{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
