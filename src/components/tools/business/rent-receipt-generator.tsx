"use client";

import { useState, useRef, useEffect } from "react";
import { Printer, RefreshCw, Pen, Eraser } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function RentReceiptGenerator() {
  const [tenantName, setTenantName] = useState("Rajesh Kumar");
  const [landlordName, setLandlordName] = useState("Sunita Sharma");
  const [landlordPan, setLandlordPan] = useState("ABCDE1234F");
  
  const [propertyAddress, setPropertyAddress] = useState("Flat 402, Green Glen Layout, Bangalore, KA");
  const [rentAmount, setRentAmount] = useState(25000);
  const [depositAmount, setDepositAmount] = useState(100000);
  
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentMode, setPaymentMode] = useState("Bank Transfer");

  const [signature, setSignature] = useState<string>("");
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const prevMonth = new Date();
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    
    setPaymentDate(today);
    setPeriodStart(prevMonth.toISOString().split("T")[0]);
    setPeriodEnd(today);
  }, []);

  const handleReset = () => {
    setTenantName("Rajesh Kumar");
    setLandlordName("Sunita Sharma");
    setLandlordPan("ABCDE1234F");
    setPropertyAddress("Flat 402, Green Glen Layout, Bangalore, KA");
    setRentAmount(25000);
    setDepositAmount(100000);
    setPaymentMode("Bank Transfer");
    clearSignature();
    toast.info("Rent receipt settings cleared.");
  };

  // HTML5 Canvas Drawing Pad functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const endDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      setSignature(canvas.toDataURL());
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#172554"; // deep blue ink

    // Calculate correct pointer position relative to canvas bounding client rect
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setSignature("");
    }
  };

  return (
    <>
      {/* SaaS Executive Metrics Grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6 no-print">
        <div className="p-4 rounded-2xl border bg-card/30 backdrop-blur-md space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Monthly Rent Sum</span>
          <p className="text-lg font-black font-mono text-foreground">
            ₹{rentAmount.toLocaleString()}
          </p>
        </div>
        <div className="p-4 rounded-2xl border bg-card/30 backdrop-blur-md space-y-1">
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Security Deposit</span>
          <p className="text-lg font-black font-mono text-zinc-300">
            ₹{depositAmount.toLocaleString()}
          </p>
        </div>
        <div className="p-4 rounded-2xl border bg-card/30 backdrop-blur-md space-y-1">
          <span className="text-[10px] uppercase font-bold text-emerald-500 tracking-wider">Compliance Status</span>
          <p className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5 pt-0.5">
            PAN Attached ({landlordPan ? "Compliant" : "Pending"})
          </p>
        </div>
        <div className="p-4 rounded-2xl border bg-card/30 backdrop-blur-md space-y-1 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <span className="text-[10px] uppercase font-bold text-primary tracking-wider">Payment channel</span>
          <p className="text-base font-bold text-primary">
            {paymentMode}
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 no-print">
        {/* 1. Build form */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-border/60 bg-card/40 backdrop-blur-md">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Pen className="h-5 w-5 text-primary" /> Receipt Details
                </h2>
                <Button size="sm" variant="outline" onClick={handleReset}>
                  <RefreshCw className="h-3.5 w-3.5 mr-1" /> Reset
                </Button>
              </div>

              {/* Tenant / Landlord info */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Tenant Name</Label>
                  <Input value={tenantName} onChange={e => setTenantName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Landlord Name</Label>
                  <Input value={landlordName} onChange={e => setLandlordName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Landlord PAN (For HRA)</Label>
                  <Input value={landlordPan} onChange={e => setLandlordPan(e.target.value)} />
                </div>
              </div>

              {/* Rental details */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Monthly Rent (₹)</Label>
                  <Input type="number" value={rentAmount === 0 ? "" : rentAmount} onChange={e => setRentAmount(parseFloat(e.target.value) || 0)} />
                </div>
                <div className="space-y-2">
                  <Label>Security Deposit (₹)</Label>
                  <Input type="number" value={depositAmount === 0 ? "" : depositAmount} onChange={e => setDepositAmount(parseFloat(e.target.value) || 0)} />
                </div>
                <div className="space-y-2">
                  <Label>Payment Mode</Label>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none"
                    value={paymentMode}
                    onChange={e => setPaymentMode(e.target.value)}
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="UPI / Scan">UPI / Online</option>
                    <option value="Cash">Cash</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
              </div>

              {/* Rent Period */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Period Start Date</Label>
                  <Input type="date" value={periodStart} onChange={e => setPeriodStart(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Period End Date</Label>
                  <Input type="date" value={periodEnd} onChange={e => setPeriodEnd(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Payment Date</Label>
                  <Input type="date" value={paymentDate} onChange={e => setPaymentDate(e.target.value)} />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label>Property Address</Label>
                <textarea
                  rows={2}
                  className="w-full rounded-md border px-3 py-2 text-sm bg-background focus:outline-none"
                  value={propertyAddress}
                  onChange={e => setPropertyAddress(e.target.value)}
                />
              </div>

              {/* Digital Signature Drawing Canvas Pad */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Landlord's Signature (Draw Pad)</Label>
                  {signature && (
                    <Button variant="ghost" size="sm" className="h-6 text-[10px] text-zinc-400 hover:text-destructive" onClick={clearSignature}>
                      <Eraser className="h-3 w-3 mr-1" /> Clear
                    </Button>
                  )}
                </div>
                <div className="relative border-2 border-dashed border-zinc-700/30 rounded-xl bg-zinc-50/5 h-28 flex items-center justify-center overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    width={340}
                    height={110}
                    className="absolute inset-0 cursor-crosshair touch-none"
                    onMouseDown={startDrawing}
                    onMouseUp={endDrawing}
                    onMouseOut={endDrawing}
                    onMouseMove={draw}
                    onTouchStart={startDrawing}
                    onTouchEnd={endDrawing}
                    onTouchMove={draw}
                  />
                  {!signature && <span className="text-[10px] text-zinc-500 font-mono select-none">Draw signature directly in this box</span>}
                </div>
              </div>

              <Button size="lg" className="w-full" onClick={() => window.print()}>
                <Printer className="h-4 w-4 mr-2" /> Print / Save as PDF
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 2. Live preview */}
        <div className="lg:col-span-5 hidden lg:block">
          <div className="sticky top-28 border rounded-2xl bg-white text-zinc-900 shadow-xl p-8 min-h-[580px] flex flex-col font-sans justify-between text-xs">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-start border-b pb-6">
                <div>
                  <h1 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Rent Receipt</h1>
                  <p className="text-zinc-500 font-mono text-[10px] mt-1">Receipt Date: {paymentDate}</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-emerald-600 bg-emerald-50 px-3 py-1 border border-emerald-100 rounded font-mono">
                    ₹{rentAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Statement */}
              <p className="text-xs leading-relaxed text-zinc-600 font-medium">
                Received with thanks from <strong className="text-zinc-800">{tenantName}</strong>, the sum of{" "}
                <strong className="text-zinc-800">₹{rentAmount.toLocaleString()}</strong> as rent payment for the residential property
                located at <strong className="text-zinc-800">{propertyAddress}</strong> for the period starting{" "}
                <span className="font-semibold text-zinc-700">{periodStart}</span> to{" "}
                <span className="font-semibold text-zinc-700">{periodEnd}</span>.
              </p>

              {/* Properties details */}
              <div className="grid grid-cols-2 gap-4 text-[10px] border bg-zinc-50 p-4 rounded-xl">
                <div><span className="font-semibold text-zinc-400">Payment Mode:</span> <span className="font-bold text-zinc-700">{paymentMode}</span></div>
                <div><span className="font-semibold text-zinc-400">Security Deposit:</span> <span className="font-bold text-zinc-700 font-mono">₹{depositAmount.toLocaleString()}</span></div>
                <div><span className="font-semibold text-zinc-400">Landlord Name:</span> <span className="font-bold text-zinc-700">{landlordName}</span></div>
                <div><span className="font-semibold text-zinc-400">Landlord PAN:</span> <span className="font-bold text-zinc-700 font-mono uppercase">{landlordPan}</span></div>
              </div>
            </div>

            {/* Signature Box */}
            <div className="flex justify-between items-end border-t pt-6 text-[10px]">
              <div>
                <p className="text-zinc-400 leading-relaxed font-mono">HRA tax exemption verified receipt</p>
              </div>
              <div className="text-center w-28 space-y-1">
                {signature ? (
                  <img src={signature} alt="Landlord Signature" className="h-10 w-28 object-contain mx-auto" />
                ) : (
                  <div className="h-10 w-28 border-b border-zinc-200 border-dashed" />
                )}
                <p className="text-zinc-400 font-semibold">Landlord Signature</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Printed output */}
      <div className="print-only text-zinc-900 bg-white min-h-screen p-12 flex flex-col font-sans justify-between text-xs" style={{ display: "none" }}>
        <div className="space-y-6">
          <div className="flex justify-between items-start border-b pb-6">
            <div>
              <h1 className="text-lg font-bold uppercase tracking-wider text-zinc-800">RENT RECEIPT</h1>
              <p className="text-zinc-400 font-mono text-[10px] mt-1">Receipt Date: {paymentDate}</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-zinc-900 font-mono">
                ₹{rentAmount.toLocaleString()}
              </span>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-zinc-700 mt-6">
            Received with thanks from <strong className="text-zinc-900">{tenantName}</strong>, the sum of{" "}
            <strong className="text-zinc-900">₹{rentAmount.toLocaleString()}</strong> as rent payment for the residential property
            located at <strong className="text-zinc-900">{propertyAddress}</strong> for the period starting{" "}
            <span className="font-semibold">{periodStart}</span> to{" "}
            <span className="font-semibold">{periodEnd}</span>.
          </p>

          <div className="grid grid-cols-2 gap-4 text-xs border p-6 rounded-xl mt-6">
            <div><span className="font-semibold text-zinc-400">Payment Mode:</span> <span className="font-bold text-zinc-800">{paymentMode}</span></div>
            <div><span className="font-semibold text-zinc-400">Security Deposit:</span> <span className="font-bold text-zinc-800 font-mono">₹{depositAmount.toLocaleString()}</span></div>
            <div><span className="font-semibold text-zinc-400">Landlord Name:</span> <span className="font-bold text-zinc-800">{landlordName}</span></div>
            <div><span className="font-semibold text-zinc-400">Landlord PAN:</span> <span className="font-bold text-zinc-800 font-mono uppercase">{landlordPan}</span></div>
          </div>
        </div>

        <div className="flex justify-between items-end border-t pt-8 text-[11px] mt-12">
          <div>
            <p className="text-zinc-400 leading-relaxed font-mono">HRA tax exemption verified receipt</p>
          </div>
          <div className="text-center w-36 space-y-1">
            {signature ? (
              <img src={signature} alt="Landlord Signature" className="h-12 w-36 object-contain mx-auto" />
            ) : (
              <div className="h-12 w-36 border-b border-zinc-200 border-dashed" />
            )}
            <p className="text-zinc-500 font-semibold mt-1">Landlord Signature</p>
          </div>
        </div>
      </div>
    </>
  );
}
