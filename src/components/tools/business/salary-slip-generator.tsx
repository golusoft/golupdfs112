"use client";

import { useState, useEffect } from "react";
import { Printer, RefreshCw, FileText, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function SalarySlipGenerator() {
  const [employeeName, setEmployeeName] = useState("Aman Verma");
  const [employeeId, setEmployeeId] = useState("EMP-2026-081");
  const [designation, setDesignation] = useState("Senior Frontend Engineer");
  const [department, setDepartment] = useState("Engineering");
  
  const [companyName, setCompanyName] = useState("Zenith Software Systems");
  const [companyAddress, setCompanyAddress] = useState("Block C, Tech Park, Bangalore, KA");
  
  const [payPeriod, setPayPeriod] = useState("");
  const [workedDays, setWorkedDays] = useState(30);

  // Earnings
  const [basicPay, setBasicPay] = useState(60000);
  const [hra, setHra] = useState(24000);
  const [allowance, setAllowance] = useState(15000);

  // Deductions
  const [pf, setPf] = useState(7200); // 12% of basic standard
  const [esi, setEsi] = useState(450);  // Standard ESI contribution
  const [professionalTax, setProfessionalTax] = useState(200);

  useEffect(() => {
    const today = new Date();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    setPayPeriod(`${months[today.getMonth()]} ${today.getFullYear()}`);
  }, []);

  const handleReset = () => {
    setEmployeeName("Aman Verma");
    setEmployeeId("EMP-2026-081");
    setDesignation("Senior Frontend Engineer");
    setDepartment("Engineering");
    setCompanyName("Zenith Software Systems");
    setCompanyAddress("Block C, Tech Park, Bangalore, KA");
    setWorkedDays(30);
    setBasicPay(60000);
    setHra(24000);
    setAllowance(15000);
    setPf(7200);
    setEsi(450);
    setProfessionalTax(200);
    toast.info("Salary Slip settings cleared.");
  };

  const grossEarnings = basicPay + hra + allowance;
  const totalDeductions = pf + esi + professionalTax;
  const netSalary = grossEarnings - totalDeductions;

  const takeHomeRatio = grossEarnings > 0 ? (netSalary / grossEarnings) * 100 : 0;
  const deductionRatio = grossEarnings > 0 ? (totalDeductions / grossEarnings) * 100 : 0;

  return (
    <>
      {/* SaaS Executive Metrics Grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6 no-print">
        <div className="p-4 rounded-2xl border bg-card/30 backdrop-blur-md space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Gross Earnings</span>
          <p className="text-lg font-black font-mono text-foreground">
            ₹{grossEarnings.toLocaleString()}
          </p>
        </div>
        <div className="p-4 rounded-2xl border bg-card/30 backdrop-blur-md space-y-1">
          <span className="text-[10px] uppercase font-bold text-destructive tracking-wider">Total Deductions</span>
          <p className="text-lg font-black font-mono text-destructive">
            ₹{totalDeductions.toLocaleString()}
          </p>
        </div>
        <div className="p-4 rounded-2xl border bg-card/30 backdrop-blur-md space-y-1">
          <span className="text-[10px] uppercase font-bold text-emerald-500 tracking-wider">Take-Home Ratio</span>
          <p className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5 pt-0.5">
            {takeHomeRatio.toFixed(0)}% of Gross Earnings
          </p>
        </div>
        <div className="p-4 rounded-2xl border bg-card/30 backdrop-blur-md space-y-1 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <span className="text-[10px] uppercase font-bold text-primary tracking-wider">Net Monthly Take-Home</span>
          <p className="text-lg font-black font-mono text-primary">
            ₹{netSalary.toLocaleString()}
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
                  <FileText className="h-5 w-5 text-primary" /> Salary Slip Configurator
                </h2>
                <Button size="sm" variant="outline" onClick={handleReset}>
                  <RefreshCw className="h-3.5 w-3.5 mr-1" /> Reset
                </Button>
              </div>

              {/* Employee & Payroll Metadata */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Employee Legal Name</Label>
                  <Input value={employeeName} onChange={e => setEmployeeName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Employee Serial Number</Label>
                  <Input value={employeeId} onChange={e => setEmployeeId(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Designation / Role</Label>
                  <Input value={designation} onChange={e => setDesignation(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Input value={department} onChange={e => setDepartment(e.target.value)} />
                </div>
              </div>

              {/* Company Info */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2 col-span-1">
                  <Label>Worked Days</Label>
                  <Input type="number" value={workedDays === 0 ? "" : workedDays} onChange={e => setWorkedDays(parseInt(e.target.value) || 0)} />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Payment Period (Month & Year)</Label>
                  <Input value={payPeriod} onChange={e => setPayPeriod(e.target.value)} />
                </div>
                <div className="space-y-2 col-span-3">
                  <Label>Company Name</Label>
                  <Input value={companyName} onChange={e => setCompanyName(e.target.value)} />
                </div>
                <div className="space-y-2 col-span-3">
                  <Label>Company Address</Label>
                  <Input value={companyAddress} onChange={e => setCompanyAddress(e.target.value)} />
                </div>
              </div>

              {/* Earnings & Deductions Splits */}
              <div className="grid gap-6 sm:grid-cols-2 pt-2 border-t">
                {/* Earnings */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-primary border-b pb-1">Earnings (₹)</h3>
                  <div className="space-y-2">
                    <div>
                      <Label className="text-xs">Basic Monthly Pay</Label>
                      <Input type="number" value={basicPay === 0 ? "" : basicPay} onChange={e => setBasicPay(parseFloat(e.target.value) || 0)} />
                    </div>
                    <div>
                      <Label className="text-xs">HRA Allowance</Label>
                      <Input type="number" value={hra === 0 ? "" : hra} onChange={e => setHra(parseFloat(e.target.value) || 0)} />
                    </div>
                    <div>
                      <Label className="text-xs">Other Allowances (Medical, LTA)</Label>
                      <Input type="number" value={allowance === 0 ? "" : allowance} onChange={e => setAllowance(parseFloat(e.target.value) || 0)} />
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500 border-b pb-1">Deductions (₹)</h3>
                  <div className="space-y-2">
                    <div>
                      <Label className="text-xs">Provident Fund (PF)</Label>
                      <Input type="number" value={pf === 0 ? "" : pf} onChange={e => setPf(parseFloat(e.target.value) || 0)} />
                    </div>
                    <div>
                      <Label className="text-xs">ESI / Health Cover contribution</Label>
                      <Input type="number" value={esi === 0 ? "" : esi} onChange={e => setEsi(parseFloat(e.target.value) || 0)} />
                    </div>
                    <div>
                      <Label className="text-xs">Professional Tax (PT)</Label>
                      <Input type="number" value={professionalTax === 0 ? "" : professionalTax} onChange={e => setProfessionalTax(parseFloat(e.target.value) || 0)} />
                    </div>
                  </div>
                </div>
              </div>

              <Button size="lg" className="w-full" onClick={() => window.print()}>
                <Printer className="h-4 w-4 mr-2" /> Print / Save as PDF
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 2. live preview */}
        <div className="lg:col-span-5 hidden lg:block">
          <div className="sticky top-28 border rounded-2xl bg-white text-zinc-900 shadow-xl p-8 min-h-[580px] flex flex-col font-sans justify-between text-xs">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-start border-b pb-4">
                <div>
                  <h2 className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Zenith Pay Slip</h2>
                  <h1 className="text-base font-bold text-zinc-800 mt-1">{companyName}</h1>
                  <p className="text-[9px] text-zinc-500 mt-0.5">{companyAddress}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-zinc-800">Statement for: {payPeriod}</p>
                  <p className="text-[9px] text-zinc-500">Worked Days: {workedDays}</p>
                </div>
              </div>

              {/* Employee metadata */}
              <div className="grid grid-cols-2 gap-4 text-[10px] border-b pb-4 text-zinc-600">
                <div><span className="font-semibold text-zinc-400">Employee Name:</span> <span className="font-bold text-zinc-800">{employeeName}</span></div>
                <div><span className="font-semibold text-zinc-400">Employee Serial:</span> <span className="font-bold text-zinc-800 font-mono">{employeeId}</span></div>
                <div><span className="font-semibold text-zinc-400">Role Designation:</span> <span className="font-bold text-zinc-800">{designation}</span></div>
                <div><span className="font-semibold text-zinc-400">Department:</span> <span className="font-bold text-zinc-800">{department}</span></div>
              </div>

              {/* Earnings & Deductions Tables */}
              <div className="grid grid-cols-2 gap-4 text-[10px]">
                {/* Earnings table */}
                <div className="space-y-2">
                  <h4 className="font-bold border-b pb-1 text-zinc-500 uppercase">Earnings</h4>
                  <div className="flex justify-between"><span>Basic Pay</span><span className="font-mono">₹{basicPay.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>HRA Allowance</span><span className="font-mono">₹{hra.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>Other Allowances</span><span className="font-mono">₹{allowance.toLocaleString()}</span></div>
                  <div className="flex justify-between pt-1 border-t font-semibold text-zinc-800">
                    <span>Gross Earnings</span><span className="font-mono">₹{grossEarnings.toLocaleString()}</span>
                  </div>
                </div>

                {/* Deductions table */}
                <div className="space-y-2 border-l pl-4">
                  <h4 className="font-bold border-b pb-1 text-zinc-500 uppercase">Deductions</h4>
                  <div className="flex justify-between"><span>Provident Fund</span><span className="font-mono">₹{pf.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>ESI Contribution</span><span className="font-mono">₹{esi.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>Professional Tax</span><span className="font-mono">₹{professionalTax.toLocaleString()}</span></div>
                  <div className="flex justify-between pt-1 border-t font-semibold text-zinc-800">
                    <span>Total Deductions</span><span className="font-mono">₹{totalDeductions.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Calculations net take-home */}
            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between items-center bg-zinc-50 p-4 rounded-xl">
                <div>
                  <h4 className="text-xs font-bold text-zinc-800">Net Take-Home Salary</h4>
                  <p className="text-[9px] text-zinc-400 mt-0.5">Credited to employee bank account</p>
                </div>
                <span className="text-lg font-black text-emerald-600 font-mono">
                  ₹{netSalary.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Printed output */}
      <div className="print-only text-zinc-900 bg-white min-h-screen p-12 flex flex-col font-sans justify-between text-xs" style={{ display: "none" }}>
        <div className="space-y-8">
          <div className="flex justify-between items-start border-b pb-4">
            <div>
              <h2 className="text-sm font-black uppercase text-zinc-400 tracking-wider">SALARY PAYSLIP</h2>
              <h1 className="text-lg font-bold text-zinc-800 mt-2">{companyName}</h1>
              <p className="text-[10px] text-zinc-500 whitespace-pre-line mt-1">{companyAddress}</p>
            </div>
            <div className="text-right space-y-1">
              <p className="text-xs font-bold text-zinc-800">Payment Month: {payPeriod}</p>
              <p className="text-[10px] text-zinc-500">Worked Days: {workedDays}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs border p-6 rounded-xl text-zinc-800">
            <div><span className="font-semibold text-zinc-400">Employee Name:</span> <span className="font-bold text-zinc-900">{employeeName}</span></div>
            <div><span className="font-semibold text-zinc-400">Employee ID:</span> <span className="font-bold text-zinc-900 font-mono">{employeeId}</span></div>
            <div><span className="font-semibold text-zinc-400">Designation:</span> <span className="font-bold text-zinc-900">{designation}</span></div>
            <div><span className="font-semibold text-zinc-400">Department:</span> <span className="font-bold text-zinc-900">{department}</span></div>
          </div>

          <div className="grid grid-cols-2 gap-8 text-xs pt-4">
            {/* Earnings table */}
            <div className="space-y-2">
              <h4 className="font-bold border-b pb-1 text-zinc-500 uppercase">Earnings Description</h4>
              <div className="flex justify-between py-1"><span>Basic Pay Component</span><span className="font-mono">₹{basicPay.toLocaleString()}</span></div>
              <div className="flex justify-between py-1"><span>House Rent Allowance (HRA)</span><span className="font-mono">₹{hra.toLocaleString()}</span></div>
              <div className="flex justify-between py-1"><span>Extra Allowances</span><span className="font-mono">₹{allowance.toLocaleString()}</span></div>
              <div className="flex justify-between pt-2 border-t font-semibold text-zinc-900">
                <span>Gross Monthly Earnings</span><span className="font-mono">₹{grossEarnings.toLocaleString()}</span>
              </div>
            </div>

            {/* Deductions table */}
            <div className="space-y-2 border-l pl-8">
              <h4 className="font-bold border-b pb-1 text-zinc-500 uppercase">Deductions Summary</h4>
              <div className="flex justify-between py-1"><span>Provident Fund (PF)</span><span className="font-mono">₹{pf.toLocaleString()}</span></div>
              <div className="flex justify-between py-1"><span>ESI Health Insurance</span><span className="font-mono">₹{esi.toLocaleString()}</span></div>
              <div className="flex justify-between py-1"><span>Professional Tax (PT)</span><span className="font-mono">₹{professionalTax.toLocaleString()}</span></div>
              <div className="flex justify-between pt-2 border-t font-semibold text-zinc-900">
                <span>Total Statutory Deductions</span><span className="font-mono">₹{totalDeductions.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-8 space-y-4 mt-12">
          <div className="flex justify-between items-center bg-zinc-50 p-6 rounded-xl border">
            <div>
              <h4 className="text-sm font-bold text-zinc-800">Net Take-Home Salary Credited</h4>
              <p className="text-[10px] text-zinc-400 mt-0.5">Credited to employee bank account in full compliance</p>
            </div>
            <span className="text-2xl font-black text-emerald-600 font-mono">
              ₹{netSalary.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between text-[10px] text-zinc-400 font-mono pt-4">
            <p>Zenith Automated Payroll Solutions</p>
            <p>Authorized Signature & Stamp</p>
          </div>
        </div>
      </div>
    </>
  );
}
