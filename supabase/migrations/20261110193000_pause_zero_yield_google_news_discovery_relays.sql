-- 2026-11-10 newsroom transport recovery.
-- Production smoke run 42881731681 observed 18/139 failed sources (12.9%).
-- Nine Google News relay sources repeatedly returned upstream 503/HTTP 0
-- and had zero feed items in the prior 24 hours. Disable only those observed
-- failed *discovery relays*, not the healthy original-publisher feeds or the
-- governor Google relay (which had a genuinely new item during this window).
--
-- This is NOT a smoke threshold reduction and does NOT delete existing news,
-- lower editorial source requirements or bypass the independent source gates.
-- Retain the rows for investigation and verified future recovery.

with blocked as (
  select cs.id
  from public.content_sources cs
  where cs.enabled is true
    and cs.source_name in (
      'Texas Attorney General Actions — Google News',
      'Texas Awards Contests and Recognition — Google News',
      'Texas Corporate Partnerships and Expansions — Google News',
      'Texas Courts and Judicial Appointments — Google News',
      'Texas Education Primary Sources — Google News',
      'Texas Executive Actions — Google News',
      'Texas Grants and Workforce Investments — Google News',
      'Texas Human Interest — Caught on Camera',
      'Texas Sports Records and Honors — Google News'
    )
    and cs.rss_url like 'https://ftkznprjljkhymknvhye.supabase.co/functions/v1/ktr-rss-relay%'
    and not exists (
      select 1 from public.texas_news_feed f
      where f.source=cs.source_name
        and f.created_at >= now()-interval '24 hours'
    )
)
update public.content_sources cs
set enabled=false,
    updated_at=now(),
    notes=concat_ws(E'\n',nullif(cs.notes,''),
      '2026-11-10: Paused repeated upstream Google News relay 503/HTTP 0 after verified zero items in last 24 hours; preserve historical records and independently sourced first-party news. Re-enable only on verified transport/source-quality recovery.')
where cs.id in (select id from blocked);

-- This intentionally leaves the 10th failing relay, Texas Governor Primary
-- Source — Google News, unchanged because it had real fresh feed evidence.
-- This guard will still preserve any named relay if it starts producing items
-- before migration execution on a later database.
