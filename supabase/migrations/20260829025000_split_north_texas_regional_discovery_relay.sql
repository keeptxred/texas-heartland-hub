update public.content_sources
set rss_url='https://ftkznprjljkhymknvhye.supabase.co/functions/v1/ktr-rss-relay-north?feed=dfw-cross-timbers',
    source_url='https://news.google.com/',
    enabled=true,
    notes='Regional sweep for Fort Worth, Arlington, Denton, Weatherford and Cross Timbers stories via fixed split relay to avoid oversized-query transport failures.',
    updated_at=now()
where source_name='North Texas and Cross Timbers — Regional Discovery';

insert into public.content_sources(platform,source_name,source_url,category,notes,source_reputation_score,source_quality_reason,enabled,rss_url)
select 'rss','Western North Texas and Red River — Regional Discovery','https://news.google.com/','Local',
       'Regional sweep for Wichita Falls, Mineral Wells, Graham and Jacksboro via fixed split relay.',
       null,null,true,
       'https://ftkznprjljkhymknvhye.supabase.co/functions/v1/ktr-rss-relay-north?feed=western-north-texas'
where not exists (select 1 from public.content_sources where source_name='Western North Texas and Red River — Regional Discovery');
