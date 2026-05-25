export interface AffiliateProduct {
  id: string;
  name: string;
  category: string;
  tagline: string;
  ctaText: string;
  rawLink: string;
  rating: number; // out of 5
  keyFeature: string;
  priceModel: string; // e.g. Free, $9/mo, $5/mo
}

/**
 * Centrally Managed Affiliate Inventory Configuration
 * PDF tools, AI, Productivity SaaS, Cloud Storage, Hosting, VPN, and Office Workflow.
 */
export const AFFILIATE_INVENTORY: AffiliateProduct[] = [
  // 1. PDF Tools
  {
    id: "adobe-pro",
    name: "Adobe Acrobat Pro",
    category: "pdf_tools",
    tagline: "The absolute industry standard for professional PDF document management.",
    ctaText: "Get Acrobat Pro",
    rawLink: "https://partner.adobe.com/golu-acrobat-pro",
    rating: 4.8,
    keyFeature: "Advanced Form Filling, OCR, & Desktop Editing",
    priceModel: "$19.99/mo"
  },
  {
    id: "soda-pdf",
    name: "Soda PDF Pro",
    category: "pdf_tools",
    tagline: "A fast, lightweight, and modern cloud alternative for combining & compressing.",
    ctaText: "Try Soda PDF Pro",
    rawLink: "https://sodapdf.pxf.io/golu-sodapdf",
    rating: 4.5,
    keyFeature: "Affordable Batch Processing & Cloud Connect",
    priceModel: "$6.99/mo"
  },

  // 2. AI Tools
  {
    id: "gemini-advanced",
    name: "Google Gemini Advanced",
    category: "ai_tools",
    tagline: "Unleash Google's smartest 1.5 Pro and 2.5 Pro models for extreme workflow logic.",
    ctaText: "Try Gemini Advanced",
    rawLink: "https://gemini.google.com/advanced?golu-ref",
    rating: 4.9,
    keyFeature: "2 Million Token Context Window & Workspace Integration",
    priceModel: "$20.00/mo"
  },

  // 3. Productivity SaaS
  {
    id: "notion-ai",
    name: "Notion Enterprise & AI",
    category: "productivity_saas",
    tagline: "The ultimate unified workspace for knowledge systems, wikis, and team checklists.",
    ctaText: "Boost Notion Workspace",
    rawLink: "https://notion.grsm.io/golu-notion",
    rating: 4.7,
    keyFeature: "AI-Powered Autofill & Universal Search",
    priceModel: "$8.00/mo"
  },

  // 4. Cloud Storage
  {
    id: "pcloud",
    name: "pCloud Lifetime Storage",
    category: "cloud_storage",
    tagline: "The most secure, client-side encrypted lifetime cloud drive located in Switzerland.",
    ctaText: "Claim pCloud Lifetime",
    rawLink: "https://partner.pcloud.com/golu-pcloud",
    rating: 4.6,
    keyFeature: "Swiss Privacy Protection & Zero-Knowledge Folder",
    priceModel: "$199 Lifetime"
  },

  // 5. Web Hosting
  {
    id: "hostinger",
    name: "Hostinger Business Cloud",
    category: "hosting",
    tagline: "Fastest affordable managed hosting with free SSL, global CDN, and automated backups.",
    ctaText: "Get Hostinger Cloud",
    rawLink: "https://hostinger.com/golu-hosting",
    rating: 4.7,
    keyFeature: "Unmetered Bandwidth & 100 website installs",
    priceModel: "$3.99/mo"
  },

  // 6. VPN & Security
  {
    id: "nordvpn",
    name: "NordVPN Secure Tunnel",
    category: "vpn_security",
    tagline: "Ultra-fast double-hop encryption tunnel shielding your browser metadata from tracking.",
    ctaText: "Activate NordVPN",
    rawLink: "https://go.nordvpn.net/aff_c?offer_id=golu-nord",
    rating: 4.8,
    keyFeature: "Threat Protection, Dedicated IP, & Meshnet",
    priceModel: "$3.29/mo"
  },

  // 7. Office Workflow Software
  {
    id: "microsoft-365",
    name: "Microsoft 365 Personal",
    category: "office_workflow",
    tagline: "Full access to classic Word, Excel, PowerPoint, Outlook, and 1 TB OneDrive cloud storage.",
    ctaText: "Get Microsoft 365",
    rawLink: "https://microsoft.com/365-personal?golu-ref",
    rating: 4.7,
    keyFeature: "Offline Native Apps & Copilot AI integration",
    priceModel: "$6.99/mo"
  }
];

/**
 * Helper to fetch inventory objects dynamically based on category
 */
export function getProductsByCategory(category: string): AffiliateProduct[] {
  return AFFILIATE_INVENTORY.filter(p => p.category === category);
}

/**
 * Mapping helper to associate Article categories with affiliate categories
 */
export function mapCategoryToAffiliate(blogCategory: string): string {
  const c = blogCategory.toLowerCase();
  if (c.includes("compress") || c.includes("merge") || c.includes("split") || c.includes("join") || c.includes("pdf")) {
    return "pdf_tools";
  }
  if (c.includes("ai") || c.includes("chatgpt") || c.includes("agent") || c.includes("prompt")) {
    return "ai_tools";
  }
  if (c.includes("hosting") || c.includes("server") || c.includes("domain") || c.includes("web")) {
    return "hosting";
  }
  if (c.includes("security") || c.includes("vpn") || c.includes("privacy") || c.includes("sign")) {
    return "vpn_security";
  }
  if (c.includes("excel") || c.includes("word") || c.includes("office") || c.includes("doc")) {
    return "office_workflow";
  }
  return "productivity_saas"; // Default fallback category
}
