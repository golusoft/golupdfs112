import type { Metadata } from "next";
import { absoluteUrl } from "./utils";

export const SITE = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "GoluPDFs",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://golupdf.online",
  tagline: "The Modern PDF Studio — 30+ Premium Tools",
  description:
    "GoluPDFs is the modern PDF ecosystem. Compress, merge, split, sign, convert and edit PDFs with 30+ professional tools — all running privately in your browser.",
  twitter: "@golupdfs",
  defaultOgImage: "/og.png",
  locale: "en_US",
};

interface MetaInput {
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string;
  noindex?: boolean;
  keywords?: string[];
}

export function buildMetadata({
  title,
  description,
  path = "/",
  ogImage,
  noindex,
  keywords,
}: MetaInput = {}): Metadata {
  const fullTitle = title ? `${title} — ${SITE.name}` : `${SITE.name} — ${SITE.tagline}`;
  const desc = description || SITE.description;
  const url = absoluteUrl(path);
  const image = ogImage || SITE.defaultOgImage;

  return {
    title: fullTitle,
    description: desc,
    metadataBase: new URL(SITE.url),
    alternates: { canonical: url },
    keywords: keywords?.join(", "),
    applicationName: SITE.name,
    authors: [{ name: SITE.name }],
    creator: SITE.name,
    publisher: SITE.name,
    robots: noindex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
        },
    openGraph: {
      type: "website",
      locale: SITE.locale,
      url,
      title: fullTitle,
      description: desc,
      siteName: SITE.name,
      images: [{ url: image, width: 1200, height: 630, alt: fullTitle }],
    },
    twitter: {
      card: "summary_large_image",
      site: SITE.twitter,
      creator: SITE.twitter,
      title: fullTitle,
      description: desc,
      images: [image],
    },
    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: "/icon.svg", type: "image/svg+xml" },
      ],
      apple: "/apple-icon.png",
    },
    verification: {
      google: "T2Ttwg1aoevlBfBEOrjv43lpt07yc_q0V81CvfuKAvE",
    },
    category: "technology",
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    logo: absoluteUrl("/icon.svg"),
    description: SITE.description,
    sameAs: [
      "https://twitter.com/golupdfs",
      "https://github.com/golupdfs",
      "https://linkedin.com/company/golupdfs",
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE.url}/tools?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}

export function softwareJsonLd(name: string, description: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "12847",
    },
  };
}
