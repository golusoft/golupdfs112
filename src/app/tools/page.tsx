import type { Metadata } from "next";
import { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ToolsBrowser } from "@/components/tools/tools-browser";
import { buildMetadata } from "@/lib/seo";
import { TOOLS } from "@/lib/tools";

export const metadata: Metadata = buildMetadata({
  title: "All PDF Tools — 30+ Premium Tools",
  description:
    "Browse the complete library of GoluPDFs tools. Compress, merge, split, convert, sign, edit and more — every PDF workflow, beautifully designed.",
  path: "/tools",
});

export default function ToolsIndexPage() {
  // Sort: popular badged first, then alphabetical
  const sorted = [...TOOLS].sort((a, b) => {
    const ra = a.badge === "popular" ? -2 : a.badge === "new" ? -1 : 0;
    const rb = b.badge === "popular" ? -2 : b.badge === "new" ? -1 : 0;
    return ra - rb || a.name.localeCompare(b.name);
  });

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs font-medium backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              30 PROFESSIONAL TOOLS · 6 CATEGORIES
            </span>
            <h1 className="mt-5 font-display text-balance text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
              The complete <span className="gradient-text">PDF toolkit.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-pretty text-muted-foreground sm:text-lg">
              Search, filter and launch any tool in seconds. Every workflow runs locally — your files
              never leave your device.
            </p>
          </div>

          <div className="mt-12">
            <Suspense fallback={<div className="h-32 animate-pulse rounded-2xl bg-muted/40" />}>
              <ToolsBrowser tools={sorted} />
            </Suspense>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
