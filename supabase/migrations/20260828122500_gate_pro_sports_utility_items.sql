-- Keep relevant but low-value sports utility listings out of article generation.
-- These results are useful as social discovery but should not become native SEO
-- articles merely because they mention an allowlisted Texas pro team.

create or replace function public.guard_texas_pro_sports_discovery_row()
returns trigger
language plpgsql
set search_path = public
as $function$
declare
  haystack text := lower(coalesce(new.title,'') || ' ' || coalesce(new.description,'') || ' ' || coalesce(new.source,''));
  has_non_rangers_team boolean;
  has_rangers_alias boolean;
  has_sports_context boolean;
  is_law_enforcement_rangers boolean;
  is_utility_item boolean;
  is_allowed boolean;
  was_guarded boolean := coalesce((new.viral_signals->>'pro_sports_guard')::boolean,false)
    or coalesce((new.viral_signals->>'source_contamination')::boolean,false);
begin
  if new.trend_source is distinct from 'Texas Pro Sports — Daily Discovery' then
    return new;
  end if;

  has_non_rangers_team := haystack ~ '(dallas mavericks|dallas cowboys|houston astros|houston texans|san antonio spurs|\m(mavericks|cowboys|astros|texans|spurs)\M)';
  has_rangers_alias := haystack ~ '\m(texas rangers|rangers)\M';
  has_sports_context := haystack ~ '(\mmlb\M|baseball|game|games|series|pitcher|bullpen|inning|innings|batting|playoff|world series|clubhouse|roster|lineup|scores?|highlights?|opponent|schedule|standings|season|spring training|where to watch|watch|stream|live updates|tv channel|call up|called up|prospect|insider|depth chart|trade deadline|wild card|al west)';
  is_law_enforcement_rangers := has_rangers_alias and haystack ~ '(\mdps\M|department of public safety|law enforcement|trooper|troopers|criminal investigation|public safety commission|rangers leadership|chief of the texas rangers|police|murder|investigation)';
  is_utility_item := haystack ~ '(how to watch|where to watch|live stream|stream info|tv channel|live updates|\modds\M|\mspread\M|statcast game preview|game highlights|how to buy|nike vomero|running shoes just dropped)';
  is_allowed := has_non_rangers_team or (has_rangers_alias and has_sports_context and not is_law_enforcement_rangers);

  if is_allowed and is_utility_item then
    new.target_site := 'keeptxred';
    new.target_section := 'Sports';
    new.routing_type := 'FACEBOOK_ONLY';
    new.ready_for_rewrite := false;
    new.viral_signals := coalesce(new.viral_signals,'{}'::jsonb)
      - 'source_contamination' - 'pro_sports_guard'
      || jsonb_build_object(
        'pro_sports_utility',true,
        'auto_publish_eligible',false,
        'editorial_lane','SOCIAL_ONLY',
        'exclusion_reason','Pro-sports watch/stream/odds/highlights/shopping utility item is social-only',
        'routing_lock',true,
        'routing_locked_site','keeptxred',
        'routing_locked_section','Sports'
      );
    return new;
  end if;

  if is_allowed then
    new.target_site := 'keeptxred';
    new.target_section := 'Sports';
    if was_guarded and new.internal_slug is null then
      new.viral_scored_at := null;
      new.classification_confidence := null;
      new.viral_score := 0;
      new.ready_for_rewrite := false;
    end if;
    new.viral_signals := coalesce(new.viral_signals,'{}'::jsonb)
      - 'source_contamination' - 'pro_sports_guard' - 'pro_sports_utility' - 'exclusion_reason'
      - 'routing_lock' - 'routing_locked_site' - 'routing_locked_section';
    return new;
  end if;

  new.ready_for_rewrite := false;
  new.viral_score := 0;
  new.classification_confidence := greatest(coalesce(new.classification_confidence,0),1);
  new.viral_scored_at := coalesce(new.viral_scored_at,now());

  if is_law_enforcement_rangers then
    new.target_site := 'keeptxred';
    new.target_section := 'Texas News';
    new.viral_signals := coalesce(new.viral_signals,'{}'::jsonb) || jsonb_build_object(
      'source_contamination',true,
      'pro_sports_guard',true,
      'pro_sports_utility',false,
      'auto_publish_eligible',false,
      'editorial_lane','REVIEW',
      'exclusion_reason','Texas Rangers law-enforcement result arrived through pro-sports discovery',
      'routing_lock',true,
      'routing_locked_site','keeptxred',
      'routing_locked_section','Texas News'
    );
  else
    new.target_site := 'review';
    new.target_section := 'Unclassified';
    new.viral_signals := coalesce(new.viral_signals,'{}'::jsonb) || jsonb_build_object(
      'source_contamination',true,
      'pro_sports_guard',true,
      'pro_sports_utility',false,
      'auto_publish_eligible',false,
      'editorial_lane','REVIEW',
      'exclusion_reason','Texas Pro Sports discovery result lacked an allowlisted pro-team signal',
      'routing_lock',true,
      'routing_locked_site','review',
      'routing_locked_section','Unclassified'
    );
  end if;
  return new;
end;
$function$;

-- Re-evaluate only unlinked source history. Published/native rows are untouched.
update public.texas_news_feed
set title = title
where trend_source = 'Texas Pro Sports — Daily Discovery'
  and internal_slug is null;

comment on function public.guard_texas_pro_sports_discovery_row() is
  'Final pro-sports guard: accepts team news, routes utility/watch/odds/shopping results to social-only, review-locks Rangers law-enforcement ambiguity, and quarantines unrelated noise.';
