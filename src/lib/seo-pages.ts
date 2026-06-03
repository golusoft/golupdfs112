/**
 * Programmatic SEO landing pages — high-intent search variants that
 * deep-link into the right tool with prefilled options.
 *
 * Each entry produces a unique landing page at /:slug with bespoke
 * H1, intro, FAQ, schema and CTA. Adding a new entry = a new SEO page.
 */
export interface SeoPagePreset {
  slug: string;
  /** Tool slug to deep-link / embed */
  tool: string;
  /** Optional URL parameter passed to the tool route (e.g. ?level=extreme) */
  toolQuery?: string;
  h1: string;
  /** Page <title> (without site suffix — that's appended automatically) */
  title: string;
  description: string;
  /** Long-form intro shown above the runner */
  intro: string;
  /** "Why" bullets unique to this intent */
  whyBullets: string[];
  /** FAQ overrides specific to this query */
  faq?: { q: string; a: string }[];
  /** Optional related cluster slugs for internal linking */
  cluster?: string[];
  /** Primary keyword for meta keywords */
  keywords: string[];
}

const compressFaq = (size: string) => [
  {
    q: `How can I compress a PDF to ${size} online?`,
    a: `Upload your PDF to GoluPDFs Compress, choose the appropriate compression preset, and click Run. Our engine automatically rasterizes high-DPI images and rebuilds a leaner PDF that targets ${size}.`,
  },
  {
    q: `Will compressing to ${size} reduce quality?`,
    a: `For most documents, you'll lose only minor visual detail at this size. Use Lossless mode if you need to keep selectable text and maximum quality, or Strong/Extreme for the smallest file possible.`,
  },
  {
    q: `Is compressing to ${size} free?`,
    a: `Yes — every compression preset on GoluPDFs is 100% free, with no watermarks, account, or daily limit. Your file is processed locally in your browser.`,
  },
];

export const SEO_PAGES: SeoPagePreset[] = [
  // ─── Compress family (super high-intent) ──────────────────────────────────
  {
    slug: "compress-pdf-to-100kb",
    tool: "compress-pdf",
    toolQuery: "level=extreme",
    h1: "Compress PDF to 100 KB online",
    title: "Compress PDF to 100 KB Online — Free",
    description:
      "Compress any PDF down to 100 KB or smaller online. Free, private, browser-based — no signup, no watermark, no upload.",
    intro:
      "Need a small PDF for an online application or visa portal? Our extreme compression preset reduces most PDFs by 80–95%, hitting the 100 KB bracket while preserving readability of text and key visuals.",
    whyBullets: [
      "Hits 100 KB target on most A4 documents in seconds",
      "Zero upload — all compression runs in your browser",
      "Adaptive image-quality engine preserves readability",
      "Free with no watermark or account",
    ],
    faq: compressFaq("100 KB"),
    cluster: ["compress-pdf-to-200kb", "compress-pdf-to-500kb", "best-pdf-compressor"],
    keywords: ["compress pdf to 100kb", "reduce pdf to 100kb online", "shrink pdf to 100kb"],
  },
  {
    slug: "compress-pdf-to-200kb",
    tool: "compress-pdf",
    toolQuery: "level=strong",
    h1: "Compress PDF to 200 KB online",
    title: "Compress PDF to 200 KB Online — Free",
    description:
      "Reduce any PDF to under 200 KB while keeping text readable. Free, fully browser-based, no upload required.",
    intro:
      "200 KB is the sweet spot for most online forms and resume uploads. Our Strong preset shrinks files toward this target while keeping pages legible and printable.",
    whyBullets: [
      "Optimized for 200 KB upload limits",
      "Browser-side — your PDF never leaves your device",
      "Crystal-clear text on most A4 pages",
      "Unlimited compressions, completely free",
    ],
    faq: compressFaq("200 KB"),
    cluster: ["compress-pdf-to-100kb", "compress-pdf-to-500kb", "best-pdf-compressor"],
    keywords: ["compress pdf to 200kb", "reduce pdf 200kb", "make pdf less than 200kb"],
  },
  {
    slug: "compress-pdf-to-500kb",
    tool: "compress-pdf",
    toolQuery: "level=medium",
    h1: "Compress PDF to 500 KB online",
    title: "Compress PDF to 500 KB Online — Free",
    description:
      "Compress PDFs to 500 KB while keeping crisp visuals. 100% browser-based and free.",
    intro:
      "Compress PDFs to 500 KB for email attachments and online portals. Our Medium preset balances size and quality beautifully.",
    whyBullets: [
      "Best quality-to-size ratio in the industry",
      "Multi-page document support",
      "No upload, no signup, no tracking",
      "Email-friendly output",
    ],
    faq: compressFaq("500 KB"),
    cluster: ["compress-pdf-to-100kb", "compress-pdf-to-200kb", "compress-pdf-for-email"],
    keywords: ["compress pdf to 500kb", "reduce pdf to 500kb", "pdf compressor 500kb"],
  },
  {
    slug: "compress-pdf-for-email",
    tool: "compress-pdf",
    toolQuery: "level=strong",
    h1: "Compress PDF for email — under 25 MB & under 10 MB",
    title: "Compress PDF for Email Attachments",
    description:
      "Make any PDF small enough to attach to Gmail (25 MB) or Outlook (20 MB). Browser-side, free, no upload.",
    intro:
      "Hitting attachment limits in Gmail, Outlook or Yahoo? Our compressor reduces large PDFs to email-friendly sizes — 25 MB, 20 MB or 10 MB — without sacrificing legibility.",
    whyBullets: [
      "Targets Gmail's 25 MB and Outlook's 20 MB limits",
      "Reduces 100 MB+ scanned PDFs to under 10 MB",
      "Lightning-fast browser-side processing",
      "Forever free, no signup",
    ],
    cluster: ["compress-pdf-to-500kb", "best-pdf-compressor"],
    keywords: ["compress pdf for email", "compress pdf gmail attachment", "shrink pdf for outlook"],
  },
  {
    slug: "best-pdf-compressor",
    tool: "compress-pdf",
    h1: "The best free PDF compressor in 2026",
    title: "Best Free PDF Compressor — Browser-Based",
    description:
      "GoluPDFs is the best free online PDF compressor — 5 quality presets, target-size mode, batch compression, all in your browser.",
    intro:
      "What makes a great PDF compressor in 2026? Speed, privacy, and presets that actually work. GoluPDFs Compress hits all three with zero compromises.",
    whyBullets: [
      "5 quality presets from lossless to extreme",
      "Batch compress up to 50 PDFs at once",
      "100% browser-based — privacy-first",
      "Live size & quality comparison",
    ],
    cluster: [
      "compress-pdf-to-100kb",
      "compress-pdf-to-200kb",
      "compress-pdf-for-email",
    ],
    keywords: ["best pdf compressor", "best free pdf compressor", "top pdf compressor 2026"],
  },
  // ─── Merge family ────────────────────────────────────────────────────────
  {
    slug: "merge-pdf-online",
    tool: "merge-pdf",
    h1: "Merge PDF online — combine PDFs in seconds",
    title: "Merge PDF Online Free — Combine PDFs",
    description:
      "Merge unlimited PDFs into one document with drag-and-drop ordering. Browser-based, free, no upload.",
    intro:
      "Combine multiple PDFs into a single polished file. Drag, drop, reorder visually, then export — every step happens in your browser.",
    whyBullets: [
      "Combine unlimited PDFs",
      "Drag-and-drop visual reordering",
      "Works with password-protected PDFs",
      "Free and unlimited use",
    ],
    cluster: ["combine-pdf-files-into-one", "merge-pdf-without-watermark"],
    keywords: ["merge pdf online", "combine pdf online", "join pdf files"],
  },
  {
    slug: "combine-pdf-files-into-one",
    tool: "merge-pdf",
    h1: "Combine PDF files into one PDF",
    title: "Combine PDF Files Into One — Free Online",
    description:
      "Combine multiple PDF files into one document. Drag-and-drop, reorder, export — all in your browser.",
    intro:
      "Combine PDF files in seconds with our visual merge tool. Reorder pages with drag-and-drop, preview before export, and download a single polished file.",
    whyBullets: [
      "Visual page sorting",
      "Combine 100+ files at once",
      "No file size limits",
      "Browser-side privacy",
    ],
    cluster: ["merge-pdf-online", "merge-pdf-without-watermark"],
    keywords: ["combine pdf files into one", "join multiple pdfs", "merge pdfs into one"],
  },
  {
    slug: "merge-pdf-without-watermark",
    tool: "merge-pdf",
    h1: "Merge PDFs without watermark",
    title: "Merge PDF Without Watermark — Free",
    description:
      "Combine PDFs without any watermark, ever. Free unlimited merging, no signup required.",
    intro:
      "Tired of compressors and merge sites stamping watermarks on your output? GoluPDFs Merge produces clean, watermark-free PDFs every time.",
    whyBullets: [
      "Zero watermarks, ever",
      "No signup or account",
      "Unlimited use",
      "Visual page sorting",
    ],
    cluster: ["merge-pdf-online", "combine-pdf-files-into-one"],
    keywords: ["merge pdf without watermark", "combine pdf no watermark", "free pdf merge no watermark"],
  },
  // ─── Split / Pages family ────────────────────────────────────────────────
  {
    slug: "split-pdf-pages",
    tool: "split-pdf",
    h1: "Split PDF pages online — break a PDF apart",
    title: "Split PDF Pages — Free Online Splitter",
    description:
      "Split any PDF by page range, every page or smart extraction. Browser-based, free, no upload.",
    intro:
      "Need to break a PDF into chapters or extract a single section? Our visual splitter gives you full control with thumbnails, ranges and ZIP export.",
    whyBullets: [
      "Split by page range or every page",
      "Visual page thumbnails",
      "ZIP export of all parts",
      "100% browser-based",
    ],
    cluster: ["extract-pages-from-pdf", "remove-pages-from-pdf"],
    keywords: ["split pdf pages", "split pdf online", "break pdf into pages"],
  },
  {
    slug: "extract-pages-from-pdf",
    tool: "extract-pages",
    h1: "Extract pages from PDF",
    title: "Extract Pages from PDF — Free Online",
    description:
      "Pull specific pages out of any PDF as a new file. Browser-based, free, no upload.",
    intro:
      "Extract a chapter, exhibit or single page from a larger PDF. Our visual extractor lets you pick exactly what you need and export it as a new compact PDF.",
    whyBullets: [
      "Visual page selection",
      "Custom range support (e.g. 1-3, 5, 7)",
      "Merge extracted pages or keep separate",
      "Browser-side, no upload",
    ],
    cluster: ["split-pdf-pages", "remove-pages-from-pdf"],
    keywords: ["extract pages from pdf", "pdf page extractor", "save pages of pdf"],
  },
  {
    slug: "remove-pages-from-pdf",
    tool: "remove-pages",
    h1: "Remove pages from PDF",
    title: "Remove Pages from PDF — Free Online",
    description:
      "Delete unwanted pages from any PDF in seconds. Visual selector, browser-based, free.",
    intro:
      "Strip out blank pages, drafts, or appendices with our visual page remover. Preview, select, and export a clean optimized PDF.",
    whyBullets: [
      "Visual page selector",
      "Range-based removal",
      "File-size optimization",
      "100% browser-based",
    ],
    cluster: ["split-pdf-pages", "extract-pages-from-pdf"],
    keywords: ["remove pages from pdf", "delete pdf page", "pdf page remover"],
  },
  // ─── Convert family ──────────────────────────────────────────────────────
  {
    slug: "pdf-to-word-converter",
    tool: "pdf-to-word",
    h1: "PDF to Word converter online",
    title: "PDF to Word Converter — Free Online",
    description:
      "Convert any PDF into an editable .docx Word document. Browser-based, free, accurate.",
    intro:
      "Get a fully editable Word document from any PDF — preserving headings, paragraphs, tables and structure with our smart extraction engine.",
    whyBullets: [
      "Editable .docx output",
      "Preserves formatting and layout",
      "Multi-column detection",
      "Free and unlimited",
    ],
    cluster: ["best-pdf-to-word", "convert-pdf-to-jpg-online"],
    keywords: ["pdf to word converter", "convert pdf to word", "pdf to docx"],
  },
  {
    slug: "best-pdf-to-word",
    tool: "pdf-to-word",
    h1: "The best PDF to Word converter in 2026",
    title: "Best PDF to Word Converter — Editable .docx",
    description:
      "GoluPDFs is the best free PDF to Word converter — fully editable .docx, preserved layout, browser-based.",
    intro:
      "When you need an editable Word document from a PDF, accuracy matters. GoluPDFs preserves typography, multi-column layouts and image placement better than the alternatives.",
    whyBullets: [
      "Industry-leading layout preservation",
      "Smart text extraction",
      "Free and unlimited",
      "Privacy-first processing",
    ],
    cluster: ["pdf-to-word-converter", "convert-pdf-to-jpg-online"],
    keywords: ["best pdf to word converter", "best free pdf to docx", "top pdf to word"],
  },
  {
    slug: "convert-pdf-to-jpg-online",
    tool: "pdf-to-jpg",
    h1: "Convert PDF to JPG online",
    title: "Convert PDF to JPG Online — HD Free",
    description:
      "Convert PDF pages to crystal-clear JPG images. HD/Ultra-HD presets, browser-based, free.",
    intro:
      "Turn every PDF page into a beautiful JPG image with custom DPI control from web-quality (72) to print-ready (300).",
    whyBullets: [
      "DPI control from 72 to 300",
      "Per-page selection",
      "ZIP all images in one click",
      "Browser-based privacy",
    ],
    cluster: ["pdf-to-word-converter", "jpg-to-pdf-online"],
    keywords: ["convert pdf to jpg online", "pdf to jpg hd", "pdf to image converter"],
  },
  {
    slug: "jpg-to-pdf-online",
    tool: "jpg-to-pdf",
    h1: "JPG to PDF online — convert images to a PDF",
    title: "JPG to PDF Online — Free Image to PDF",
    description:
      "Convert JPG, PNG and WEBP images into a polished PDF. A4, US Letter, Legal sizes, drag-to-order, free.",
    intro:
      "Upload one or many images, drag-to-order them, choose page size and margins, and export a print-ready PDF in seconds.",
    whyBullets: [
      "JPG, PNG and WEBP supported",
      "Drag-and-drop ordering",
      "A4, US Letter, Legal & custom sizes",
      "Up to 200 images per PDF",
    ],
    cluster: ["convert-pdf-to-jpg-online"],
    keywords: ["jpg to pdf online", "image to pdf converter", "png to pdf"],
  },
  // ─── Secure family ───────────────────────────────────────────────────────
  {
    slug: "protect-pdf-with-password",
    tool: "protect-pdf",
    h1: "Protect PDF with password",
    title: "Protect PDF with Password — Free Online",
    description:
      "Encrypt any PDF with a strong password and granular permissions. Browser-based, free.",
    intro:
      "Lock down sensitive documents with a strong password. Set permissions for printing, copying and editing, and ship a PDF only the right people can read.",
    whyBullets: [
      "Strong password protection",
      "Granular permissions",
      "Built-in password generator",
      "Free and unlimited",
    ],
    cluster: ["unlock-pdf-online"],
    keywords: ["protect pdf with password", "encrypt pdf", "pdf password protector"],
  },
  {
    slug: "unlock-pdf-online",
    tool: "unlock-pdf",
    h1: "Unlock PDF online — remove PDF password",
    title: "Unlock PDF Online — Remove Password Free",
    description:
      "Remove passwords from PDFs you own. 100% browser-based — your password never leaves your device.",
    intro:
      "Remove passwords from PDFs that you own and have the rights to unlock. Processing is fully local — we never see your file or password.",
    whyBullets: [
      "Local password processing",
      "Batch unlocking",
      "No upload or storage",
      "Free with no signup",
    ],
    cluster: ["protect-pdf-with-password"],
    keywords: ["unlock pdf online", "remove pdf password", "pdf password remover"],
  },
  // ─── Edit family ─────────────────────────────────────────────────────────
  {
    slug: "scan-document-to-pdf",
    tool: "scan-to-pdf",
    h1: "Scan document to PDF — mobile scanner",
    title: "Scan Document to PDF — Free Mobile Scanner",
    description:
      "Turn any photo into a clean PDF with auto edge detection and document enhancement. Free, browser-based.",
    intro:
      "Snap a photo of any document and get a polished, color-corrected PDF in seconds. Works beautifully on iOS and Android.",
    whyBullets: [
      "Auto edge detection",
      "Document enhancement",
      "Multi-page scanning",
      "Mobile-first UX",
    ],
    cluster: ["jpg-to-pdf-online"],
    keywords: ["scan document to pdf", "scan to pdf", "mobile pdf scanner"],
  },
  {
    slug: "sign-pdf-online",
    tool: "sign-pdf",
    h1: "Sign PDF online — draw, type or upload",
    title: "Sign PDF Online — Free e-Signature",
    description:
      "Sign any PDF in seconds. Draw, type or upload your signature with smart placement. Free, browser-based.",
    intro:
      "Get contracts, NDAs and forms signed without leaving your browser. Draw your signature, type it with our handwriting font, or upload an image — then drag it where you need it.",
    whyBullets: [
      "Draw, type or upload",
      "Reusable signature presets",
      "Smart placement guide",
      "Free and unlimited",
    ],
    keywords: ["sign pdf online", "esign pdf", "free pdf signer"],
  },
  {
    slug: "add-page-numbers-to-pdf",
    tool: "page-numbers",
    h1: "Add page numbers to PDF",
    title: "Add Page Numbers to PDF — Free Online",
    description:
      "Add beautiful page numbers to any PDF with custom typography and positioning. Browser-based, free.",
    intro:
      "Number your PDF pages with full control over format, position and style — perfect for reports, ebooks and academic papers.",
    whyBullets: [
      "9 position presets",
      "Custom format strings (1, 1/N, Page 1)",
      "Per-page range control",
      "Live preview",
    ],
    keywords: ["add page numbers to pdf", "pdf page numbers", "number pdf pages"],
  },
  {
    slug: "watermark-pdf-online",
    tool: "watermark-pdf",
    h1: "Watermark PDF online — text & image",
    title: "Watermark PDF Online — Add Text or Image",
    description:
      "Add a beautiful text or image watermark to any PDF with opacity and tiling control. Free, browser-based.",
    intro:
      "Brand any PDF with a confidential stamp, copyright text or logo watermark. Full control over opacity, rotation and tiling.",
    whyBullets: [
      "Text or image watermarks",
      "Opacity 0–100% control",
      "Tiled / single placement",
      "Live preview",
    ],
    keywords: ["watermark pdf online", "add watermark pdf", "pdf watermark tool"],
  },
  // ─── Metadata Editor Pro Slugs ──────────────────────────────────────────
  {
    slug: "remove-pdf-metadata",
    tool: "pdf-metadata-viewer",
    toolQuery: "action=scrub",
    h1: "Remove PDF Metadata Online",
    title: "Remove PDF Metadata Online — Free GDPR Scrub",
    description: "Safely strip author tags, tracking signatures, creation dates, and XML objects from your PDF in your browser.",
    intro: "Remove all metadata from your PDFs in one click. Our client-side GDPR Safe Scrub ensures your document details remain private before sharing.",
    whyBullets: [
      "Wipes Title, Author, Creator, and modification stamps instantly",
      "Clears hidden XMP XML payload streams client-side",
      "No upload — PDF is scrubbed inside browser memory",
      "Completely free with no limit on file size",
    ],
    keywords: ["remove pdf metadata", "delete pdf metadata", "strip pdf metadata free"],
  },
  {
    slug: "check-pdf-metadata",
    tool: "pdf-metadata-viewer",
    h1: "Check PDF Metadata Online",
    title: "Check PDF Metadata Online — Free Document Inspector",
    description: "Check embedded properties and keywords in any PDF. Inspect headers and tags client-side for tracking signatures.",
    intro: "Verify what metadata properties are hidden in your PDF files. Upload your document to inspect its properties instantly in your browser.",
    whyBullets: [
      "View standard fields: Title, Author, Creator, Subject",
      "Check modification dates and PDF version details",
      "Identify tracking tags and unique catalog IDs",
      "No registration or signups required",
    ],
    keywords: ["check pdf metadata", "inspect pdf properties", "view hidden pdf tags"],
  },
  {
    slug: "pdf-author-checker",
    tool: "pdf-metadata-viewer",
    h1: "PDF Author Checker & Editor",
    title: "PDF Author Checker — Check & Change PDF Authorship",
    description: "Inspect or change the author name tag in any PDF document. Quick client-side author metadata editing.",
    intro: "Need to verify or remove the author tag in a PDF before submitting it for double-blind review or public release? Edit it instantly on GoluPDF.",
    whyBullets: [
      "Instantly read the Author property of any PDF",
      "Modify or delete author tags in seconds",
      "100% private — your document never leaves your machine",
      "Maintains PDF formatting and layout structure",
    ],
    keywords: ["pdf author checker", "change pdf author name", "edit pdf author metadata"],
  },
  {
    slug: "pdf-properties-viewer",
    tool: "pdf-metadata-viewer",
    h1: "PDF Properties Viewer online",
    title: "PDF Properties Viewer — Inspect Document Metadata",
    description: "View standard PDF properties, catalog versions, page sizes, and fonts client-side for free.",
    intro: "Gain full transparency into your PDF documents. View creation dates, creator software, layout details, and catalog structures instantly.",
    whyBullets: [
      "Displays standard catalog tags and properties",
      "Find out which tool or software generated the PDF",
      "Private and browser-based, no uploads or signups",
      "Fast, sub-second execution",
    ],
    keywords: ["pdf properties viewer", "read pdf metadata", "view pdf creator software"],
  },
  {
    slug: "pdf-privacy-checker",
    tool: "pdf-metadata-viewer",
    h1: "PDF Privacy Checker & GDPR Audit",
    title: "PDF Privacy Checker — Detect Hidden Tracking Data",
    description: "Audit your PDF documents for GDPR privacy leaks. Scan for timezone logs, creator footprints, and unique IDs.",
    intro: "Are you leaking confidential metadata in your corporate PDFs? Scan your files client-side to verify if their properties comply with privacy audits.",
    whyBullets: [
      "Identifies software tags and document GUID structures",
      "Checks for creation time zone and device stamps",
      "Rates document privacy health with an audit score",
      "One-click scrub to anonymize files instantly",
    ],
    keywords: ["pdf privacy checker", "gdpr pdf audit", "anonymize pdf metadata"],
  },

  // ─── Blank Page Detector Pro Slugs ──────────────────────────────────────
  {
    slug: "remove-blank-pages-pdf",
    tool: "pdf-blank-page-detector",
    toolQuery: "action=remove-blanks",
    h1: "Remove blank pages from PDF online",
    title: "Remove Blank Pages from PDF Online — Free & Visual",
    description: "Detect and delete blank pages from any PDF document. Adjust sensitivity, estimate paper savings, and download.",
    intro: "Clean up your document layouts. Automatically locate blank or near-blank pages and remove them visually in one click.",
    whyBullets: [
      "Adjustable blankness threshold to catch watermarks or light lines",
      "Estimate print budget and ink cartridge volume savings",
      "Visual page selector with bulk deletion",
      "100% browser-based, keeping your documents private",
    ],
    keywords: ["remove blank pages pdf", "delete empty pages pdf", "clean pdf pages"],
  },
  {
    slug: "delete-empty-pages-pdf",
    tool: "pdf-blank-page-detector",
    h1: "Delete empty pages in PDF files",
    title: "Delete Empty Pages in PDF — Free Visual Deletion",
    description: "Scan your PDF for empty pages and delete them. Optimize documents for print and email attachments.",
    intro: "Remove unwanted space from your PDF reports or presentations. Our empty page scanner helps keep your documents compact and professional.",
    whyBullets: [
      "Instantly identifies empty sheet layouts",
      "Side-by-side zoom preview of flagged pages",
      "Saves paper sheets and ink cartridges",
      "Completely free to use with no registrations",
    ],
    keywords: ["delete empty pages pdf", "delete blank pdf pages", "pdf empty page remover"],
  },
  {
    slug: "clean-pdf-before-printing",
    tool: "pdf-blank-page-detector",
    h1: "Clean PDF before printing — save paper & ink",
    title: "Clean PDF Before Printing — Ink & Paper Savings Calculator",
    description: "Check your PDF for blank sheets, duplicates, and near-duplicates to minimize printing cost and ink volume.",
    intro: "Reduce print cost and carbon footprint. Detect empty pages, calculate savings in real-time, and download a printer-optimized file.",
    whyBullets: [
      "Estimates total printing cost based on sheets count",
      "Ink cartridge calculator displays estimated savings",
      "Identifies identical duplicate pages client-side",
      "Prints clean documents without wasted blank pages",
    ],
    keywords: ["clean pdf before printing", "save paper printing pdf", "reduce print cost pdf"],
  },

  // ─── Table Extractor Pro Slugs ──────────────────────────────────────────
  {
    slug: "extract-invoice-table-from-pdf",
    tool: "pdf-table-extractor",
    toolQuery: "preset=invoice",
    h1: "Extract invoice table from PDF to Excel",
    title: "Extract Invoice Tables from PDF — Convert to Excel",
    description: "Extract line item tables from invoice PDFs into clean Excel or CSV sheets. Free browser-side converter.",
    intro: "Automate invoice audits. Extract bill tables, item descriptions, quantities, unit prices, and tax columns instantly in your browser.",
    whyBullets: [
      "Pre-defined column templates for invoices",
      "Grid editor to adjust unit values and tax percentages",
      "Fast client-side tabular data compilation",
      "Keep invoice records private on your device",
    ],
    keywords: ["extract invoice table from pdf", "convert invoice pdf to excel", "pdf invoice parser"],
  },
  {
    slug: "extract-research-tables-from-pdf",
    tool: "pdf-table-extractor",
    toolQuery: "preset=research",
    h1: "Extract scientific research tables from PDF",
    title: "Extract Scientific Tables from PDF — Excel & CSV Export",
    description: "Digitize research tables, matrices, and data charts from PDF papers. Map columns and export to Excel.",
    intro: "Extract research data tables from academic papers, journals, and reports. Adjust merged cell mappings and download structured CSVs.",
    whyBullets: [
      "Merged Cell Detection and multi-page tables joining",
      "Reconstruct complex research grids accurately",
      "Export to XLS (Excel XML), CSV, and JSON",
      "Free to use, keeping your draft files secure",
    ],
    keywords: ["extract research tables from pdf", "pdf table extraction tool", "academic table converter"],
  },

  // ─── Comparisons & FAQ Slugs ────────────────────────────────────────────
  {
    slug: "golupdf-vs-ilovepdf",
    tool: "compress-pdf",
    h1: "GoluPDF vs iLovePDF — why browser-side is better",
    title: "GoluPDF vs iLovePDF — Complete Security & Speed Comparison",
    description: "Compare GoluPDF and iLovePDF. Discover why WebAssembly-based client processing is safer and faster than cloud uploads.",
    intro: "Evaluating GoluPDF and iLovePDF for your company? Read our complete comparison highlighting local browser-side execution vs. server-side cloud uploads.",
    whyBullets: [
      "GoluPDF runs 100% locally in your browser cache",
      "Zero file uploads means absolute confidentiality and compliance",
      "No subscription gates or daily tool limits",
      "Vibrant modern UI with instant previews",
    ],
    keywords: ["golupdf vs ilovepdf", "ilovepdf alternative", "browser-side pdf compression"],
  },
  {
    slug: "golupdf-vs-smallpdf",
    tool: "compress-pdf",
    h1: "GoluPDF vs Smallpdf — comparison of PDF tools",
    title: "GoluPDF vs Smallpdf — Free Local PDF Editor Comparison",
    description: "Compare GoluPDF and Smallpdf. Learn how client-side WebAssembly saves time and secures private files.",
    intro: "Compare GoluPDF vs Smallpdf. See how GoluPDF offers free visual editing, page organization, and metadata scrubbing without subscription prompts.",
    whyBullets: [
      "No signup prompts or mandatory email registers",
      "WASM tools compile PDFs locally at offline speeds",
      "Includes advanced tools like GDPR Metadata Scrub",
      "Unlimited batch conversions for free",
    ],
    keywords: ["golupdf vs smallpdf", "smallpdf alternative", "free pdf editors 2026"],
  },
  {
    slug: "golupdf-vs-adobe",
    tool: "compress-pdf",
    h1: "GoluPDF vs Adobe Acrobat Web alternative",
    title: "GoluPDF vs Adobe Acrobat Web — Free PDF Tools Comparison",
    description: "Compare GoluPDF and Adobe Acrobat web services. Discover a lightweight, client-side alternative with zero subscription gates.",
    intro: "Looking for an Adobe Acrobat Web alternative? Discover how GoluPDF runs high-fidelity PDF editing and combining features directly inside browser memory.",
    whyBullets: [
      "Runs instantly without installing heavyweight desktop clients",
      "No account or creative cloud subscription required",
      "WASM-powered rendering maintains vector-sharp details",
      "Private and safe for corporate contracts",
    ],
    keywords: ["golupdf vs adobe", "adobe acrobat alternative", "free online pdf editor alternative"],
  },
  {
    slug: "how-to-extract-table-from-pdf",
    tool: "pdf-table-extractor",
    h1: "How to extract table from PDF to Excel",
    title: "How to Extract Tables from PDF to Excel — Step-by-Step Guide",
    description: "Step-by-step guide to extract tabular data from PDFs online without copy-pasting. Visual column mapper tutorial.",
    intro: "Learn how to parse table grids from any PDF. GoluPDF makes it easy to map columns and download clean multi-sheet Excel files locally.",
    whyBullets: [
      "Step 1: Upload PDF to GoluPDF Table Extractor",
      "Step 2: Check detected tables on page preview panels",
      "Step 3: Modify cells in the spreadsheet UI if needed",
      "Step 4: Click export and download as Excel XLSX",
    ],
    keywords: ["how to extract table from pdf", "pdf to excel table conversion", "parse table data from pdf"],
  },
  {
    slug: "how-to-remove-blank-pages-from-pdf",
    tool: "pdf-blank-page-detector",
    h1: "How to remove blank pages from PDF online",
    title: "How to Remove Blank Pages from PDF Online — Visual Guide",
    description: "Learn how to detect and remove empty pages in a PDF document. Quick visual instructions using GoluPDF.",
    intro: "Strip blank pages or empty scanned drafts from your document in minutes. Follow this visual step-by-step tutorial.",
    whyBullets: [
      "Step 1: Upload document to Blank Page Detector",
      "Step 2: Adjust sensitivity sliders to scan for blank sheets",
      "Step 3: Auto-select and double check thumbnails",
      "Step 4: Delete pages and download optimized PDF",
    ],
    keywords: ["how to remove blank pages from pdf", "delete blank sheets pdf", "pdf clean blank pages guide"],
  },
  {
    slug: "how-to-remove-metadata-from-pdf",
    tool: "pdf-metadata-viewer",
    h1: "How to remove metadata from PDF online",
    title: "How to Remove Metadata from PDF — GDPR Safe Scrub Guide",
    description: "Learn how to audit and remove hidden metadata, author tags, and software footprints from PDFs client-side.",
    intro: "Keep your files confidential. Our step-by-step guide walks you through checking properties and scrubbing document tags client-side.",
    whyBullets: [
      "Step 1: Upload PDF to Metadata Viewer & Editor",
      "Step 2: Inspect title, author, software, and timestamps",
      "Step 3: Run GDPR Safe Scrub to wipe all identifiers",
      "Step 4: Save the anonymized PDF to your device",
    ],
    keywords: ["how to remove metadata from pdf", "strip pdf author tags", "sanitize pdf files gdpr"],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// PROGRAMMATIC SEO DYNAMIC GENERATOR (100+ SEO pages)
// ─────────────────────────────────────────────────────────────────────────────

const BANKS = [
  { name: "HDFC Bank", key: "hdfc" },
  { name: "State Bank of India (SBI)", key: "sbi" },
  { name: "Axis Bank", key: "axis" },
  { name: "ICICI Bank", key: "icici" },
  { name: "Kotak Mahindra Bank", key: "kotak" },
  { name: "Punjab National Bank (PNB)", key: "pnb" },
  { name: "Bank of Baroda (BOB)", key: "bob" },
  { name: "Canara Bank", key: "canara" },
  { name: "Union Bank of India", key: "union" },
  { name: "Yes Bank", key: "yes" },
  { name: "IDFC First Bank", key: "idfc" },
  { name: "IndusInd Bank", key: "indusind" },
  { name: "Federal Bank", key: "federal" },
  { name: "HSBC Bank", key: "hsbc" },
  { name: "Standard Chartered", key: "standard-chartered" },
  { name: "Citi Bank", key: "citi" },
  { name: "Chase Bank", key: "chase" },
  { name: "Wells Fargo", key: "wells-fargo" },
  { name: "Bank of America", key: "bank-of-america" },
  { name: "Barclays", key: "barclays" },
  { name: "Lloyds Bank", key: "lloyds" },
  { name: "TD Bank", key: "td" },
  { name: "Royal Bank of Canada", key: "rbc" },
  { name: "ANZ Bank", key: "anz" },
  { name: "Westpac", key: "westpac" },
  { name: "Bank of India", key: "boi" },
  { name: "UCO Bank", key: "uco" },
  { name: "Central Bank of India", key: "central-bank" },
  { name: "Bandhan Bank", key: "bandhan" },
  { name: "RBL Bank", key: "rbl" },
  { name: "DBS Bank", key: "dbs" },
  { name: "Citibank India", key: "citi-india" },
  { name: "Standard Chartered India", key: "standard-chartered-india" },
  { name: "Paytm Payments Bank", key: "paytm" },
  { name: "HSBC India", key: "hsbc-india" },
  { name: "NatWest", key: "natwest" },
  { name: "Santander", key: "santander" },
  { name: "Halifax", key: "halifax" },
  { name: "Societe Generale", key: "socgen" },
  { name: "Deutsche Bank", key: "deutsche" }
];

const PLATFORMS = [
  { name: "Stripe", key: "stripe" },
  { name: "QuickBooks", key: "quickbooks" },
  { name: "Xero", key: "xero" },
  { name: "Zoho Invoice", key: "zoho" },
  { name: "FreshBooks", key: "freshbooks" },
  { name: "Wave Accounting", key: "wave" },
  { name: "PayPal", key: "paypal" },
  { name: "Square", key: "square" },
  { name: "Shopify", key: "shopify" },
  { name: "Bill.com", key: "bill" },
  { name: "Sage", key: "sage" },
  { name: "Salesforce", key: "salesforce" },
  { name: "HubSpot", key: "hubspot" },
  { name: "Chargebee", key: "chargebee" },
  { name: "Recurly", key: "recurly" },
  { name: "Invoicera", key: "invoicera" },
  { name: "Harvest", key: "harvest" },
  { name: "Toggl", key: "toggl" },
  { name: "Fiserv", key: "fiserv" },
  { name: "Adyen", key: "adyen" },
  { name: "Zoho Books", key: "zoho-books" },
  { name: "Stripe Billing", key: "stripe-billing" },
  { name: "Gumroad", key: "gumroad" },
  { name: "Payoneer", key: "payoneer" },
  { name: "Wise", key: "wise" },
  { name: "Revolut", key: "revolut" },
  { name: "Monzo", key: "monzo" },
  { name: "N26", key: "n26" },
  { name: "Mercury Bank", key: "mercury" },
  { name: "Brex", key: "brex" },
  { name: "Ramp", key: "ramp" },
  { name: "Deel", key: "deel" },
  { name: "Gusto", key: "gusto" },
  { name: "Rippling", key: "rippling" },
  { name: "Etsy", key: "etsy" },
  { name: "Amazon Seller Central", key: "amazon-seller" },
  { name: "eBay Seller", key: "ebay-seller" },
  { name: "FastSpring", key: "fastspring" },
  { name: "Paddle", key: "paddle" },
  { name: "GoCardless", key: "gocardless" }
];

const INDUSTRIES = [
  { name: "Legal & Law Firms", key: "legal" },
  { name: "Financial & Wealth Management", key: "financial" },
  { name: "Real Estate & Housing", key: "real-estate" },
  { name: "Academic & Scientific Research", key: "academic" },
  { name: "Medical & Healthcare", key: "medical" },
  { name: "Insurance & Auditing", key: "insurance" },
  { name: "Human Resources (HR)", key: "human-resources" },
  { name: "Software & IT Services", key: "software-it" },
  { name: "Retail & E-commerce Operations", key: "retail" },
  { name: "Marketing & Creative Agencies", key: "marketing" },
  { name: "Consulting Firms", key: "consulting" },
  { name: "Hospitality & Tourism", key: "hospitality" },
  { name: "Construction & Engineering", key: "construction" },
  { name: "Logistics & Supply Chain", key: "logistics" },
  { name: "Education & Schools", key: "education" },
  { name: "Nonprofit Organizations", key: "nonprofit" },
  { name: "Government & Public Sector", key: "government" },
  { name: "Architecture & Design", key: "architecture" },
  { name: "Media & Entertainment", key: "media" },
  { name: "Energy & Utilities", key: "energy" },
  { name: "Agriculture & Farming", key: "agriculture" },
  { name: "Automotive & Transport", key: "automotive" },
  { name: "Freelancers & Solopreneurs", key: "freelance" },
  { name: "E-commerce Operations", key: "ecommerce" },
  { name: "Venture Capital & Private Equity", key: "vc-pe" }
];

const CREDIT_CARDS = [
  { name: "Chase Credit Card", key: "chase-cc" },
  { name: "American Express (Amex)", key: "amex" },
  { name: "Capital One Credit Card", key: "capital-one-cc" },
  { name: "Citi Credit Card", key: "citi-cc" },
  { name: "Bank of America Credit Card", key: "boa-cc" },
  { name: "Apple Card", key: "apple-card" },
  { name: "Wells Fargo Credit Card", key: "wells-fargo-cc" },
  { name: "Barclays Credit Card", key: "barclays-cc" },
  { name: "HDFC Credit Card", key: "hdfc-cc" },
  { name: "SBI Credit Card", key: "sbi-cc" },
  { name: "Axis Credit Card", key: "axis-cc" },
  { name: "ICICI Credit Card", key: "icici-cc" },
  { name: "Kotak Credit Card", key: "kotak-cc" },
  { name: "Discover Credit Card", key: "discover" },
  { name: "Amazon Prime Rewards Visa", key: "amazon-visa" },
  { name: "Fidelity Rewards Visa", key: "fidelity-visa" },
  { name: "USAA Credit Card", key: "usaa-cc" },
  { name: "Navy Federal Credit Card", key: "navy-federal-cc" },
  { name: "Discover IT Card", key: "discover-it" },
  { name: "Chase Freedom", key: "chase-freedom" }
];

const UTILITIES = [
  { name: "PG&E (Pacific Gas & Electric)", key: "pge" },
  { name: "Comcast Xfinity", key: "comcast" },
  { name: "Verizon Wireless", key: "verizon" },
  { name: "AT&T Business", key: "att" },
  { name: "T-Mobile", key: "tmobile" },
  { name: "Duke Energy", key: "duke-energy" },
  { name: "Southern California Edison", key: "sce" },
  { name: "National Grid", key: "national-grid" },
  { name: "Con Edison", key: "coned" },
  { name: "British Gas", key: "british-gas" },
  { name: "EDF Energy", key: "edf" },
  { name: "Telstra", key: "telstra" },
  { name: "Rogers Communications", key: "rogers" },
  { name: "Bell Canada", key: "bell" },
  { name: "Orange Telecom", key: "orange" },
  { name: "Vodafone", key: "vodafone" },
  { name: "Airtel Bill", key: "airtel" },
  { name: "Jio Postpaid", key: "jio" },
  { name: "Tata Power", key: "tata-power" },
  { name: "BESCOM", key: "bescom" }
];

// Generate bank statement routes programmatically
const BANK_SEO_PAGES: SeoPagePreset[] = BANKS.map((bank) => ({
  slug: `extract-${bank.key}-statement-pdf-to-excel`,
  tool: "pdf-table-extractor",
  toolQuery: `preset=bank-statement&bank=${bank.key}`,
  h1: `Extract ${bank.name} PDF Statement to Excel`,
  title: `Convert ${bank.name} Statement PDF to Excel Online`,
  description: `Extract transaction tables from ${bank.name} statements directly into clean Excel (.xlsx) sheets. 100% browser-side, secure, and free.`,
  intro: `Need to export transaction details from your ${bank.name} PDF bank statements into Excel or CSV for budgeting or auditing? GoluPDF does it client-side without storing your financial records.`,
  whyBullets: [
    `Optimized parsing matching standard ${bank.name} header schemas`,
    `Automatic Debit, Credit, and Balance column identification`,
    `100% browser-based processing keeps your bank accounts safe`,
    `Multi-page statement support merges split tables onto one sheet`,
  ],
  faq: [
    { q: `How do I extract a ${bank.name} PDF statement to Excel?`, a: `Upload your PDF statement to GoluPDF's Table Extractor, configure the Bank Statement mapping options, and click 'Run Table Extractor'. Your tables will compile instantly to download as an Excel workbook.` },
    { q: `Are my banking credentials or statements stored?`, a: `Never. GoluPDF operates entirely client-side using local WebAssembly modules. Your statements are parsed in your browser cache and never hit our web servers.` }
  ],
  keywords: [`extract ${bank.key} statement pdf to excel`, `${bank.key} statement converter`, `${bank.key} pdf to csv`]
}));

// Generate software invoice routes programmatically
const INVOICE_SEO_PAGES: SeoPagePreset[] = PLATFORMS.map((platform) => ({
  slug: `extract-${platform.key}-invoice-pdf-to-excel`,
  tool: "pdf-table-extractor",
  toolQuery: `preset=invoice&platform=${platform.key}`,
  h1: `Extract ${platform.name} Invoice PDF to Excel`,
  title: `Convert ${platform.name} Invoice PDF to Excel Online`,
  description: `Extract line item tables from ${platform.name} invoices directly into clean Excel (.xlsx) or CSV sheets. Free browser-side converter.`,
  intro: `Automate audits and tracking. Extract bill tables, item descriptions, quantities, unit prices, and tax columns from ${platform.name} invoices instantly.`,
  whyBullets: [
    `Pre-defined column templates matching ${platform.name} invoices`,
    `Adjust unit values, totals, and tax slabs in the grid editor`,
    `Instant XML Excel and CSV downloads in your browser`,
    `No software installs or credit card signups required`,
  ],
  faq: [
    { q: `How do I extract a ${platform.name} invoice PDF?`, a: `Upload the invoice document to GoluPDF Table Extractor, choose the Invoice structure mapping option, review the lines in the grid editor, and click download.` },
    { q: `Does this support batch processing of ${platform.name} receipts?`, a: `Yes, you can extract tables from multiple documents or process multi-page invoice items continuously.` }
  ],
  keywords: [`extract ${platform.key} invoice pdf to excel`, `convert ${platform.key} invoice to csv`, `${platform.key} pdf invoice parser`]
}));

// Generate industry tool template directories programmatically (25 industries * 6 tool mappings = 150 pages)
const INDUSTRY_PDF_TOOLS = [
  { slug: "compress-pdf", suffix: "compress", label: "Compress PDFs" },
  { slug: "merge-pdf", suffix: "merge", label: "Merge PDFs" },
  { slug: "sign-pdf", suffix: "sign", label: "Sign PDFs" },
  { slug: "pdf-table-extractor", suffix: "extract-tables", label: "Extract Tables" },
  { slug: "pdf-metadata-viewer", suffix: "scrub-metadata", label: "Scrub Metadata" },
  { slug: "pdf-blank-page-detector", suffix: "remove-blank-pages", label: "Remove Empty Pages" }
];

const INDUSTRY_SEO_PAGES: SeoPagePreset[] = INDUSTRIES.flatMap((industry) => 
  INDUSTRY_PDF_TOOLS.map((tool) => ({
    slug: `templates/${industry.key}/${tool.suffix}`,
    tool: tool.slug,
    h1: `${tool.label} for ${industry.name} — Free & Secure`,
    title: `${tool.label} for ${industry.name} | Online Document Templates`,
    description: `Optimize, organize, and manage documents for ${industry.name}. Professional, client-side PDF utility built for ${industry.name.toLowerCase()} workflows.`,
    intro: `Streamline operations in ${industry.name}. Use our premium browser-based ${tool.label.toLowerCase()} utility to customize, sanitize, and verify your document assets instantly.`,
    whyBullets: [
      `Tailored templates matching standard ${industry.name.toLowerCase()} folders`,
      `100% browser-based security for highly sensitive regulatory records`,
      `No file limits, signups, or subscription prompts`,
      `Frictionless and fast operation in sub-seconds`,
    ],
    faq: [
      { q: `Why should I use GoluPDF for ${industry.name}?`, a: `Because we process documents 100% inside your browser using WebAssembly. This ensures absolute privacy and compliance with HIPAA, GDPR, and legal confidentiality standards.` },
      { q: `Is it free for large teams in ${industry.name}?`, a: `Yes. All GoluPDF utilities are fully unlocked and free for everyone with no watermarks or registrations.` }
    ],
    keywords: [`${industry.key} pdf tools`, `${tool.suffix} for ${industry.key}`, `${industry.key} document templates`]
  }))
);

// Generate credit card statement routes programmatically
const CREDIT_CARD_SEO_PAGES: SeoPagePreset[] = CREDIT_CARDS.map((card) => ({
  slug: `extract-${card.key}-statement-pdf-to-excel`,
  tool: "pdf-table-extractor",
  toolQuery: `preset=credit-card&card=${card.key}`,
  h1: `Extract ${card.name} PDF Statement to Excel`,
  title: `Convert ${card.name} Statement PDF to Excel Online`,
  description: `Extract transaction tables from ${card.name} statements directly into clean Excel (.xlsx) or CSV sheets. 100% browser-side, secure, and free.`,
  intro: `Need to export transaction details from your ${card.name} PDF credit card statements into Excel or CSV for budgeting or auditing? GoluPDF does it client-side without storing your financial records.`,
  whyBullets: [
    `Optimized parsing matching standard ${card.name} header schemas`,
    `Automatic transaction date and amount column identification`,
    `100% browser-based processing keeps your card records safe`,
    `Multi-page statement support merges split tables onto one sheet`,
  ],
  faq: [
    { q: `How do I extract a ${card.name} PDF statement to Excel?`, a: `Upload your PDF statement to GoluPDF's Table Extractor, configure the Credit Card Statement mapping options, and click 'Run Table Extractor'. Your tables will compile instantly to download as an Excel workbook.` },
    { q: `Are my credit card details or statements stored?`, a: `Never. GoluPDF operates entirely client-side using local WebAssembly modules. Your statements are parsed in your browser cache and never hit our web servers.` }
  ],
  keywords: [`extract ${card.key} statement pdf to excel`, `${card.key} statement converter`, `${card.key} pdf to csv`]
}));

// Generate utility bill routes programmatically
const UTILITY_SEO_PAGES: SeoPagePreset[] = UTILITIES.map((utility) => ({
  slug: `extract-${utility.key}-bill-pdf-to-excel`,
  tool: "pdf-table-extractor",
  toolQuery: `preset=utility-bill&utility=${utility.key}`,
  h1: `Extract ${utility.name} Bill PDF to Excel`,
  title: `Convert ${utility.name} Bill PDF to Excel Online`,
  description: `Extract transaction tables and item lists from ${utility.name} bills directly into clean Excel (.xlsx) or CSV sheets. 100% browser-side, secure, and free.`,
  intro: `Need to export transaction details and charge tables from your ${utility.name} utility bills into Excel or CSV? GoluPDF does it client-side without storing your records.`,
  whyBullets: [
    `Optimized parsing matching standard ${utility.name} bill schemas`,
    `Automatic billing period and amount column identification`,
    `100% browser-based processing keeps your details safe`,
    `Multi-page statement support merges split tables onto one sheet`,
  ],
  faq: [
    { q: `How do I extract a ${utility.name} PDF bill to Excel?`, a: `Upload your PDF bill to GoluPDF's Table Extractor, configure the Utility Bill mapping options, and click 'Run Table Extractor'. Your tables will compile instantly to download as an Excel workbook.` },
    { q: `Are my billing details or bills stored?`, a: `Never. GoluPDF operates entirely client-side using local WebAssembly modules. Your statements are parsed in your browser cache and never hit our web servers.` }
  ],
  keywords: [`extract ${utility.key} bill pdf to excel`, `${utility.key} bill converter`, `${utility.key} pdf to csv`]
}));

// Append dynamic programmatic lists to the main list
SEO_PAGES.push(
  ...BANK_SEO_PAGES, 
  ...INVOICE_SEO_PAGES, 
  ...INDUSTRY_SEO_PAGES,
  ...CREDIT_CARD_SEO_PAGES,
  ...UTILITY_SEO_PAGES
);

export const SEO_PAGES_BY_SLUG: Record<string, SeoPagePreset> = Object.fromEntries(
  SEO_PAGES.map((p) => [p.slug, p])
);

export function getSeoPage(slug: string): SeoPagePreset | undefined {
  return SEO_PAGES_BY_SLUG[slug];
}

