-- Texas Sports vertical: source visibility + recurring discovery/classification.
-- Discovery remains source-first and feeds the existing texas_news_feed -> rewrite
-- -> image -> publication machinery rather than introducing a second publisher.

CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

INSERT INTO public.content_sources (
  platform,
  source_name,
  source_url,
  rss_url,
  category,
  notes,
  source_reputation_score,
  source_quality_reason,
  enabled
)
SELECT
  v.platform,
  v.source_name,
  v.source_url,
  v.rss_url,
  'Sports',
  'Official Texas sports primary source used by KTR Sports discovery.',
  v.reputation,
  'Official first-party team, league, university athletics, governing body, or venue source.',
  true
FROM (VALUES
  ('rss','Dallas Cowboys','https://www.dallascowboys.com','https://www.dallascowboys.com/rss/news',95),
  ('rss','Houston Texans','https://www.houstontexans.com','https://www.houstontexans.com/rss/news',95),
  ('website','Houston Astros','https://www.mlb.com/astros/news',NULL,95),
  ('website','Texas Rangers','https://www.mlb.com/rangers/news',NULL,95),
  ('website','Dallas Mavericks','https://www.mavs.com/news/',NULL,94),
  ('website','Houston Rockets','https://www.nba.com/rockets/news',NULL,94),
  ('website','San Antonio Spurs','https://www.nba.com/spurs/news',NULL,94),
  ('website','Dallas Stars','https://www.nhl.com/stars/news/',NULL,94),
  ('website','Austin FC','https://www.austinfc.com/news/',NULL,94),
  ('website','FC Dallas','https://www.fcdallas.com/news/',NULL,94),
  ('website','Houston Dynamo FC','https://www.houstondynamofc.com/news/',NULL,94),
  ('website','Houston Dash','https://www.houstondynamofc.com/houstondash/news/',NULL,94),
  ('website','Dallas Wings','https://wings.wnba.com/news/',NULL,94),
  ('website','Texas Longhorns Athletics','https://texaslonghorns.com/news/',NULL,94),
  ('website','Texas A&M Athletics','https://12thman.com/news/',NULL,94),
  ('website','TCU Athletics','https://gofrogs.com/news/',NULL,92),
  ('website','Baylor Athletics','https://baylorbears.com/news/',NULL,92),
  ('website','Texas Tech Athletics','https://texastech.com/news/',NULL,92),
  ('website','Houston Cougars Athletics','https://uhcougars.com/news/',NULL,92),
  ('website','SMU Athletics','https://smumustangs.com/news/',NULL,92),
  ('website','UTSA Athletics','https://goutsa.com/news/',NULL,92),
  ('website','North Texas Athletics','https://meangreensports.com/news/',NULL,90),
  ('website','Texas State Athletics','https://txst.com/news/',NULL,90),
  ('rss','University Interscholastic League','https://www.uiltexas.org/','https://feeds.feedburner.com/uil-press-releases',96),
  ('website','Circuit of the Americas','https://circuitoftheamericas.com/blog/',NULL,92),
  ('website','Texas Motor Speedway','https://www.texasmotorspeedway.com/media/news/',NULL,92)
) AS v(platform, source_name, source_url, rss_url, reputation)
WHERE NOT EXISTS (
  SELECT 1 FROM public.content_sources cs WHERE lower(cs.source_name) = lower(v.source_name)
);

DO $$
DECLARE existing_job_id bigint;
BEGIN
  SELECT jobid INTO existing_job_id FROM cron.job WHERE jobname = 'keep-tx-red-ingest-sports' LIMIT 1;
  IF existing_job_id IS NOT NULL THEN PERFORM cron.unschedule(existing_job_id); END IF;
  SELECT jobid INTO existing_job_id FROM cron.job WHERE jobname = 'keep-tx-red-classify-sports' LIMIT 1;
  IF existing_job_id IS NOT NULL THEN PERFORM cron.unschedule(existing_job_id); END IF;
END
$$;

-- Refresh official sports sources twice an hour, offset from the general feed.
SELECT cron.schedule(
  'keep-tx-red-ingest-sports',
  '17,47 * * * *',
  $$
    SELECT net.http_post(
      url := 'https://keeptxred.com/api/public/hooks/ingest-sports',
      headers := '{"Content-Type":"application/json","Accept":"application/json"}'::jsonb,
      body := '{"source":"pg_cron"}'::jsonb,
      timeout_milliseconds := 120000
    );
  $$
);

-- Normalize team/league/topic metadata after the shared publisher has had time
-- to turn feed discoveries into daily_articles. This also backfills recent rows.
SELECT cron.schedule(
  'keep-tx-red-classify-sports',
  '27 * * * *',
  $$
    SELECT net.http_post(
      url := 'https://keeptxred.com/api/public/hooks/classify-sports',
      headers := '{"Content-Type":"application/json","Accept":"application/json"}'::jsonb,
      body := '{"source":"pg_cron"}'::jsonb,
      timeout_milliseconds := 120000
    );
  $$
);
