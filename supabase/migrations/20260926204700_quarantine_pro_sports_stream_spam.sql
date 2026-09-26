-- Quarantine a confirmed spam source leaking obfuscated live-stream utility pages
-- into the Texas Pro Sports discovery lane. This exact source/lane combination
-- has produced only fake WATCHLIVE/STREAM/TV-channel titles in the current backlog.

create or replace function public.guard_texas_pro_sports_discovery_row()
returns trigger
language plpgsql
set search_path = public
as $function$
declare
  haystack text := lower(coalesce(new.title,'') || ' ' || coalesce(new.description,'') || ' ' || coalesce(new.source,''));
  title_text text := lower(coalesce(new.title,''));
  source_text text := lower(coalesce(new.source,''));
  has_full_team_name boolean; has_unambiguous_alias boolean; has_rangers_alias boolean;
  has_rangers_sports_context boolean; is_law_enforcement_rangers boolean; is_utility_page boolean; is_confirmed_spam_source boolean; is_allowed boolean;
begin
  if new.trend_source is distinct from 'Texas Pro Sports — Daily Discovery' then return new; end if;
  if new.internal_slug is not null or new.texasdefined_slug is not null then return new; end if;
  has_full_team_name := haystack ~ '(dallas mavericks|dallas cowboys|houston astros|houston texans|san antonio spurs)';
  has_unambiguous_alias := haystack ~ E'\\m(mavs|mavericks|cowboys|astros|texans|spurs)\\M';
  has_rangers_alias := haystack ~ ('texas rangers|' || E'\\mrangers\\M');
  has_rangers_sports_context := haystack ~ '(mlb|baseball|al west|american league|world series|wild card|playoff|postseason|game|games|home finale|series|mound|pitcher|pitching|bullpen|lineup|batting|inning|innings|homer|home run|degrom|eovaldi|jung|schumaker|globe life|season|twins)';
  is_law_enforcement_rangers := has_rangers_alias and haystack ~ (E'\\mdps\\M' || '|department of public safety|law enforcement|trooper|troopers|criminal investigation|public safety commission|rangers leadership');
  is_confirmed_spam_source := source_text = 'air and space museum';
  is_utility_page := is_confirmed_spam_source or title_text ~ ('how to watch|watchlive|live/free|live stream|live coverage|stream]here|way to watch|tv channel|' || E'\\modds\\M' || '|' || E'\\mspread\\M' || '|prediction|' || E'\\mpicks\\M' || '|betting odds|best bets');
  is_allowed := (has_full_team_name or has_unambiguous_alias or (has_rangers_alias and has_rangers_sports_context)) and not is_law_enforcement_rangers and not is_utility_page;
  if is_allowed then
    new.target_site := 'texasdefined'; new.target_section := 'Sports'; new.ready_for_rewrite := false;
    if coalesce((new.viral_signals->>'source_contamination')::boolean,false) is true then
      new.viral_scored_at := null; new.classification_confidence := null; new.viral_score := 0;
      new.viral_signals := coalesce(new.viral_signals,'{}'::jsonb) - 'source_contamination' - 'auto_publish_eligible' - 'editorial_lane' - 'exclusion_reason' - 'routing_lock' - 'routing_locked_site' - 'routing_locked_section';
    end if;
    new.viral_signals := coalesce(new.viral_signals,'{}'::jsonb) || jsonb_build_object('site_ownership','texasdefined','ownership_reason','Routine Texas sports coverage belongs on TexasDefined');
  else
    new.target_site := 'review'; new.target_section := 'Unclassified'; new.ready_for_rewrite := false; new.viral_score := 0;
    new.classification_confidence := greatest(coalesce(new.classification_confidence,0),1); new.viral_scored_at := coalesce(new.viral_scored_at,now());
    new.viral_signals := coalesce(new.viral_signals,'{}'::jsonb) || jsonb_build_object('source_contamination',true,'auto_publish_eligible',false,'editorial_lane','REVIEW','exclusion_reason',case when is_confirmed_spam_source then 'Confirmed spam source in Texas Pro Sports discovery lane' when is_utility_page then 'Texas Pro Sports utility/service page is not an editorial article' when is_law_enforcement_rangers then 'Texas Rangers law-enforcement result is not Texas Rangers baseball coverage' else 'Texas Pro Sports discovery result lacked an allowlisted team signal' end,'routing_lock',true,'routing_locked_site','review','routing_locked_section','Unclassified');
  end if;
  return new;
end;$function$;

update public.texas_news_feed set title=title
where trend_source='Texas Pro Sports — Daily Discovery'
  and internal_slug is null and texasdefined_slug is null
  and (lower(coalesce(source,''))='air and space museum' or lower(coalesce(title,'')) ~ '(watchlive|live/free|live stream|live coverage|stream]here|way to watch|tv channel)');
