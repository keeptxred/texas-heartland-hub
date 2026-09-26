-- Treat the uniquely identifying "Mavs" alias as Dallas Mavericks coverage while preserving
-- the stricter sports-context requirement for ambiguous aliases such as Rangers and Texans.
create or replace function public.guard_texas_pro_sports_discovery_row()
returns trigger
language plpgsql
set search_path = public
as $function$
declare
  haystack text := lower(coalesce(new.title, '') || ' ' || coalesce(new.description, '') || ' ' || coalesce(new.source, ''));
  title_text text := lower(coalesce(new.title, ''));
  has_team_name boolean;
  has_unique_mavs_alias boolean;
  has_team_alias boolean;
  has_sports_context boolean;
  is_law_enforcement_rangers boolean;
  is_utility_page boolean;
  is_allowed boolean;
begin
  if new.trend_source is distinct from 'Texas Pro Sports — Daily Discovery' then return new; end if;

  has_team_name := haystack ~ '(dallas mavericks|dallas cowboys|houston astros|houston texans|san antonio spurs)';
  has_unique_mavs_alias := haystack ~ '\\m(mavs|mavericks)\\M';
  has_team_alias := haystack ~ '\\m(cowboys|astros|texans|spurs|rangers)\\M';
  has_sports_context := haystack ~ '(nfl|nba|mlb|baseball|football|basketball|game|games|preseason|postseason|playoff|playoffs|world series|series preview|\\mseries\\M|super bowl|player|players|roster|depth chart|trade|quarterback|\\mqb\\M|running back|\\mrb\\M|linebacker|coach|pitcher|pitching|bullpen|batting|inning|innings|homer|homers|home run|home runs|odds|spread|stream|watch|opponent|training camp|\\mcamp\\M|schedule|schedules|insider|athletic|sports|arena|stadium|final practice|season)';
  is_law_enforcement_rangers := haystack ~ '(texas rangers|\\mrangers\\M)' and haystack ~ '(\\mdps\\M|department of public safety|law enforcement|trooper|troopers|criminal investigation|public safety commission|rangers leadership)';
  is_utility_page := title_text ~ '(how to watch|live stream|where to watch|tv channel|\\modds\\M|\\mspread\\M|prediction|\\mpicks\\M|betting odds|best bets)';
  is_allowed := (has_team_name or has_unique_mavs_alias or (has_team_alias and has_sports_context)) and not is_law_enforcement_rangers and not is_utility_page;

  if is_allowed then
    new.target_site := 'texasdefined';
    new.target_section := 'Sports';
    new.viral_signals := (coalesce(new.viral_signals, '{}'::jsonb)
      - 'source_contamination' - 'auto_publish_eligible' - 'editorial_lane' - 'exclusion_reason')
      || jsonb_build_object('site_ownership','texasdefined','ownership_reason','Routine Texas sports coverage belongs on TexasDefined');
  else
    new.target_site := 'review';
    new.target_section := 'Unclassified';
    new.ready_for_rewrite := false;
    new.viral_score := 0;
    new.classification_confidence := 1;
    new.viral_scored_at := coalesce(new.viral_scored_at, now());
    new.viral_signals := coalesce(new.viral_signals, '{}'::jsonb) || jsonb_build_object(
      'source_contamination',true,'auto_publish_eligible',false,'editorial_lane','REVIEW',
      'exclusion_reason',case
        when is_utility_page then 'Texas Pro Sports utility/service page is not an editorial article'
        when is_law_enforcement_rangers then 'Texas Rangers law-enforcement result is not Texas Rangers baseball coverage'
        else 'Texas Pro Sports discovery result lacked allowlisted team/sports context'
      end);
  end if;
  return new;
end;
$function$;

update public.texas_news_feed set title=title
where trend_source='Texas Pro Sports — Daily Discovery'
  and internal_slug is null and texasdefined_slug is null;

comment on function public.guard_texas_pro_sports_discovery_row() is
'Routes valid routine Texas pro sports to TexasDefined Sports; Mavs/Mavericks is accepted as a unique alias while ambiguous aliases still require sports context.';
