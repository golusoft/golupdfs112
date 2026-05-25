import { getProductsByCategory, mapCategoryToAffiliate, AffiliateProduct } from "@/lib/admin/affiliate-config";

export interface AffiliateInsertionResult {
  content: string;
  blocks_inserted: boolean;
  inserted_products: string[];
}

/**
 * Technical Affiliate Monetization & Telemetry Engine.
 * Contextually detects intent, generates comparison grids, and formats secure redirect links.
 */

// 1. Detect commercial/transactional search intent in article keyword & outline
export function detectCommercialIntent(keyword: string, content: string): boolean {
  const kw = keyword.toLowerCase();
  const body = content.toLowerCase();

  const commercialTriggers = [
    "best", "compare", "vs", "review", "top", "pricing", "price", 
    "buy", "cheap", "alternative", "free tool", "software", "premium"
  ];

  // If keyword contains triggers, or content has tabular structures comparing services
  const hasKwTrigger = commercialTriggers.some(t => kw.includes(t));
  const hasTables = content.includes("|") && body.includes("competitor");

  return hasKwTrigger || hasTables;
}

// 2. Generate a secure, trackable redirect url
export function generateTrackUrl(postSlug: string, product: AffiliateProduct): string {
  const encUrl = encodeURIComponent(product.rawLink);
  return `/api/track?slug=${postSlug}&product=${product.id}&url=${encUrl}`;
}

// 3. Generate a highly styled, premium Comparison Grid (No spam, native aesthetics)
export function generateComparisonGrid(postSlug: string, products: AffiliateProduct[]): string {
  if (products.length === 0) return "";

  let html = `\n\n## Comparison: Top Recommended Document & Workflow Utilities\n\n`;
  html += `<div className="mt-6 overflow-hidden rounded-2xl border bg-card shadow-lg shadow-brand-500/5 animate-fade-in-up">\n`;
  html += `  <div className="overflow-x-auto">\n`;
  html += `    <table className="w-full text-left text-sm border-collapse">\n`;
  html += `      <thead>\n`;
  html += `        <tr className="border-b bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">\n`;
  html += `          <th className="px-6 py-4">Software</th>\n`;
  html += `          <th className="px-6 py-4">Key Advantage</th>\n`;
  html += `          <th className="px-6 py-4">Pricing</th>\n`;
  html += `          <th className="px-6 py-4 text-center">Action</th>\n`;
  html += `        </tr>\n`;
  html += `      </thead>\n`;
  html += `      <tbody className="divide-y divide-border bg-card">\n`;

  products.forEach(p => {
    const trackUrl = generateTrackUrl(postSlug, p);
    html += `        <tr className="hover:bg-muted/20 transition-colors">\n`;
    html += `          <td className="px-6 py-4 font-bold text-foreground">${p.name}</td>\n`;
    html += `          <td className="px-6 py-4 text-muted-foreground">${p.keyFeature}</td>\n`;
    html += `          <td className="px-6 py-4 font-mono font-semibold text-brand-600 dark:text-brand-400">${p.priceModel}</td>\n`;
    html += `          <td className="px-6 py-4 text-center">\n`;
    html += `            <a href="${trackUrl}" target="_blank" rel="noopener noreferrer" className="inline-flex h-9 items-center justify-center rounded-lg bg-gradient-to-r from-brand-600 to-violet-600 px-4 text-xs font-semibold text-white shadow-md shadow-brand-500/10 hover:brightness-110 active:scale-[0.98] transition-all">${p.ctaText}</a>\n`;
    html += `          </td>\n`;
    html += `        </tr>\n`;
  });

  html += `      </tbody>\n`;
  html += `    </table>\n`;
  html += `  </div>\n`;
  html += `</div>\n\n`;

  return html;
}

// 4. Generate a premium contextual Call-To-Action (CTA) Banner
export function generateCtaBanner(postSlug: string, product: AffiliateProduct): string {
  const trackUrl = generateTrackUrl(postSlug, product);
  
  let html = `\n\n`;
  html += `> ### [🔥 Special Offer] ${product.name}\n`;
  html += `> **Advantage:** ${product.tagline}\n`;
  html += `> **Standard Value:** Starting at ${product.priceModel} (${product.keyFeature}).\n`;
  html += `> [👉 **${product.ctaText} Instantly**](${trackUrl})\n`;
  html += `\n\n`;

  return html;
}

// 5. Core Contextual Monetization Compiler (Automated CTA Insertion Gateway)
export function compileAffiliateMonetization(
  content: string,
  primaryKeyword: string,
  blogCategory: string,
  postSlug: string
): AffiliateInsertionResult {
  // If not commercial intent, skip to prevent SEO pollution
  const isCommercial = detectCommercialIntent(primaryKeyword, content);
  if (!isCommercial) {
    return { content, blocks_inserted: false, inserted_products: [] };
  }

  // Identify affiliate inventory target categories
  const targetCategory = mapCategoryToAffiliate(blogCategory);
  const products = getProductsByCategory(targetCategory);

  if (products.length === 0) {
    return { content, blocks_inserted: false, inserted_products: [] };
  }

  let finalContent = content;
  const inserted_products: string[] = [];

  // Strategy A: Contextually inject a Comparison Grid before the first structural H2 heading
  const h2Index = finalContent.search(/^##\s+/m);
  if (h2Index !== -1) {
    const comparisonGrid = generateComparisonGrid(postSlug, products.slice(0, 3));
    finalContent = 
      finalContent.substring(0, h2Index) + 
      comparisonGrid + 
      finalContent.substring(h2Index);
      
    products.slice(0, 3).forEach(p => inserted_products.push(p.id));
  }

  // Strategy B: Weave a high-converting CTA text link inside the final FAQ/Summary H2 block
  const lastH2Index = finalContent.lastIndexOf("\n## ");
  if (lastH2Index !== -1 && products.length > 0) {
    // Select primary category product
    const topProduct = products[0];
    const ctaBanner = generateCtaBanner(postSlug, topProduct);
    
    finalContent = 
      finalContent.substring(0, lastH2Index) + 
      ctaBanner + 
      finalContent.substring(lastH2Index);

    if (!inserted_products.includes(topProduct.id)) {
      inserted_products.push(topProduct.id);
    }
  }

  return {
    content: finalContent,
    blocks_inserted: inserted_products.length > 0,
    inserted_products
  };
}
