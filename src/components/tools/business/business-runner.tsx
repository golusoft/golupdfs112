"use client";

import { InvoiceGenerator } from "./invoice-generator";
import { QuotationGenerator } from "./quotation-generator";
import { SalarySlipGenerator } from "./salary-slip-generator";
import { RentReceiptGenerator } from "./rent-receipt-generator";
import { GstCalculator } from "./gst-calculator";
import { ProfitMarginCalculator } from "./profit-margin-calculator";
import { RoiCalculator } from "./roi-calculator";
import { EmiCalculator } from "./emi-calculator";
import { GstInvoiceGenerator } from "./gst-invoice-generator";
import { PurchaseOrderGenerator } from "./purchase-order-generator";

interface BusinessToolRunnerProps {
  slug: string;
}

export function BusinessToolRunner({ slug }: BusinessToolRunnerProps) {
  switch (slug) {
    case "invoice-generator":
      return <InvoiceGenerator />;
    case "quotation-generator":
      return <QuotationGenerator />;
    case "salary-slip-generator":
      return <SalarySlipGenerator />;
    case "rent-receipt-generator":
      return <RentReceiptGenerator />;
    case "gst-calculator":
      return <GstCalculator />;
    case "profit-margin-calculator":
      return <ProfitMarginCalculator />;
    case "roi-calculator":
      return <RoiCalculator />;
    case "emi-calculator":
      return <EmiCalculator />;
    case "gst-invoice-generator":
      return <GstInvoiceGenerator />;
    case "purchase-order-generator":
      return <PurchaseOrderGenerator />;
    default:
      return (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center text-sm text-destructive">
          Unknown Business Suite tool specified: <strong>{slug}</strong>.
        </div>
      );
  }
}
