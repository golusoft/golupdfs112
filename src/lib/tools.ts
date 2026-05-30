/**
 * Tool registry — single source of truth for all PDF tools.
 * Each tool has a slug, metadata, SEO copy, FAQ, and an `engine` key
 * pointing to a processor in /lib/pdf/processors.
 */
import type { LucideIcon } from "lucide-react";
import {
  Archive as ArchiveIcon,
  Combine,
  Scissors,
  Image as ImageIcon,
  FileImage,
  LayoutGrid,
  Trash2,
  RotateCw,
  Hash,
  Lock,
  Unlock,
  Droplet,
  PenLine,
  FileText,
  FileType2,
  FileSpreadsheet,
  Sheet,
  FileBarChart,
  Presentation,
  ScanText,
  Camera,
  Crop,
  EyeOff,
  Highlighter,
  Tag,
  Layers,
  BookOpen,
  GitCompare,
  Sparkles,
} from "lucide-react";

export type ToolCategory =
  | "organize"
  | "convert"
  | "edit"
  | "secure"
  | "optimize"
  | "ai"
  | "business";

export const CATEGORIES: Record<ToolCategory, { label: string; description: string; color: string }> = {
  organize: { label: "Organize", description: "Merge, split, rotate & rearrange pages", color: "from-blue-500 to-cyan-500" },
  convert: { label: "Convert", description: "Convert to and from PDF formats", color: "from-violet-500 to-fuchsia-500" },
  edit: { label: "Edit", description: "Annotate, sign, watermark & more", color: "from-emerald-500 to-teal-500" },
  secure: { label: "Secure", description: "Protect, redact & control access", color: "from-amber-500 to-rose-500" },
  optimize: { label: "Optimize", description: "Compress and reduce PDF size", color: "from-pink-500 to-rose-500" },
  ai: { label: "AI Suite", description: "Intelligent document workflows", color: "from-indigo-500 to-purple-500" },
  business: { label: "Business Suite", description: "Invoices, quotes, receipts & calculations", color: "from-amber-500 to-orange-500" },
};

export interface ToolFAQ {
  q: string;
  a: string;
}

export interface Tool {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  category: ToolCategory;
  icon: LucideIcon;
  badge?: "popular" | "new" | "pro" | "ai";
  features: string[];
  /** key referencing a processor in /lib/pdf/processors */
  engine:
    | "compress"
    | "merge"
    | "split"
    | "pdf-to-jpg"
    | "jpg-to-pdf"
    | "organize"
    | "remove-pages"
    | "rotate"
    | "extract"
    | "page-numbers"
    | "protect"
    | "unlock"
    | "watermark"
    | "sign"
    | "pdf-to-word"
    | "word-to-pdf"
    | "pdf-to-excel"
    | "excel-to-pdf"
    | "pdf-to-ppt"
    | "ppt-to-pdf"
    | "ocr"
    | "scan"
    | "crop"
    | "redact"
    | "annotate"
    | "metadata"
    | "bulk-convert"
    | "ebook"
    | "compare"
    | "ai-assistant"
    | "invoice-generator"
    | "quotation-generator"
    | "salary-slip-generator"
    | "rent-receipt-generator"
    | "gst-calculator"
    | "profit-margin-calculator"
    | "roi-calculator"
    | "emi-calculator"
    | "gst-invoice-generator"
    | "purchase-order-generator";
  accept: string[];
  maxFiles: number;
  faq: ToolFAQ[];
  longDescription: string;
}

const baseFaq = (name: string): ToolFAQ[] => [
  {
    q: `Is ${name} free to use?`,
    a: `Yes. ${name} is 100% free, with no watermarks or daily limits. All processing happens in your browser, so there's no upload to our servers.`,
  },
  {
    q: "Are my files secure?",
    a: "Absolutely. Your files never leave your device — every operation runs locally in your browser using WebAssembly-grade libraries. Nothing is uploaded, stored, or logged.",
  },
  {
    q: "Does it work on mobile?",
    a: "Yes. The entire platform is mobile-first, optimized for iOS and Android with smooth touch interactions and responsive layouts.",
  },
  {
    q: "What's the maximum file size?",
    a: "We support files up to 200 MB per document on the free tier. Performance scales with your device's RAM since processing is local.",
  },
];

export const TOOLS: Tool[] = [
  // Optimize
  {
    slug: "compress-pdf",
    name: "Compress PDF Pro",
    shortName: "Compress PDF",
    tagline: "Shrink any PDF up to 90% with cinema-grade quality",
    description: "AI-style smart compression with target size mode, lossless optimization & batch processing.",
    category: "optimize",
    icon: ArchiveIcon,
    badge: "popular",
    engine: "compress",
    accept: ["application/pdf"],
    maxFiles: 50,
    features: [
      "Smart compression engine with 4 quality presets",
      "Target file size mode (50KB / 100KB / 200KB / 500KB)",
      "Extreme compression for email attachments",
      "Lossless mode preserves vector quality",
      "Batch compress up to 50 files",
      "Live size comparison & analytics",
      "ZIP bulk export",
      "Smart optimization suggestions",
    ],
    faq: [
      { q: "How small can I compress a PDF?", a: "Our extreme compression preset can reduce most PDFs by 60–90% while keeping text crisp. For image-heavy PDFs, we typically achieve 80%+ reduction." },
      { q: "Will compression affect quality?", a: "Choose Lossless mode for zero quality loss, or use one of four presets (Light, Medium, Strong, Extreme) to balance size vs visual quality." },
      ...baseFaq("Compress PDF Pro").slice(1),
    ],
    longDescription:
      "Compress PDF Pro is an enterprise-grade PDF optimizer that uses content-aware compression to dramatically shrink file size without sacrificing readability. Perfect for emailing contracts, uploading to portals with size limits, or archiving thousands of documents.",
  },
  // Organize
  {
    slug: "merge-pdf",
    name: "Merge PDF Studio",
    shortName: "Merge PDF",
    tagline: "Combine unlimited PDFs with visual page sorting",
    description: "Drag-and-drop merge with live preview, smart duplicate detection & merge timeline.",
    category: "organize",
    icon: Combine,
    badge: "popular",
    engine: "merge",
    accept: ["application/pdf"],
    maxFiles: 100,
    features: [
      "Unlimited PDF merging",
      "Drag-and-drop reordering",
      "Live page preview thumbnails",
      "Visual merge timeline",
      "Smart duplicate detection",
      "Combine password-protected PDFs",
      "Instant export — no upload",
      "Reorder by drag handle",
    ],
    faq: baseFaq("Merge PDF Studio"),
    longDescription:
      "Merge PDF Studio brings Adobe-grade combining to your browser. Drag files in any order, preview every page, and export a single polished document in seconds.",
  },
  {
    slug: "split-pdf",
    name: "Split PDF Advanced",
    shortName: "Split PDF",
    tagline: "Split by range, every page or smart extraction",
    description: "Visual split planner with page preview, batch splitting and custom naming.",
    category: "organize",
    icon: Scissors,
    badge: "popular",
    engine: "split",
    accept: ["application/pdf"],
    maxFiles: 1,
    features: [
      "Split by custom page ranges",
      "Split every page into separate PDFs",
      "Smart extraction by bookmarks",
      "Visual split planner with thumbnails",
      "Batch split multiple files",
      "Custom output file naming",
      "ZIP all results in one click",
    ],
    faq: baseFaq("Split PDF Advanced"),
    longDescription:
      "Whether you need a single chapter or every page as its own file, Split PDF Advanced gives you visual control over how a document is broken apart.",
  },
  {
    slug: "organize-pdf",
    name: "PDF Page Organizer",
    shortName: "Organize PDF",
    tagline: "Drag, rotate, duplicate or delete pages visually",
    description: "Adobe-style visual page editor with thumbnails, drag-to-reorder & bulk actions.",
    category: "organize",
    icon: LayoutGrid,
    engine: "organize",
    accept: ["application/pdf"],
    maxFiles: 1,
    features: [
      "Drag-and-drop page reordering",
      "Rotate any page 90°/180°/270°",
      "Duplicate pages instantly",
      "Delete pages with one click",
      "Smart page alignment grid",
      "Visual editing mode",
      "Undo/redo support",
    ],
    faq: baseFaq("PDF Page Organizer"),
    longDescription:
      "PDF Page Organizer is the visual page editor every PDF should have built-in. Reorder, rotate, duplicate and delete pages with the speed of a presentation tool.",
  },
  {
    slug: "remove-pages",
    name: "Remove PDF Pages",
    shortName: "Remove Pages",
    tagline: "Delete pages from any PDF in seconds",
    description: "Visual page selector with multi-remove, preview system & instant optimization.",
    category: "organize",
    icon: Trash2,
    engine: "remove-pages",
    accept: ["application/pdf"],
    maxFiles: 1,
    features: [
      "Visual page selector with thumbnails",
      "Multi-page removal",
      "Preview before removing",
      "Batch delete pages",
      "Instant file size optimization",
      "Range-based removal",
    ],
    faq: baseFaq("Remove PDF Pages"),
    longDescription: "Remove unwanted pages — blank pages, ads, drafts — from any PDF and download a clean optimized version instantly.",
  },
  {
    slug: "rotate-pdf",
    name: "Rotate PDF Pro",
    shortName: "Rotate PDF",
    tagline: "Rotate selected or all pages with smart detection",
    description: "Batch rotation with smart orientation detection & visual rotation preview.",
    category: "organize",
    icon: RotateCw,
    engine: "rotate",
    accept: ["application/pdf"],
    maxFiles: 1,
    features: [
      "Rotate selected pages individually",
      "Batch rotate entire document",
      "90° / 180° / 270° presets",
      "Smart orientation auto-detection",
      "Visual rotation preview",
    ],
    faq: baseFaq("Rotate PDF Pro"),
    longDescription: "Fix sideways or upside-down PDFs in seconds. Rotate selected pages or the entire document with full visual control.",
  },
  {
    slug: "extract-pages",
    name: "Extract PDF Pages",
    shortName: "Extract Pages",
    tagline: "Pull specific pages out as a new PDF",
    description: "Extract page ranges with visual selection and preview before export.",
    category: "organize",
    icon: Layers,
    engine: "extract",
    accept: ["application/pdf"],
    maxFiles: 1,
    features: [
      "Extract custom page ranges",
      "Visual page selection",
      "Merge extracted pages into one PDF",
      "Preview pages before export",
      "Custom output naming",
    ],
    faq: baseFaq("Extract PDF Pages"),
    longDescription: "Extract any combination of pages from a PDF as a new compact document — ideal for sharing chapters, sections or specific exhibits.",
  },
  // Convert
  {
    slug: "pdf-to-jpg",
    name: "PDF to JPG Ultra",
    shortName: "PDF to JPG",
    tagline: "Convert every page to crystal-clear images",
    description: "HD/Ultra-HD export with custom quality engine, page selection & ZIP export.",
    category: "convert",
    icon: ImageIcon,
    badge: "popular",
    engine: "pdf-to-jpg",
    accept: ["application/pdf"],
    maxFiles: 1,
    features: [
      "Standard, HD & Ultra-HD export",
      "Custom DPI control (72 – 300)",
      "Page selection",
      "ZIP all images in one download",
      "Real-time preview",
      "Optimized image generation",
    ],
    faq: baseFaq("PDF to JPG Ultra"),
    longDescription: "Convert any PDF into pixel-perfect JPG images. Choose DPI from web-quality to print-ready, select specific pages, and export everything as a ZIP.",
  },
  {
    slug: "jpg-to-pdf",
    name: "JPG to PDF Pro",
    shortName: "JPG to PDF",
    tagline: "Turn images into a polished PDF document",
    description: "Drag-to-order with margins, orientation control, custom page sizes & bulk uploads.",
    category: "convert",
    icon: FileImage,
    badge: "popular",
    engine: "jpg-to-pdf",
    accept: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
    maxFiles: 200,
    features: [
      "Drag-and-drop ordering",
      "Custom margins & padding",
      "Portrait / landscape control",
      "A4, US Letter, Legal & custom sizes",
      "Bulk upload up to 200 images",
      "Smart image alignment",
      "Print-ready export",
    ],
    faq: baseFaq("JPG to PDF Pro"),
    longDescription: "Build a professional PDF from JPG, PNG and WEBP images. Set page size, orientation and margins, then export a print-ready document.",
  },
  {
    slug: "pdf-to-word",
    name: "PDF to Word Ultra",
    shortName: "PDF to Word",
    tagline: "Convert PDFs into editable .docx documents",
    description: "Smart text extraction with formatting preservation & OCR-ready structure.",
    category: "convert",
    icon: FileText,
    badge: "popular",
    engine: "pdf-to-word",
    accept: ["application/pdf"],
    maxFiles: 1,
    features: [
      "Editable DOCX export",
      "Formatting preservation engine",
      "Smart text extraction",
      "OCR-ready structure",
      "Multi-column layout detection",
    ],
    faq: baseFaq("PDF to Word Ultra"),
    longDescription: "Get a fully editable Microsoft Word document from any PDF. Our extraction engine preserves headings, paragraphs and structure.",
  },
  {
    slug: "word-to-pdf",
    name: "Word to PDF Pro",
    shortName: "Word to PDF",
    tagline: "Convert .docx to high-fidelity PDFs",
    description: "High-quality rendering with formatting retention and smart typography preservation.",
    category: "convert",
    icon: FileType2,
    engine: "word-to-pdf",
    accept: [
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    maxFiles: 5,
    features: [
      "High-quality rendering",
      "Formatting retention",
      "Smart typography preservation",
      "Embedded fonts support",
    ],
    faq: baseFaq("Word to PDF Pro"),
    longDescription: "Convert Microsoft Word documents into pixel-perfect PDFs that look identical on every device.",
  },
  {
    slug: "pdf-to-excel",
    name: "PDF to Excel",
    shortName: "PDF to Excel",
    tagline: "Extract tables into clean spreadsheets",
    description: "Intelligent table extraction with spreadsheet-ready export.",
    category: "convert",
    icon: FileSpreadsheet,
    engine: "pdf-to-excel",
    accept: ["application/pdf"],
    maxFiles: 1,
    features: [
      "Intelligent table extraction",
      "Spreadsheet-ready XLSX export",
      "Smart table detection",
      "Multi-sheet output",
    ],
    faq: baseFaq("PDF to Excel"),
    longDescription: "Pull tables out of PDFs into editable Excel sheets — perfect for invoices, reports and financial statements.",
  },
  {
    slug: "excel-to-pdf",
    name: "Excel to PDF",
    shortName: "Excel to PDF",
    tagline: "Convert spreadsheets to print-ready PDFs",
    description: "Print optimization, sheet selection and page fitting controls.",
    category: "convert",
    icon: Sheet,
    engine: "excel-to-pdf",
    accept: [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
    maxFiles: 5,
    features: [
      "Print-optimized output",
      "Per-sheet selection",
      "Fit-to-page controls",
      "Custom margins",
    ],
    faq: baseFaq("Excel to PDF"),
    longDescription: "Convert XLSX and XLS spreadsheets into clean print-ready PDFs with intelligent page fitting.",
  },
  {
    slug: "pdf-to-powerpoint",
    name: "PDF to PowerPoint",
    shortName: "PDF to PPT",
    tagline: "Turn PDFs into editable presentations",
    description: "Slide extraction with editable PPT generation and layout preservation.",
    category: "convert",
    icon: Presentation,
    engine: "pdf-to-ppt",
    accept: ["application/pdf"],
    maxFiles: 1,
    features: [
      "Slide extraction",
      "Editable PPTX generation",
      "Layout preservation",
      "High-fidelity rendering",
    ],
    faq: baseFaq("PDF to PowerPoint"),
    longDescription: "Convert PDF slide decks into fully editable PowerPoint presentations with preserved layouts and styles.",
  },
  {
    slug: "powerpoint-to-pdf",
    name: "PowerPoint to PDF",
    shortName: "PPT to PDF",
    tagline: "Convert presentations to PDF",
    description: "Presentation optimization with HD rendering and slide quality engine.",
    category: "convert",
    icon: FileBarChart,
    engine: "ppt-to-pdf",
    accept: [
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ],
    maxFiles: 5,
    features: [
      "Presentation optimization",
      "HD rendering",
      "Slide quality engine",
      "Embedded media support",
    ],
    faq: baseFaq("PowerPoint to PDF"),
    longDescription: "Share presentations as a polished PDF that looks identical to the source PowerPoint.",
  },
  {
    slug: "ebook-to-pdf",
    name: "Ebook to PDF",
    shortName: "Ebook to PDF",
    tagline: "Convert EPUB & MOBI ebooks into PDF",
    description: "EPUB/MOBI support with typography preservation and responsive conversion.",
    category: "convert",
    icon: BookOpen,
    engine: "ebook",
    accept: [
      "application/epub+zip",
      "application/x-mobipocket-ebook",
      "application/octet-stream",
    ],
    maxFiles: 5,
    features: [
      "EPUB & MOBI support",
      "Typography preservation",
      "Responsive conversion engine",
      "Embedded image rendering",
    ],
    faq: baseFaq("Ebook to PDF"),
    longDescription: "Convert your EPUB and MOBI library into universal PDFs that read perfectly on any device.",
  },
  {
    slug: "bulk-convert",
    name: "Bulk PDF Converter",
    shortName: "Bulk Convert",
    tagline: "Convert hundreds of files in one queue",
    description: "Queue system with bulk conversion, ZIP export and conversion analytics.",
    category: "convert",
    icon: Layers,
    engine: "bulk-convert",
    accept: ["application/pdf", "image/*"],
    maxFiles: 500,
    features: [
      "Queue-based processing",
      "Bulk conversion engine",
      "ZIP export of all results",
      "Drag-and-drop workflow",
      "Conversion analytics dashboard",
    ],
    faq: baseFaq("Bulk PDF Converter"),
    longDescription: "Process hundreds of files in one go. Perfect for digitizing archives, batch invoice processing and large migrations.",
  },
  // Edit
  {
    slug: "page-numbers",
    name: "Add Page Numbers",
    shortName: "Page Numbers",
    tagline: "Add beautiful page numbers with custom typography",
    description: "Advanced typography, dynamic positioning, page range support & live preview.",
    category: "edit",
    icon: Hash,
    engine: "page-numbers",
    accept: ["application/pdf"],
    maxFiles: 1,
    features: [
      "Advanced typography controls",
      "8 position presets (corners + middles)",
      "Dynamic positioning",
      "Page range support",
      "Live preview",
      "Custom format strings (1, 1/N, Page 1)",
    ],
    faq: baseFaq("Add Page Numbers"),
    longDescription: "Add professional page numbers to any PDF with full control over font, size, color and position.",
  },
  {
    slug: "watermark-pdf",
    name: "PDF Watermark Tool",
    shortName: "Watermark",
    tagline: "Add text or image watermarks with style",
    description: "Text & image watermarks with opacity control, tiled mode & live preview.",
    category: "edit",
    icon: Droplet,
    engine: "watermark",
    accept: ["application/pdf"],
    maxFiles: 1,
    features: [
      "Text watermarks with custom font",
      "Image watermarks (PNG/JPG)",
      "Opacity 0–100% control",
      "Tiled / single placement modes",
      "Advanced positioning",
      "Live preview",
    ],
    faq: baseFaq("PDF Watermark Tool"),
    longDescription: "Brand any PDF with a beautiful watermark — confidential stamps, logos, or copyright text.",
  },
  {
    slug: "sign-pdf",
    name: "PDF Signer Pro",
    shortName: "Sign PDF",
    tagline: "Sign documents legally and beautifully",
    description: "Draw, type or upload signatures with reusable presets and smart placement.",
    category: "edit",
    icon: PenLine,
    badge: "popular",
    engine: "sign",
    accept: ["application/pdf"],
    maxFiles: 1,
    features: [
      "Draw signature with mouse or touch",
      "Upload signature image",
      "Type signature with handwritten font",
      "Reusable signature presets",
      "Smart placement guide",
      "Multi-page signing",
    ],
    faq: baseFaq("PDF Signer Pro"),
    longDescription: "Sign contracts, NDAs and forms in seconds. Draw, type or upload your signature and place it anywhere on a PDF.",
  },
  {
    slug: "annotate-pdf",
    name: "PDF Annotator",
    shortName: "Annotate",
    tagline: "Highlight, comment and draw on any PDF",
    description: "Highlights, comments, free drawing, sticky notes & advanced shapes.",
    category: "edit",
    icon: Highlighter,
    engine: "annotate",
    accept: ["application/pdf"],
    maxFiles: 1,
    features: [
      "Text highlighting",
      "Comments & sticky notes",
      "Free drawing pen",
      "Shapes (rectangle, ellipse, arrow)",
      "Collaborative-ready UI",
      "Color presets",
    ],
    faq: baseFaq("PDF Annotator"),
    longDescription: "Mark up any PDF with highlights, comments, shapes and free drawing. Perfect for reviewing contracts and giving feedback.",
  },
  {
    slug: "crop-pdf",
    name: "PDF Crop Tool",
    shortName: "Crop PDF",
    tagline: "Crop margins and unwanted content",
    description: "Visual crop editor with margin removal and comparison preview.",
    category: "edit",
    icon: Crop,
    engine: "crop",
    accept: ["application/pdf"],
    maxFiles: 1,
    features: [
      "Visual crop editor",
      "Auto-detect & remove margins",
      "Custom crop dimensions",
      "Before/after comparison preview",
      "Apply to all pages or selection",
    ],
    faq: baseFaq("PDF Crop Tool"),
    longDescription: "Crop white margins, scanner artifacts or unwanted edges from any PDF page with pixel-perfect control.",
  },
  {
    slug: "metadata-editor",
    name: "PDF Metadata Editor",
    shortName: "Metadata",
    tagline: "Edit title, author, keywords & SEO metadata",
    description: "Metadata editing with cleanup tools and bulk metadata operations.",
    category: "edit",
    icon: Tag,
    engine: "metadata",
    accept: ["application/pdf"],
    maxFiles: 50,
    features: [
      "Edit title, author, subject, keywords",
      "Metadata cleanup (remove tracker data)",
      "SEO metadata fields",
      "Bulk metadata operations",
      "View XMP & document info",
    ],
    faq: baseFaq("PDF Metadata Editor"),
    longDescription: "Take control of PDF metadata. Edit author, title, keywords for SEO, or strip tracking metadata before sharing.",
  },
  // Secure
  {
    slug: "protect-pdf",
    name: "PDF Password Protector",
    shortName: "Protect PDF",
    tagline: "Encrypt PDFs with military-grade security",
    description: "Permissions system, password generator and security analytics.",
    category: "secure",
    icon: Lock,
    badge: "popular",
    engine: "protect",
    accept: ["application/pdf"],
    maxFiles: 10,
    features: [
      "AES-256 encryption",
      "Owner & user passwords",
      "Granular permissions (print, copy, edit)",
      "Built-in password generator",
      "Security strength analytics",
    ],
    faq: baseFaq("PDF Password Protector"),
    longDescription: "Protect sensitive PDFs with strong encryption. Set permissions for printing, copying and editing.",
  },
  {
    slug: "unlock-pdf",
    name: "PDF Password Remover",
    shortName: "Unlock PDF",
    tagline: "Remove passwords from PDFs you own",
    description: "Unlock protected PDFs with secure browser-side processing.",
    category: "secure",
    icon: Unlock,
    engine: "unlock",
    accept: ["application/pdf"],
    maxFiles: 10,
    features: [
      "Unlock with known password",
      "Batch unlocking",
      "Secure browser-side flow",
      "No upload, no logging",
    ],
    faq: baseFaq("PDF Password Remover"),
    longDescription: "Remove passwords from PDFs you own. Processing happens entirely in your browser — your password and file never leave your device.",
  },
  {
    slug: "redact-pdf",
    name: "PDF Redactor",
    shortName: "Redact",
    tagline: "Permanently remove sensitive information",
    description: "Blur sensitive data, permanent black-box redaction and secure removal.",
    category: "secure",
    icon: EyeOff,
    engine: "redact",
    accept: ["application/pdf"],
    maxFiles: 1,
    features: [
      "Blur sensitive areas",
      "Permanent black-box redaction",
      "Secure content removal",
      "Page preview system",
      "Apply to all pages",
    ],
    faq: baseFaq("PDF Redactor"),
    longDescription: "Permanently remove names, account numbers and confidential text from PDFs before sharing.",
  },
  // Convert / OCR / Scan
  {
    slug: "ocr-pdf",
    name: "OCR PDF Tool",
    shortName: "OCR PDF",
    tagline: "Make scanned PDFs searchable",
    description: "Searchable PDF generation with selectable text extraction.",
    category: "convert",
    icon: ScanText,
    badge: "ai",
    engine: "ocr",
    accept: ["application/pdf", "image/*"],
    maxFiles: 1,
    features: [
      "Searchable PDF generation",
      "Selectable text overlay",
      "Multi-language support",
      "AI-grade text recognition",
    ],
    faq: baseFaq("OCR PDF Tool"),
    longDescription: "Turn scanned documents into searchable, copy-pasteable PDFs using advanced OCR.",
  },
  {
    slug: "scan-to-pdf",
    name: "Scan to PDF",
    shortName: "Scan",
    tagline: "Mobile scanner with auto edge detection",
    description: "Auto edge detection, document enhancement, smart filters & perspective correction.",
    category: "convert",
    icon: Camera,
    engine: "scan",
    accept: ["image/*"],
    maxFiles: 50,
    features: [
      "Mobile-optimized scanner UI",
      "Auto edge detection",
      "Document enhancement filters",
      "Black & white / grayscale / color modes",
      "Perspective correction",
      "Multi-page scanning",
    ],
    faq: baseFaq("Scan to PDF"),
    longDescription: "Turn your phone into a professional scanner. Snap photos and get a clean, color-corrected PDF instantly.",
  },
  // Compare
  {
    slug: "compare-pdf",
    name: "PDF Comparison Tool",
    shortName: "Compare",
    tagline: "Spot every difference between two PDFs",
    description: "Visual comparison with highlighted differences and side-by-side mode.",
    category: "edit",
    icon: GitCompare,
    badge: "new",
    engine: "compare",
    accept: ["application/pdf"],
    maxFiles: 2,
    features: [
      "Visual side-by-side comparison",
      "Highlighted differences",
      "Text difference engine",
      "Export comparison report",
    ],
    faq: baseFaq("PDF Comparison Tool"),
    longDescription: "Compare two versions of any PDF and instantly see what changed — perfect for contracts and legal review.",
  },
  // AI
  {
    slug: "ai-pdf-assistant",
    name: "AI PDF Assistant",
    shortName: "AI Assistant",
    tagline: "Chat, summarize and analyze any PDF",
    description: "AI-ready architecture with smart document insights and AI workflow layout.",
    category: "ai",
    icon: Sparkles,
    badge: "ai",
    engine: "ai-assistant",
    accept: ["application/pdf"],
    maxFiles: 1,
    features: [
      "Chat with your PDF (coming soon)",
      "Auto-generated summaries",
      "Smart document insights",
      "Key-fact extraction",
      "AI workflow layout",
    ],
    faq: baseFaq("AI PDF Assistant"),
    longDescription: "The AI Assistant turns any PDF into a conversational knowledge base. Summarize 100-page reports in seconds, ask questions, extract key facts.",
  },
  // --- BUSINESS SUITE ---
  {
    slug: "invoice-generator",
    name: "Professional Invoice Generator",
    shortName: "Invoice Generator",
    tagline: "Create and print professional invoices instantly",
    description: "Fully client-side invoice generator with tax calculation, discounts, logo upload, and local drafts saving.",
    category: "business",
    icon: FileText,
    badge: "popular",
    engine: "invoice-generator",
    accept: [],
    maxFiles: 0,
    features: [
      "Custom branding & company logo uploads",
      "Dynamic GST & SGST/CGST tax calculations",
      "Custom discount thresholds per line item",
      "Local storage draft autosave & restore",
      "Multi-currency support & custom symbols",
      "Mobile-friendly sleek spreadsheet editors",
      "Optimized A4 print page styles",
    ],
    faq: [
      { q: "Is GoluPDFs Invoice Generator completely free?", a: "Yes. GoluPDFs Invoice Generator is 100% free with no registration, watermarks, or usage limits. Everything runs in your browser." },
      { q: "Are my business invoices saved on a server?", a: "No. Your data is highly confidential. All calculations, logo uploads, and generation happen locally in your device's memory sandbox." },
      { q: "Can I save my invoice as a draft to edit later?", a: "Yes. The tool automatically saves your latest invoice draft in your browser's localStorage, allowing you to restore it whenever you return." },
      { q: "How do I download the invoice as a PDF?", a: "Click the 'Print / Save as PDF' button. Your browser's native print interface will open, where you can select 'Save as PDF' to generate the document." },
      { q: "Does the generator support GST calculations?", a: "Yes, it supports customizable tax percentages that can be calculated as CGST/SGST or IGST based on your transaction type." }
    ],
    longDescription: "The Professional Invoice Generator is a clean, Stripe-styled invoice wizard designed for business owners, freelancers, and small teams. It allows you to build custom itemized invoices, calculate complex taxes and discounts, and save files locally. Print directly to your hardware or save to a pixel-perfect PDF in seconds."
  },
  {
    slug: "quotation-generator",
    name: "Business Quotation Generator",
    shortName: "Quotation Generator",
    tagline: "Generate elegant business quotes in seconds",
    description: "Professional quote creator featuring itemized pricing grids, terms customizer, and signature blocks.",
    category: "business",
    icon: FileBarChart,
    badge: "new",
    engine: "quotation-generator",
    accept: [],
    maxFiles: 0,
    features: [
      "Dynamic product grids with inline subtotals",
      "Adjustable GST and promotional discounts",
      "Custom business terms & conditions sections",
      "Client and manager digital signature fields",
      "Instant print and Save-as-PDF actions",
    ],
    faq: [
      { q: "Can I customize the terms on my quotation?", a: "Yes. The Quotation Generator features an editable Terms & Conditions section where you can list delivery times, validity periods, and terms." },
      { q: "Does GoluPDFs charge for quotation exports?", a: "No. GoluPDFs Quotation Generator is free with no watermarks or locked corporate templates." },
      { q: "Is my customer data secure?", a: "Absolutely. GoluPDFs operates 100% client-side, meaning customer details, prices, and signatures never leave your browser." },
      { q: "Can I sign the quotation digitally?", a: "Yes. The generator includes dedicated signature zones for both the client and the issuing business manager." }
    ],
    longDescription: "Create professional, elegant quotations for clients and business stakeholders. With dynamic itemized pricing grids, automated tax breakdowns, and custom signature sections, GoluPDFs helps your sales pipeline operate at enterprise-level speed."
  },
  {
    slug: "salary-slip-generator",
    name: "Employee Salary Slip Generator",
    shortName: "Salary Slip Generator",
    tagline: "Generate employee payslips with automated calculations",
    description: "Professional payroll slips generator calculating HRA, basic earnings, deductions, PF, and ESI instantly.",
    category: "business",
    icon: FileSpreadsheet,
    badge: "new",
    engine: "salary-slip-generator",
    accept: [],
    maxFiles: 0,
    features: [
      "Comprehensive employee & payroll metadata forms",
      "Automated basic earnings, HRA, & allowances sums",
      "Dynamic PF (Provident Fund) and ESI deductions",
      "Instant Net Salary calculations",
      "Clean corporate design mapped to standard A4 sheets",
    ],
    faq: [
      { q: "How is net salary calculated in GoluPDFs payslips?", a: "Net salary is computed by summing the basic pay and all extra allowances (HRA, DA, Special Allowance), and then subtracting total deductions (PF, ESI, Tax)." },
      { q: "Can I print a physical salary slip?", a: "Yes. The salary slip generator features a dedicated print action that opens your native operating system print manager for instant physical output." },
      { q: "Do I need to sign up to generate employee slips?", a: "No. GoluPDFs is non-custodial and requires no registrations or email capture." }
    ],
    longDescription: "Manage payroll documentation with speed. The Salary Slip Generator is designed for HR managers, startups, and small businesses to generate professional salary slips. Easily record employee roles, track HRA/PF/ESI percentages, and export standard, clean payslips locally."
  },
  {
    slug: "rent-receipt-generator",
    name: "Free Rent Receipt Generator",
    shortName: "Rent Receipt",
    tagline: "Generate rent receipts instantly for HRA claims",
    description: "Quick landlord rent receipts creator with tenant info, payment tracking, and digital signatures.",
    category: "business",
    icon: Sheet,
    badge: "popular",
    engine: "rent-receipt-generator",
    accept: [],
    maxFiles: 0,
    features: [
      "Tenant, landlord, and property details forms",
      "Security deposit and monthly rent record tracking",
      "Support for multiple payment modes (Cash, Online, UPI)",
      "Digital signature draw pad for landlords",
      "Optimized format for HRA tax exemption claims",
    ],
    faq: [
      { q: "Are these rent receipts valid for HRA claims?", a: "Yes. The generated receipts capture landlord PANs, monthly payments, tenant info, and signatures, which are fully compliant for HRA exemptions." },
      { q: "How do I add the landlord's signature?", a: "The rent receipt generator features a high-fidelity digital canvas signature pad where landlords can draw their signature with a mouse or touch screen." }
    ],
    longDescription: "GoluPDFs Rent Receipt Generator helps tenants create clean, professional rent receipts to claim HRA (House Rent Allowance) tax exemptions. Capture landlord details, monthly sums, payment modes, and digital signatures instantly without third-party server uploads."
  },
  {
    slug: "gst-calculator",
    name: "Online Indian GST Calculator",
    shortName: "GST Calculator",
    tagline: "Calculate GST addition and removal instantly",
    description: "Indian GST tax slab calculator with SGST/CGST/IGST breakdown and direct copy options.",
    category: "business",
    icon: Hash,
    badge: "popular",
    engine: "gst-calculator",
    accept: [],
    maxFiles: 0,
    features: [
      "Dual calculation mode: Add GST and Remove GST",
      "Support for standard Indian slabs (5%, 12%, 18%, 28%)",
      "Dynamic SGST, CGST, and IGST breakdowns",
      "Clean, mobile-optimized numeric keyboard inputs",
      "One-click copy clipboard action for tax calculations",
    ],
    faq: [
      { q: "What is the difference between CGST, SGST, and IGST?", a: "CGST and SGST are applied on intra-state supply (within the state), sharing the tax evenly. IGST is applied on inter-state supply (between states)." },
      { q: "How do I calculate GST removal?", a: "Choose the 'Remove GST' mode, input the total price, select the slab, and our tool will extract the base price and exact tax amount." }
    ],
    longDescription: "The Online GST Calculator provides small businesses and retail owners with a fast, mobile-friendly tax utility. Calculate GST addition and removal across all Indian tax slabs (5%, 12%, 18%, 28%) and instantly extract CGST, SGST, and IGST breakdowns."
  },
  {
    slug: "profit-margin-calculator",
    name: "Business Profit Margin Calculator",
    shortName: "Profit Calculator",
    tagline: "Calculate gross profit margins and product markup instantly",
    description: "Pricing calculator to determine product cost, revenue, gross profit, margin percentage, and markup percentage.",
    category: "business",
    icon: Combine,
    badge: "new",
    engine: "profit-margin-calculator",
    accept: [],
    maxFiles: 0,
    features: [
      "Dynamic Cost, Revenue, Margin, and Markup calculations",
      "Interactive slider controls for pricing simulations",
      "Calculates required price for target margin goals",
      "Stripe-inspired clean financial breakdown sheet",
      "100% confidential and local browser processing",
    ],
    faq: [
      { q: "What is the difference between margin and markup?", a: "Margin is the profit percentage relative to the selling price (revenue), whereas markup is the profit percentage relative to the cost price (cost)." },
      { q: "How do I calculate gross profit margin?", a: "Gross profit margin is calculated by subtracting Cost from Revenue, and then dividing that profit by Revenue: Margin = (Revenue - Cost) / Revenue * 100." }
    ],
    longDescription: "Optimize product pricing with our Profit Margin Calculator. Built for startup owners, retailers, and digital agency teams, it calculates exact gross profits, margins, and markups in real-time, helping you define premium pricing structures with confidence."
  },
  {
    slug: "roi-calculator",
    name: "Simple & Annualized ROI Calculator",
    shortName: "ROI Calculator",
    tagline: "Calculate Return on Investment and CAGR in seconds",
    description: "Analyze investment returns, capital gains, compound annual growth rate (CAGR), and investment multiples.",
    category: "business",
    icon: GitCompare,
    badge: "new",
    engine: "roi-calculator",
    accept: [],
    maxFiles: 0,
    features: [
      "Simple ROI and Annualized ROI (CAGR) calculations",
      "Support for customizable investment tenure (years/months)",
      "Tracks net gain, final capital, and investment multiples",
      "Premium financial visual gauge and progression bars",
      "Private local browser execution with no cookies",
    ],
    faq: [
      { q: "What is Annualized ROI (CAGR)?", a: "Annualized ROI represents the compound annual growth rate (CAGR) of an investment, reflecting the rate of return per year over the investment period." },
      { q: "Why is ROI important for small businesses?", a: "Return on Investment (ROI) helps small business owners measure the efficiency of their capital allocation across marketing campaigns, equipment purchases, or software investments." }
    ],
    longDescription: "Evaluate the profitability of capital expenditures. The ROI Calculator computes simple capital gains, annualized interest rates, and multiples for business investments, letting you compare marketing campaigns, real estate projects, and asset purchases instantly."
  },
  {
    slug: "emi-calculator",
    name: "Business Loan EMI Calculator",
    shortName: "EMI Calculator",
    tagline: "Calculate monthly loan EMIs and amortization schedules",
    description: "Loan and lease calculator displaying monthly payments, total interest burden, and detailed principal-vs-interest charts.",
    category: "business",
    icon: LayoutGrid,
    badge: "new",
    engine: "emi-calculator",
    accept: [],
    maxFiles: 0,
    features: [
      "Precise monthly EMI loan payment calculations",
      "Detailed yearly and monthly amortization schedules",
      "Calculates total interest burden and net payment sums",
      "Standard printable A4 sheet formatting",
      "Zero-software local browser memory processing",
    ],
    faq: [
      { q: "What is an EMI?", a: "EMI stands for Equated Monthly Installment — a fixed payment amount made by a borrower to a lender at a specified date each calendar month." },
      { q: "How does the interest rate affect my total loan cost?", a: "Higher annual interest rates dramatically increase the overall interest payable over long loan tenures, which you can visualize dynamically in our amortization table." }
    ],
    longDescription: "Model business loans and equipment leases with the Business EMI Calculator. Input loan principal, annual interest rate, and tenure to instantly extract monthly payments, total interest costs, and a hardware-printable monthly amortization schedule."
  },
  {
    slug: "gst-invoice-generator",
    name: "Indian GST Tax Invoice Generator",
    shortName: "GST Invoice Creator",
    tagline: "Generate GST-compliant tax invoices instantly",
    description: "Indian GST tax invoice builder capturing HSN/SAC codes, buyer/seller GSTINs, and SGST/CGST/IGST calculations.",
    category: "business",
    icon: FileType2,
    badge: "new",
    engine: "gst-invoice-generator",
    accept: [],
    maxFiles: 0,
    features: [
      "Fields for Buyer & Seller GSTIN details",
      "Dedicated HSN / SAC code columns per line item",
      "Dynamic intra-state (CGST+SGST) vs inter-state (IGST) math",
      "Standard printable A4 tax invoice formatting",
      "Confidential client-side processing",
    ],
    faq: [
      { q: "Is this GST invoice generator valid in India?", a: "Yes. The generated tax invoices capture all statutory GST details, HSN codes, tax slabs, GSTINs, and signatures, conforming to Indian GST rules." },
      { q: "Do I need to pay or signup?", a: "No, GoluPDFs is completely free, secure, and operates entirely locally in browser RAM." }
    ],
    longDescription: "The GST Invoice Generator is a tax-compliant invoicing wizard. Built for Indian merchants and MSMEs, it simplifies intra-state and inter-state GST calculations, tracks HSN codes, and exports clean tax invoice sheets directly from your browser memory."
  },
  {
    slug: "purchase-order-generator",
    name: "Corporate Purchase Order Generator",
    shortName: "Purchase Order",
    tagline: "Generate professional corporate purchase orders",
    description: "Client-side PO creator with vendor databases, shipping details, and automated price sheets.",
    category: "business",
    icon: Presentation,
    badge: "new",
    engine: "purchase-order-generator",
    accept: [],
    maxFiles: 0,
    features: [
      "Vendor and buyer corporate address forms",
      "Custom shipping terms and delivery dates tracker",
      "Itemized purchase tables with automatic total sums",
      "Print and Save-as-PDF optimized A4 sheets",
      "Secure and private local browser environment",
    ],
    faq: [
      { q: "What is the difference between an invoice and a purchase order?", a: "A Purchase Order is sent by the buyer to order goods, confirming the agreement before shipment. An Invoice is sent by the seller to request payment." },
      { q: "Can I save custom vendor details?", a: "Yes, you can edit vendor address blocks dynamically and save current layouts directly." }
    ],
    longDescription: "Structure corporate purchases with our Purchase Order Generator. Track shipping conditions, detail item lists, configure taxes, and print standard purchase orders directly from your browser memory without cloud database dependencies."
  },
];

export const TOOLS_BY_SLUG: Record<string, Tool> = Object.fromEntries(
  TOOLS.map((t) => [t.slug, t])
);

export function getToolBySlug(slug: string): Tool | undefined {
  return TOOLS_BY_SLUG[slug];
}

export function getToolsByCategory(category: ToolCategory): Tool[] {
  return TOOLS.filter((t) => t.category === category);
}

export function getPopularTools(): Tool[] {
  return TOOLS.filter((t) => t.badge === "popular");
}

export function getRelatedTools(slug: string, limit = 4): Tool[] {
  const tool = getToolBySlug(slug);
  if (!tool) return [];
  return TOOLS.filter((t) => t.slug !== slug && t.category === tool.category).slice(0, limit);
}
