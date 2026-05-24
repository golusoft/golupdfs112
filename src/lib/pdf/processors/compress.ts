"use client";

import { PDFDocument } from "pdf-lib";
import { loadPdfDocument, renderPageToCanvas } from "../pdfjs";
import type { ProcessOptions, ProcessResult, ProgressCallback } from "../types";

/**
 * Compress PDF — content-aware strategy:
 *
 * • lossless / light  → Re-save through pdf-lib with object streams (10–25%).
 * • medium / strong / extreme → Rasterize each page to a downscaled JPEG and
 *   rebuild a clean image-based PDF. Produces dramatic size reductions for
 *   image-heavy or scanned documents (40–90%).
 *
 * Trade-off: rasterized output loses selectable text. Lossless mode keeps it.
 */
type Level = NonNullable<ProcessOptions["level"]>;

const PRESETS: Record<Level, { scale: number; quality: number; objectStreams: boolean }> = {
  lossless: { scale: 1, quality: 1, objectStreams: true },
  light: { scale: 1.0, quality: 0.85, objectStreams: true },
  medium: { scale: 0.85, quality: 0.72, objectStreams: true },
  strong: { scale: 0.7, quality: 0.55, objectStreams: true },
  extreme: { scale: 0.55, quality: 0.4, objectStreams: true },
};

export async function compressPdf(
  files: File[],
  opts: ProcessOptions,
  onProgress?: ProgressCallback
): Promise<ProcessResult> {
  if (files.length !== 1) throw new Error("Select a single PDF");
  const file = files[0];
  const inputBuffer = await file.arrayBuffer();
  const inputSize = inputBuffer.byteLength;

  const level: Level = opts.level || "medium";
  const preset = PRESETS[level];

  if (level === "lossless" || level === "light") {
    onProgress?.(40, "Optimizing");
    const src = await PDFDocument.load(inputBuffer, { ignoreEncryption: true });
    onProgress?.(80, "Saving");
    const bytes = await src.save({
      useObjectStreams: preset.objectStreams,
      addDefaultPage: false,
    });
    const ab = bytes.slice().buffer;
    const blob = new Blob([ab], { type: "application/pdf" });
    onProgress?.(100);
    const reduction = Math.max(0, 100 - (blob.size / inputSize) * 100);
    return {
      blob,
      filename: `${file.name.replace(/\.pdf$/i, "")}-compressed.pdf`,
      bytes: blob.size,
      stats: {
        original: inputSize,
        compressed: blob.size,
        reductionPct: reduction.toFixed(1),
        mode: level,
      },
    };
  }

  // Rasterize-and-rebuild
  const pdfjs = await loadPdfDocument(inputBuffer.slice(0));
  const total = pdfjs.numPages;
  const newPdf = await PDFDocument.create();

  for (let i = 1; i <= total; i++) {
    onProgress?.(((i - 1) / total) * 90, `Compressing page ${i}/${total}`);
    const canvas = await renderPageToCanvas(pdfjs, i, 1.5 * preset.scale);
    const dataUrl = canvas.toDataURL("image/jpeg", preset.quality);
    const jpgBytes = base64ToBytes(dataUrl.split(",")[1]);
    const img = await newPdf.embedJpg(jpgBytes);
    const page = newPdf.addPage([img.width, img.height]);
    page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
  }

  onProgress?.(95, "Saving");
  const bytes = await newPdf.save({ useObjectStreams: true });
  const ab = bytes.slice().buffer;
  const blob = new Blob([ab], { type: "application/pdf" });
  onProgress?.(100);
  const reduction = Math.max(0, 100 - (blob.size / inputSize) * 100);
  return {
    blob,
    filename: `${file.name.replace(/\.pdf$/i, "")}-compressed.pdf`,
    bytes: blob.size,
    stats: {
      original: inputSize,
      compressed: blob.size,
      reductionPct: reduction.toFixed(1),
      mode: level,
    },
  };
}

function base64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr;
}
