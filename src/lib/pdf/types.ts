export interface ProcessOptions {
  /** Compression level / target — interpreted per-engine */
  level?: "lossless" | "light" | "medium" | "strong" | "extreme";
  targetKb?: number;
  /** Page numbers to operate on (1-indexed) */
  pages?: number[];
  /** A range like "1-3,5,7-9" */
  pageRange?: string;
  /** Rotation degrees */
  rotation?: 0 | 90 | 180 | 270;
  /** Watermark options */
  watermarkText?: string;
  watermarkOpacity?: number;
  /** Page numbering options */
  positionPreset?:
    | "tl"
    | "tc"
    | "tr"
    | "ml"
    | "mc"
    | "mr"
    | "bl"
    | "bc"
    | "br";
  format?: string;
  /** Password */
  password?: string;
  newPassword?: string;
  /** Image conversion */
  dpi?: number;
  /** Page size */
  pageSize?: "A4" | "LETTER" | "LEGAL" | "A3" | "A5";
  orientation?: "portrait" | "landscape";
  margin?: number;
  /** Metadata */
  metadata?: {
    title?: string;
    author?: string;
    subject?: string;
    keywords?: string;
    creator?: string;
    producer?: string;
    scrub?: boolean;
  };
  /** PDF to image */
  imageFormat?: "jpeg" | "png";
  /** Quality 0..1 */
  imageQuality?: number;
  /** Reordering page index order */
  order?: number[];
  /** Visual page rotation map */
  rotations?: Record<number, number>;
  /** Advanced visual workspace merge options */
  addPageNumbers?: boolean;
  mergePageMap?: {
    type?: "page" | "blank";
    fileIndex: number;
    pageNumber: number;
    rotation?: number;
  }[];
}

export interface ProcessResult {
  blob: Blob;
  filename: string;
  bytes: number;
  /** For multi-output operations like split / pdf-to-jpg */
  files?: { blob: Blob; filename: string; bytes: number }[];
  /** Optional human-readable stats */
  stats?: Record<string, string | number>;
}

export type ProgressCallback = (percent: number, message?: string) => void;
