-- The pro-sports source guard must be strictly source-scoped. SQL `<>` returns
-- NULL when trend_source is NULL, which previously allowed unrelated rows to
-- fall through into the pro-sports quarantine. Use IS DISTINCT FROM and repair
-- only unlinked rows carrying this guard's own false-contamination marker.

create or replace function public.guard_texas_pro_sports_discovery_row()
returns trigger
language plpgsql
set search_path = public
as $function$
declare
  haystack text := lower(coalesce(new.title, '') || ' ' || coalesce(new.description, '') || ' ' || coalesce(new.source, ''));
  title_text text := lower(coalesce(new.title, ''));
  has_team_name boolean;
  has_team_alias boolean;
  has_sports_context boolean;
  is_law_enforcement_rangers boolean;
  is_utility_page boolean;
  is_allowed boolean;
begin
  if new.trend_source is distinct from 'Texas Pro Sports — Daily Discovery' then
    return new;
  end if;

  has_team_name := haystack ~ '(dallas mavericks|dallas cowboys|houston astros|houston texans|san antonio spurs)';
  has_team_alias := haystack ~ '\m(mavericks|cowboys|astros|texans|spurs|rangers)\M';
  has_sports_context := haystack ~ '(nfl|nba|mlb|baseball|football|basketball|game|games|preseason|postseason|playoff|playoffs|world series|super bowl|player|players|roster|depth chart|trade|quarterback|\mqb\M|running back|\mrb\M|linebacker|coach|pitcher|bullpen|batting|inning|innings|odds|spread|stream|watch|opponent|training camp|\mcamp\M|schedule|schedules|insider|athletic|sports|arena|stadium|final practice|season)';
  is_law_enforcement_rangers := haystack ~ '(texas rangers|\mrangers\M)' and haystack ~ '(\mdps\M|department of public safety|law enforcement|trooper|troopers|criminal investigation|public safety commission|rangers leadership)';
  is_utility_page := title_text ~ '(how to watch|live stream|where to watch|tv channel|\modds\M|\mspread\M|prediction|\mpicks\M|betting odds|best bets)';
  is_allowed := (has_team_name or (has_team_alias and has_sports_context)) and not is_law_enforcement_rangers and not is_utility_page;

  if is_allowed then
    new.target_site := 'keeptxred';
    new.target_section := 'Sports';
    if coalesce((new.viral_signals->>'source_contamination')::boolean, false) is true and new.internal_slug is null then
      new.viral_scored_at := null;
      new.classification_confidence := null;
      new.viral_score := 0;
      new.ready_for_rewrite := false;
      new.viral_signals := coalesce(new.viral_signals, '{}'::jsonb)
        - 'source_contamination'
        - 'auto_publish_eligible'
        - 'editorial_lane'
        - 'exclusion_reason';
    end if;
  else
    new.target_site := 'review';
    new.target_section := 'Unclassified';
    new.ready_for_rewrite := false;
    new.viral_score := 0;
    new.classification_confidence := 1;
    new.viral_scored_at := coalesce(new.viral_scored_at, now());
    new.viral_signals := coalesce(new.viral_signals, '{}'::jsonb) || jsonb_build_object(
      'source_contamination', true,
      'auto_publish_eligible', false,
      'editorial_lane', 'REVIEW',
      'exclusion_reason', case
        when is_utility_page then 'Texas Pro Sports utility/service page is not an editorial article'
        when is_law_enforcement_rangers then 'Texas Rangers law-enforcement result is not Texas Rangers baseball coverage'
        else 'Texas Pro Sports discovery result lacked allowlisted team/sports context'
      end
    );
  end if;
  return new;
end;
$function$;

-- Remove only false markers created by this guard on rows that did not come
-- from the pro-sports discovery source. No linked/published row is touched.
update public.texas_news_feed
set
  viral_scored_at = null,
  classification_confidence = null,
  viral_score = 0,
  ready_for_rewrite = false,
  viral_signals = coalesce(viral_signals, '{}'::jsonb)
    - 'source_contamination'
    - 'auto_publish_eligible'
    - 'editorial_lane'
    - 'exclusion_reason'
where trend_source is distinct from 'Texas Pro Sports — Daily Discovery'
  and internal_slug is null
  and texasdefined_slug is null
  and coalesce((viral_signals->>'source_contamination')::boolean, false) = true
  and coalesce(viral_signals->>'exclusion_reason','') like 'Texas Pro Sports%';

comment on function public.guard_texas_pro_sports_discovery_row() is
  'Strictly source-scoped pro-sports guard using NULL-safe trend_source comparison; quarantines unrelated, law-enforcement Rangers, and utility pages only for Texas Pro Sports discovery.';
