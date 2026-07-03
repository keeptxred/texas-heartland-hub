ALTER TABLE public.daily_articles ADD COLUMN IF NOT EXISTS teams text[] NOT NULL DEFAULT '{}';
CREATE INDEX IF NOT EXISTS daily_articles_teams_gin ON public.daily_articles USING gin (teams);