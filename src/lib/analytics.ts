export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || "G-ZQ3X06CGJS";

/**
 * Log page views to Google Analytics.
 */
export const pageview = (url: string) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

interface EventParams {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  [key: string]: any;
}

/**
 * Log specific events to Google Analytics.
 */
export const event = ({
  action,
  category,
  label,
  value,
  ...params
}: EventParams) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
      ...params,
    });
  }
};

/**
 * Custom Helper: Track PDF Tool Execution Launch
 */
export const trackToolUse = (toolSlug: string, toolName: string) => {
  event({
    action: "use_tool",
    category: "Engagement",
    label: toolName,
    tool_slug: toolSlug,
  });
};

/**
 * Custom Helper: Track File Upload Event
 */
export const trackUpload = (toolSlug: string, count: number) => {
  event({
    action: "upload_files",
    category: "Engagement",
    label: toolSlug,
    file_count: count,
  });
};

/**
 * Custom Helper: Track File Download Event
 */
export const trackDownload = (toolSlug: string, filename: string) => {
  event({
    action: "download_file",
    category: "Engagement",
    label: filename,
    tool_slug: toolSlug,
  });
};

/**
 * Custom Helper: Track Conversions (Successful processing, forms, pricing clicks)
 */
export const trackConversion = (toolSlug: string, actionType: string) => {
  event({
    action: "conversion",
    category: "Conversion",
    label: toolSlug,
    conversion_type: actionType,
  });
};
