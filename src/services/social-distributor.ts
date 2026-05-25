import { insertDbLog } from "@/lib/admin/mock-blog-data";

export interface DistributionResult {
  platform: string;
  status: "success" | "skipped" | "failed";
  postUrl?: string;
  message: string;
}

export interface SocialTokenConfig {
  devToApiKey?: string;
  hashnodeToken?: string;
  hashnodePublicationId?: string;
  mediumIntegrationToken?: string;
  linkedinAccessToken?: string;
}

/**
 * Reads social token configuration from environment variables.
 * Supports runtime injection — no code changes needed when tokens are added.
 */
function getSocialTokens(): SocialTokenConfig {
  return {
    devToApiKey: process.env.DEV_TO_API_KEY,
    hashnodeToken: process.env.HASHNODE_TOKEN,
    hashnodePublicationId: process.env.HASHNODE_PUBLICATION_ID,
    mediumIntegrationToken: process.env.MEDIUM_INTEGRATION_TOKEN,
    linkedinAccessToken: process.env.LINKEDIN_ACCESS_TOKEN,
  };
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://golupdfs112-autz.vercel.app";

/**
 * Post to Dev.to using the public API.
 * Requires DEV_TO_API_KEY env var.
 */
async function postToDevTo(
  title: string,
  slug: string,
  content: string,
  excerpt: string,
  canonicalUrl: string,
  token: string
): Promise<DistributionResult> {
  try {
    const body = {
      article: {
        title,
        body_markdown: content,
        description: excerpt.substring(0, 155),
        canonical_url: canonicalUrl,
        published: true,
        tags: ["pdf", "productivity", "tools", "tutorial"],
      }
    };
    const res = await fetch("https://dev.to/api/articles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": token,
      },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const data = await res.json();
      return {
        platform: "Dev.to",
        status: "success",
        postUrl: data.url,
        message: `Published to Dev.to. Canonical set to ${canonicalUrl}`,
      };
    }
    const errText = await res.text();
    throw new Error(`Dev.to API error ${res.status}: ${errText}`);
  } catch (err: any) {
    return { platform: "Dev.to", status: "failed", message: err.message };
  }
}

/**
 * Post to Hashnode using the GraphQL API.
 * Requires HASHNODE_TOKEN and HASHNODE_PUBLICATION_ID env vars.
 */
async function postToHashnode(
  title: string,
  slug: string,
  content: string,
  excerpt: string,
  canonicalUrl: string,
  token: string,
  publicationId: string
): Promise<DistributionResult> {
  try {
    const mutation = `
      mutation PublishPost($input: PublishPostInput!) {
        publishPost(input: $input) {
          post { id url title }
        }
      }
    `;
    const variables = {
      input: {
        title,
        contentMarkdown: content,
        publicationId,
        originalArticleURL: canonicalUrl,
        slug: `${slug}-guide`,
        subtitle: excerpt.substring(0, 155),
        tags: [],
        disableComments: false,
      }
    };
    const res = await fetch("https://gql.hashnode.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token,
      },
      body: JSON.stringify({ query: mutation, variables }),
    });
    if (res.ok) {
      const data = await res.json();
      const postUrl = data?.data?.publishPost?.post?.url;
      return {
        platform: "Hashnode",
        status: "success",
        postUrl,
        message: `Published to Hashnode. Canonical: ${canonicalUrl}`,
      };
    }
    throw new Error(`Hashnode API error ${res.status}`);
  } catch (err: any) {
    return { platform: "Hashnode", status: "failed", message: err.message };
  }
}

/**
 * Medium requires OAuth — kept as documented stub.
 * Activate by providing MEDIUM_INTEGRATION_TOKEN.
 */
async function postToMedium(
  title: string,
  slug: string,
  content: string,
  canonicalUrl: string,
  token: string
): Promise<DistributionResult> {
  try {
    // First get user ID
    const userRes = await fetch("https://api.medium.com/v1/me", {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!userRes.ok) throw new Error("Failed to get Medium user");
    const userData = await userRes.json();
    const userId = userData?.data?.id;
    if (!userId) throw new Error("Medium user ID not found");

    const res = await fetch(`https://api.medium.com/v1/users/${userId}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        contentFormat: "markdown",
        content,
        canonicalUrl,
        publishStatus: "public",
        tags: ["pdf", "productivity", "tools"],
      }),
    });
    if (res.ok) {
      const data = await res.json();
      return {
        platform: "Medium",
        status: "success",
        postUrl: data?.data?.url,
        message: `Published to Medium. Canonical: ${canonicalUrl}`,
      };
    }
    throw new Error(`Medium API error ${res.status}`);
  } catch (err: any) {
    return { platform: "Medium", status: "failed", message: err.message };
  }
}

/**
 * LinkedIn UGC Share API — requires LINKEDIN_ACCESS_TOKEN.
 * Shares as a text post with article link.
 */
async function postToLinkedIn(
  title: string,
  excerpt: string,
  canonicalUrl: string,
  token: string
): Promise<DistributionResult> {
  try {
    // Get profile URN first
    const profileRes = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!profileRes.ok) throw new Error("LinkedIn profile fetch failed");
    const profileData = await profileRes.json();
    const authorUrn = `urn:li:person:${profileData.sub}`;

    const shareBody = {
      author: authorUrn,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: {
            text: `📄 ${title}\n\n${excerpt.substring(0, 200)}\n\nRead more: ${canonicalUrl}\n\n#PDF #Productivity #Tools`
          },
          shareMediaCategory: "NONE",
        }
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
      }
    };

    const res = await fetch("https://api.linkedin.com/v2/ugcPosts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify(shareBody),
    });
    if (res.ok) {
      return {
        platform: "LinkedIn",
        status: "success",
        message: `LinkedIn post shared. URL: ${canonicalUrl}`,
      };
    }
    throw new Error(`LinkedIn API error ${res.status}`);
  } catch (err: any) {
    return { platform: "LinkedIn", status: "failed", message: err.message };
  }
}

/**
 * Main syndication dispatcher.
 * Reads tokens from env vars — fully modular.
 * If a token is not set, platform is skipped gracefully.
 */
export async function syndicatePost(
  title: string,
  slug: string,
  content: string,
  excerpt: string
): Promise<DistributionResult[]> {
  const canonicalUrl = `${SITE_URL}/blog/${slug}`;
  const tokens = getSocialTokens();
  const results: DistributionResult[] = [];

  // Dev.to
  if (tokens.devToApiKey && !tokens.devToApiKey.startsWith("replace")) {
    const result = await postToDevTo(title, slug, content, excerpt, canonicalUrl, tokens.devToApiKey);
    results.push(result);
    await insertDbLog("syndication", result.status === 'success' ? 'success' : 'failed',
      `Dev.to: ${result.message}`, slug);
  } else {
    results.push({ platform: "Dev.to", status: "skipped", message: "DEV_TO_API_KEY not configured" });
  }

  // Hashnode
  if (tokens.hashnodeToken && tokens.hashnodePublicationId &&
      !tokens.hashnodeToken.startsWith("replace")) {
    const result = await postToHashnode(
      title, slug, content, excerpt, canonicalUrl,
      tokens.hashnodeToken, tokens.hashnodePublicationId
    );
    results.push(result);
    await insertDbLog("syndication", result.status === 'success' ? 'success' : 'failed',
      `Hashnode: ${result.message}`, slug);
  } else {
    results.push({ platform: "Hashnode", status: "skipped", message: "HASHNODE_TOKEN or HASHNODE_PUBLICATION_ID not configured" });
  }

  // Medium
  if (tokens.mediumIntegrationToken && !tokens.mediumIntegrationToken.startsWith("replace")) {
    const result = await postToMedium(title, slug, content, canonicalUrl, tokens.mediumIntegrationToken);
    results.push(result);
    await insertDbLog("syndication", result.status === 'success' ? 'success' : 'failed',
      `Medium: ${result.message}`, slug);
  } else {
    results.push({ platform: "Medium", status: "skipped", message: "MEDIUM_INTEGRATION_TOKEN not configured" });
  }

  // LinkedIn
  if (tokens.linkedinAccessToken && !tokens.linkedinAccessToken.startsWith("replace")) {
    const result = await postToLinkedIn(title, excerpt, canonicalUrl, tokens.linkedinAccessToken);
    results.push(result);
    await insertDbLog("syndication", result.status === 'success' ? 'success' : 'failed',
      `LinkedIn: ${result.message}`, slug);
  } else {
    results.push({ platform: "LinkedIn", status: "skipped", message: "LINKEDIN_ACCESS_TOKEN not configured" });
  }

  return results;
}

/**
 * Get syndication status summary for dashboard.
 */
export function getSyndicationSummary(results: DistributionResult[]) {
  return {
    total: results.length,
    published: results.filter(r => r.status === 'success').length,
    failed: results.filter(r => r.status === 'failed').length,
    skipped: results.filter(r => r.status === 'skipped').length,
    platforms: results.map(r => ({
      platform: r.platform,
      status: r.status,
      url: r.postUrl,
    }))
  };
}
