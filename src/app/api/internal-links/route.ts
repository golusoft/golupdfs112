import { NextResponse } from "next/server";
import { runInternalLinkingAgent } from "@/services/multi-agent-engine";
import { getDbPostBySlug, insertDbPost } from "@/lib/admin/mock-blog-data";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const slug = body.slug;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const post = await getDbPostBySlug(slug);
    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    // Run linking agent on article content
    const updatedContent = await runInternalLinkingAgent(post.content, slug);
    post.content = updatedContent;
    post.updated_at = new Date().toISOString();

    await insertDbPost(post);

    return NextResponse.json({
      success: true,
      slug: post.slug,
      content: post.content
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to inject internal links" }, { status: 500 });
  }
}
