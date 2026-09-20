alter table public.gsc_page_daily_metrics drop constraint if exists gsc_page_daily_metrics_url_check;
alter table public.gsc_page_daily_metrics add constraint gsc_page_daily_metrics_url_check check (url ~ '^https://keeptxred[.]com(?:/|$)');
alter table public.gsc_url_inspection drop constraint if exists gsc_url_inspection_url_check;
alter table public.gsc_url_inspection add constraint gsc_url_inspection_url_check check (url ~ '^https://keeptxred[.]com(?:/|$)');
