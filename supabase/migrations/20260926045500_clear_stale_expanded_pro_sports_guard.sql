-- Clear stale expanded pro-sports quarantine metadata when a row no longer belongs to that discovery lane.
CREATE OR REPLACE FUNCTION public.guard_expanded_texas_pro_sports_discovery_row()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
declare
  haystack text := lower(coalesce(new.title,'') || ' ' || coalesce(new.description,'') || ' ' || coalesce(new.source,''));
  title_text text := lower(coalesce(new.title,''));
  is_basketball_lane boolean := new.trend_source = 'Texas Pro Basketball — Rockets and Wings Discovery';
  is_soccer_lane boolean := new.trend_source = 'Texas Pro Soccer — Daily Discovery';
  has_team_name boolean := false;
  has_team_alias boolean := false;
  has_sports_context boolean := false;
  is_utility_page boolean;
  is_allowed boolean;
  was_guarded boolean := coalesce((new.viral_signals->>'expanded_pro_sports_guard')::boolean,false);
begin
  if not is_basketball_lane and not is_soccer_lane then
    if was_guarded and new.internal_slug is null and new.texasdefined_slug is null then
      new.viral_signals := coalesce(new.viral_signals,'{}'::jsonb)
        - 'source_contamination' - 'expanded_pro_sports_guard' - 'auto_publish_eligible'
        - 'editorial_lane' - 'exclusion_reason' - 'routing_lock'
        - 'routing_locked_site' - 'routing_locked_section';
      new.viral_scored_at := null;
      new.classification_confidence := null;
      new.viral_score := 0;
      new.ready_for_rewrite := false;
    end if;
    return new;
  end if;

  if is_basketball_lane then
    has_team_name := haystack ~ '(houston rockets|dallas wings)';
    has_team_alias := haystack ~ '\m(rockets|wings)\M';
    has_sports_context := haystack ~ '(\mnba\M|\mwnba\M|basketball|game|games|playoff|playoffs|player|players|roster|draft|trade|guard|forward|center|big man|coach|arena|court|season|standings|three-pointer|three point|tipoff|sign|signed|waive|waived|contract|two-way|training camp|stretch five|championship|jersey|points|injury|offseason)';
  else
    has_team_name := haystack ~ '(austin fc|fc dallas|houston dynamo fc|houston dash)';
    has_team_alias := haystack ~ '(\mdynamo\M|\mdash\M)';
    has_sports_context := haystack ~ '(\mmls\M|\mnwsl\M|soccer|football club|match|matches|goal|goals|striker|midfielder|defender|keeper|goalkeeper|pitch|season|standings|playoff|playoffs|cup)';
  end if;

  is_utility_page := title_text ~ '(how to watch|live stream|where to watch|tv channel|\modds\M|\mspread\M|prediction|\mpicks\M|betting odds|best bets|ways to attend|\mtickets?\M)';
  is_allowed := (has_team_name or (has_team_alias and has_sports_context)) and not is_utility_page;

  if is_allowed then
    new.target_site := 'keeptxred';
    new.target_section := 'Sports';
    if was_guarded and new.internal_slug is null and new.texasdefined_slug is null then
      new.viral_scored_at:=null; new.classification_confidence:=null; new.viral_score:=0; new.ready_for_rewrite:=false;
    end if;
    new.viral_signals := coalesce(new.viral_signals,'{}'::jsonb)
      - 'source_contamination' - 'expanded_pro_sports_guard' - 'auto_publish_eligible'
      - 'editorial_lane' - 'exclusion_reason' - 'routing_lock'
      - 'routing_locked_site' - 'routing_locked_section';
    return new;
  end if;

  new.target_site:='review'; new.target_section:='Unclassified'; new.ready_for_rewrite:=false;
  new.viral_score:=0; new.classification_confidence:=greatest(coalesce(new.classification_confidence,0),1);
  new.viral_scored_at:=coalesce(new.viral_scored_at,now());
  new.viral_signals := coalesce(new.viral_signals,'{}'::jsonb) || jsonb_build_object(
    'source_contamination',true,'expanded_pro_sports_guard',true,'auto_publish_eligible',false,
    'editorial_lane','REVIEW','exclusion_reason',
    case when is_utility_page then 'Expanded Texas pro-sports utility/service page is not an editorial article'
         else 'Expanded Texas pro-sports discovery result lacked the lane allowlisted team signal' end,
    'routing_lock',true,'routing_locked_site','review','routing_locked_section','Unclassified');
  return new;
end;
$function$;

-- Re-evaluate only stale guarded, unpublished rows outside the two owned discovery lanes.
UPDATE public.texas_news_feed
SET description = description
WHERE coalesce((viral_signals->>'expanded_pro_sports_guard')::boolean,false)
  AND coalesce(trend_source,'') NOT IN (
    'Texas Pro Basketball — Rockets and Wings Discovery',
    'Texas Pro Soccer — Daily Discovery'
  )
  AND internal_slug IS NULL
  AND texasdefined_slug IS NULL;

-- Run this lane-specific guard after generic routing and TexasDefined sports ownership.
DROP TRIGGER IF EXISTS zzzzzzzz_guard_expanded_texas_pro_sports_discovery_row ON public.texas_news_feed;
DROP TRIGGER IF EXISTS zzzzzzzzzzzzz_guard_expanded_texas_pro_sports_discovery_row ON public.texas_news_feed;
CREATE TRIGGER zzzzzzzzzzzzz_guard_expanded_texas_pro_sports_discovery_row
BEFORE INSERT OR UPDATE OF title, description, source, trend_source, viral_signals
ON public.texas_news_feed
FOR EACH ROW EXECUTE FUNCTION public.guard_expanded_texas_pro_sports_discovery_row();

-- Re-run the bounded cleanup now that the lane guard executes last.
UPDATE public.texas_news_feed
SET title = title
WHERE coalesce((viral_signals->>'expanded_pro_sports_guard')::boolean,false)
  AND coalesce(trend_source,'') NOT IN (
    'Texas Pro Basketball — Rockets and Wings Discovery',
    'Texas Pro Soccer — Daily Discovery'
  )
  AND internal_slug IS NULL
  AND texasdefined_slug IS NULL;
