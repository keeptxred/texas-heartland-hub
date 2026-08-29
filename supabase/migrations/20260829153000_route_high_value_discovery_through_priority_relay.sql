-- Route two high-value discovery feeds that showed transient 503 failures in
-- production through the existing bounded-retry priority relay. The priority
-- relay remains a closed allowlist and does not change scoring/publication.

update public.content_sources
set rss_url = 'https://ftkznprjljkhymknvhye.supabase.co/functions/v1/ktr-rss-relay-priority?feed=google-primary-governor',
    updated_at = now()
where source_name = 'Texas Governor Primary Source — Google News'
  and enabled = true;

update public.content_sources
set rss_url = 'https://ftkznprjljkhymknvhye.supabase.co/functions/v1/ktr-rss-relay-priority?feed=google-workforce-grants',
    updated_at = now()
where source_name = 'Texas Grants and Workforce Investments — Google News'
  and enabled = true;
