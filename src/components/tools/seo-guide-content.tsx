import React from "react";
import { 
  Building2, 
  CreditCard, 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  Activity, 
  DollarSign,
  TrendingUp, 
  Layers, 
  Sparkles,
  CheckCircle2,
  FileSpreadsheet
} from "lucide-react";

interface SeoGuideProps {
  slug: string;
  h1: string;
  keywords?: string[];
  whyBullets?: string[];
}

export function SeoGuideContent({ slug, h1, keywords = [], whyBullets = [] }: SeoGuideProps) {
  // Determine page type from slug
  const isCreditCard = slug.includes("-cc-") || slug.includes("amex") || slug.includes("apple-card") || slug.includes("discover") || slug.includes("visa") || slug.includes("freedom");
  const isUtility = slug.includes("-bill-") || slug.includes("pge") || slug.includes("comcast") || slug.includes("verizon") || slug.includes("att") || slug.includes("tmobile") || slug.includes("energy") || slug.includes("grid") || slug.includes("coned") || slug.includes("telecom") || slug.includes("vodafone") || slug.includes("airtel") || slug.includes("jio") || slug.includes("power") || slug.includes("bescom");
  const isComparison = slug.includes("-vs-") || slug.includes("-alternative");
  const isIndustry = slug.startsWith("templates/");
  const isCountry = slug.includes("indian-bank") || slug.includes("us-bank") || slug.includes("uk-bank") || slug.includes("canadian-bank");
  const isBankStatement = slug.includes("-statement-") && !isCreditCard && !isCountry;

  // 1. BANK STATEMENT SECTION
  if (isBankStatement) {
    const bankName = h1.replace("Extract ", "").replace(" PDF Statement to Excel", "").trim();
    return (
      <div className="mt-16 space-y-12 border-t pt-16">
        <div className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" /> Technical Guide: Extracting {bankName} Transaction Logs
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Bank statements are highly structured but notoriously difficult to copy and paste. {bankName} statements usually feature multi-page grids containing sensitive transaction lines, balance offsets, and customer account headers. Copying this text directly typically breaks row boundaries, merges descriptions with credit/debit figures, and leaves you with hours of manual alignment.
          </p>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Our local WebAssembly PDF engine parses the native page vectors directly within your browser. Rather than sending files to remote servers, GoluPDF extracts the tabular grid lines securely in sub-seconds.
          </p>
        </div>

        {/* Section: Standard Columns */}
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-emerald-500" /> Standard {bankName} Excel Mapping Schema
            </h3>
            <p className="mt-2 text-xs text-muted-foreground">
              Our extractor automatically parses transactional data and maps it into the following standard accounting spreadsheet columns:
            </p>
            <div className="mt-4 overflow-hidden rounded-lg border">
              <table className="min-w-full divide-y divide-border text-xs text-left">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-2 font-medium">Mapped Column</th>
                    <th className="px-4 py-2 font-medium">Typical Data Match</th>
                    <th className="px-4 py-2 font-medium">Formatting</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  <tr>
                    <td className="px-4 py-2 font-medium font-mono">Date</td>
                    <td className="px-4 py-2">Transaction/Valuation Date</td>
                    <td className="px-4 py-2">YYYY-MM-DD</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium font-mono">Description</td>
                    <td className="px-4 py-2">Transaction Details & Payee info</td>
                    <td className="px-4 py-2">Text / Alpha-numeric</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium font-mono">Ref/Chq No.</td>
                    <td className="px-4 py-2">Cheque number or reference string</td>
                    <td className="px-4 py-2">Number / Text</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium font-mono">Debit (Withdrawal)</td>
                    <td className="px-4 py-2">Outgoing transaction amounts</td>
                    <td className="px-4 py-2">Decimal (0.00)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium font-mono">Credit (Deposit)</td>
                    <td className="px-4 py-2">Incoming deposits or transfers</td>
                    <td className="px-4 py-2">Decimal (0.00)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium font-mono">Balance</td>
                    <td className="px-4 py-2">Running balance after transactions</td>
                    <td className="px-4 py-2">Decimal (0.00)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-6 space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" /> Overcoming Statement Export Challenges
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <div>
                  <strong>Password Protection:</strong> Most {bankName} statements are secured with a password (e.g. combination of name and birth date). GoluPDF runs locally and will prompt you to enter the password to decrypt the file in browser memory before extracting.
                </div>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <div>
                  <strong>Multi-Line Descriptions:</strong> A single transaction description can wrap across 2 or 3 lines. GoluPDF joins these fragments so they reside inside a single Excel row, preventing split-data misalignment.
                </div>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <div>
                  <strong>OCR Table Recovery Mode:</strong> If your bank statement is a print scan or photo, standard text selectors will fail. Toggle our **OCR Recovery Mode** to run client-side spatial calculations and reconstruct structural grids.
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Section: Accounting Use Cases */}
        <div className="rounded-2xl border bg-gradient-to-br from-primary/5 to-secondary/5 p-8">
          <h3 className="text-xl font-bold text-foreground">Critical Financial Use Cases</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Accountants, tax advisors, and finance departments utilize GoluPDF for various data auditing processes:
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            <div className="space-y-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">1</div>
              <h4 className="font-semibold text-sm">Monthly Bank Reconciliation</h4>
              <p className="text-xs text-muted-foreground">Reconcile accounting logs with actual bank records. Importing the extracted Excel statement directly into systems like QuickBooks, Xero, or Tally reduces data entry times by 95%.</p>
            </div>
            <div className="space-y-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">2</div>
              <h4 className="font-semibold text-sm">Audit & Forensic Analytics</h4>
              <p className="text-xs text-muted-foreground">Audit years of statements to scan for abnormalities, duplicate payouts, and expense leakage. An Excel layout lets you run sorting filters and pivoting operations instantly.</p>
            </div>
            <div className="space-y-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">3</div>
              <h4 className="font-semibold text-sm">Mortgage & Income Verification</h4>
              <p className="text-xs text-muted-foreground">Underwriters verify loan applicant cash-flow patterns by converting statements into structured sheets to calculate debt-to-income (DTI) metrics efficiently.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. CREDIT CARD SECTION
  if (isCreditCard) {
    const cardName = h1.replace("Extract ", "").replace(" PDF Statement to Excel", "").trim();
    return (
      <div className="mt-16 space-y-12 border-t pt-16">
        <div className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <CreditCard className="h-8 w-8 text-primary" /> Technical Guide: Reconciling {cardName} Logs
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Credit card statements are optimized for visual formatting rather than data analysis. They contain promo blocks, rewards breakdowns, and multi-currency exchange lines. For corporate tax filing or personal financial modeling, copying these tables manually creates layout errors. GoluPDF extracts every charge, payment, and refund securely.
          </p>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Our tool maps card details directly into clean spreadsheet grids. All calculations occur inside the local sandbox of your browser, ensuring absolute security for sensitive corporate accounts.
          </p>
        </div>

        {/* Section: Rewards & categorization */}
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border bg-card p-6 space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-500" /> Spending Analysis & Merchant Categorization
            </h3>
            <p className="text-sm text-muted-foreground">
              When converting {cardName} PDF records, our table extractor isolates key merchant columns to help you tag expenses:
            </p>
            <ul className="space-y-3 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong>Merchant Name Parsing:</strong> Isolates cleaner merchant names (e.g. &quot;Uber Trip&quot; or &quot;Amazon Prime&quot;) from bloated transaction strings containing invoice codes or transaction locations.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong>Reward/Cashback Tiers:</strong> Detects points columns and cash back rebates earned on per-line transactions, enabling you to audit rewards eligibility.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong>Exchange Rates:</strong> Extracts original currency amounts and exchange markups for overseas transactions, isolating processing fees.
                </div>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-primary" /> Credit Card Reconciliation Schema
            </h3>
            <div className="mt-4 overflow-hidden rounded-lg border text-xs">
              <table className="min-w-full divide-y divide-border text-left">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-2 font-medium">Field</th>
                    <th className="px-4 py-2 font-medium">Type</th>
                    <th className="px-4 py-2 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  <tr>
                    <td className="px-4 py-2 font-medium font-mono">Post Date</td>
                    <td className="px-4 py-2">Date</td>
                    <td className="px-4 py-2">The date the charge was finalized</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium font-mono">Merchant</td>
                    <td className="px-4 py-2">Text</td>
                    <td className="px-4 py-2">The merchant name and billing descriptor</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium font-mono">Category</td>
                    <td className="px-4 py-2">Category</td>
                    <td className="px-4 py-2">Auto-parsed MCC category (e.g. Travel)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium font-mono">Amount</td>
                    <td className="px-4 py-2">Decimal</td>
                    <td className="px-4 py-2">Charge amount (negative for refunds/credits)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Audit guide */}
        <div className="rounded-2xl border bg-card p-8">
          <h3 className="text-lg font-bold text-foreground">Step-by-Step Business Credit Card Audit Guide</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Follow these steps to clean and audit your statements for business accounting:
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-4 text-xs text-muted-foreground">
            <div className="border-l-2 border-primary pl-4">
              <span className="font-bold text-primary block text-sm">STEP 1</span>
              Upload statement and run the grid extractor mapping date, merchant, and decimal amounts.
            </div>
            <div className="border-l-2 border-primary pl-4">
              <span className="font-bold text-primary block text-sm">STEP 2</span>
              Identify refunds and adjustments (marked with negative symbols or credit signs) and reconcile with invoices.
            </div>
            <div className="border-l-2 border-primary pl-4">
              <span className="font-bold text-primary block text-sm">STEP 3</span>
              Sort by merchant name or spend category to group software subscriptions, travel expenditures, and office tools.
            </div>
            <div className="border-l-2 border-primary pl-4">
              <span className="font-bold text-primary block text-sm">STEP 4</span>
              Export to XLSX and import directly to corporate ledger systems to avoid manual journal entries.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. UTILITY BILL SECTION
  if (isUtility) {
    const utilityName = h1.replace("Extract ", "").replace(" Bill PDF to Excel", "").trim();
    return (
      <div className="mt-16 space-y-12 border-t pt-16">
        <div className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Activity className="h-8 w-8 text-primary" /> Technical Guide: Parsing {utilityName} Invoices
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Utility bills are complex, data-rich records showing tiered consumption rates, meter metrics, distribution surcharges, and local energy taxes. Multi-location companies or property managers auditing utilities face a massive time drain manually copy-pasting numbers. GoluPDF extracts tabular billing periods and unit logs directly in your browser.
          </p>
        </div>

        {/* Grid: Columns and carbon calculator */}
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" /> Key Utility Billing Metrics Extracted
            </h3>
            <p className="mt-2 text-xs text-muted-foreground">
              Our extractor isolates critical utility values to support utility auditing databases:
            </p>
            <div className="mt-4 space-y-3 text-xs text-muted-foreground">
              <div className="flex gap-2">
                <span className="text-primary font-bold">✔</span>
                <div>
                  <strong>Meter Readings:</strong> Previous and current meter counts are mapped to calculate total billing units (kWh, Therms, Gallons, CCF).
                </div>
              </div>
              <div className="flex gap-2">
                <span className="text-primary font-bold">✔</span>
                <div>
                  <strong>Tiered Slabs:</strong> Identifies charge tiers (e.g. baseline allowance charges vs. peak/excess tier rates).
                </div>
              </div>
              <div className="flex gap-2">
                <span className="text-primary font-bold">✔</span>
                <div>
                  <strong>Service Addresses:</strong> Extracts distinct account IDs, meter serials, and physical service addresses to group reports.
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-6 space-y-3">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Activity className="h-5 w-5 text-emerald-500" /> Carbon Audit & Sustainability Tracking
            </h3>
            <p className="text-xs text-muted-foreground">
              For corporate ESG reporting (Environmental, Social, and Governance), companies must calculate their carbon footprints. Converting PDF bills into Excel tables simplifies energy auditing:
            </p>
            <ul className="list-disc pl-4 text-xs text-muted-foreground space-y-2">
              <li><strong>Consolidated tracking:</strong> Export monthly usage logs across 100+ branches and combine them into a single spreadsheet.</li>
              <li><strong>Calculate CO2 Equivalents:</strong> Use standard emission conversion factors directly in Excel based on extracted kWh or Therm values.</li>
              <li><strong>Verify Meter Accuracy:</strong> Compare historical usage spikes against seasonal weather variations.</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // 4. COMPARISON PAGES SECTION
  if (isComparison) {
    const competitor = h1.split(" vs ")[0] || "Competitor";
    return (
      <div className="mt-16 space-y-12 border-t pt-16">
        <div className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-primary" /> Security & Performance: GoluPDF vs {competitor}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Most online PDF tools upload your documents directly to cloud servers for processing. This presents major data privacy vulnerabilities, especially when dealing with financial records, bank statements, legal contracts, or identity scans. 
          </p>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            <strong>GoluPDF operates on a completely different model.</strong> By employing modern WebAssembly (WASM) and client-side processing, your documents never leave your machine. Processing happens entirely inside your browser memory sandbox.
          </p>
        </div>

        {/* Feature Comparison Table */}
        <div className="rounded-2xl border bg-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">GoluPDF Feature & Privacy Comparison Matrix</h3>
          <div className="overflow-x-auto rounded-lg border text-xs">
            <table className="min-w-full divide-y divide-border text-left">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">Feature / Metric</th>
                  <th className="px-4 py-3 font-semibold text-primary">GoluPDF</th>
                  <th className="px-4 py-3 font-semibold">iLovePDF</th>
                  <th className="px-4 py-3 font-semibold">Smallpdf</th>
                  <th className="px-4 py-3 font-semibold">Adobe Acrobat Web</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                <tr>
                  <td className="px-4 py-3 font-medium">Processing Location</td>
                  <td className="px-4 py-3 text-emerald-500 font-semibold">Local (100% Client-Side WebAssembly)</td>
                  <td className="px-4 py-3">Cloud Servers</td>
                  <td className="px-4 py-3">Cloud Servers</td>
                  <td className="px-4 py-3">Cloud Servers</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Data Privacy & GDPR</td>
                  <td className="px-4 py-3 text-emerald-500 font-semibold">Absolute (Files never uploaded)</td>
                  <td className="px-4 py-3 text-red-500">Files stored for up to 2 hours</td>
                  <td className="px-4 py-3 text-red-500">Files stored for up to 1 hour</td>
                  <td className="px-4 py-3 text-red-500">Server logging & analytics rules</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Watermarks</td>
                  <td className="px-4 py-3 text-emerald-500 font-semibold">None (100% Free & Unmarked)</td>
                  <td className="px-4 py-3">No watermark (Paid model rules)</td>
                  <td className="px-4 py-3 text-red-500">Restricted features or stamps</td>
                  <td className="px-4 py-3">Account required for output</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Pricing & Limits</td>
                  <td className="px-4 py-3 text-emerald-500 font-semibold">Free Forever (No daily caps)</td>
                  <td className="px-4 py-3">Restricted daily usage caps</td>
                  <td className="px-4 py-3 text-red-500">2 files per day limit</td>
                  <td className="px-4 py-3">Limited free trials, paid subscriptions</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">GDPR Metadata Scrub</td>
                  <td className="px-4 py-3 text-emerald-500 font-semibold">Yes (Full Audit & Scrub)</td>
                  <td className="px-4 py-3 text-red-500">No</td>
                  <td className="px-4 py-3 text-red-500">No</td>
                  <td className="px-4 py-3 text-red-500">No</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section: Why WASM is faster */}
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-500" /> Bypassing Network Bottlenecks
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Because cloud PDF editors require uploading files to remote clusters, your conversion speed is throttled by your internet upload speed. If you are uploading a 50 MB scanned catalog over a mobile data connection, it can take minutes just to transfer.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              GoluPDF compiles WebAssembly modules directly into your browser cache. The processing runs locally at the speed of your device&apos;s processor, eliminating network latencies and upload waits.
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" /> Regulatory & Corporate Compliance
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Under GDPR, HIPAA, and industry-specific privacy guidelines, uploading documents containing Personally Identifiable Information (PII) to unauthorized third-party databases is a serious compliance breach. 
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Since GoluPDF does not transmit, review, or store document pages, compliance officers can safely deploy GoluPDF across financial, legal, and medical offices without breaching data privacy regulations.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 5. INDUSTRY SPECIFIC SECTION
  if (isIndustry) {
    const industryName = h1.split(" for ")[1]?.split(" — ")[0] || "Your Industry";
    return (
      <div className="mt-16 space-y-12 border-t pt-16">
        <div className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" /> Document Workflows in {industryName}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Operational workflows in {industryName} demand maximum efficiency and absolute security. Whether processing case files, medical charting histories, client audits, or design specifications, documents must remain secure and compliant with relevant industrial standards (e.g. HIPAA, GDPR, SOC2).
          </p>
        </div>

        {/* Specific layout for compliance and workflows */}
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" /> Security & Regulatory Requirements in {industryName}
            </h3>
            <p className="mt-2 text-xs text-muted-foreground">
              Documents handled within {industryName.toLowerCase()} frequently contain sensitive data. Standard cloud conversion websites present risks. GoluPDF maintains complete client-side data sovereignty:
            </p>
            <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Wipes creation software fingerprints to protect workflow secrecy.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Wipes creation location time zones.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Runs inside a client-side sandbox to bypass server uploads.
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border bg-card p-6 space-y-3">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" /> Industry Document Audit Checklist
            </h3>
            <ol className="list-decimal pl-4 text-xs text-muted-foreground space-y-2">
              <li><strong>Sanitize Properties:</strong> Run the metadata editor to scrub creator names, revision history, and unique catalog tags.</li>
              <li><strong>Optimize Page Count:</strong> Scan documents for blank sheets and empty draft templates to save print cost and storage boundaries.</li>
              <li><strong>Extract Grid Tables:</strong> Port transaction lines, item lists, and accounting structures to Excel without manual layout entry.</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  // 6. COUNTRY BASED BANK STATEMENT SECTION
  if (isCountry) {
    const countryName = slug.includes("indian-bank") ? "India" : 
                        slug.includes("us-bank") ? "United States" : 
                        slug.includes("uk-bank") ? "United Kingdom" : "Canada";
    return (
      <div className="mt-16 space-y-12 border-t pt-16">
        <div className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" /> Regional Banking Formats & Extraction in {countryName}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Financial reporting and bank statements differ by region. Banks in the {countryName} employ distinct transactional headers, column schemas, and tax statement formats. Copying these records to spreadsheets requires adjusting formats to local accounting norms.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-primary" /> Regional Formatting Norms ({countryName})
            </h3>
            <ul className="mt-4 space-y-3 text-xs text-muted-foreground">
              {slug.includes("indian-bank") && (
                <>
                  <li><strong>Date Patterns:</strong> Parses both Indian standard dates (DD-MM-YYYY) and text configurations (e.g. 15-Jun-2026).</li>
                  <li><strong>Currency Formats:</strong> Seamlessly handles the Indian numbering system formatting (e.g., Lakhs and Crores like 1,00,000.00).</li>
                  <li><strong>Transaction Descriptions:</strong> Handles complex descriptions containing UPI, NEFT, IMPS, RTGS, and GST codes, joining wrapped text blocks.</li>
                </>
              )}
              {slug.includes("us-bank") && (
                <>
                  <li><strong>Date Patterns:</strong> Parses US standard dates (MM/DD/YYYY) and post logs.</li>
                  <li><strong>ACH Transactions:</strong> Maps ACH payments, electronic deposits, and Federal Reserve wire codes.</li>
                  <li><strong>Decimal Formats:</strong> Supports US standards (1,000.00) and separates processing fees.</li>
                </>
              )}
              {slug.includes("uk-bank") && (
                <>
                  <li><strong>Date Patterns:</strong> Parses UK standard dates (DD/MM/YYYY) and posting timestamps.</li>
                  <li><strong>Faster Payments System (FPS):</strong> Maps direct debits, standing orders, and FPS reference logs.</li>
                  <li><strong>Currency Format:</strong> Configured for GBP (£) standard balances and VAT transactions.</li>
                </>
              )}
              {slug.includes("canadian-bank") && (
                <>
                  <li><strong>Interac e-Transfer:</strong> Maps Interac references, direct deposit codes, and EFT transfers.</li>
                  <li><strong>Dual Language Formats:</strong> Handles bilingual (English/French) statement formats and descriptions cleanly.</li>
                  <li><strong>DTI Ratios:</strong> Generates sheets ready for Canadian mortgage stress tests.</li>
                </>
              )}
            </ul>
          </div>

          <div className="rounded-2xl border bg-card p-6 space-y-3">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-emerald-500" /> Best Practices for Reconciliation
            </h3>
            <ol className="list-decimal pl-4 text-xs text-muted-foreground space-y-2">
              <li><strong>Verify Totals:</strong> Compare the opening and closing balance fields in the extracted sheet against the PDF statement totals.</li>
              <li><strong>Match UPI/ACH Refs:</strong> Check reference IDs during matching to isolate duplicate entries or missing payouts.</li>
              <li><strong>Export to ERP:</strong> Convert statements directly to CSV or XLSX and upload to regional ledger ERP integrations.</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
