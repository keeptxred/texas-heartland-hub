-- Narrow final holds for two observed non-news formats from the expanded source layer.
-- Preserve feed history for audit; never touch linked/published rows.

create or replace function public.guard_non_news_listing_profiles()
returns trigger
language plpgsql
set search_path = public
as $function$
declare
  t text := lower(trim(coalesce(new.title, '')));
  src text := lower(coalesce(new.source, '') || ' ' || coalesce(new.trend_source, ''));
  is_non_news boolean := false;
begin
  if new.internal_slug is not null or new.texasdefined_slug is not null then
    return new;
  end if;

  -- Bare municipal recurring-event listing with no editorial/news event.
  if t = 'singo bingo' and src ~ 'texas city municipal news' then
    is_non_news := true;
  end if;

  -- 247Sports roster/profile cards surfaced by regional discovery, e.g.
  -- "Julian Reese II, Amarillo Palo Duro , Wide Receiver".
  if src ~ '247sports'
     and t ~ ',[^,]+,[[:space:]]*(wide receiver|quarterback|running back|linebacker|defensive back|cornerback|safety|tight end|offensive lineman|defensive lineman|edge|athlete|kicker|punter)[[:space:]]*$'
     and t !~ '(commits?|commitment|signs?|signed|offers?|offered|transfers?|recruiting|ranked|announces?|chooses?|flips?|decommits?)'
  then
    is_non_news := true;
  end if;

  if is_non_news then
    new.target_site := 'review';
    new.target_section := 'Unclassified';
    new.ready_for_rewrite := false;
    new.viral_score := 0;
    new.viral_scored_at := coalesce(new.viral_scored_at, now());
    new.routing_type := null;
    new.viral_signals := coalesce(new.viral_signals, '{}'::jsonb) || jsonb_build_object(
      'low_value_title', true,
      'auto_publish_eligible', false,
      'editorial_lane', 'REVIEW',
      'final_quality_guard', true,
      'exclusion_reason', 'Non-news recurring event listing or player profile card',
      'routing_lock', true,
      'routing_locked_site', 'review',
      'routing_locked_section', 'Unclassified'
    );
  end if;

  return new;
end;
$function$;

drop trigger if exists zzzzzzzzzzz_guard_non_news_listing_profiles on public.texas_news_feed;
create trigger zzzzzzzzzzz_guard_non_news_listing_profiles
before insert or update of title, source, trend_source, viral_signals
on public.texas_news_feed
for each row execute function public.guard_non_news_listing_profiles();

update public.texas_news_feed
set title = title
where internal_slug is null
  and texasdefined_slug is null
  and (
    (lower(trim(title)) = 'singo bingo' and lower(coalesce(source, '') || ' ' || coalesce(trend_source, '')) ~ 'texas city municipal news')
    or (
      lower(coalesce(source, '') || ' ' || coalesce(trend_source, '')) ~ '247sports'
      and lower(title) ~ ',[^,]+,[[:space:]]*(wide receiver|quarterback|running back|linebacker|defensive back|cornerback|safety|tight end|offensive lineman|defensive lineman|edge|athlete|kicker|punter)[[:space:]]*$'
      and lower(title) !~ '(commits?|commitment|signs?|signed|offers?|offered|transfers?|recruiting|ranked|announces?|chooses?|flips?|decommits?)'
    )
  );

comment on function public.guard_non_news_listing_profiles() is
  'Holds bare recurring-event listings and static 247Sports player profile cards as non-news without affecting real recruiting news.';
