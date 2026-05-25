# 🚀 GoluPDFs AI SEO OS — Production Deployment Guide

## Repository
- GitHub: https://github.com/golusoft/golupdfs112
- Vercel Project: https://vercel.com/golubhai321lkr-1648s-projects/golupdfs112-autz
- Production URL: https://golupdfs112-autz.vercel.app

---

## Step 1 — Initialize Git & Push to GitHub

```bash
git init
git remote add origin https://github.com/golusoft/golupdfs112.git
git add .
git commit -m "feat: Autonomous AI SEO OS v2 — Production ready"
git branch -M main
git push -u origin main
```

## Step 2 — Connect Vercel to GitHub

1. Go to https://vercel.com/golubhai321lkr-1648s-projects/golupdfs112-autz/settings
2. Click **Git** → **Connect Git Repository**
3. Select **golusoft/golupdfs112**
4. Set production branch: **main**
5. Enable **Auto-Deploy on Push** ✅

## Step 3 — Configure Environment Variables in Vercel

Go to: Settings → Environment Variables → Add each:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server only) |
| `GEMINI_API_KEY` | Google Gemini API key |
| `OPENROUTER_API_KEY` | OpenRouter API key (fallback) |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD` | Admin login password |
| `JWT_SECRET` | Random 64-char string for session signing |
| `CRON_SECRET` | Secret token for cron authentication |
| `DISCORD_WEBHOOK_URL` | Discord webhook for alerts |
| `GOOGLE_SITE_VERIFICATION` | GSC verification meta tag value |
| `DEV_TO_API_KEY` | Dev.to integration token (optional) |
| `HASHNODE_TOKEN` | Hashnode GraphQL token (optional) |
| `NEXT_PUBLIC_SITE_URL` | https://golupdfs112-autz.vercel.app |

## Step 4 — Execute Supabase Migrations

1. Go to your Supabase dashboard → SQL Editor
2. Open `supabase/production_schema.sql`
3. Paste the entire file content and click **Run**
4. Verify tables: blog_posts, keyword_opportunities, generation_logs, analytics_insights, article_embeddings, affiliate_clicks

## Step 5 — Verify Cron Setup

1. In Vercel dashboard → Settings → Cron Jobs
2. Verify `/api/schedule` shows schedule: `0 4 * * *` (4am UTC daily)
3. Set `CRON_SECRET` env var in Vercel

## Step 6 — Validate Deployment

- ✅ https://golupdfs112-autz.vercel.app — Homepage
- ✅ https://golupdfs112-autz.vercel.app/blog — Blog listing
- ✅ https://golupdfs112-autz.vercel.app/admin — Admin dashboard
- ✅ https://golupdfs112-autz.vercel.app/sitemap.xml — Sitemap
- ✅ https://golupdfs112-autz.vercel.app/robots.txt — Robots
- ✅ https://golupdfs112-autz.vercel.app/api/admin/health — Health check

## Step 7 — Custom Domain (Future)

When you purchase a custom domain:
1. Vercel Dashboard → Domains → Add Domain
2. Add DNS A record: `76.76.21.21`
3. Add CNAME: `www` → `cname.vercel-dns.com`
4. Update `NEXT_PUBLIC_SITE_URL` env var to your domain
5. SSL is auto-provisioned by Vercel

---

## .gitignore Checklist

Ensure these are NEVER committed:
- `.env.local` ✅ (in .gitignore)
- `.next/` ✅ (in .gitignore)
- `node_modules/` ✅ (in .gitignore)
