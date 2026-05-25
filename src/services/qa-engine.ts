export interface QaReport {
  score: number;
  readability_ease: number;
  readability_grade: string;
  keyword_density: { keyword: string; density: number; status: string }[];
  duplicate_overlap_pct: number;
  eeat_score: number;
  warnings: string[];
  status: "excellent" | "passed" | "needs_review";
}

/**
 * Technical QA Scoring & Optimization Safety Engine.
 * Evaluates Flesch readability, EEAT, keyword stuffing, and self-cannibalization.
 */

// 1. Helper to count syllables in a word
function countSyllablesInWord(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (w.length <= 2) return 1;
  const vowels = "aeiouy";
  let count = 0;
  let prevVowel = false;

  for (let i = 0; i < w.length; i++) {
    const isVowel = vowels.includes(w[i]);
    if (isVowel && !prevVowel) {
      count++;
    }
    prevVowel = isVowel;
  }

  // Handle silent 'e' at end
  if (w.endsWith("e")) {
    count--;
  }
  // Make sure it returns at least 1
  return Math.max(count, 1);
}

// 2. Flesch Readability Scoring Function
export function calculateReadability(content: string): { ease: number; grade: string } {
  // Strip markdown formatting tags to parse raw words
  const cleanText = content
    .replace(/[#*`_\[\]()\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = cleanText.split(/\s+/).filter(w => w.length > 0);

  if (words.length === 0 || sentences.length === 0) {
    return { ease: 100, grade: "Easy" };
  }

  const totalWords = words.length;
  const totalSentences = sentences.length;
  let totalSyllables = 0;

  words.forEach(w => {
    totalSyllables += countSyllablesInWord(w);
  });

  const wordsPerSentence = totalWords / totalSentences;
  const syllablesPerWord = totalSyllables / totalWords;

  // Flesch Reading Ease Formula
  const ease = 206.835 - 1.015 * wordsPerSentence - 84.6 * syllablesPerWord;
  const clampedEase = Math.max(0, Math.min(100, Math.round(ease)));

  // Flesch-Kincaid Grade Level mapping
  let grade = "Standard";
  if (clampedEase >= 90) grade = "5th Grade (Very Easy)";
  else if (clampedEase >= 80) grade = "6th Grade (Easy)";
  else if (clampedEase >= 70) grade = "7th Grade (Fairly Easy)";
  else if (clampedEase >= 60) grade = "8th-9th Grade (Standard)";
  else if (clampedEase >= 50) grade = "High School (Fairly Difficult)";
  else if (clampedEase >= 30) grade = "College Graduate (Difficult)";
  else grade = "Academic (Very Difficult)";

  return { ease: clampedEase, grade };
}

// 3. Keyword Density Stuffing Guard
export function auditKeywordDensity(
  content: string,
  primaryKeyword: string,
  lsiKeywords: string[] = []
): { keyword: string; density: number; status: string }[] {
  const text = content.toLowerCase();
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const totalWords = words.length;

  if (totalWords === 0) return [];

  const targets = [primaryKeyword, ...lsiKeywords];
  const auditResults: { keyword: string; density: number; status: string }[] = [];

  targets.forEach(kw => {
    const kwLower = kw.toLowerCase();
    
    // Regexp to count occurrences matching word boundaries
    const escaped = kwLower.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b`, "g");
    const matches = text.match(regex);
    const count = matches ? matches.length : 0;

    // Multiply count by keyword word length to evaluate text space occupancy
    const kwWordCount = kwLower.split(/\s+/).length;
    const density = parseFloat(((count * kwWordCount / totalWords) * 100).toFixed(2));

    let status = "safe";
    if (density > 2.5) status = "stuffed";
    else if (density < 0.6) status = "under_optimized";

    auditResults.push({ keyword: kw, density, status });
  });

  return auditResults;
}

// 4. N-gram Plagiarism & Cannibalization Checker (Shingle Similarity)
import { getDbPosts } from "@/lib/admin/mock-blog-data";

function getShingles(text: string, size = 3): Set<string> {
  const words = text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter(w => w.length > 2);
    
  const shingles = new Set<string>();
  for (let i = 0; i <= words.length - size; i++) {
    const shingle = words.slice(i, i + size).join(" ");
    shingles.add(shingle);
  }
  return shingles;
}

export async function checkDuplicateShingles(content: string, excludeSlug = ""): Promise<number> {
  const currentShingles = getShingles(content);
  if (currentShingles.size === 0) return 0;

  const posts = await getDbPosts();
  let maxOverlap = 0;

  for (const post of posts) {
    if (post.slug === excludeSlug || !post.published_at) continue;

    const postShingles = getShingles(post.content);
    if (postShingles.size === 0) continue;

    let matchCount = 0;
    currentShingles.forEach(sh => {
      if (postShingles.has(sh)) matchCount++;
    });

    const overlap = (matchCount / currentShingles.size) * 100;
    if (overlap > maxOverlap) {
      maxOverlap = overlap;
    }
  }

  return parseFloat(maxOverlap.toFixed(1));
}

// 5. EEAT Quality Signals Evaluator
export function evaluateEeat(content: string): number {
  const text = content.toLowerCase();
  let score = 50; // Starting baseline

  // First-person trust markers check ("we", "I", "our") represent active testing
  const activePronouns = [" we ", " i ", " our ", " let's ", " us "];
  let pronounCount = 0;
  activePronouns.forEach(p => {
    if (text.includes(p)) pronounCount += 5;
  });
  score += Math.min(pronounCount, 20);

  // Citations & reference checks [Text](http...)
  const externalLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)/g;
  const links = content.match(externalLinkRegex);
  if (links && links.length >= 2) {
    score += 15;
  } else if (links && links.length > 0) {
    score += 8;
  }

  // Structured elements (such as comparison grids, benchmark lists, bullet guidelines)
  if (content.includes("|") && content.includes("-")) {
    score += 15;
  }

  // Frequently Asked Questions section inclusion
  if (text.includes("frequently asked questions") || text.includes(" faq")) {
    score += 10;
  }

  return Math.min(score, 100);
}

// 6. Comprehensive QA Report Generator (Aggregator Gateway)
export async function runQaEngine(
  content: string,
  primaryKeyword: string,
  lsiKeywords: string[] = [],
  slug = ""
): Promise<QaReport> {
  const warnings: string[] = [];

  // Flesch ease & readability
  const readability = calculateReadability(content);
  if (readability.ease < 35) {
    warnings.push(`Extremely complex reading level: Flesch score ${readability.ease} (${readability.grade}). Suggest splitting sentences.`);
  }

  // Keyword Density stuffing audit
  const keywords = auditKeywordDensity(content, primaryKeyword, lsiKeywords);
  keywords.forEach(kw => {
    if (kw.status === "stuffed") {
      warnings.push(`Keyword Stuffing Detected: '${kw.keyword}' has a high density of ${kw.density}%. Safe threshold is 2.5%.`);
    } else if (kw.status === "under_optimized" && kw.keyword === primaryKeyword) {
      warnings.push(`Under-Optimized: Primary keyword '${kw.keyword}' has a low density of ${kw.density}%.`);
    }
  });

  // Plagiarism Shingle overlap
  const duplicateOverlap = await checkDuplicateShingles(content, slug);
  if (duplicateOverlap > 18.0) {
    warnings.push(`Self-Cannibalization Alert: Overlaps ${duplicateOverlap}% of content shingles with an existing published guide.`);
  }

  // EEAT Validation
  const eeat = evaluateEeat(content);
  if (eeat < 65) {
    warnings.push(`Weak EEAT Signals: Trust score is low (${eeat}/100). Inject personal testing verbs, citations, and comparison metrics.`);
  }

  // Compute final aggregated QA Score (0-100)
  const densityPenalty = keywords.some(k => k.status === "stuffed") ? 20 : 0;
  const duplicatePenalty = duplicateOverlap > 18.0 ? Math.floor(duplicateOverlap * 1.5) : 0;
  const readabilityFactor = readability.ease < 30 ? 10 : 0;

  const rawQaScore = (readability.ease * 0.2) + (eeat * 0.4) + (100 - duplicateOverlap) * 0.4;
  const finalScore = Math.max(10, Math.min(100, Math.round(rawQaScore - densityPenalty - duplicatePenalty - readabilityFactor)));

  let status: "excellent" | "passed" | "needs_review" = "passed";
  if (finalScore >= 88 && warnings.length === 0) status = "excellent";
  else if (finalScore < 65 || duplicateOverlap > 25.0) status = "needs_review";

  return {
    score: finalScore,
    readability_ease: readability.ease,
    readability_grade: readability.grade,
    keyword_density: keywords,
    duplicate_overlap_pct: duplicateOverlap,
    eeat_score: eeat,
    warnings,
    status
  };
}
