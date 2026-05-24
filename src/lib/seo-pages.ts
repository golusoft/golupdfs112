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
];

export const SEO_PAGES_BY_SLUG: Record<string, SeoPagePreset> = Object.fromEntries(
  SEO_PAGES.map((p) => [p.slug, p])
);

export function getSeoPage(slug: string): SeoPagePreset | undefined {
  return SEO_PAGES_BY_SLUG[slug];
}
