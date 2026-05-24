/**
 * Parse a range string like "1-3,5,7-9" into an array of 1-indexed page numbers.
 */
export function parsePageRange(input: string, max: number): number[] {
  if (!input.trim()) return [];
  const out = new Set<number>();
  for (const part of input.split(",").map((s) => s.trim()).filter(Boolean)) {
    if (part.includes("-")) {
      const [a, b] = part.split("-").map((s) => parseInt(s, 10));
      if (Number.isFinite(a) && Number.isFinite(b)) {
        const lo = Math.min(a, b);
        const hi = Math.max(a, b);
        for (let i = lo; i <= hi; i++) {
          if (i >= 1 && i <= max) out.add(i);
        }
      }
    } else {
      const n = parseInt(part, 10);
      if (Number.isFinite(n) && n >= 1 && n <= max) out.add(n);
    }
  }
  return [...out].sort((a, b) => a - b);
}
