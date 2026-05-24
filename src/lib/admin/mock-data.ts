/**
 * Mock analytics data for the admin dashboard.
 * In production, swap with Supabase queries + GA4 + Search Console APIs.
 *
 * Keeps the dashboard meaningful at all times so the UX is enterprise-grade
 * even before real integrations are wired.
 */
import { TOOLS } from "@/lib/tools";

const seed = (n: number, salt = 1) => Math.sin(n * 12.9898 + salt * 78.233) * 43758.5453;
const rand = (n: number, salt = 1) => Math.abs(seed(n, salt)) % 1;

export function trafficSeries(days = 30) {
  const today = new Date();
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (days - 1 - i));
    const base = 8000 + Math.round(rand(i, 1) * 4000);
    const visits = Math.round(base * (1 + i / days * 0.4));
    const conversions = Math.round(visits * (0.55 + rand(i, 2) * 0.1));
    return {
      date: d.toISOString().slice(5, 10),
      visits,
      conversions,
      revenue: Math.round(visits * 0.0042 * 100) / 100,
    };
  });
}

export function topTools(limit = 10) {
  return TOOLS
    .map((t, i) => ({
      slug: t.slug,
      name: t.shortName,
      category: t.category,
      uses: Math.round(50000 / (i + 1) + rand(i, 3) * 8000),
      conversionRate: Math.round((45 + rand(i, 4) * 30) * 10) / 10,
      avgTime: Math.round(800 + rand(i, 5) * 1500),
    }))
    .sort((a, b) => b.uses - a.uses)
    .slice(0, limit);
}

export function topQueries(limit = 10) {
  const queries = [
    { q: "compress pdf to 100kb", clicks: 18420, impressions: 184230, position: 2.3, ctr: 10.0 },
    { q: "merge pdf online", clicks: 12830, impressions: 134200, position: 3.1, ctr: 9.6 },
    { q: "split pdf pages", clicks: 9420, impressions: 102330, position: 3.8, ctr: 9.2 },
    { q: "pdf to word converter", clicks: 8120, impressions: 121450, position: 5.2, ctr: 6.7 },
    { q: "free pdf compressor", clicks: 7820, impressions: 88420, position: 4.0, ctr: 8.8 },
    { q: "convert pdf to jpg", clicks: 6230, impressions: 73120, position: 4.7, ctr: 8.5 },
    { q: "sign pdf online", clicks: 5910, impressions: 81230, position: 5.5, ctr: 7.3 },
    { q: "scan to pdf", clicks: 4830, impressions: 62410, position: 6.1, ctr: 7.7 },
    { q: "watermark pdf", clicks: 4120, impressions: 51330, position: 5.9, ctr: 8.0 },
    { q: "remove pdf password", clicks: 3920, impressions: 49830, position: 6.4, ctr: 7.9 },
  ];
  return queries.slice(0, limit);
}

export function feedbackList() {
  return [
    {
      id: "f1",
      author: "sarah.chen@lattice.com",
      rating: 5,
      message:
        "Replaced our entire Acrobat workflow. The page organizer alone is worth it.",
      tool: "organize-pdf",
      date: "2 hours ago",
      status: "new",
    },
    {
      id: "f2",
      author: "marcus@studiowest.io",
      rating: 5,
      message: "Compressed a 220 MB PDF to 12 MB without quality loss. Magical.",
      tool: "compress-pdf",
      date: "5 hours ago",
      status: "new",
    },
    {
      id: "f3",
      author: "aditi@vellum.law",
      rating: 4,
      message:
        "Great tool. Wish PDF→Word handled multi-column legal docs better.",
      tool: "pdf-to-word",
      date: "1 day ago",
      status: "open",
    },
    {
      id: "f4",
      author: "diego@helio.dev",
      rating: 5,
      message: "Bulk converter handled 14k files overnight. Insane.",
      tool: "bulk-convert",
      date: "2 days ago",
      status: "resolved",
    },
    {
      id: "f5",
      author: "priya@northwood.com",
      rating: 5,
      message: "Mobile signing UX is genuinely better than DocuSign.",
      tool: "sign-pdf",
      date: "3 days ago",
      status: "resolved",
    },
  ];
}

export function recentActivity() {
  return [
    { type: "deploy", message: "Deployed v1.4.2 to production", ts: "8 min ago" },
    { type: "tool", message: "AI PDF Assistant promoted to public beta", ts: "2 hours ago" },
    { type: "seo", message: "12 new keywords ranking in top 10", ts: "6 hours ago" },
    { type: "revenue", message: "AdSense RPM hit a new monthly high ($14.20)", ts: "1 day ago" },
    { type: "blog", message: "New article: ‘Best PDF tools in 2026’ published", ts: "2 days ago" },
  ];
}

export function siteHealth() {
  return {
    uptime30d: 99.97,
    avgResponse: 142,
    p95Response: 320,
    cwv: { lcp: 1.8, fid: 12, cls: 0.04, score: 98 },
    errorsLast24h: 3,
  };
}

export function revenueSeries(days = 30) {
  return trafficSeries(days).map((d) => ({
    date: d.date,
    adsense: Math.round(d.visits * 0.0035 * 100) / 100,
    affiliate: Math.round(d.visits * 0.0012 * 100) / 100,
    total: Math.round(d.visits * 0.0047 * 100) / 100,
  }));
}
