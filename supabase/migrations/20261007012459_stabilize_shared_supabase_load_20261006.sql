create index if not exists texas_news_feed_unclassified_recent_idx
  on public.texas_news_feed (pub_date desc, id desc)
  where pillar_classified_at is null;

create index if not exists bill_sponsors_slug_bill_idx
  on public.bill_sponsors (sponsor_slug, bill_id);

drop index if exists public.idx_texasdefined_event_offers_location;
drop index if exists public.idx_texasdefined_event_offers_tags;

revoke all on function public.verify_repo_migrations(text[]) from public, anon, authenticated;
grant execute on function public.verify_repo_migrations(text[]) to service_role;

select cron.alter_job(12, '10,40 * * * *', null, null, null, null);
select cron.alter_job(13, '13,43 * * * *', null, null, null, null);
select cron.alter_job(14, '16,46 * * * *', null, null, null, null);
select cron.alter_job(15, '19,49 * * * *', null, null, null, null);
select cron.alter_job(16, '22,52 * * * *', null, null, null, null);
select cron.alter_job(21, '14,44 * * * *', null, null, null, null);
