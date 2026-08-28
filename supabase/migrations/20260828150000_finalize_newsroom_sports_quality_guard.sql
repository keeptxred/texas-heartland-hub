-- Final trusted-sports refinement: sports/athletics publishers and common
-- baseball series shorthand are valid sports evidence. This restores only
-- rows previously held by this guard; the Texas Rangers law-enforcement veto
-- remains authoritative.

create or replace function public.guard_newsroom_route_quality()
returns trigger
language plpgsql
set search_path = public
as $function$
declare
  title_text text := lower(coalesce(new.title, ''));
  content_text text := lower(coalesce(new.title, '') || ' ' || coalesce(new.description, ''));
  source_text text := lower(coalesce(new.source, '') || ' ' || coalesce(new.trend_source, ''));
  is_obituary boolean;
  is_known_sports_source boolean;
  has_real_sports_signal boolean;
  is_law_enforcement_rangers boolean;
  is_local_openings boolean;
  is_public_art boolean;
  is_community_support boolean;
begin
  is_obituary := title_text ~ '\mobituary\M' or title_text ~ '^death notice\M';

  is_law_enforcement_rangers :=
    content_text ~ '(texas rangers|\mrangers\M)'
    and content_text ~ '(\mdps\M|department of public safety|law enforcement|trooper|troopers|criminal investigation|public safety commission|rangers leadership|chief of the texas rangers|solve[sd]? .* murder)';

  is_known_sports_source := source_text ~
    '(\msports\M|athletics|texas rangers|houston astros|houston texans|dallas cowboys|dallas stars|ksat spurs|texags|burnt orange nation|blogging the boys|espn|mlb\.com|nfl\.com|nba\.com|nhl\.com)';

  has_real_sports_signal :=
    is_known_sports_source
    or content_text ~ '(dallas cowboys|houston texans|houston astros|san antonio spurs|dallas mavericks|houston rockets|dallas stars|houston dynamo|fc dallas)'
    or (content_text ~ '\mtexas rangers\M' and content_text ~ '(\mmlb\M|baseball|game|games|series|rubber match|pitcher|bullpen|inning|innings|batting|playoff|world series|clubhouse|roster|watch|stream|scores?|highlights?|lineup)')
    or content_text ~ '\m(nfl|nba|mlb|nhl|mls|wnba)\M'
    or content_text ~ '(college football|high school football|\mfootball\M|\mbaseball\M|\mbasketball\M|\mhockey\M|\msoccer\M|\mgolf\M|\mvolleyball\M|\msoftball\M|swimming and diving|track and field|cross country|\mtennis\M|heisman|preseason|season opener|training camp|quarterback|\mqb\M|touchdown|wide receiver|running back|linebacker|roster|playoff|championship|coach|athlete|athletics|recruiting|\mrecruit\M|\mrecruits\M|\mcommit\M|\mcommits\M|commitment|transfer|prospect|rehab outing|lineup|bullpen|offense|defense|red raiders|longhorns|aggies|horned frogs|\mcowboys\M|\mtexans\M|\mastros\M|\mspurs\M|\mmavericks\M)';

  is_local_openings := title_text ~ '(new businesses? now open|businesses? now open in|check out [0-9]+ new businesses?|[0-9]+ new businesses? now open)';
  is_public_art := title_text ~ '(placemaking through art|public art collection|\mpublic art\M|community art installation|arts? district)';
  is_community_support := title_text ~ '(baby shower|works to feed [0-9,]+ local students|feeds? [0-9,]+ local students|community organization .* (feeds?|supports?) .* students)';

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

  if has_real_sports_signal and not is_law_enforcement_rangers
     and coalesce((new.viral_signals->>'route_quality_hold')::boolean, false)
  then
    new.target_site := 'keeptxred';
    new.target_section := 'Sports';
    new.viral_signals := coalesce(new.viral_signals, '{}'::jsonb)
      - 'route_quality_hold'
      - 'route_quality_reason';
  end if;

  if is_local_openings or is_public_art or is_community_support then
    new.target_site := 'texasdefined';
    new.target_section := 'Texas Life';
  end if;

  return new;
end;
$function$;

update public.texas_news_feed
set title = title
where internal_slug is null
  and texasdefined_slug is null
  and created_at >= now() - interval '14 days';
