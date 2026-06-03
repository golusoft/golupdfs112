-- ─────────────────────────────────────────────────────────────────────────────
-- GoluPDFs AI SEO Operating System - Production DB Migration v2
-- Idempotent: Safe to run multiple times. All statements use IF NOT EXISTS.
-- ─────────────────────────────────────────────────────────────────────────────

-- 0. Enable required extensions
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- 1. Blog Posts Table
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT[] NOT NULL DEFAULT '{}',
  lsi_keywords TEXT[] NOT NULL DEFAULT '{}',
  category TEXT NOT NULL DEFAULT 'Guide',
  image_url TEXT,
  image_alt TEXT,
  image_caption TEXT,
  schema_markup JSONB DEFAULT '{}'::jsonb,
  is_pillar BOOLEAN DEFAULT false,
  pillar_id TEXT,
  topic_cluster TEXT DEFAULT 'General',
  seo_score INTEGER DEFAULT 0,
  seo_score_details JSONB DEFAULT '{}'::jsonb,
  is_programmatic BOOLEAN DEFAULT false,
  affiliate_blocks_inserted BOOLEAN DEFAULT false,
  affiliate_data JSONB DEFAULT '{}'::jsonb,
  views_30d INTEGER DEFAULT 0,
  clicks_30d INTEGER DEFAULT 0,
  ctr_30d NUMERIC(5,2) DEFAULT 0.00,
  avg_position NUMERIC(4,2) DEFAULT 0.00,
  read_time TEXT,
  author TEXT NOT NULL DEFAULT 'GoluPDFs AI',
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- 2. Keyword Opportunities Table
CREATE TABLE IF NOT EXISTS public.keyword_opportunities (
  id BIGSERIAL PRIMARY KEY,
  keyword TEXT UNIQUE NOT NULL,
  difficulty INTEGER NOT NULL DEFAULT 0,
  search_volume INTEGER NOT NULL DEFAULT 0,
  intent TEXT NOT NULL DEFAULT 'Informational',
  opportunity_score INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'discovered',
  suggested_title TEXT,
  title_variations TEXT[] NOT NULL DEFAULT '{}',
  topic_cluster TEXT NOT NULL DEFAULT 'General',
  is_pillar BOOLEAN DEFAULT false,
  serp_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- 3. Generation Logs Table
CREATE TABLE IF NOT EXISTS public.generation_logs (
  id BIGSERIAL PRIMARY KEY,
  ts TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
  action TEXT NOT NULL,
  status TEXT NOT NULL,
  keyword TEXT,
  details TEXT NOT NULL,
  payload JSONB DEFAULT '{}'::jsonb,
  trace_id TEXT
);

-- 4. Analytics Insights Table
CREATE TABLE IF NOT EXISTS public.analytics_insights (
  id BIGSERIAL PRIMARY KEY,
  ts TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
  insight_type TEXT NOT NULL,
  affected_post_id TEXT REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  recommended_action TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
);

-- 5. RAG Article Embeddings Table
CREATE TABLE IF NOT EXISTS public.article_embeddings (
  id BIGSERIAL PRIMARY KEY,
  post_id TEXT REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  chunk_index INTEGER NOT NULL DEFAULT 0,
  content TEXT NOT NULL,
  embedding vector(768) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
  UNIQUE(post_id, chunk_index)
);

-- 6. Affiliate Click Telemetry Table
CREATE TABLE IF NOT EXISTS public.affiliate_clicks (
  id BIGSERIAL PRIMARY KEY,
  ts TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
  post_slug TEXT NOT NULL,
  product_name TEXT NOT NULL,
  affiliate_link TEXT NOT NULL,
  user_ip TEXT,
  user_agent TEXT
);

-- 7. Cron Execution Log Table (NEW)
CREATE TABLE IF NOT EXISTS public.cron_executions (
  id BIGSERIAL PRIMARY KEY,
  ts TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
  trace_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'running', -- running, success, failed
  keyword_run TEXT,
  published_slug TEXT,
  articles_published INTEGER DEFAULT 0,
  articles_failed INTEGER DEFAULT 0,
  articles_refreshed INTEGER DEFAULT 0,
  duration_ms INTEGER,
  error_message TEXT,
  summary JSONB DEFAULT '{}'::jsonb
);

-- 8. Social Syndication Queue Table (NEW)
CREATE TABLE IF NOT EXISTS public.syndication_queue (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
  post_slug TEXT NOT NULL,
  post_title TEXT NOT NULL,
  canonical_url TEXT NOT NULL,
  platform TEXT NOT NULL, -- medium, devto, linkedin, hashnode
  status TEXT NOT NULL DEFAULT 'pending', -- pending, published, failed, skipped
  published_url TEXT,
  error_message TEXT,
  published_at TIMESTAMP WITH TIME ZONE
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Row-Level Security
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.keyword_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cron_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.syndication_queue ENABLE ROW LEVEL SECURITY;

-- RLS Policies (use DO blocks for idempotency)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='blog_posts' AND policyname='public_select_published') THEN
    CREATE POLICY "public_select_published" ON public.blog_posts FOR SELECT USING (published_at IS NOT NULL);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='blog_posts' AND policyname='service_role_all') THEN
    CREATE POLICY "service_role_all" ON public.blog_posts FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='keyword_opportunities' AND policyname='service_role_all') THEN
    CREATE POLICY "service_role_all" ON public.keyword_opportunities FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='generation_logs' AND policyname='service_role_all') THEN
    CREATE POLICY "service_role_all" ON public.generation_logs FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='analytics_insights' AND policyname='service_role_all') THEN
    CREATE POLICY "service_role_all" ON public.analytics_insights FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='article_embeddings' AND policyname='service_role_all') THEN
    CREATE POLICY "service_role_all" ON public.article_embeddings FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='affiliate_clicks' AND policyname='service_role_all') THEN
    CREATE POLICY "service_role_all" ON public.affiliate_clicks FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='cron_executions' AND policyname='service_role_all') THEN
    CREATE POLICY "service_role_all" ON public.cron_executions FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='syndication_queue' AND policyname='service_role_all') THEN
    CREATE POLICY "service_role_all" ON public.syndication_queue FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- Performance Indexes
-- ─────────────────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_pillar ON public.blog_posts(pillar_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_cluster ON public.blog_posts(topic_cluster);
CREATE INDEX IF NOT EXISTS idx_blog_posts_seo_score ON public.blog_posts(seo_score DESC);
CREATE INDEX IF NOT EXISTS idx_keyword_status ON public.keyword_opportunities(status);
CREATE INDEX IF NOT EXISTS idx_generation_logs_ts ON public.generation_logs(ts DESC);
CREATE INDEX IF NOT EXISTS idx_generation_logs_trace ON public.generation_logs(trace_id);
CREATE INDEX IF NOT EXISTS idx_analytics_insights_status ON public.analytics_insights(status);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_post ON public.affiliate_clicks(post_slug);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_product ON public.affiliate_clicks(product_name);
CREATE INDEX IF NOT EXISTS idx_cron_executions_ts ON public.cron_executions(ts DESC);
CREATE INDEX IF NOT EXISTS idx_syndication_status ON public.syndication_queue(status);
CREATE INDEX IF NOT EXISTS idx_syndication_platform ON public.syndication_queue(platform);
CREATE INDEX IF NOT EXISTS idx_article_embeddings_cos ON public.article_embeddings
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- ─────────────────────────────────────────────────────────────────────────────
-- Useful Views
-- ─────────────────────────────────────────────────────────────────────────────

-- Revenue aggregation by product
CREATE OR REPLACE VIEW public.affiliate_revenue_by_product AS
  SELECT
    product_name,
    COUNT(*) AS total_clicks,
    COUNT(DISTINCT post_slug) AS articles_driving_clicks,
    DATE_TRUNC('day', ts) AS click_date
  FROM public.affiliate_clicks
  GROUP BY product_name, DATE_TRUNC('day', ts)
  ORDER BY total_clicks DESC;

-- Top performing blog posts
CREATE OR REPLACE VIEW public.top_performing_posts AS
  SELECT
    id, slug, title, seo_score, views_30d, clicks_30d, ctr_30d, avg_position,
    topic_cluster, is_pillar, published_at
  FROM public.blog_posts
  WHERE published_at IS NOT NULL
  ORDER BY seo_score DESC, views_30d DESC;

-- ─────────────────────────────────────────────────────────────────────────────
-- pgvector Match Articles RPC Function
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.match_articles(
  query_embedding vector(768),
  match_threshold float,
  match_count int,
  exclude_slug text
) RETURNS TABLE (
  post_id text,
  slug text,
  content text,
  similarity float
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ae.post_id,
    ae.slug,
    ae.content,
    1 - (ae.embedding <=> query_embedding) AS similarity
  FROM public.article_embeddings ae
  WHERE ae.slug <> exclude_slug
    AND 1 - (ae.embedding <=> query_embedding) > match_threshold
  ORDER BY ae.embedding <=> query_embedding
  LIMIT match_count;
END;
$$ LANGUAGE plpgsql;

-- ─────────────────────────────────────────────────────────────────────────────
-- Storage Buckets
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
  VALUES ('blog-images', 'blog-images', true)
  ON CONFLICT (id) DO NOTHING;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='objects' AND policyname='blog_images_public_read') THEN
    CREATE POLICY "blog_images_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'blog-images');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='objects' AND policyname='blog_images_service_write') THEN
    CREATE POLICY "blog_images_service_write" ON storage.objects FOR ALL TO service_role
      USING (bucket_id = 'blog-images') WITH CHECK (bucket_id = 'blog-images');
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- PDF Analysis Shareable Reports Table (NEW)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.pdf_reports (
  id TEXT PRIMARY KEY,
  filename TEXT NOT NULL,
  stats JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

ALTER TABLE public.pdf_reports ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='pdf_reports' AND policyname='public_select_reports') THEN
    CREATE POLICY "public_select_reports" ON public.pdf_reports FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='pdf_reports' AND policyname='public_insert_reports') THEN
    CREATE POLICY "public_insert_reports" ON public.pdf_reports FOR INSERT WITH CHECK (true);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_pdf_reports_created ON public.pdf_reports(created_at DESC);

