-- Some local-TV RSS feeds syndicate national utility/wire pieces. Preserve those
-- rows for audit, but keep a very narrow set of obvious non-Texas items out of
-- SEO/rewrite queues. This never deletes or publishes content.

create or replace function public.guard_obvious_local_feed_national_syndication()
returns trigger
language plpgsql
set search_path = public
as $function$
declare
  t text := lower(coalesce(new.title,''));
  from_local_syndication boolean := coalesce(new.trend_source,'') in ('KRIS 6 — Corpus Christi Local','KZTV Action 10 — Corpus Christi Local');
  obvious_national_noise boolean;
begin
  if not from_local_syndication then return new; end if;

  obvious_national_noise :=
    t ~ 'study links lower early-life sugar intake to reduced cancer risk'
    or t ~ 'tennessee national guard.*fatally shot'
    or t ~ 'fed chair .*rate hikes?.*inflation'
    or t ~ 'foldable iphone.*\$?2,?000';

  if obvious_national_noise and new.internal_slug is null and new.texasdefined_slug is null then
    new.target_site := 'review';
    new.target_section := 'Unclassified';
    new.ready_for_rewrite := false;
    new.routing_type := null;
    new.viral_score := 0;
    new.viral_signals := coalesce(new.viral_signals,'{}'::jsonb) || jsonb_build_object(
      'national_syndication_noise',true,
      'auto_publish_eligible',false,
      'editorial_lane','REVIEW',
      'exclusion_reason','National syndicated item from a Texas local feed lacks a Texas newsroom angle'
    );
  end if;
  return new;
end;
$function$;

drop trigger if exists zzzzzzzz_guard_obvious_local_feed_national_syndication on public.texas_news_feed;
create trigger zzzzzzzz_guard_obvious_local_feed_national_syndication
before insert or update of title,description,source,trend_source,routing_type,viral_signals
on public.texas_news_feed
for each row execute function public.guard_obvious_local_feed_national_syndication();

update public.texas_news_feed
set title = title
where created_at >= now()-interval '14 days'
  and trend_source in ('KRIS 6 — Corpus Christi Local','KZTV Action 10 — Corpus Christi Local')
  and internal_slug is null
  and texasdefined_slug is null;

comment on function public.guard_obvious_local_feed_national_syndication() is
  'De-queues narrowly identified national syndicated stories from local Corpus Christi feeds when they have no Texas newsroom angle; preserves rows for audit and never deletes/publishes content.';
