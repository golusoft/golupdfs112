import type { MetadataRoute } from "next";
import { TOOLS } from "@/lib/tools";
import { SEO_PAGES } from "@/lib/seo-pages";
import { SITE } from "@/lib/seo";
import { getDbPosts } from "@/lib/admin/mock-blog-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/tools`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${SITE.url}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE.url}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE.url}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE.url}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE.url}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE.url}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const toolRoutes: MetadataRoute.Sitemap = TOOLS.map((t) => ({
    url: `${SITE.url}/tools/${t.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: t.badge === "popular" ? 0.95 : 0.85,
  }));

  const seoRoutes: MetadataRoute.Sitemap = SEO_PAGES.map((p) => ({
    url: `${SITE.url}/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = await getDbPosts();
    blogRoutes = posts
      .filter((p) => !!p.published_at)
      .map((p) => ({
        url: `${SITE.url}/blog/${p.slug}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : now,
        changeFrequency: "weekly",
        priority: 0.8,
      }));
  } catch (e) {
    console.warn("Failed to dynamically compile blog routes for sitemap:", e);
  }

  return [...staticRoutes, ...toolRoutes, ...seoRoutes, ...blogRoutes];
}
