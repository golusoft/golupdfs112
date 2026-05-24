"use client";

/**
 * Lazily load PDF.js with worker config.
 * Using legacy build for broad compatibility + dynamic worker URL via CDN.
 */
import type * as PdfJs from "pdfjs-dist";

let _pdfjs: typeof PdfJs | null = null;

export async function getPdfJs(): Promise<typeof PdfJs> {
  if (typeof window === "undefined") {
    throw new Error("PDF.js can only be used in the browser");
  }
  if (_pdfjs) return _pdfjs;
  const pdfjs = await import("pdfjs-dist");
  // Use CDN worker matching the installed version (4.7.76)
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.7.76/pdf.worker.min.mjs`;
  _pdfjs = pdfjs;
  return pdfjs;
}

export async function loadPdfDocument(file: File | ArrayBuffer) {
  const pdfjs = await getPdfJs();
  const data = file instanceof ArrayBuffer ? file : await file.arrayBuffer();
  return pdfjs.getDocument({ data: new Uint8Array(data) }).promise;
}

/** Render a page to a canvas at given scale. Returns the canvas (caller owns it). */
export async function renderPageToCanvas(
  pdfDoc: Awaited<ReturnType<typeof loadPdfDocument>>,
  pageNumber: number,
  scale = 1.5
): Promise<HTMLCanvasElement> {
  const page = await pdfDoc.getPage(pageNumber);
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D context unavailable");
  await page.render({ canvasContext: ctx, viewport, canvas }).promise;
  return canvas;
}

/** Generate a low-res data-URL thumbnail for a given page. */
export async function thumbnailPage(
  file: File | ArrayBuffer,
  pageNumber = 1,
  maxWidth = 240
): Promise<string> {
  const pdf = await loadPdfDocument(file);
  const page = await pdf.getPage(pageNumber);
  const baseViewport = page.getViewport({ scale: 1 });
  const scale = Math.min(2, maxWidth / baseViewport.width);
  const canvas = await renderPageToCanvas(pdf, pageNumber, scale);
  return canvas.toDataURL("image/jpeg", 0.8);
}
