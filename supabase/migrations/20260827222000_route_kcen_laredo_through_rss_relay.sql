-- Route two proven local-news RSS feeds through the fixed Supabase relay so
-- Cloudflare ingestion does not depend on zero-yield HTML rendering paths.

update public.content_sources
set rss_url='https://ftkznprjljkhymknvhye.supabase.co/functions/v1/ktr-rss-relay?feed=kcen-local',
    updated_at=now(),
    notes=concat_ws(' ',nullif(notes,''),'Routed through fixed RSS relay after direct Worker path repeatedly yielded zero items; upstream RSS verified at 40 items on 2026-08-27.')
where source_name='KCEN 6 — Central Texas Local RSS';

insert into public.content_sources(platform,source_name,source_url,category,notes,source_reputation_score,source_quality_reason,enabled,rss_url)
select 'rss','Laredo Morning Times — Local RSS','https://www.lmtonline.com/local/','Local',
       'Fixed relay to Laredo Morning Times RSS; upstream verified HTTP 200 with 15 items on 2026-08-27.',
       85,'Established Laredo local newspaper; fixed RSS relay.',true,
       'https://ftkznprjljkhymknvhye.supabase.co/functions/v1/ktr-rss-relay?feed=lmt-local'
where not exists(select 1 from public.content_sources where source_name='Laredo Morning Times — Local RSS');

update public.content_sources
set enabled=true,
    rss_url='https://ftkznprjljkhymknvhye.supabase.co/functions/v1/ktr-rss-relay?feed=lmt-local',
    updated_at=now()
where source_name='Laredo Morning Times — Local RSS';
