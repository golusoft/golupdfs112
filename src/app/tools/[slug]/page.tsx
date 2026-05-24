import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ToolRunner } from "@/components/tools/tool-runner";
import { Breadcrumbs } from "@/components/tools/breadcrumbs";
import { ToolFaq } from "@/components/tools/tool-faq";
import { RelatedTools } from "@/components/tools/related-tools";
import { FeatureList } from "@/components/tools/feature-list";
import { ShareButtons } from "@/components/tools/share-buttons";
import { AdSlot } from "@/components/tools/ad-slot";
import { StructuredData } from "@/components/structured-data";
import { Badge } from "@/components/ui/badge";
import {
  TOOLS,
  CATEGORIES,
  getToolBySlug,
  getRelatedTools,
} from "@/lib/tools";
import {
  buildMetadata,
  breadcrumbJsonLd,
  faqJsonLd,
  softwareJsonLd,
  SITE,
} from "@/lib/seo";
import { absoluteUrl, cn } from "@/lib/utils";

export async function generateStaticParams() {
  return TOOLS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return buildMetadata({ title: "Tool not found", noindex: true });
  return buildMetadata({
    title: `${tool.name} — Free Online`,
    description: `${tool.tagline} ${tool.description}`,
    path: `/tools/${tool.slug}`,
    keywords: [
      tool.name,
      tool.shortName,
      `${tool.shortName.toLowerCase()} online`,
      `free ${tool.shortName.toLowerCase()}`,
      `${tool.shortName.toLowerCase()} no signup`,
      ...tool.features.map((f) => f.toLowerCase()),
    ],
  });
}

export default async function ToolPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const related = getRelatedTools(slug, 4);
  const url = absoluteUrl(`/tools/${tool.slug}`);
  const breadcrumbs = [
    { name: "Tools", url: absoluteUrl("/tools") },
    { name: tool.shortName, url },
  ];

  return (
    <>
      <StructuredData
        data={[
          softwareJsonLd(tool.name, tool.description, url),
          breadcrumbJsonLd([{ name: "Home", url: SITE.url }, ...breadcrumbs]),
          faqJsonLd(tool.faq),
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
            <Breadcrumbs
              items={[{ label: "Tools", href: "/tools" }, { label: tool.shortName }]}
            />

            <div className="mt-6 grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="capitalize">
                    {CATEGORIES[tool.category].label}
                  </Badge>
                  {tool.badge && (
                    <Badge
                      variant={tool.badge === "ai" ? "gradient" : "default"}
                      className="uppercase"
                    >
                      {tool.badge}
                    </Badge>
                  )}
                </div>
                <h1 className="mt-4 font-display text-balance text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
                  {tool.name}
                </h1>
                <p className="mt-4 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl">
                  {tool.tagline}
                </p>
                <div className="mt-6">
                  <ShareButtons url={url} title={`${tool.name} · GoluPDFs`} />
                </div>
              </div>
              <div className="lg:col-span-4">
                <div
                  className={cn(
                    "relative ml-auto grid h-32 w-32 place-items-center overflow-hidden rounded-3xl bg-gradient-to-br shadow-2xl",
                    CATEGORIES[tool.category].color
                  )}
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent" />
                  <tool.icon className="relative h-14 w-14 text-white" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RUNNER */}
        <section className="container mt-12">
          {(() => {
            const { icon: _, ...serializedTool } = tool;
            return <ToolRunner tool={serializedTool} />;
          })()}
        </section>

        {/* AD SLOT */}
        <section className="container mt-12">
          <AdSlot className="mx-auto max-w-3xl" />
        </section>

        {/* FEATURES + LONG DESCRIPTION */}
        <section className="container mt-20 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="font-display text-3xl font-bold tracking-tight">
              Why use {tool.shortName}?
            </h2>
            <p className="mt-4 text-pretty text-muted-foreground sm:text-lg">
              {tool.longDescription}
            </p>
            <div className="mt-8">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                What's inside
              </h3>
              <div className="mt-4">
                <FeatureList features={tool.features} />
              </div>
            </div>
          </div>

          <aside className="lg:col-span-5">
            <div className="rounded-2xl border bg-card p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                How it works
              </h3>
              <ol className="mt-4 space-y-4">
                {[
                  { t: "Upload", d: "Drag and drop your file or click to browse." },
                  { t: "Customize", d: "Tweak quality, range or layout in the side panel." },
                  { t: "Download", d: "Run the tool and download — all in your browser." },
                ].map((s, i) => (
                  <li key={i} className="flex gap-4">
                    <span
                      className={cn(
                        "grid h-8 w-8 shrink-0 place-items-center rounded-full font-semibold text-white shadow bg-gradient-to-br",
                        CATEGORIES[tool.category].color
                      )}
                    >
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{s.t}</p>
                      <p className="text-xs text-muted-foreground">{s.d}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-4 rounded-2xl border bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-6">
              <h3 className="text-sm font-semibold">🔒 Privacy guarantee</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Your files are processed locally using WebAssembly-grade libraries. We never
                receive, store, or log your documents.
              </p>
            </div>
          </aside>
        </section>

        {/* FAQ */}
        <section className="container mt-20 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="font-display text-3xl font-bold tracking-tight">
              {tool.shortName} — frequently asked
            </h2>
            <p className="mt-3 text-muted-foreground">
              Quick answers about {tool.shortName.toLowerCase()}.
            </p>
            <div className="mt-8">
              <ToolFaq items={tool.faq} />
            </div>
          </div>

          <aside className="lg:col-span-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Related tools
            </h3>
            <div className="mt-4">
              <RelatedTools tools={related} />
            </div>

            <div className="mt-8">
              <AdSlot />
            </div>
          </aside>
        </section>
      </main>

      <Footer />
    </>
  );
}
