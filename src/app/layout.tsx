import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { Providers } from "@/components/providers";
import { Analytics } from "@/components/analytics";
import { StructuredData } from "@/components/structured-data";
import { buildMetadata, organizationJsonLd, websiteJsonLd } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = buildMetadata({
  keywords: [
    "PDF tools",
    "compress PDF",
    "merge PDF",
    "split PDF",
    "convert PDF",
    "PDF to Word",
    "PDF to JPG",
    "JPG to PDF",
    "sign PDF",
    "edit PDF online",
    "free PDF tools",
    "online PDF editor",
  ],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0f1c" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID || "G-ZQ3X06CGJS";
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jakarta.variable} ${mono.variable}`}>
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <StructuredData data={[organizationJsonLd(), websiteJsonLd()]} />
        {/* Google Analytics 4 (Deferred with lazyOnload for performance) */}
        <Script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
          strategy="lazyOnload"
        />
        <Script
          id="google-analytics"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', {
                anonymize_ip: true,
                send_page_view: false
              });
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
