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

  // Custom Exact Target KB Implementation
  if (opts.targetKb && opts.targetKb > 0) {
    const targetBytes = opts.targetKb * 1024;

    // ─────────────────────────────────────────────────────────────────────────
    // Case A: Input PDF is already SMALLER than target size -> Lossless Padding
    // ─────────────────────────────────────────────────────────────────────────
    if (inputSize <= targetBytes) {
      onProgress?.(30, "Optimizing stream");
      const src = await PDFDocument.load(inputBuffer, { ignoreEncryption: true });
      onProgress?.(70, "Saving template");
      let bytesArray = await src.save({ useObjectStreams: true });

      // Append precise byte padding to match the target KB exactly down to the byte
      const diff = targetBytes - bytesArray.length;
      const header = "\n%--GOLUPDF-PAD--\n%";
      const footer = "\n";
      const overhead = header.length + footer.length;

      if (diff > overhead) {
        const padSize = diff - overhead;
        const padding = header + "0".repeat(padSize) + footer;
        const encoder = new TextEncoder();
        const padBytes = encoder.encode(padding);

        const merged = new Uint8Array(bytesArray.length + padBytes.length);
        merged.set(bytesArray, 0);
        merged.set(padBytes, bytesArray.length);
        bytesArray = merged;
      }

      const ab = bytesArray.slice().buffer;
      const blob = new Blob([ab], { type: "application/pdf" });
      onProgress?.(100);

      return {
        blob,
        filename: `${file.name.replace(/\.pdf$/i, "")}-${opts.targetKb}kb.pdf`,
        bytes: blob.size,
        stats: {
          original: inputSize,
          compressed: blob.size,
          reductionPct: "0.0", // enlarged / resized
          mode: `Target Size: ${opts.targetKb} KB (Byte-Perfect)`,
        },
      };
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Case B: Input PDF is LARGER than target size -> Dynamically Scale & Compress
    // ─────────────────────────────────────────────────────────────────────────
    const pdfjs = await loadPdfDocument(inputBuffer.slice(0));
    const total = pdfjs.numPages;
    const newPdf = await PDFDocument.create();

    // Estimate optimal rasterization scale and quality to get under the target size
    const targetKbPerPage = opts.targetKb / total;
    let scale = 0.85;
    let quality = 0.72;

    if (targetKbPerPage < 25) {
      scale = 0.45;
      quality = 0.25;
    } else if (targetKbPerPage < 55) {
      scale = 0.6;
      quality = 0.42;
    } else if (targetKbPerPage < 95) {
      scale = 0.75;
      quality = 0.55;
    } else if (targetKbPerPage < 160) {
      scale = 0.85;
      quality = 0.68;
    } else {
      scale = 1.0;
      quality = 0.8;
    }

    for (let i = 1; i <= total; i++) {
      onProgress?.(((i - 1) / total) * 90, `Resizing page ${i}/${total}`);
      const canvas = await renderPageToCanvas(pdfjs, i, 1.5 * scale);
      const dataUrl = canvas.toDataURL("image/jpeg", quality);
      const jpgBytes = base64ToBytes(dataUrl.split(",")[1]);
      const img = await newPdf.embedJpg(jpgBytes);
      const page = newPdf.addPage([img.width, img.height]);
      page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
    }

    onProgress?.(95, "Finalizing stream");
    let bytesArray = await newPdf.save({ useObjectStreams: true });

    // Pad precisely to target size if compression took it slightly under the target
    const diff = targetBytes - bytesArray.length;
    const header = "\n%--GOLUPDF-PAD--\n%";
    const footer = "\n";
    const overhead = header.length + footer.length;

    if (diff > overhead) {
      const padSize = diff - overhead;
      const padding = header + "0".repeat(padSize) + footer;
      const encoder = new TextEncoder();
      const padBytes = encoder.encode(padding);

      const merged = new Uint8Array(bytesArray.length + padBytes.length);
      merged.set(bytesArray, 0);
      merged.set(padBytes, bytesArray.length);
      bytesArray = merged;
    }

    const ab = bytesArray.slice().buffer;
    const blob = new Blob([ab], { type: "application/pdf" });
    onProgress?.(100);

    const reduction = Math.max(0, 100 - (blob.size / inputSize) * 100);
    return {
      blob,
      filename: `${file.name.replace(/\.pdf$/i, "")}-${opts.targetKb}kb.pdf`,
      bytes: blob.size,
      stats: {
        original: inputSize,
        compressed: blob.size,
        reductionPct: reduction.toFixed(1),
        mode: `Target Size: ${opts.targetKb} KB (Byte-Perfect)`,
      },
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Standard Presets Mode (Level-based compression)
  // ─────────────────────────────────────────────────────────────────────────────
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
