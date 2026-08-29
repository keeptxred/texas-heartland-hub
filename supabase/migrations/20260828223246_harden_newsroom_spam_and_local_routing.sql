-- Final newsroom quality guard for source-specific spam and deterministic local routing.
-- This runs after the existing router/quality triggers and never touches linked/published rows.

create or replace function public.guard_final_newsroom_quality_v2()
returns trigger
language plpgsql
set search_path = public
as $function$
declare
  t text := lower(coalesce(new.title, ''));
  h text := lower(coalesce(new.title, '') || ' ' || coalesce(new.description, '') || ' ' || coalesce(new.source, '') || ' ' || coalesce(new.trend_source, ''));
  is_low_value boolean;
  is_sports_context boolean;
  is_local_crime_or_crash boolean;
begin
  if new.internal_slug is not null or new.texasdefined_slug is not null then
    return new;
  end if;

  is_low_value :=
    t ~ 'live@?streams?'
    or t ~ 'where to watch,?[[:space:]]*stream info,?[[:space:]]*tv channel'
    or t ~ 'how to watch.*live stream info'
    or t ~ 'odds,?[[:space:]]*spread,?[[:space:]]*(and[[:space:]]*)?totals?'
    or t ~ 'prediction,?[[:space:]]*picks?[[:space:]]*&[[:space:]]*odds'
    or t ~ '^our next .* meetup'
    or t ~ '^power outage maps?.*check for outages';

  if is_low_value then
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
      'exclusion_reason', 'Streaming/odds/utility/promotional page is not a newsroom story',
      'routing_lock', true,
      'routing_locked_site', 'review',
      'routing_locked_section', 'Unclassified'
    );
    return new;
  end if;

  -- A national syndicated legal-market story surfaced in a Corpus Christi feed
  -- without a Texas angle. Keep this source-specific and evidence-based.
  if coalesce(new.trend_source, '') in ('KRIS 6 — Corpus Christi Local', 'KZTV Action 10 — Corpus Christi Local')
     and t ~ 'prediction markets.*federal appeals court'
     and h !~ '(texas|corpus christi|nueces|kingsville|coastal bend)'
  then
    new.target_site := 'review';
    new.target_section := 'Unclassified';
    new.ready_for_rewrite := false;
    new.viral_score := 0;
    new.viral_scored_at := coalesce(new.viral_scored_at, now());
    new.routing_type := null;
    new.viral_signals := coalesce(new.viral_signals, '{}'::jsonb) || jsonb_build_object(
      'national_syndication_noise', true,
      'auto_publish_eligible', false,
      'editorial_lane', 'REVIEW',
      'final_quality_guard', true,
      'exclusion_reason', 'National syndicated story lacks a Texas newsroom angle'
    );
    return new;
  end if;

  is_sports_context :=
    h ~ '(dallas cowboys|houston texans|houston astros|texas rangers|san antonio spurs|dallas mavericks|dallas stars|houston rockets)'
    or h ~ '\m(nfl|nba|mlb|nhl|mls|wnba)\M'
    or lower(coalesce(new.source, '') || ' ' || coalesce(new.trend_source, '')) ~ '(sports|athletics|texags|blogging the boys|burnt orange nation|ksat spurs)';

  is_local_crime_or_crash :=
    t ~ '(deadly crash|fatal crash|bus crash|vehicle crash|car crash|multi-vehicle crash|[0-9]+-vehicle crash|collision|allegedly stabbed|stabbing|double murder|\mmurder\M|\mhomicide\M|found guilty.*murder|dies? after .*crash|killed .*crash|hospitalized after .*crash|arrested|affidavit)'
    and not is_sports_context;

  if is_local_crime_or_crash then
    new.target_site := 'keeptxred';
    new.target_section := 'Texas News';
    new.viral_signals := coalesce(new.viral_signals, '{}'::jsonb) || jsonb_build_object(
      'final_quality_guard', true,
      'route_quality_reason', 'Local crime/crash precedence routes to KTR Texas News'
    );
    return new;
  end if;

  if t ~ '(rep\.? .*recall petition|recall petition .*file suit|texas lawmaker .*oil regulators|public comment at meetings)' then
    new.target_site := 'keeptxred';
    new.target_section := 'Politics';
    return new;
  end if;

  if t ~ 'texas veterans commission .*awards?' then
    new.target_site := 'keeptxred';
    new.target_section := 'Texas News';
    return new;
  end if;

  if t ~ '(community expo|girl scouts?.*documentary|high schools? in texas .*ranked|texas .*high schools?.*ranked|hosts? [0-9-]*day healing event)' then
    new.target_site := 'texasdefined';
    new.target_section := 'Texas Life';
    return new;
  end if;

  return new;
end;
$function$;

-- Run after all existing newsroom route guards.
drop trigger if exists zzzzzzzzz_guard_final_newsroom_quality_v2 on public.texas_news_feed;
create trigger zzzzzzzzz_guard_final_newsroom_quality_v2
before insert or update of title, description, source, trend_source, viral_signals
on public.texas_news_feed
for each row execute function public.guard_final_newsroom_quality_v2();

-- Re-evaluate only recent unlinked rows in the exact classes hardened above.
update public.texas_news_feed
set title = title
where internal_slug is null
  and texasdefined_slug is null
  and created_at >= now() - interval '30 days'
  and (
    lower(title) ~ 'live@?streams?'
    or lower(title) ~ 'where to watch,?[[:space:]]*stream info,?[[:space:]]*tv channel'
    or lower(title) ~ 'how to watch.*live stream info'
    or lower(title) ~ 'odds,?[[:space:]]*spread,?[[:space:]]*(and[[:space:]]*)?totals?'
    or lower(title) ~ 'prediction,?[[:space:]]*picks?[[:space:]]*&[[:space:]]*odds'
    or lower(title) ~ '^our next .* meetup'
    or lower(title) ~ '^power outage maps?.*check for outages'
    or lower(title) ~ '(deadly crash|fatal crash|bus crash|vehicle crash|car crash|multi-vehicle crash|[0-9]+-vehicle crash|collision|allegedly stabbed|stabbing|double murder|\mmurder\M|\mhomicide\M|found guilty.*murder|dies? after .*crash|killed .*crash|hospitalized after .*crash|arrested|affidavit)'
    or lower(title) ~ '(rep\.? .*recall petition|recall petition .*file suit|texas lawmaker .*oil regulators|public comment at meetings|texas veterans commission .*awards?|community expo|girl scouts?.*documentary|high schools? in texas .*ranked|texas .*high schools?.*ranked|hosts? [0-9-]*day healing event)'
    or (coalesce(trend_source, '') in ('KRIS 6 — Corpus Christi Local', 'KZTV Action 10 — Corpus Christi Local') and lower(title) ~ 'prediction markets.*federal appeals court')
  );

comment on function public.guard_final_newsroom_quality_v2() is
  'Final newsroom guard for streaming/odds/utility spam, local crime/crash route precedence, and narrow deterministic civic/lifestyle gaps.';
