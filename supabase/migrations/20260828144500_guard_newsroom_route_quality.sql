-- Final routing-quality guard for deterministic edge cases discovered by the
-- expanded newsroom source set. This intentionally runs after the broad router
-- and the pro-sports source guard. It does not publish content.

create or replace function public.guard_newsroom_route_quality()
returns trigger
language plpgsql
set search_path = public
as $function$
declare
  title_text text := lower(coalesce(new.title, ''));
  content_text text := lower(coalesce(new.title, '') || ' ' || coalesce(new.description, ''));
  is_obituary boolean;
  has_real_sports_signal boolean;
  is_law_enforcement_rangers boolean;
  is_local_openings boolean;
  is_public_art boolean;
  is_community_support boolean;
begin
  is_obituary := title_text ~ '\mobituary\M' or title_text ~ '^death notice\M';

  is_law_enforcement_rangers :=
    content_text ~ '(texas rangers|\mrangers\M)'
    and content_text ~ '(\mdps\M|department of public safety|law enforcement|trooper|troopers|criminal investigation|public safety commission|rangers leadership|chief of the texas rangers)';

  has_real_sports_signal :=
    content_text ~ '(dallas cowboys|houston texans|houston astros|san antonio spurs|dallas mavericks|houston rockets|dallas stars|houston dynamo|fc dallas)'
    or (content_text ~ '\mtexas rangers\M' and content_text ~ '(\mmlb\M|baseball|game|games|pitcher|bullpen|inning|innings|batting|playoff|world series|clubhouse|roster)')
    or content_text ~ '\m(nfl|nba|mlb|nhl|mls|wnba)\M'
    or content_text ~ '(college football|high school football|\mfootball\M|\mbaseball\M|\mbasketball\M|\mhockey\M|\msoccer\M|\mgolf\M|\mvolleyball\M|\msoftball\M|swimming and diving|track and field|cross country|\mtennis\M|heisman|preseason|season opener|training camp|quarterback|touchdown|wide receiver|running back|linebacker|roster|playoff|championship|coach|athlete|athletics|recruiting|red raiders|longhorns|aggies|horned frogs|\mcowboys\M|\mtexans\M|\mastros\M|\mspurs\M|\mmavericks\M)';

  is_local_openings :=
    title_text ~ '(new businesses? now open|businesses? now open in|check out [0-9]+ new businesses?|[0-9]+ new businesses? now open)';

  is_public_art :=
    title_text ~ '(placemaking through art|public art collection|\mpublic art\M|community art installation|arts? district)';

  is_community_support :=
    title_text ~ '(baby shower|works to feed [0-9,]+ local students|feeds? [0-9,]+ local students|community organization .* (feeds?|supports?) .* students)';

  -- Individual obituary/death-notice listings are retained for audit but never
  -- enter rewrite/publication lanes.
  if is_obituary then
    new.target_site := 'review';
    new.target_section := 'Unclassified';
    new.ready_for_rewrite := false;
    new.viral_score := 0;
    new.viral_scored_at := coalesce(new.viral_scored_at, now());
    new.viral_signals := coalesce(new.viral_signals, '{}'::jsonb) || jsonb_build_object(
      'low_value_title', true,
      'auto_publish_eligible', false,
      'editorial_lane', 'REVIEW',
      'exclusion_reason', 'Obituary/death-notice listing is not a newsroom story'
    );
    return new;
  end if;

  -- Protect against substring collisions such as "inflation" matching bare
  -- "nfl" in older router vocabulary, and against Texas Rangers police items.
  if new.target_section = 'Sports' and (not has_real_sports_signal or is_law_enforcement_rangers) then
    new.target_site := 'review';
    new.target_section := 'Unclassified';
    new.ready_for_rewrite := false;
    new.viral_signals := coalesce(new.viral_signals, '{}'::jsonb) || jsonb_build_object(
      'route_quality_hold', true,
      'auto_publish_eligible', false,
      'editorial_lane', 'REVIEW',
      'route_quality_reason', 'Sports route lacked a real sports signal'
    );
    return new;
  end if;

  -- Deterministic lifestyle/community classes belong on TexasDefined.
  if is_local_openings or is_public_art or is_community_support then
    new.target_site := 'texasdefined';
    new.target_section := 'Texas Life';
  end if;

  return new;
end;
$function$;

drop trigger if exists zzzz_guard_newsroom_route_quality on public.texas_news_feed;
create trigger zzzz_guard_newsroom_route_quality
before insert or update of title, description, source, trend_source
on public.texas_news_feed
for each row execute function public.guard_newsroom_route_quality();

-- Re-evaluate only recent, unlinked rows. Existing published/linked content is
-- untouched. Trigger ordering applies the broad router first, source-specific
-- pro-sports guard second, and this final quality guard last.
update public.texas_news_feed
set title = title
where internal_slug is null
  and texasdefined_slug is null
  and created_at >= now() - interval '14 days';

comment on function public.guard_newsroom_route_quality() is
  'Final newsroom routing guard: blocks obituary stubs and false Sports substring matches, and routes deterministic local lifestyle/community stories to TexasDefined.';
