-- Persist admin dismissals for the ChatGPT Auto Articles panel without
-- changing ingestion or publication state.
ALTER TABLE public.daily_articles
  ADD COLUMN IF NOT EXISTS chatgpt_admin_ignored boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.daily_articles.chatgpt_admin_ignored IS
  'When true, hides the article from the admin ChatGPT Auto Articles review panel.';
