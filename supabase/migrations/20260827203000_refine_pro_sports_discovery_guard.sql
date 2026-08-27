-- Refine the pro-sports discovery quarantine guard. Google News can match an
-- exact team query but shorten the rendered headline to an alias (Texans,
-- Astros, Cowboys, Rangers). Accept those aliases when sports context is
-- present, while explicitly rejecting Texas Rangers law-enforcement results.

create or replace function public.guard_texas_pro_sports_discovery_row()
returns trigger
language plpgsql
set search_path = public
as $function$
declare
  haystack text := lower(
    coalesce(new.title, '') || ' ' ||
    coalesce(new.description, '') || ' ' ||
    coalesce(new.source, '')
  );
  has_team_name boolean;
  has_team_alias boolean;
  has_sports_context boolean;
  is_law_enforcement_rangers boolean;
  is_allowed boolean;
begin
  if new.trend_source <> 'Texas Pro Sports — Daily Discovery' then
    return new;
  end if;

  has_team_name := haystack ~ '(dallas mavericks|dallas cowboys|houston astros|houston texans|san antonio spurs)';
  has_team_alias := haystack ~ '\m(mavericks|cowboys|astros|texans|spurs|rangers)\M';
  has_sports_context := haystack ~ '(nfl|nba|mlb|baseball|football|basketball|game|games|preseason|postseason|playoff|playoffs|world series|super bowl|player|players|roster|depth chart|trade|quarterback|\mqb\M|running back|\mrb\M|linebacker|coach|pitcher|bullpen|batting|inning|innings|odds|spread|stream|watch|opponent|training camp|\mcamp\M|schedule|schedules|insider|athletic|sports|arena|stadium|final practice|season)';
  is_law_enforcement_rangers := haystack ~ '(texas rangers|\mrangers\M)' and haystack ~ '(\mdps\M|department of public safety|law enforcement|trooper|troopers|criminal investigation|public safety commission|rangers leadership)';

  is_allowed := (has_team_name or (has_team_alias and has_sports_context)) and not is_law_enforcement_rangers;

  if not is_allowed then
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
      'exclusion_reason', 'Texas Pro Sports discovery result lacked allowlisted team/sports context or matched Texas Rangers law enforcement'
    );
  else
    -- Undo only this guard's prior false-positive quarantine on legitimate,
    -- unlinked team rows. viral_score is NOT NULL, so keep it at zero while
    -- clearing viral_scored_at to return the row to the safe scorer queue.
    if coalesce((new.viral_signals->>'source_contamination')::boolean, false) is true
       and new.internal_slug is null
    then
      new.viral_scored_at := null;
      new.classification_confidence := null;
      new.viral_score := 0;
      new.ready_for_rewrite := false;
      new.viral_signals := (coalesce(new.viral_signals, '{}'::jsonb)
        - 'source_contamination'
        - 'auto_publish_eligible'
        - 'editorial_lane'
        - 'exclusion_reason');
    end if;
  end if;

  return new;
end;
$function$;

-- Re-evaluate all unlinked rows from this discovery source under the refined
-- rule. Linked/published content remains untouched.
update public.texas_news_feed
set title = title
where trend_source = 'Texas Pro Sports — Daily Discovery'
  and internal_slug is null;

comment on function public.guard_texas_pro_sports_discovery_row() is
  'Quarantines unrelated Texas Pro Sports discovery results; accepts sports-context team aliases and rejects Texas Rangers law-enforcement ambiguity.';
