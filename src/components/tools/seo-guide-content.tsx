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
  FileSpreadsheet,
  Wallet,
  UserCheck,
  Percent
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
  const isUtility = slug.includes("-bill-") || slug.includes("pge") || slug.includes("comcast") || slug.includes("verizon") || slug.includes("att") || slug.includes("tmobile") || slug.includes("energy") || slug.includes("grid") || slug.includes("coned") || slug.includes("telecom") || slug.includes("vodafone") || slug.includes("airtel") || slug.includes("jio") || slug.includes("power") || slug.includes("bescom") || slug.includes("uppcl") || slug.includes("mseb");
  const isComparison = slug.includes("-vs-") || slug.includes("-alternative");
  const isIndustry = slug.startsWith("templates/");
  const isCountry = slug.includes("indian-bank") || slug.includes("us-bank") || slug.includes("uk-bank") || slug.includes("canadian-bank");
  
  // High-traffic Indian Financial Instruments
  const isEpfo = slug.includes("epfo");
  const isCams = slug.includes("cams");
  const isItr = slug.includes("itr");
  const isLic = slug.includes("lic");
  const isNps = slug.includes("nps");

  const isBankStatement = slug.includes("-statement-") && !isCreditCard && !isCountry && !isNps;

  // Render variables
  let guideJsx: React.ReactNode = null;

  // 1. BANK STATEMENT SECTION
  if (isBankStatement) {
    const bankName = h1.replace("Extract ", "").replace(" PDF Statement to Excel", "").trim();
    guideJsx = (
      <div className="space-y-12">
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
    guideJsx = (
      <div className="space-y-12">
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
            <div className="border-l-2 border-primary block-step pl-4">
              <span className="font-bold text-primary block text-sm">STEP 1</span>
              Upload statement and run the grid extractor mapping date, merchant, and decimal amounts.
            </div>
            <div className="border-l-2 border-primary block-step pl-4">
              <span className="font-bold text-primary block text-sm">STEP 2</span>
              Identify refunds and adjustments (marked with negative symbols or credit signs) and reconcile with invoices.
            </div>
            <div className="border-l-2 border-primary block-step pl-4">
              <span className="font-bold text-primary block text-sm">STEP 3</span>
              Sort by merchant name or spend category to group software subscriptions, travel expenditures, and office tools.
            </div>
            <div className="border-l-2 border-primary block-step pl-4">
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
    guideJsx = (
      <div className="space-y-12">
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
    guideJsx = (
      <div className="space-y-12">
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
    guideJsx = (
      <div className="space-y-12">
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
    guideJsx = (
      <div className="space-y-12">
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

  // 7. EPFO PASSOOK E-E-A-T GUIDE
  if (isEpfo) {
    guideJsx = (
      <div className="space-y-12">
        <div className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Wallet className="h-8 w-8 text-primary" /> Comprehensive Guide: Exporting EPF Passbooks to Excel
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            The Employees&apos; Provident Fund Organisation (EPFO) provides members with a monthly contribution ledger, also known as the EPF Passbook. This PDF contains critical fields: employer contributions, employee share deductions, pension fund credits, interest transactions, and cumulative balances.
          </p>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            For individuals auditing their pension funds, checking employer compliance, or calculating interest compounding payouts, copying data directly from the EPFO portal PDF is highly frustrating. It contains complex multi-page tables, headers, and footer details that break grid row mappings when copied.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-emerald-500" /> Mapped EPF Passbook Ledger Columns
            </h3>
            <p className="mt-2 text-xs text-muted-foreground">
              GoluPDF isolates the transaction tables of the passbook and structures them into six distinct ledger fields:
            </p>
            <div className="mt-4 overflow-hidden rounded-lg border text-xs">
              <table className="min-w-full divide-y divide-border text-left">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-2 font-medium">Excel Header</th>
                    <th className="px-4 py-2 font-medium">EPF Matching Field</th>
                    <th className="px-4 py-2 font-medium">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  <tr>
                    <td className="px-4 py-2 font-medium font-mono">Date/Month</td>
                    <td className="px-4 py-2">Transaction deposit timestamp</td>
                    <td className="px-4 py-2">Date</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium font-mono">Particulars</td>
                    <td className="px-4 py-2">Wage month description (e.g. &quot;03/2026&quot;)</td>
                    <td className="px-4 py-2">Text</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium font-mono">Employee Share</td>
                    <td className="px-4 py-2">Employee EPF deduction (12% of basic wage)</td>
                    <td className="px-4 py-2">Decimal</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium font-mono">Employer Share</td>
                    <td className="px-4 py-2">Employer share (3.67% of wage)</td>
                    <td className="px-4 py-2">Decimal</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium font-mono">Pension Fund</td>
                    <td className="px-4 py-2">Pension contribution (8.33% of wage)</td>
                    <td className="px-4 py-2">Decimal</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium font-mono">Cr / Dr</td>
                    <td className="px-4 py-2">Interest additions or withdrawal debits</td>
                    <td className="px-4 py-2">Decimal</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-6 space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" /> Security & Decryption Details
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              EPF passbooks downloaded directly from the EPFO unified member portal are standard PDFs but contain sensitive financial identity tags like your **Universal Account Number (UAN)**, PAN, and Member IDs.
            </p>
            <div className="rounded-xl bg-muted p-4 text-xs space-y-2 text-muted-foreground">
              <p><strong>🔒 Browser Sandbox Decryption:</strong> GoluPDF performs all decryption, text indexing, and table building locally on your device. We do not use third-party APIs or upload passbooks to servers. Your UAN, wage records, and provident balance remain private.</p>
              <p><strong>💡 Password Hint:</strong> If your EPF statement PDF is encrypted, the default password is usually a set combination of your birth year or account identifier. Input the decryption key locally when prompted.</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-8">
          <h3 className="text-lg font-bold text-foreground">EPFO Passbook Download & Verification Checklist</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Verify your employer monthly credits with these simple auditing steps:
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-4 text-xs text-muted-foreground">
            <div className="border-l-2 border-primary pl-4">
              <span className="font-bold text-primary block text-sm">STEP 1</span>
              Log in to the official EPFO Member Portal (passbook.epfindia.gov.in) using your UAN and Password.
            </div>
            <div className="border-l-2 border-primary pl-4">
              <span className="font-bold text-primary block text-sm">STEP 2</span>
              Select your Member ID block and download the PDF passbook for the current or previous financial year.
            </div>
            <div className="border-l-2 border-primary pl-4">
              <span className="font-bold text-primary block text-sm">STEP 3</span>
              Drag and drop the PDF into GoluPDF and select the EPFO passbook mapping configuration.
            </div>
            <div className="border-l-2 border-primary pl-4">
              <span className="font-bold text-primary block text-sm">STEP 4</span>
              Compare the Employee Share (12%) and Pension Share (8.33%) totals with your salary slips to detect credits mismatches.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 8. CAMS MUTUAL FUND CAS E-E-A-T GUIDE
  if (isCams) {
    guideJsx = (
      <div className="space-y-12">
        <div className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" /> Technical Guide: Extracting CAMS Mutual Fund CAS Logs
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            A Consolidated Account Statement (CAS) issued by CAMS (Computer Age Management Services) or Karvy (KFintech) compiles your entire mutual fund holdings across different asset management companies (AMCs) and folios. These statements are vital for portfolio consolidation, tax audit reporting, and wealth planning.
          </p>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            However, CAS PDFs are multi-column, densely formatted, and typically spread across dozens of pages. Direct copying results in broken rows, mixed folios, and misaligned transaction numbers.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border bg-card p-6 space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-emerald-500" /> CAS Holdings Mapping Schema
            </h3>
            <p className="text-xs text-muted-foreground">
              Our WebAssembly utility extracts both transaction histories and asset summary valuations, structuring them into clean columns:
            </p>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><strong>Folio Number & AMC:</strong> Groups transactions by specific AMC and account folios.</li>
              <li><strong>Scheme Name:</strong> Identifies Direct vs Regular plans and debt vs equity schemes.</li>
              <li><strong>Transaction Type:</strong> Categorizes purchase, SIP installments, redemptions, switches, and dividend payouts.</li>
              <li><strong>NAV & Units:</strong> Isolates transaction pricing (Net Asset Value), units allocated, and transaction totals.</li>
            </ul>
          </div>

          <div className="rounded-2xl border bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" /> Absolute Confidentiality for Portfolio Data
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Your CAMS Consolidated Account Statement contains your full portfolio valuation, PAN, email, residential address, and folio balances. Uploading this to standard cloud converters exposes your sensitive financial assets to third-party databases.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground font-semibold text-emerald-500">
              🔒 GoluPDF processes CAS decryption and grid building locally on your device. No financial records ever touch our web servers.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border bg-gradient-to-br from-primary/5 to-secondary/5 p-8">
          <h3 className="text-xl font-bold text-foreground">Mutual Fund Tax Auditing & Capital Gains Reconciliation</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Auditing Long-Term Capital Gains (LTCG) and Short-Term Capital Gains (STCG) for tax returns is simple with Excel:
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-3 text-xs text-muted-foreground">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-foreground">SIP Compounding Audit</h4>
              <p>Reconcile each SIP transaction date and rate against bank auto-debits to identify payment delay charges or missed portfolio logs.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-foreground">Weighted Cost of Acquisition</h4>
              <p>Calculate the average cost of acquisition for equity units easily using Excel formulas on the extracted tabular columns.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-foreground">Grandfathered NAV Tracking</h4>
              <p>Isolate units purchased before January 31, 2018, and apply grandfathering rules for Indian equity LTCG audits in your spreadsheet.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 9. ITR VERIFICATION E-E-A-T GUIDE
  if (isItr) {
    guideJsx = (
      <div className="space-y-12">
        <div className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <UserCheck className="h-8 w-8 text-primary" /> Technical Guide: Parsing ITR-V PDF Acknowledgments
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            The Income Tax Return Verification form (ITR-V) is a single-page or short PDF document issued by the Income Tax Department of India after e-filing. It summarises your total gross income, tax deductions under Chapter VI-A, net taxable income, self-assessment tax paid, TDS credits, and refund or tax due balances.
          </p>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            For individuals compiling tax logs, applying for loans, or performing financial audits, extracting figures from several assessment years is a key step. GoluPDF reads e-filing schedules client-side, structuring numbers into clean spreadsheets.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border bg-card p-6 space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-emerald-500" /> Mapped ITR Tax Fields
            </h3>
            <p className="text-xs text-muted-foreground font-mono">
              The parser captures these critical tax parameters:
            </p>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><strong>Assessment Year (AY) & PAN:</strong> Identifies tax years and unique taxpayer IDs.</li>
              <li><strong>Gross Total Income:</strong> Captures income from salary, house property, business, and capital gains.</li>
              <li><strong>Chapter VI-A Deductions:</strong> Extracts total investments under 80C, 80D, 80G, and 80TTA.</li>
              <li><strong>Tax Payable & TDS:</strong> Parses total tax payable, TDS deducted, self-assessment paid, and refunds.</li>
            </ul>
          </div>

          <div className="rounded-2xl border bg-card p-6 space-y-3">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" /> Accessing Encrypted ITR PDFs
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              ITR-V and tax logs are password-secured. The standard password format for ITR statements is your PAN (in lowercase) combined with your date of birth (DDMMYYYY).
            </p>
            <div className="bg-muted p-4 rounded-xl text-xs text-muted-foreground">
              GoluPDF prompts for this password locally in your browser to decrypt the file before parsing. We never see, store, or transmit your password or tax returns.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 10. LIC PREMIUM RECEIPT E-E-A-T GUIDE
  if (isLic) {
    guideJsx = (
      <div className="space-y-12">
        <div className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Percent className="h-8 w-8 text-primary" /> Tax Savings Audit: Extracting LIC Premium Receipts
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Life Insurance Corporation (LIC) premium receipts serve as official proof of payment for tax exemptions. Under Section 80C of the Income Tax Act, life insurance premiums paid for self, spouse, and children are deductible from gross income (up to ₹1.5 Lakhs annually).
          </p>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Auditors and taxpayers handling multiple policies face a major chore during tax filing season. Converting LIC receipt PDFs into structured spreadsheets speeds up the verification of premium splits, base premiums, and GST components.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-emerald-500" /> Mapped Premium Receipt Fields
            </h3>
            <div className="mt-4 overflow-hidden rounded-lg border text-xs">
              <table className="min-w-full divide-y divide-border text-left">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-2 font-medium">Header Field</th>
                    <th className="px-4 py-2 font-medium">Description</th>
                    <th className="px-4 py-2 font-medium">Tax Utility</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  <tr>
                    <td className="px-4 py-2 font-medium font-mono">Policy Number</td>
                    <td className="px-4 py-2">Unique life insurance policy ID</td>
                    <td className="px-4 py-2">Reconciliation matching</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium font-mono">Receipt Date</td>
                    <td className="px-4 py-2">The exact date of premium receipting</td>
                    <td className="px-4 py-2">FY assessment tagging</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium font-mono">Base Premium</td>
                    <td className="px-4 py-2">Premium amount excluding GST</td>
                    <td className="px-4 py-2">Primary 80C deduction base</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium font-mono">CGST / SGST</td>
                    <td className="px-4 py-2">Service tax and central/state levies</td>
                    <td className="px-4 py-2">GST tracking audits</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium font-mono">Total Paid</td>
                    <td className="px-4 py-2">Final gross premium debited</td>
                    <td className="px-4 py-2">Cash outflow verification</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-6 space-y-3">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" /> Local Processing Compliance
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Insurance receipts include policy terms, customer names, addresses, and premium amounts. GoluPDF operates entirely inside your local browser. All text vector mapping and formatting occur client-side, ensuring that your insurance policies are never sent online.
            </p>
            <p className="text-xs text-muted-foreground">
              Upload multiple receipts sequentially to build a unified tax-deduction ledger for easy tax filing.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 11. NPS STATEMENT E-E-A-T GUIDE
  if (isNps) {
    guideJsx = (
      <div className="space-y-12">
        <div className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" /> Technical Guide: Extracting NPS CRA Statements to Excel
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            The National Pension System (NPS) statement (issued by CRA NSDL or KFintech) tracks your retirement contributions. NPS features Tier-I accounts (mandatory pension lock-in, eligible for extra ₹50,000 deduction under Sec 80CCD(1B)) and Tier-II accounts (voluntary withdrawable investment).
          </p>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            An NPS transaction statement lists multiple pages of contribution tables, scheme holdings, asset classes (E, C, G, A), and transaction units. Copying this data directly breaks row schemas. GoluPDF parses your NPS statements locally, outputting structured Excel transaction ledgers.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border bg-card p-6 space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-emerald-500" /> NPS Excel Ledger Columns
            </h3>
            <p className="text-xs text-muted-foreground">
              Our tool extracts transaction dates, contributions, units allocated, NAV values, and investment amounts:
            </p>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><strong>PRAN:</strong> PRAN (Permanent Retirement Account Number) verification field.</li>
              <li><strong>Tier Type:</strong> Separates Tier-I and Tier-II transactions.</li>
              <li><strong>Contribution Amt:</strong> Net contribution amount before brokerage or fees.</li>
              <li><strong>Asset Allocation:</strong> Splits units across Equity (E), Corporate Bonds (C), and G-Secs (G).</li>
              <li><strong>NAV & Unit Allocation:</strong> Tracks NAV value and allocated pension units.</li>
            </ul>
          </div>

          <div className="rounded-2xl border bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" /> Secure Pension Statement Auditing
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Your NPS statement contains your PRAN, financial holdings, employer details, and personal coordinates. Keeping this private is critical. 
            </p>
            <p className="mt-2 text-xs leading-relaxed text-emerald-500 font-semibold">
              🔒 GoluPDF processes statements entirely client-side using local WebAssembly. No PRAN or retirement assets statistics are uploaded to third-party databases.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!guideJsx) return null;

  return (
    <div className="mt-16 border-t pt-16">
      {guideJsx}
      
      {/* Visual Trademark Disclaimer Card */}
      <div className="mt-12 rounded-xl border border-muted-foreground/15 bg-muted/40 p-4 text-[11px] leading-relaxed text-muted-foreground">
        <p>
          <strong>Disclaimer:</strong> GoluPDFs is a private, independent utility platform. It is not affiliated with, authorized, endorsed by, or in any way officially connected with the State Bank of India (SBI), HDFC Bank, ICICI Bank, Axis Bank, Kotak Mahindra Bank, Punjab National Bank (PNB), Bank of Baroda (BOB), Paytm, EPFO, CAMS, Karvy (KFintech), LIC, NPS, or any of their subsidiaries or affiliates. The official websites of these entities can be found at their respective domains. All product and service names, logos, brands, trademarks, and registered trademarks mentioned on this website are the property of their respective owners. Their use on GoluPDFs does not imply any affiliation with or endorsement by them.
        </p>
        <p className="mt-1.5 font-medium">
          🔒 Data Privacy: All document decryption, processing, and table extractions are conducted 100% client-side inside your browser sandbox using WebAssembly. No files or personal/financial data are uploaded, stored, or transmitted to our servers.
        </p>
      </div>
    </div>
  );
}
