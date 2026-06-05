import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Zap, Star } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Breadcrumbs } from "@/components/tools/breadcrumbs";
import { ToolRunner } from "@/components/tools/tool-runner";
import { ToolFaq } from "@/components/tools/tool-faq";
import { RelatedTools } from "@/components/tools/related-tools";
import { StructuredData } from "@/components/structured-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SEO_PAGES_ACTIVE, getSeoPage } from "@/lib/seo-pages";
import { getToolBySlug, CATEGORIES, TOOLS } from "@/lib/tools";
import {
  buildMetadata,
  breadcrumbJsonLd,
  faqJsonLd,
  softwareJsonLd,
  howToJsonLd,
  SITE,
} from "@/lib/seo";
import { absoluteUrl, cn } from "@/lib/utils";
import { SeoGuideContent } from "@/components/tools/seo-guide-content";

// Block dynamic generation for unwhitelisted paths
export const dynamicParams = false;

export async function generateStaticParams() {
  return SEO_PAGES_ACTIVE.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const page = getSeoPage(slug);
  if (!page) return buildMetadata({ title: "Page not found", noindex: true });
  return buildMetadata({
    title: page.title,
    description: page.description,
    path: `/${page.slug}`,
    keywords: page.keywords,
  });
}

export default async function SeoLandingPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const page = getSeoPage(slug);
  if (!page) notFound();
  const tool = getToolBySlug(page.tool);
  if (!tool) notFound();

  const url = absoluteUrl(`/${page.slug}`);
  const faq = page.faq?.length ? page.faq : tool.faq;
  const cluster = (page.cluster ?? [])
    .map((c) => SEO_PAGES_ACTIVE.find((p) => p.slug === c))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  // Dynamic Internal Linking Engine
  let dynamicCluster = cluster;
  if (dynamicCluster.length === 0) {
    if (page.slug.startsWith("extract-") && page.slug.endsWith("-statement-pdf-to-excel")) {
      const isCard = page.slug.includes("-cc-") || page.slug.includes("amex") || page.slug.includes("apple-card") || page.slug.includes("discover") || page.slug.includes("visa") || page.slug.includes("freedom");
      dynamicCluster = SEO_PAGES_ACTIVE.filter((p) => {
        const otherIsCard = p.slug.includes("-cc-") || p.slug.includes("amex") || p.slug.includes("apple-card") || p.slug.includes("discover") || p.slug.includes("visa") || p.slug.includes("freedom");
        return p.slug.startsWith("extract-") && p.slug.endsWith("-statement-pdf-to-excel") && p.slug !== page.slug && (isCard === otherIsCard);
      }).slice(0, 5);
    } else if (page.slug.startsWith("extract-") && page.slug.endsWith("-invoice-pdf-to-excel")) {
      dynamicCluster = SEO_PAGES_ACTIVE.filter((p) => p.slug.startsWith("extract-") && p.slug.endsWith("-invoice-pdf-to-excel") && p.slug !== page.slug).slice(0, 5);
    } else if (page.slug.startsWith("extract-") && page.slug.endsWith("-bill-pdf-to-excel")) {
      dynamicCluster = SEO_PAGES_ACTIVE.filter((p) => p.slug.startsWith("extract-") && p.slug.endsWith("-bill-pdf-to-excel") && p.slug !== page.slug).slice(0, 5);
    } else if (page.slug.startsWith("templates/")) {
      const industryKey = page.slug.split("/")[1];
      dynamicCluster = SEO_PAGES_ACTIVE.filter((p) => p.slug.startsWith(`templates/${industryKey}/`) && p.slug !== page.slug).slice(0, 5);
    }
  }

  // Pull related tools by category for sidebar
  const related = TOOLS.filter((t) => t.category === tool.category && t.slug !== tool.slug).slice(0, 4);

  return (
    <>
      <StructuredData
        data={[
          softwareJsonLd(tool.name, page.description, url),
          breadcrumbJsonLd([
            { name: "Home", url: SITE.url },
            { name: page.h1, url },
          ]),
          faqJsonLd(faq),
          howToJsonLd(page.h1, page.description, page.whyBullets),
        ]}
      />

      <Navbar />

      <main className="pt-28 pb-16">
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div
            className={cn(
              "absolute inset-0 -z-10 opacity-[0.07] bg-gradient-to-br",
              CATEGORIES[tool.category].color
            )}
            aria-hidden
          />
          <div className="absolute inset-0 -z-10 dot-pattern opacity-30 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)]" />
          <div className="container">
            <Breadcrumbs items={[{ label: page.h1 }]} />

            <div className="mt-6 max-w-4xl">
              <Badge variant="secondary" className="capitalize">
                <Sparkles className="h-3 w-3" /> Built on {tool.shortName}
              </Badge>
              <h1 className="mt-4 font-display text-balance text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                {page.h1}
              </h1>
              <p className="mt-5 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl">
                {page.intro}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" /> Browser-side
                </span>
                <span className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-500" /> Sub-second
                </span>
                <span className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-amber-500 text-amber-500" /> 4.9 / 5
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* TOOL RUNNER */}
        <section className="container mt-12">
          {(() => {
            const { icon: _, ...serializedTool } = tool;
            return <ToolRunner tool={serializedTool} />;
          })()}
        </section>

        {/* WHY THIS PAGE */}
        <section className="container mt-20 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="font-display text-3xl font-bold tracking-tight">
              Why use GoluPDFs for this?
            </h2>
            <ul className="mt-6 grid gap-3">
              {page.whyBullets.map((b, i) => (
                <li key={i} className="flex items-start gap-3 rounded-xl border bg-card p-4">
                  <span
                    className={cn(
                      "grid h-7 w-7 shrink-0 place-items-center rounded-full text-white text-xs font-bold bg-gradient-to-br",
                      CATEGORIES[tool.category].color
                    )}
                  >
                    {i + 1}
                  </span>
                  <span className="text-sm leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                What you get inside {tool.shortName}
              </h3>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {tool.features.slice(0, 6).map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* In-depth guide content to remove Thin Content risk */}
            <SeoGuideContent slug={page.slug} h1={page.h1} keywords={page.keywords} whyBullets={page.whyBullets} />
          </div>

          <aside className="lg:col-span-5">
            {dynamicCluster.length > 0 && (
              <div className="rounded-2xl border bg-card p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Related guides
                </h3>
                <ul className="mt-4 space-y-3">
                  {dynamicCluster.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/${c.slug}`}
                        className="group flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-accent"
                      >
                        <span className="text-sm font-medium">{c.h1}</span>
                        <ArrowRight className="h-3.5 w-3.5 -translate-x-1 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-4 rounded-2xl border bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-6">
              <h3 className="text-sm font-semibold">🔒 Privacy guarantee</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Files are processed locally in your browser using WebAssembly-grade libraries. We never
                receive, store or log your documents.
              </p>
              <Button asChild variant="ghost" size="sm" className="mt-3 -ml-3">
                <Link href={`/tools/${tool.slug}`}>
                  Open full tool <ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            </div>
          </aside>
        </section>

        {/* FAQ + RELATED */}
        <section className="container mt-20 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="font-display text-3xl font-bold tracking-tight">
              Frequently asked questions
            </h2>
            <div className="mt-8">
              <ToolFaq items={faq} />
            </div>
          </div>
          <aside className="lg:col-span-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              More tools you'll love
            </h3>
            <div className="mt-4">
              <RelatedTools tools={related} />
            </div>
          </aside>
        </section>
      </main>

      <Footer />
    </>
  );
}
