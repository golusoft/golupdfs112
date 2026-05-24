# GoluPDFs — Premium PDF Tools SaaS Platform

> The modern PDF Studio — 30+ premium tools that run privately in your browser.
> Built with Next.js 15, TypeScript, Tailwind CSS, ShadCN UI, Framer Motion, GSAP, pdf-lib, PDF.js, Zustand, Supabase.

---

## ✨ Highlights

- **30 premium PDF tools** — compress, merge, split, convert, sign, edit, redact, annotate, OCR, scan, and more
- **100% browser-side processing** — files never leave the user's device (pdf-lib + PDF.js)
- **Programmatic SEO engine** — 21 high-intent landing pages (compress-pdf-to-100kb, merge-pdf-online, etc.)
- **Premium admin dashboard** — JWT-auth, traffic charts, top tools, SEO performance, AdSense revenue, feedback, site health
- **Cinematic UI** — glass panels, mesh gradients, floating particles, motion choreography across every page
- **SEO-first architecture** — sitemap.xml, robots.txt, JSON-LD (Organization, WebSite, SoftwareApplication, BreadcrumbList, FAQPage), edge-rendered OG image, Web Vitals optimized
- **Mobile-first** — drawer nav, touch-friendly drop zones, responsive layouts
- **Built to scale** — tool registry pattern means adding a new tool = one entry in `lib/tools.ts`

---

## 📦 Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) + React 19 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + custom design system |
| UI primitives | ShadCN UI (Radix) |
| Motion | Framer Motion + GSAP |
| PDF engine | pdf-lib + pdfjs-dist (4.7.76) |
| File handling | react-dropzone, JSZip, file-saver |
| State | Zustand (with persist middleware) |
| Auth | JWT via `jose` (HS256, httpOnly cookie) |
| Backend | Supabase (optional — for analytics & feedback) |
| Charts | Recharts |
| Hosting | Vercel (edge-ready) |

---

## 🚀 Quick start

```bash
# 1. Install
npm install

# 2. Env
cp .env.example .env.local
# Fill in ADMIN_JWT_SECRET (long random string) at minimum

# 3. Dev
npm run dev          # http://localhost:3000

# 4. Production build
npm run build && npm start
```

### Required environment variables

| Variable | Used by | Notes |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | SEO / OG / sitemap | e.g. `https://golupdfs.com` |
| `ADMIN_EMAIL` | Admin login | The single admin user's email |
| `ADMIN_PASSWORD` | Admin login | Plaintext compared at sign-in (server-only) |
| `ADMIN_JWT_SECRET` | Cookie signing | Min 32 chars, random |

### Optional environment variables

| Variable | Used by |
|---|---|
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | AdSense ad slots |
| `NEXT_PUBLIC_GOOGLE_VERIFICATION` | Search Console verification |
| `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser Supabase client |
| `SUPABASE_SERVICE_ROLE_KEY` | Server analytics writes |

---

## 🗂 Project structure

```
src/
├── app/
│   ├── (seo)/[slug]/page.tsx      # 21 programmatic SEO landing pages
│   ├── admin/
│   │   ├── (authed)/              # JWT-protected route group
│   │   │   ├── layout.tsx         # Auth gate + admin shell
│   │   │   ├── page.tsx           # Dashboard
│   │   │   ├── tools/             # Tool analytics
│   │   │   ├── seo/               # SEO + Search Console layout
│   │   │   ├── revenue/           # AdSense revenue
│   │   │   ├── feedback/          # User feedback
│   │   │   ├── health/            # Site health + CWV
│   │   │   └── settings/          # Admin settings
│   │   └── login/page.tsx         # Public login form
│   ├── api/
│   │   ├── admin/login/route.ts   # Login endpoint
│   │   ├── admin/logout/route.ts  # Logout endpoint
│   │   └── track/route.ts         # Event tracking → Supabase
│   ├── tools/
│   │   ├── page.tsx               # Tool browser (search + filter)
│   │   └── [slug]/page.tsx        # Dynamic tool page (× 30)
│   ├── blog/, about/, pricing/, contact/, privacy/, terms/
│   ├── sitemap.ts, robots.ts, manifest.ts
│   ├── opengraph-image.tsx        # Edge-rendered 1200×630 OG
│   ├── icon.svg, layout.tsx, page.tsx, not-found.tsx, globals.css
├── components/
│   ├── ui/                        # 14 ShadCN primitives
│   ├── layout/                    # Navbar, Footer, Logo, ThemeToggle
│   ├── motion/                    # FadeIn, FloatingParticles, AnimatedCounter, Magnetic
│   ├── home/                      # Hero, UploadSpotlight, ToolGrid, Features, Stats, Testimonials, FAQ, CTA
│   ├── tools/                     # ToolRunner, Dropzone, OptionsPanel, ResultPanel, FAQ, RelatedTools, Breadcrumbs, ShareButtons, AdSlot
│   ├── admin/                     # AdminShell, LoginForm, StatCard, Charts
│   ├── analytics.tsx              # GA4 + AdSense scripts
│   ├── providers.tsx              # ThemeProvider + Toaster + Tooltip
│   └── structured-data.tsx
├── lib/
│   ├── tools.ts                   # The 30-tool registry (single source of truth)
│   ├── seo.ts                     # buildMetadata + JSON-LD helpers
│   ├── seo-pages.ts               # 21 programmatic SEO presets
│   ├── auth.ts                    # JWT sign/verify
│   ├── utils.ts                   # cn, formatBytes, formatNumber, slugify, sleep
│   ├── pdf/
│   │   ├── pdfjs.ts               # PDF.js loader + thumbnails
│   │   ├── range.ts               # Page range parser
│   │   ├── types.ts
│   │   └── processors/
│   │       ├── index.ts           # Engine dispatcher
│   │       ├── core.ts            # merge, split, rotate, organize, etc.
│   │       ├── compress.ts        # 5-level compression
│   │       └── image.ts           # PDF ↔ image
│   ├── supabase/
│   │   ├── client.ts              # Browser SSR client
│   │   └── server.ts              # Server + service-role clients
│   └── admin/
│       └── mock-data.ts           # Deterministic dashboard seed data
├── store/
│   └── tools-store.ts             # Zustand: queuedFiles + recent tools (persisted)
└── middleware.ts                  # Rate limit + admin auth + security headers
```

---

## 🧰 The 30 tools

| # | Tool | Engine | Status |
|---|---|---|---|
| 1 | Compress PDF Pro | `compress` | ✅ Full (5 presets, target size) |
| 2 | Merge PDF Studio | `merge` | ✅ Full |
| 3 | Split PDF Advanced | `split` | ✅ Full (multi-output ZIP) |
| 4 | PDF to JPG Ultra | `pdf-to-jpg` | ✅ Full (DPI 72-300, JPG/PNG) |
| 5 | JPG to PDF Pro | `jpg-to-pdf` | ✅ Full (sizes + orientation + margin) |
| 6 | PDF Page Organizer | `organize` | ✅ Full |
| 7 | Remove PDF Pages | `remove-pages` | ✅ Full |
| 8 | Rotate PDF Pro | `rotate` | ✅ Full |
| 9 | Extract PDF Pages | `extract` | ✅ Full |
| 10 | Add Page Numbers | `page-numbers` | ✅ Full (9 positions, format strings) |
| 11 | PDF Password Protector | `protect` | ⚠️ Partial (metadata-flag; needs WASM-qpdf for AES) |
| 12 | PDF Password Remover | `unlock` | ✅ Full (browser-side) |
| 13 | PDF Watermark Tool | `watermark` | ✅ Full |
| 14 | PDF Signer Pro | `sign` | ⚠️ UI scaffolding (visual editor planned) |
| 15 | PDF to Word Ultra | `pdf-to-word` | 📡 Server-side queued |
| 16 | Word to PDF Pro | `word-to-pdf` | 📡 Server-side queued |
| 17 | PDF to Excel | `pdf-to-excel` | 📡 Server-side queued |
| 18 | Excel to PDF | `excel-to-pdf` | 📡 Server-side queued |
| 19 | PDF to PowerPoint | `pdf-to-ppt` | 📡 Server-side queued |
| 20 | PowerPoint to PDF | `ppt-to-pdf` | 📡 Server-side queued |
| 21 | OCR PDF Tool | `ocr` | 📡 Tesseract WASM queued |
| 22 | Scan to PDF | `scan` | ✅ Full (camera capture → PDF) |
| 23 | PDF Crop Tool | `crop` | ⚠️ Visual editor planned |
| 24 | PDF Redactor | `redact` | ✅ Black-box overlay |
| 25 | PDF Annotator | `annotate` | ⚠️ Visual editor planned |
| 26 | PDF Metadata Editor | `metadata` | ✅ Full |
| 27 | Bulk PDF Converter | `bulk-convert` | ✅ Full |
| 28 | Ebook to PDF | `ebook` | 📡 Server-side queued |
| 29 | PDF Comparison Tool | `compare` | 📡 Visual diff queued |
| 30 | AI PDF Assistant | `ai-assistant` | 📡 Streaming endpoint queued |

**Legend:** ✅ Fully functional in-browser · ⚠️ UI complete, deeper interaction planned · 📡 Stubbed with graceful "queued" message — requires server-side WASM bridge or AI endpoint to enable the export.

> Engines marked 📡 still produce a working pass-through PDF + clear user-facing note. Wiring them to a full server engine is a single dispatcher swap in `lib/pdf/processors/index.ts`.

---

## 🛡 Admin dashboard

Visit **`/admin/login`** with the credentials from `.env.local`.

The dashboard includes:

- **KPI cards** — visits, conversions, tool runs, revenue (animated counters)
- **Traffic chart** — gradient area chart over 30 days
- **Top tools** — horizontal bar chart
- **Site health** — uptime, response, P95, errors, Core Web Vitals
- **Recent activity** — deploys, tool launches, SEO milestones
- **Tool analytics** — per-tool runs, conversion rate, average time
- **SEO** — top queries with position badges + CTR
- **Revenue** — AdSense + affiliate breakdown
- **Feedback** — user feedback with status tags
- **Health** — full CWV grid + integrations checklist
- **Settings** — account info, site preference toggles

---

## 🔍 SEO

- **Sitemap** at `/sitemap.xml` (8 static + 30 tools + 21 programmatic = 59 URLs)
- **Robots** at `/robots.txt` (admin/api disallowed)
- **JSON-LD** on every page (Organization, WebSite, SoftwareApplication, BreadcrumbList, FAQPage)
- **Edge-rendered OG image** at `/opengraph-image` (1200×630)
- **Dynamic metadata** with `buildMetadata` helper
- **Programmatic landing pages** organized in semantic clusters with internal linking

---

## 🎨 Design system

- Mesh gradient backgrounds, glass-strong panels, dot/grid patterns
- Color tokens via CSS variables (light + dark)
- Brand color scale (50-950)
- 14 ShadCN UI primitives with `gradient` and `glass` variants where useful
- Custom Tailwind keyframes: shimmer, float, gradient-x, spin-slow, fade-in-up, glow

---

## 🔐 Security

- HS256 JWT in httpOnly secure cookie (12h expiry)
- Edge middleware: 60 req/min IP rate limit on /api, admin route gate, HSTS + nosniff + referrer headers
- CSP-friendly (no inline scripts beyond GA + AdSense bootstrap)
- Files never sent to the server — privacy by default

---

## 📈 Analytics integrations

GA4, Google Search Console, AdSense and Supabase event capture are wired with graceful no-op fallbacks. Drop in environment variables and they activate automatically.

`/api/track` accepts `{ event, tool, metadata }` and forwards to a Supabase `events` table when configured.

---

## 🚢 Deploy to Vercel

1. Push this repo to GitHub
2. Import into Vercel
3. Set env vars from `.env.example`
4. Deploy

The build statically renders all 30 tool pages + 21 SEO landing pages.

---

## 🗺 Roadmap

- [ ] WASM-qpdf bridge for true AES-256 PDF encryption
- [ ] Tesseract.js Web Worker for in-browser OCR
- [ ] Visual editor for sign / annotate / crop
- [ ] LibreOffice WASM bridge for PDF ↔ Office (full quality)
- [ ] AI Assistant streaming endpoint (chat-with-PDF)
- [ ] PDF compare visual diff viewer
- [ ] API access (Pro plan)

---

## 📄 License

Proprietary. © GoluPDFs.
