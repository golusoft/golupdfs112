import { getSeoPage, SEO_PAGES } from "@/lib/seo-pages";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  meta_title?: string;
  meta_description?: string;
  keywords: string[];
  lsi_keywords?: string[];
  category: string;
  image_url?: string;
  image_alt?: string;
  image_caption?: string;
  schema_markup?: any;
  is_pillar?: boolean;
  pillar_id?: string;
  topic_cluster?: string;
  seo_score: number;
  seo_score_details?: {
    keyword_density: number;
    structure_score: number;
    readability_score: number;
    link_score: number;
    ctr_score: number;
  };
  is_programmatic?: boolean;
  affiliate_blocks_inserted?: boolean;
  affiliate_data?: any;
  views_30d: number;
  clicks_30d: number;
  ctr_30d: number;
  avg_position: number;
  read_time: string;
  author: string;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface KeywordOpportunity {
  id: number;
  keyword: string;
  difficulty: number;
  search_volume: number;
  intent: string;
  opportunity_score: number;
  status: string; // discovered, approved, generating, published, rejected
  suggested_title: string;
  title_variations: string[];
  topic_cluster: string;
  is_pillar: boolean;
  serp_data?: any;
  created_at: string;
}

export interface GenerationLog {
  id: number;
  ts: string;
  action: string;
  status: string;
  keyword?: string;
  details: string;
  payload?: any;
}

export interface AnalyticsInsight {
  id: number;
  ts: string;
  insight_type: string;
  affected_post_id?: string;
  title: string;
  description: string;
  recommended_action?: string;
  status: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Memory Database Fallback Storage
// ─────────────────────────────────────────────────────────────────────────────

let mockBlogPosts: BlogPost[] = [
  {
    id: "post-1",
    slug: "best-pdf-compressor-2026",
    title: "The Best Free PDF Compressor in 2026",
    excerpt: "We tested 12 popular compressors against 50 real-world PDFs. Here is what won and why browser-side compression is a security must.",
    category: "Guide",
    read_time: "8 min",
    author: "GoluPDFs AI",
    keywords: ["best pdf compressor", "pdf compressor 2026"],
    content: `# The Best Free PDF Compressor in 2026

In today's fast-paced digital workplace, managing document size is crucial. Whether you are applying for a visa, sending client resumes, or archiving enterprise documents, large PDFs represent a persistent friction point. 

We recently ran a structured benchmark testing **12 popular online PDF compressors** against a standardized set of **50 real-world multi-page PDFs** (including high-res scans, legal contracts, and media-rich slideshows). Here is what we discovered, and why modern browser-side engines represent the new gold standard.

---

## The Core Benchmark Results

During our testing, we evaluated compressors based on three key parameters: **compression ratio**, **visual legibility**, and **privacy hygiene**.

| Tool Name | Compression Ratio | Legibility Score | Processing Model | Privacy Safety |
| :--- | :---: | :---: | :---: | :---: |
| **GoluPDFs Compress** | **84% reduction** | **Excellent (9.8/10)** | **100% In-Browser** | **100% Safe (Local)** |
| Adobe Acrobat Web | 68% reduction | Good (8.5/10) | Cloud Upload | Medium (Shared) |
| Smallpdf | 72% reduction | Fair (7.2/10) | Cloud Upload | Low (Server Retained) |
| iLovePDF | 70% reduction | Good (8.0/10) | Cloud Upload | Low (Server Retained) |

---

## Why Browser-Side Local Compression Wins

Traditional PDF compressors force you to upload your sensitive contracts, financials, and scans directly to their remote servers. Once a file leaves your local machine, you lose operational control over who reads, index-stores, or leaks your metadata.

By utilizing **pdf-lib** combined with advanced client-side rasterizers, **GoluPDFs** compresses files directly within your browser's sandboxed environment. Your files are never uploaded to our servers, maintaining complete privacy.

### Step-by-Step Guide to Small File Sizes:
1. Drag and drop your file into the local upload grid.
2. Select your compression preset (we suggest "Strong" for balance).
3. Tap **Run** and download your optimized, pixel-clear PDF instantly.

## Frequently Asked Questions

### Is browser-side PDF compression free?
Yes. Our tools are entirely free with no upload limits or watermark overlays.

### Will extreme compression ruin scanned graphics?
If you compress with our **Extreme** preset (ideal for a 100 KB target), minor image quality is rasterized, but all text characters remain perfectly readable.`,
    is_pillar: true,
    topic_cluster: "Compression Tools",
    seo_score: 95,
    seo_score_details: {
      keyword_density: 92,
      structure_score: 98,
      readability_score: 94,
      link_score: 96,
      ctr_score: 95
    },
    views_30d: 12450,
    clicks_30d: 875,
    ctr_30d: 7.03,
    avg_position: 1.4,
    published_at: "2026-05-01T10:00:00Z",
    created_at: "2026-05-01T10:00:00Z",
    updated_at: "2026-05-24T18:30:00Z"
  },
  {
    id: "post-2",
    slug: "compress-pdf-to-100kb",
    title: "How to Compress a PDF to 100 KB Without Losing Quality",
    excerpt: "Need a tiny PDF for an online job board or passport portal? Learn how to compress PDFs under 100 KB using advanced sub-sampling locally.",
    category: "Tutorial",
    read_time: "6 min",
    author: "GoluPDFs AI",
    keywords: ["compress pdf to 100kb", "pdf downsampler"],
    content: `# How to Compress a PDF to 100 KB Without Losing Quality

You upload your PDF…
and suddenly see:

“File size exceeds 100 KB.”

Frustrating, right?

Whether you're applying for a government job, submitting a university form, or uploading documents to an online portal, strict PDF size limits can quickly become a headache.

The good news?

You can **compress PDF online** and **reduce PDF file size** to 100 KB without destroying readability or image quality — if you use the right optimization method.

---

## Why Standard PDF Compressors Ruin Your Quality

Many traditional online tools use aggressive, lossy compression that makes your text blurry and images pixelated. To make matters worse, they upload your private files to cloud servers, risking your data security. 

With GoluPDFs, we do things differently. By leveraging browser-side processing, we can **shrink PDF without losing quality** directly on your device. Let's see how our **PDF size reducer** stacks up against other methods.

### Compression Method Comparison

| Method | Quality | Speed | Privacy |
| :--- | :--- | :--- | :--- |
| Online Compressors | Medium | Fast | Weak |
| Desktop Software | High | Slow | Strong |
| **GoluPDFs Browser Compression** | **High** | **Fast** | **Strong** |

---

## Step-by-Step Tutorial: Compress PDF to 100 KB Instantly

Ready to get started? Follow these simple steps to **optimize PDF for upload** using our **100KB PDF compressor** securely:

### Step 1: Upload PDF
Select and drop your PDF file into our secure, sandboxed local upload container.

### Step 2: Choose 100KB Target
Select the target size threshold or preset configuration (e.g., 100KB target compression) to fit strict portal requirements.

### Step 3: Enable Smart Compression
Activate advanced in-browser downsampling. This automatically subsets fonts, strips unused object layers, and shrinks large graphics while keeping your text perfectly sharp.

### Step 4: Download Optimized File
Click the button to process your document. The system compiles the optimized PDF and initiates the download instantly.

---

## Strong Privacy & Security: The GoluPDFs Promise

Why choose browser-side optimization?
Traditional websites upload your confidential tax returns, resumes, and medical records to their remote cloud servers. Once uploaded, you lose control of your data.

GoluPDFs operates entirely on **browser-side processing**. This means:
*   **No Upload Required**: Your files never leave your local computer.
*   **100% Privacy**: All rendering, compression, and text extraction happen inside your browser using sandboxed WebAssembly (Wasm).
*   **Optimization Explanation**: Instead of low-quality compression, GoluPDFs intelligently subsets fonts (removing unused characters) and utilizes advanced high-speed pixel averaging to target screen resolutions.

---

## Contextual Internal Resources

Need other document solutions? We offer a suite of highly-optimized, browser-safe utilities:
*   **[Compress PDF](/compress-pdf)**: Automatically shrink files to custom target sizes.
*   **[Merge PDF](/merge-pdf)**: Combine multiple documents into one single file without watermarks.
*   **[PDF Converter](/pdf-converter)**: Convert images and word documents to professional PDFs instantly.
*   **[PDF Security](/pdf-security)**: Password-protect or unlock files directly inside your browser.

---

## Need to reduce your PDF instantly?

Use the **[GoluPDFs Compress PDF to 100KB](/compress-pdf-to-100kb)** tool to automatically optimize images, fonts, and document layers directly inside your browser — no software installation required.

---

## Frequently Asked Questions

### Can I compress scanned PDFs to 100 KB?
Yes, but image-heavy scanned documents may require aggressive optimization to fit under 100 KB. Our smart engine works hard to downsample images without rendering the text illegible.

### Will PDF quality decrease?
Slightly, but our smart compression algorithms focus on high-DPI image scaling and font subsetting to preserve overall document readability.

### Is GoluPDFs secure?
Yes. Files are processed locally in-browser for privacy protection. No files are uploaded to any server, keeping your data entirely in your own hands.`,
    is_pillar: false,
    pillar_id: "post-1",
    topic_cluster: "Compression Tools",
    seo_score: 93,
    seo_score_details: {
      keyword_density: 92,
      structure_score: 96,
      readability_score: 94,
      link_score: 95,
      ctr_score: 92
    },
    schema_markup: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BlogPosting",
          "@id": "https://golupdf.online/blog/compress-pdf-to-100kb#blogposting",
          "headline": "How to Compress a PDF to 100 KB Without Losing Quality",
          "image": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&h=630&auto=format&fit=crop",
          "author": {
            "@type": "Organization",
            "name": "GoluPDFs"
          },
          "publisher": {
            "@type": "Organization",
            "name": "GoluPDFs",
            "logo": {
              "@type": "ImageObject",
              "url": "https://golupdf.online/icon.svg"
            }
          },
          "datePublished": "2026-05-10T12:00:00Z",
          "description": "Need a tiny PDF for an online job board or passport portal? Learn how to compress PDFs under 100 KB using advanced sub-sampling locally."
        },
        {
          "@type": "BreadcrumbList",
          "@id": "https://golupdf.online/blog/compress-pdf-to-100kb#breadcrumb",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://golupdf.online"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Blog",
              "item": "https://golupdf.online/blog"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": "How to Compress a PDF to 100 KB Without Losing Quality",
              "item": "https://golupdf.online/blog/compress-pdf-to-100kb"
            }
          ]
        },
        {
          "@type": "FAQPage",
          "@id": "https://golupdf.online/blog/compress-pdf-to-100kb#faq",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Can I compress scanned PDFs to 100 KB?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, but image-heavy scanned documents may require aggressive optimization to fit under 100 KB. Our smart engine works hard to downsample images without rendering the text illegible."
              }
            },
            {
              "@type": "Question",
              "name": "Will PDF quality decrease?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Slightly, but our smart compression algorithms focus on high-DPI image scaling and font subsetting to preserve overall document readability."
              }
            },
            {
              "@type": "Question",
              "name": "Is GoluPDFs secure?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. Files are processed locally in-browser for privacy protection. No files are uploaded to any server, keeping your data entirely in your own hands."
              }
            }
          ]
        }
      ]
    },
    views_30d: 8320,
    clicks_30d: 590,
    ctr_30d: 7.09,
    avg_position: 2.1,
    published_at: "2026-05-10T12:00:00Z",
    created_at: "2026-05-10T12:00:00Z",
    updated_at: "2026-05-24T18:32:00Z"
  }
];

let mockKeywords: KeywordOpportunity[] = [
  {
    id: 1,
    keyword: "how to sign a pdf online free",
    difficulty: 28,
    search_volume: 4800,
    intent: "Transactional",
    opportunity_score: 84,
    status: "discovered",
    suggested_title: "How to Sign a PDF Online Free: The 2026 Secure e-Sign Guide",
    title_variations: [
      "How to Sign a PDF Online Free: The 2026 Secure e-Sign Guide",
      "Top Free Ways to e-Sign PDFs in Browser Instantly",
      "I Tested 8 Free PDF Signers — Here is the Safest One"
    ],
    topic_cluster: "Digital Signatures",
    is_pillar: true,
    created_at: "2026-05-25T10:00:00Z"
  },
  {
    id: 2,
    keyword: "merge pdf without watermark free",
    difficulty: 18,
    search_volume: 3200,
    intent: "Commercial",
    opportunity_score: 92,
    status: "approved",
    suggested_title: "Merge PDF Without Watermark: 100% Free Online Joiner",
    title_variations: [
      "Merge PDF Without Watermark: 100% Free Online Joiner",
      "How to Combine PDFs Online Without Watermarks or Signup",
      "Stop Using Watermarked PDF Mergers — Try This Local Tool"
    ],
    topic_cluster: "Document Joining",
    is_pillar: false,
    created_at: "2026-05-25T11:00:00Z"
  },
  {
    id: 3,
    keyword: "best ocr reader for scanned pdfs",
    difficulty: 35,
    search_volume: 1800,
    intent: "Informational",
    opportunity_score: 71,
    status: "generating",
    suggested_title: "Best Free OCR Reader for Scanned PDFs: Extract Text Safely",
    title_variations: [
      "Best Free OCR Reader for Scanned PDFs: Extract Text Safely",
      "Convert Scanned PDFs to Searchable Text In-Browser",
      "No More Retyping: Best Scanned PDF OCR Web Tools"
    ],
    topic_cluster: "Text Extraction OCR",
    is_pillar: false,
    created_at: "2026-05-25T12:00:00Z"
  }
];

let mockLogs: GenerationLog[] = [
  {
    id: 1,
    ts: "2026-05-25T14:00:00Z",
    action: "research",
    status: "success",
    details: "Research Agent discovered 5 trending keywords using Google autosuggest simulation.",
    payload: { keywords_found: ["sign pdf online", "pdf scanner app free"] }
  },
  {
    id: 2,
    ts: "2026-05-25T14:15:00Z",
    action: "serp_scraping",
    status: "success",
    keyword: "merge pdf without watermark free",
    details: "SERP Scraper analyzed top 3 ranking pages for competitor FAQ and keyword density mapping.",
    payload: { competitors: ["ilovepdf.com", "smallpdf.com"], density_target: "2.4%" }
  }
];

let mockInsights: AnalyticsInsight[] = [
  {
    id: 1,
    ts: "2026-05-25T10:00:00Z",
    insight_type: "low_ctr",
    affected_post_id: "post-2",
    title: "Low Click-Through Rate Alert",
    description: "The article 'How to Compress a PDF to 100 KB' is currently ranking in position #2.1 but has a low CTR of 1.2%. Suggests optimized title variation.",
    recommended_action: "Rewrite Title to: 'I Tested 8 PDF Compressors: How to Hit 100 KB Without Blur'",
    status: "pending"
  }
];

// Helper to save state (optional simulation)
function persistState() {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("mock_blog_posts", JSON.stringify(mockBlogPosts));
      localStorage.setItem("mock_blog_keywords", JSON.stringify(mockKeywords));
      localStorage.setItem("mock_blog_logs", JSON.stringify(mockLogs));
      localStorage.setItem("mock_blog_insights", JSON.stringify(mockInsights));
    } catch (e) {
      // safe
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Production Supabase Connection & Automatic Query Retry
// ─────────────────────────────────────────────────────────────────────────────

import { createClient } from "@supabase/supabase-js";

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false }
  });
}

async function retryQuery<T>(fn: () => Promise<T>, retries = 3, delay = 500): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 1) throw error;
    await new Promise(res => setTimeout(res, delay));
    return retryQuery(fn, retries - 1, delay * 2);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Exposed Actions (gracefully falling back or bridging Supabase operations)
// ─────────────────────────────────────────────────────────────────────────────

export async function getDbPosts(): Promise<BlogPost[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      return await retryQuery(async () => {
        const { data, error } = await supabase
          .from("blog_posts")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        return data || [];
      });
    } catch (e) {
      console.warn("Supabase getDbPosts query failed, falling back to mock array:", e);
    }
  }
  return mockBlogPosts;
}

export async function getDbPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      return await retryQuery(async () => {
        const { data, error } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("slug", slug)
          .maybeSingle();
        if (error) throw error;
        return data || undefined;
      });
    } catch (e) {
      console.warn("Supabase getDbPostBySlug query failed, falling back to mock array:", e);
    }
  }

  // Check dynamic DB posts fallback
  const post = mockBlogPosts.find(p => p.slug === slug);
  if (post) return post;

  // Fallback to check SEO presets (Programmatic landing pages)
  const seoPreset = getSeoPage(slug);
  if (seoPreset) {
    return {
      id: `seo-preset-${seoPreset.slug}`,
      slug: seoPreset.slug,
      title: seoPreset.h1,
      excerpt: seoPreset.description,
      category: "Tools Showcase",
      read_time: "5 min",
      author: "GoluPDFs Engine",
      content: `# ${seoPreset.h1}

${seoPreset.intro}

## Why Choose GoluPDFs?
${seoPreset.whyBullets.map(b => `* **${b.split(" — ")[0] || b}**: ${b.split(" — ")[1] || ""}`).join("\n")}

## Frequently Asked Questions
${(seoPreset.faq || []).map(f => `### ${f.q}\n${f.a}`).join("\n\n")}`,
      keywords: seoPreset.keywords,
      is_pillar: false,
      seo_score: 98,
      views_30d: 4320,
      clicks_30d: 215,
      ctr_30d: 4.98,
      avg_position: 2.8,
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  return undefined;
}

export async function insertDbPost(post: BlogPost): Promise<BlogPost> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      return await retryQuery(async () => {
        const { data, error } = await supabase
          .from("blog_posts")
          .upsert(post, { onConflict: "slug" })
          .select()
          .single();
        if (error) throw error;
        return data;
      });
    } catch (e) {
      console.warn("Supabase insertDbPost query failed, updating local mock state:", e);
    }
  }

  mockBlogPosts = [post, ...mockBlogPosts.filter(p => p.slug !== post.slug)];
  persistState();
  return post;
}

export async function deleteDbPost(id: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      return await retryQuery(async () => {
        const { error } = await supabase
          .from("blog_posts")
          .delete()
          .eq("id", id);
        if (error) throw error;
        return true;
      });
    } catch (e) {
      console.warn("Supabase deleteDbPost failed:", e);
    }
  }

  mockBlogPosts = mockBlogPosts.filter(p => p.id !== id);
  persistState();
  return true;
}

export async function getDbKeywords(): Promise<KeywordOpportunity[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      return await retryQuery(async () => {
        const { data, error } = await supabase
          .from("keyword_opportunities")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        return data || [];
      });
    } catch (e) {
      console.warn("Supabase getDbKeywords failed, falling back to mock:", e);
    }
  }
  return mockKeywords;
}

export async function insertDbKeyword(kw: Omit<KeywordOpportunity, "id" | "created_at">): Promise<KeywordOpportunity> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      return await retryQuery(async () => {
        const { data, error } = await supabase
          .from("keyword_opportunities")
          .upsert(kw, { onConflict: "keyword" })
          .select()
          .single();
        if (error) throw error;
        return data;
      });
    } catch (e) {
      console.warn("Supabase insertDbKeyword failed, updating local mock state:", e);
    }
  }

  const newKw: KeywordOpportunity = {
    ...kw,
    id: mockKeywords.length ? Math.max(...mockKeywords.map(k => k.id)) + 1 : 1,
    created_at: new Date().toISOString()
  };
  mockKeywords = [newKw, ...mockKeywords.filter(k => k.keyword !== kw.keyword)];
  persistState();
  return newKw;
}

export async function updateDbKeywordStatus(id: number, status: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      return await retryQuery(async () => {
        const { error } = await supabase
          .from("keyword_opportunities")
          .update({ status })
          .eq("id", id);
        if (error) throw error;
        return true;
      });
    } catch (e) {
      console.warn("Supabase updateDbKeywordStatus failed:", e);
    }
  }

  const kw = mockKeywords.find(k => k.id === id);
  if (kw) {
    kw.status = status;
    persistState();
    return true;
  }
  return false;
}

export async function deleteDbKeyword(id: number): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      return await retryQuery(async () => {
        const { error } = await supabase
          .from("keyword_opportunities")
          .delete()
          .eq("id", id);
        if (error) throw error;
        return true;
      });
    } catch (e) {
      console.warn("Supabase deleteDbKeyword failed:", e);
    }
  }

  mockKeywords = mockKeywords.filter(k => k.id !== id);
  persistState();
  return true;
}

export async function getDbLogs(): Promise<GenerationLog[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      return await retryQuery(async () => {
        const { data, error } = await supabase
          .from("generation_logs")
          .select("*")
          .order("ts", { ascending: false })
          .limit(100);
        if (error) throw error;
        return data || [];
      });
    } catch (e) {
      console.warn("Supabase getDbLogs failed, falling back to mock:", e);
    }
  }
  return mockLogs;
}

export async function insertDbLog(action: string, status: string, details: string, keyword?: string, payload?: any): Promise<GenerationLog> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      return await retryQuery(async () => {
        const { data, error } = await supabase
          .from("generation_logs")
          .insert({ action, status, details, keyword, payload })
          .select()
          .single();
        if (error) throw error;
        return data;
      });
    } catch (e) {
      console.warn("Supabase insertDbLog failed, updating local mock state:", e);
    }
  }

  const newLog: GenerationLog = {
    id: mockLogs.length ? Math.max(...mockLogs.map(l => l.id)) + 1 : 1,
    ts: new Date().toISOString(),
    action,
    status,
    keyword,
    details,
    payload
  };
  mockLogs = [newLog, ...mockLogs];
  persistState();
  return newLog;
}

export async function getDbInsights(): Promise<AnalyticsInsight[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      return await retryQuery(async () => {
        const { data, error } = await supabase
          .from("analytics_insights")
          .select("*")
          .order("ts", { ascending: false });
        if (error) throw error;
        return data || [];
      });
    } catch (e) {
      console.warn("Supabase getDbInsights failed, falling back to mock:", e);
    }
  }
  return mockInsights;
}

export async function insertDbInsight(insight: Omit<AnalyticsInsight, "id" | "ts">): Promise<AnalyticsInsight> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      return await retryQuery(async () => {
        const { data, error } = await supabase
          .from("analytics_insights")
          .insert(insight)
          .select()
          .single();
        if (error) throw error;
        return data;
      });
    } catch (e) {
      console.warn("Supabase insertDbInsight failed, updating local mock state:", e);
    }
  }

  const newInsight: AnalyticsInsight = {
    ...insight,
    id: mockInsights.length ? Math.max(...mockInsights.map(i => i.id)) + 1 : 1,
    ts: new Date().toISOString()
  };
  mockInsights = [newInsight, ...mockInsights];
  persistState();
  return newInsight;
}

export async function updateDbInsightStatus(id: number, status: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      return await retryQuery(async () => {
        const { error } = await supabase
          .from("analytics_insights")
          .update({ status })
          .eq("id", id);
        if (error) throw error;
        return true;
      });
    } catch (e) {
      console.warn("Supabase updateDbInsightStatus failed:", e);
    }
  }

  const insight = mockInsights.find(i => i.id === id);
  if (insight) {
    insight.status = status;
    persistState();
    return true;
  }
  return false;
}
