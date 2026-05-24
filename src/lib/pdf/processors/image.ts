"use client";

import JSZip from "jszip";
import { loadPdfDocument, renderPageToCanvas } from "../pdfjs";
import { parsePageRange } from "../range";
import type { ProcessOptions, ProcessResult, ProgressCallback } from "../types";

// ─── PDF → JPG/PNG (per-page images, returns ZIP if multiple pages) ─────────

export async function pdfToImages(
  files: File[],
  opts: ProcessOptions,
  onProgress?: ProgressCallback
): Promise<ProcessResult> {
  if (files.length !== 1) throw new Error("Select a single PDF");
  const file = files[0];
  const pdf = await loadPdfDocument(file);
  const total = pdf.numPages;
  const targetPages = opts.pageRange
    ? parsePageRange(opts.pageRange, total)
    : Array.from({ length: total }, (_, i) => i + 1);
  if (!targetPages.length) throw new Error("No valid pages selected");

  const dpi = opts.dpi ?? 144;
  const scale = dpi / 72;
  const fmt = opts.imageFormat || "jpeg";
  const quality = opts.imageQuality ?? 0.92;
  const ext = fmt === "png" ? "png" : "jpg";
  const mime = fmt === "png" ? "image/png" : "image/jpeg";

  const out: { blob: Blob; filename: string; bytes: number }[] = [];
  for (let i = 0; i < targetPages.length; i++) {
    const page = targetPages[i];
    onProgress?.(((i + 1) / targetPages.length) * 90, `Rendering page ${page}`);
    const canvas = await renderPageToCanvas(pdf, page, scale);
    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b), mime, quality)
    );
    if (!blob) throw new Error(`Failed to render page ${page}`);
    out.push({
      blob,
      filename: `${file.name.replace(/\.pdf$/i, "")}-page-${page}.${ext}`,
      bytes: blob.size,
    });
  }
  onProgress?.(95, "Packaging");

  // Return ZIP if multi-page, else single
  if (out.length === 1) {
    onProgress?.(100);
    return { blob: out[0].blob, filename: out[0].filename, bytes: out[0].bytes, files: out };
  }
  const zip = new JSZip();
  for (const f of out) zip.file(f.filename, f.blob);
  const zipBlob = await zip.generateAsync({ type: "blob" });
  onProgress?.(100);
  return {
    blob: zipBlob,
    filename: `${file.name.replace(/\.pdf$/i, "")}-images.zip`,
    bytes: zipBlob.size,
    files: out,
  };
}
