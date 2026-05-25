import { NextResponse } from "next/server";
import { getDbPosts, insertDbPost, insertDbLog } from "@/lib/admin/mock-blog-data";
import { syndicatePost } from "@/services/social-distributor";
import { requestGoogleIndexing } from "@/services/google-search-console";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const slug = body.slug;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const posts = await getDbPosts();
    const post = posts.find(p => p.slug === slug);

    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    // Toggle publish status
    post.published_at = new Date().toISOString();
    post.updated_at = new Date().toISOString();

    await insertDbPost(post);
    await insertDbLog("publish", "success", `Publishing Agent marked '${post.title}' as live.`, post.keywords?.[0]);

    // Google Indexing API Automation
    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://golupdfs112-autz.vercel.app";
      await requestGoogleIndexing(`${siteUrl}/blog/${post.slug}`);
    } catch (e: any) {
      console.warn("Google Indexing API call failed:", e);
    }

    // Trigger Parasite SEO distribution
    let syndications: any[] = [];
    try {
      syndications = await syndicatePost(post.title, post.slug, post.content, post.excerpt);
      await insertDbLog("publish", "success", `Syndicated content successfully to Medium, LinkedIn and Dev.to channels.`, post.keywords?.[0]);
    } catch (e: any) {
      await insertDbLog("publish", "failed", `Syndication failed: ${e.message}`, post.keywords?.[0]);
    }

    // Dynamic Next.js ISR/Server Revalidation
    try {
      revalidatePath("/blog");
      revalidatePath(`/blog/${slug}`);
      revalidatePath("/sitemap.xml");
    } catch (e) {
      // server components revalidation safe log
    }

    return NextResponse.json({
      success: true,
      slug: post.slug,
      published_at: post.published_at,
      syndications
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to publish post" }, { status: 500 });
  }
}
