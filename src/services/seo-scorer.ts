export interface SeoScoreDetails {
  keyword_density: number;
  structure_score: number;
  readability_score: number;
  link_score: number;
  ctr_score: number;
}

export interface SeoScoreReport {
  score: number;
  details: SeoScoreDetails;
  suggestions: string[];
}

/**
 * AI SEO Scoring Engine (SurferSEO clone).
 * Dynamically parses article content and outputs metric cards.
 */
export function calculateSeoScore(
  title: string,
  content: string,
  primaryKeyword: string,
  lsiKeywords: string[] = []
): SeoScoreReport {
  const suggestions: string[] = [];
  const text = content.toLowerCase();
  const kw = primaryKeyword.toLowerCase();
  
  // 1. Keyword Density (Target 1.5% - 2.8%)
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  
  // Count exact primary keyword matches
  const keywordRegex = new RegExp(`\\b${kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'gi');
  const matches = content.match(keywordRegex);
  const count = matches ? matches.length : 0;
  
  const density = wordCount > 0 ? (count / wordCount) * 100 : 0;
  
  let kwScore = 0;
  if (density >= 1.2 && density <= 2.8) {
    kwScore = 100;
  } else if (density > 0 && density < 1.2) {
    kwScore = Math.floor((density / 1.2) * 80);
    suggestions.push(`Increase primary keyword density (currently ${density.toFixed(2)}%, target is 1.5% - 2.5%).`);
  } else if (density > 2.8) {
    kwScore = Math.floor((2.8 / density) * 70);
    suggestions.push(`Warning: High keyword density (${density.toFixed(2)}%). Reduce keyword usage to avoid search penalty.`);
  } else {
    kwScore = 0;
    suggestions.push(`Primary keyword '${primaryKeyword}' was not found in the article text.`);
  }

  // Calculate LSI coverage
  let lsiMatches = 0;
  lsiKeywords.forEach(word => {
    if (text.includes(word.toLowerCase())) {
      lsiMatches++;
    }
  });
  const lsiCoverage = lsiKeywords.length > 0 ? (lsiMatches / lsiKeywords.length) * 100 : 100;
  if (lsiCoverage < 70) {
    suggestions.push(`Include more semantic LSI keywords (covered ${lsiMatches}/${lsiKeywords.length}).`);
  }
  
  const densityFinalScore = Math.floor((kwScore * 0.7) + (lsiCoverage * 0.3));

  // 2. Structural Score (H2, H3, images, bullets)
  const h2Count = (content.match(/^##\s/gm) || []).length;
  const h3Count = (content.match(/^###\s/gm) || []).length;
  const bulletCount = (content.match(/^[\*\-]\s/gm) || []).length;
  const tableCount = (content.match(/\|/g) || []).length / 6; // Rough estimate

  let structScore = 0;
  if (h2Count >= 3) structScore += 40;
  else {
    structScore += h2Count * 10;
    suggestions.push(`Structure needs at least 3 distinct H2 sub-sections for better readability.`);
  }

  if (h3Count >= 2) structScore += 20;
  else structScore += h3Count * 10;

  if (bulletCount >= 5) structScore += 20;
  else {
    structScore += bulletCount * 3;
    suggestions.push(`Add a bulleted or numbered list to improve scannability.`);
  }

  if (tableCount >= 1) structScore += 20;
  else {
    suggestions.push(`Add a comparison or parameter summary table for richer user utility.`);
  }

  // 3. Readability Score (length & sentence variations)
  let readScore = 50;
  if (wordCount >= 2000) readScore += 50;
  else if (wordCount >= 1200) {
    readScore += 30;
    suggestions.push(`Article length is ${wordCount} words. Standard high-ranking posts target 2,000+ words.`);
  } else {
    readScore += Math.floor((wordCount / 1200) * 20);
    suggestions.push(`Content is quite thin (${wordCount} words). Expand detail and explanations.`);
  }

  // 4. Link & Call to Action (CTA) Score
  const links = (content.match(/\[([^\]]+)\]\(([^)]+)\)/g) || []).length;
  const internalLinksCount = (content.match(/\]\(\/(?!http)/g) || []).length; // relative routes
  
  let linkScore = 0;
  if (links >= 4) linkScore += 50;
  else {
    linkScore += links * 10;
    suggestions.push(`Insert more contextual links (currently ${links}). Target at least 4.`);
  }

  if (internalLinksCount >= 2) linkScore += 50;
  else {
    linkScore += internalLinksCount * 25;
    suggestions.push(`Add internal deep-links (currently ${internalLinksCount}) referencing other tools or pillars.`);
  }

  // 5. CTR Title Optimization Score
  let titleScore = 50;
  if (title.includes(":") || title.includes("—")) titleScore += 20; // contains separator
  if (/\d+/.test(title)) titleScore += 20; // contains numbers
  if (title.length >= 40 && title.length <= 70) titleScore += 10;
  else suggestions.push(`Optimize Title length (currently ${title.length} chars). Keep between 40-70 characters.`);

  // Final aggregate score
  const aggregateScore = Math.floor(
    (densityFinalScore * 0.3) +
    (structScore * 0.25) +
    (readScore * 0.2) +
    (linkScore * 0.15) +
    (titleScore * 0.1)
  );

  return {
    score: Math.min(Math.max(aggregateScore, 10), 100),
    details: {
      keyword_density: densityFinalScore,
      structure_score: structScore,
      readability_score: readScore,
      link_score: linkScore,
      ctr_score: titleScore
    },
    suggestions: suggestions.slice(0, 5) // top 5 actionable tips
  };
}
export function getCircularProgressColor(score: number): string {
  if (score >= 80) return "text-emerald-500 stroke-emerald-500";
  if (score >= 50) return "text-amber-500 stroke-amber-500";
  return "text-rose-500 stroke-rose-500";
}
export function getCircularProgressBackground(score: number): string {
  if (score >= 80) return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
  if (score >= 50) return "bg-amber-500/10 text-amber-500 border-amber-500/20";
  return "bg-rose-500/10 text-rose-500 border-rose-500/20";
}
