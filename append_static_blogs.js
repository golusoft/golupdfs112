const fs = require("fs");
const path = require("path");

const mockBlogDataPath = path.join(__dirname, "src", "lib", "admin", "mock-blog-data.ts");
const article1Path = path.join(__dirname, "scratch_blogs", "article1.md");
const article2Path = path.join(__dirname, "scratch_blogs", "article2.md");
const article3Path = path.join(__dirname, "scratch_blogs", "article3.md");
const article4Path = path.join(__dirname, "scratch_blogs", "article4.md");
const article5Path = path.join(__dirname, "scratch_blogs", "article5.md");
const article6Path = path.join(__dirname, "scratch_blogs", "article6.md");

try {
  let mockContent = fs.readFileSync(mockBlogDataPath, "utf8");
  let article1 = fs.readFileSync(article1Path, "utf8");
  let article2 = fs.readFileSync(article2Path, "utf8");
  let article3 = fs.readFileSync(article3Path, "utf8");
  let article4 = fs.readFileSync(article4Path, "utf8");
  let article5 = fs.readFileSync(article5Path, "utf8");
  let article6 = fs.readFileSync(article6Path, "utf8");

  // Escape backticks and dollar signs so they don't break JS template literals
  const escapeStringForTemplate = (str) => {
    return str
      .replace(/\\/g, "\\\\")
      .replace(/`/g, "\\`")
      .replace(/\${/g, "\\${");
  };

  const escapedArticle1 = escapeStringForTemplate(article1);
  const escapedArticle2 = escapeStringForTemplate(article2);
  const escapedArticle3 = escapeStringForTemplate(article3);
  const escapedArticle4 = escapeStringForTemplate(article4);
  const escapedArticle5 = escapeStringForTemplate(article5);
  const escapedArticle6 = escapeStringForTemplate(article6);

  // IDEMPOTENCY: Revert previously appended blog posts if this script was run before
  const firstAppendIndex = mockContent.indexOf(',\n  {\n    id: "indian-gst-tax-invoice-guide"');
  if (firstAppendIndex !== -1) {
    console.log("🔄 Existing appended posts detected. Reverting mock-blog-data.ts to original clean state first...");
    const kwIndex = mockContent.indexOf("let mockKeywords");
    if (kwIndex !== -1) {
      const cleanOriginalContent = mockContent.substring(0, firstAppendIndex) + "\n];\n\n" + mockContent.substring(kwIndex);
      mockContent = cleanOriginalContent;
    }
  }

  // Robust Search: Find the keyword section start and track back to find the closing array bracket
  const kwIndex = mockContent.indexOf("let mockKeywords");
  
  if (kwIndex === -1) {
    console.error("Could not locate let mockKeywords in mock-blog-data.ts");
    process.exit(1);
  }

  const targetArrayEndIndex = mockContent.lastIndexOf("];", kwIndex);
  
  if (targetArrayEndIndex === -1) {
    console.error("Could not locate the closing array bracket ]; before let mockKeywords");
    process.exit(1);
  }

  const insertText = `,
  {
    id: "indian-gst-tax-invoice-guide",
    slug: "how-to-generate-free-indian-gst-tax-invoices",
    title: "How to Generate Free Indian GST Invoices: The Ultimate Compliance Guide for Freelancers & Small Businesses",
    excerpt: "Learn how to create legally compliant Indian GST tax invoices for free. Discover rules under GST Rule 46, HSN/SAC codes, CGST, SGST, and IGST calculation splits.",
    category: "GST Billing",
    read_time: "12 min",
    author: "Golu Kumar",
    keywords: ["Indian GST tax invoice", "GST invoice generator", "free GST billing tool", "HSN SAC codes GST", "CGST SGST IGST calculator"],
    content: \`${escapedArticle1}\`,
    is_pillar: true,
    topic_cluster: "GST & Invoice Utilities",
    seo_score: 98,
    seo_score_details: {
      keyword_density: 95,
      structure_score: 99,
      readability_score: 98,
      link_score: 98,
      ctr_score: 98
    },
    views_30d: 4500,
    clicks_30d: 320,
    ctr_30d: 7.11,
    avg_position: 1.8,
    published_at: "2026-05-31T15:00:00Z",
    created_at: "2026-05-31T15:00:00Z",
    updated_at: "2026-05-31T15:00:00Z"
  },
  {
    id: "employee-salary-slip-india-guide",
    slug: "how-to-generate-free-employee-salary-slips-india",
    title: "How to Create Employee Salary Slips in India: Free Compliant Generator Guide for Startups & Small Businesses",
    excerpt: "Master payroll components under Indian tax regulations. Learn how to calculate Basic Salary, HRA, EPF deductions, Professional Tax, and generate free salary slips.",
    category: "HR & Payroll",
    read_time: "10 min",
    author: "Golu Kumar",
    keywords: ["employee salary slip India", "free salary slip generator", "payroll components India", "basic salary HRA calculation", "EPF and Professional Tax deductions"],
    content: \`${escapedArticle2}\`,
    is_pillar: false,
    topic_cluster: "HR & Salary Utilities",
    seo_score: 96,
    seo_score_details: {
      keyword_density: 94,
      structure_score: 98,
      readability_score: 96,
      link_score: 95,
      ctr_score: 96
    },
    views_30d: 3800,
    clicks_30d: 270,
    ctr_30d: 7.10,
    avg_position: 2.3,
    published_at: "2026-05-31T15:00:00Z",
    created_at: "2026-05-31T15:00:00Z",
    updated_at: "2026-05-31T15:00:00Z"
  },
  {
    id: "pdf-esignature-security-guide",
    slug: "how-to-sign-a-pdf-online-free",
    title: "How to Sign a PDF Online Free: The 2026 Employer & Freelancer e-Sign Guide",
    excerpt: "Discover how to sign PDF documents online for free legally. Master e-signature regulations under Section 5 of India's IT Act, the US ESIGN Act, and local browser tools.",
    category: "Digital Signatures",
    read_time: "11 min",
    author: "Golu Kumar",
    keywords: ["how to sign a pdf online free", "free online PDF signer", "digitally sign contract free", "safe e-signature browser", "sign NDA online without signup"],
    content: \`${escapedArticle3}\`,
    is_pillar: true,
    topic_cluster: "Digital Signatures & NDAs",
    seo_score: 98,
    seo_score_details: {
      keyword_density: 96,
      structure_score: 99,
      readability_score: 98,
      link_score: 97,
      ctr_score: 98
    },
    views_30d: 5200,
    clicks_30d: 410,
    ctr_30d: 7.88,
    avg_position: 1.6,
    published_at: "2026-06-01T15:00:00Z",
    created_at: "2026-06-01T15:00:00Z",
    updated_at: "2026-06-01T15:00:00Z"
  },
  {
    id: "pdf-merge-visual-guide",
    slug: "merge-pdf-pages-free-no-watermark",
    title: "How to Merge PDF Pages Visually: Free Document Joiner Guide (No Watermarks & No Signups)",
    excerpt: "Learn how to combine PDF pages online visually. Master drag-and-drop page sorting grids, local WebAssembly compilers, and watermark-free PDF exports.",
    category: "PDF Merging",
    read_time: "12 min",
    author: "Golu Kumar",
    keywords: ["merge pdf pages free no watermark", "combine pdf without watermark online", "free visual pdf pages sorter", "rearrange pdf pages free", "join pdfs locally"],
    content: \`${escapedArticle4}\`,
    is_pillar: true,
    topic_cluster: "Document Joining & Structuring",
    seo_score: 98,
    seo_score_details: {
      keyword_density: 95,
      structure_score: 99,
      readability_score: 98,
      link_score: 98,
      ctr_score: 98
    },
    views_30d: 6400,
    clicks_30d: 490,
    ctr_30d: 7.65,
    avg_position: 1.8,
    published_at: "2026-06-01T15:00:00Z",
    created_at: "2026-06-01T15:00:00Z",
    updated_at: "2026-06-01T15:00:00Z"
  },
  {
    id: "pdf-ocr-text-extractor-guide",
    slug: "extract-text-from-scanned-pdf-free",
    title: "How to Extract Text from Scanned PDFs: Free In-Browser OCR Reader Guide",
    excerpt: "Learn how to extract text from scanned PDFs online for free using WebAssembly. Discover image pre-processing, character feature extraction, and secure in-browser OCR.",
    category: "AI Document OCR",
    read_time: "11 min",
    author: "Golu Kumar",
    keywords: ["extract text from scanned pdf free", "make scanned pdf searchable online", "free OCR tool for scanned PDF", "local web browser OCR reader", "scanned PDF to text converter"],
    content: \`${escapedArticle5}\`,
    is_pillar: true,
    topic_cluster: "AI Document OCR Text",
    seo_score: 98,
    seo_score_details: {
      keyword_density: 95,
      structure_score: 99,
      readability_score: 98,
      link_score: 98,
      ctr_score: 98
    },
    views_30d: 5800,
    clicks_30d: 450,
    ctr_30d: 7.76,
    avg_position: 1.9,
    published_at: "2026-06-01T15:00:00Z",
    created_at: "2026-06-01T15:00:00Z",
    updated_at: "2026-06-01T15:00:00Z"
  },
  {
    id: "pdf-permanent-redaction-guide",
    slug: "how-to-permanently-redact-a-pdf-free",
    title: "How to Permanently Redact a PDF: Free Secure Black-Box Censoring Guide",
    excerpt: "Learn how to permanently redact a PDF for free. Avoid insecure draw highlights, understand underlying vector font streams, and strip tracking metadata safely.",
    category: "Document Security",
    read_time: "10 min",
    author: "Golu Kumar",
    keywords: ["how to permanently redact a pdf free", "secure black box pdf redaction", "hide sensitive information in PDF", "censor pdf text online safe", "remove private metadata PDF"],
    content: \`${escapedArticle6}\`,
    is_pillar: true,
    topic_cluster: "Document Censorship & Security",
    seo_score: 98,
    seo_score_details: {
      keyword_density: 95,
      structure_score: 99,
      readability_score: 98,
      link_score: 98,
      ctr_score: 98
    },
    views_30d: 4900,
    clicks_30d: 380,
    ctr_30d: 7.75,
    avg_position: 1.7,
    published_at: "2026-06-01T15:00:00Z",
    created_at: "2026-06-01T15:00:00Z",
    updated_at: "2026-06-01T15:00:00Z"
  }`;

  // Perform split and insert
  const beforeArrayEnd = mockContent.substring(0, targetArrayEndIndex);
  const afterArrayEnd = mockContent.substring(targetArrayEndIndex);

  const updatedContent = beforeArrayEnd + insertText + afterArrayEnd;

  fs.writeFileSync(mockBlogDataPath, updatedContent, "utf8");
  console.log("🎉 SUCCESS: Programmatically inserted all 6 E-E-A-T guides into static mock database array!");

} catch (err) {
  console.error("Error executing append script:", err.message);
}
