-- Prevent generic references to Texans from being mistaken for the Houston Texans.
-- Ambiguous short team aliases now require sports context; full team names remain
-- sufficient on their own. Backfill only unlinked rows that were classified as
-- Sports solely because of the generic word "Texans".

create or replace function public.route_texas_story_to_site()
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
  has_explicit_team boolean;
  has_ambiguous_team_alias boolean;
  has_sports_context boolean;
  is_sports boolean;
  is_hard_news boolean;
  is_material_business boolean;
  is_lifestyle boolean;
begin
  has_explicit_team := haystack ~ '(dallas cowboys|houston texans|texas rangers|houston astros|san antonio spurs|dallas mavericks|houston rockets|dallas stars|houston dynamo|fc dallas)';
  has_ambiguous_team_alias := haystack ~ '\m(cowboys|texans|rangers|astros|spurs|mavericks|rockets|stars|dynamo)\M';
  has_sports_context := haystack ~ '(nfl|nba|mlb|nhl|mls|football|baseball|basketball|hockey|soccer|preseason|training camp|quarterback|touchdown|wide receiver|running back|roster|playoff|championship|trade deadline|contract extension|injured list|coach|athlete|recruiting|nil deal|wnba|college football|high school football)';

  is_sports := has_explicit_team
    or (has_ambiguous_team_alias and has_sports_context)
    or haystack ~ '(wnba|college football|high school football|athlete|championship|playoff|roster|injured list|trade deadline|contract extension|recruiting|nil deal)';

  is_hard_news := haystack ~ '(election|vot(e|er|ing)|ballot|candidate|campaign|runoff|legislature|legislation|house bill|senate bill|governor|attorney general|secretary of state|court|judge|lawsuit|ruling|appeal|police|sheriff|dps|crime|shooting|killed|homicide|fentanyl|public safety|emergency|disaster|hurricane|tornado|flood|wildfire|drought|school district|tea |texas education agency|city council|county commissioners|mayor|property tax|appraisal|tax rate|budget|ercot|grid|utility|regulation|regulatory|border security|operation lone star|public health|hospital|outbreak)';
  is_material_business := haystack ~ '(layoff|bankruptcy|acquisition|acquire|merger|headquarters|corporate campus|factory|manufacturing plant|data center|billion-dollar|million-dollar investment|major investment|jobs created|job gains|job cuts|workforce reduction|employer|earnings|ipo|public funding|tax incentive|economic development|redevelopment|antitrust|regulatory action)';
  is_lifestyle := haystack ~ '(restaurant|barbecue|bbq|coffee shop|coffee chain|bakery|chef|food hall|dining|brewery|taproom|festival|concert|fair|travel|tourism|road trip|attraction|museum|historic site|texas history|on this day|anniversary|state park|national park|nature center|trail|camping|hiking|lake|reservoir|river|fishing|wildlife|alligator|small town|human interest|community feature|best of texas|ranking|opening soon|grand opening)';

  if is_sports then
    new.target_site := 'keeptxred';
    new.target_section := 'Sports';
  elsif is_hard_news then
    new.target_site := 'keeptxred';
    new.target_section := case
      when haystack ~ '(election|vot(e|er|ing)|ballot|candidate|campaign|runoff)' then 'Elections'
      when haystack ~ '(legislature|legislation|house bill|senate bill|governor|attorney general|secretary of state|court|judge|lawsuit|ruling|appeal)' then 'Politics'
      when is_material_business then 'Business'
      else 'Texas News'
    end;
  elsif is_material_business then
    new.target_site := 'keeptxred';
    new.target_section := 'Business';
  elsif is_lifestyle then
    new.target_site := 'texasdefined';
    new.target_section := case
      when haystack ~ '(state park|national park|nature center|trail|camping|hiking|lake|reservoir|river|fishing|wildlife|alligator|travel|tourism|road trip|attraction)' then 'Explore'
      when haystack ~ '(texas history|on this day|anniversary|historic site|museum)' then 'History'
      when haystack ~ '(restaurant|barbecue|bbq|coffee shop|coffee chain|bakery|chef|food hall|dining|brewery|taproom)' then 'Food & Drink'
      else 'Texas Life'
    end;
  else
    new.target_site := 'review';
    new.target_section := 'Unclassified';
  end if;

  return new;
end;
$function$;

with candidates as (
  select id
  from public.texas_news_feed
  where target_site = 'keeptxred'
    and target_section = 'Sports'
    and internal_slug is null
    and lower(coalesce(title,'') || ' ' || coalesce(description,'') || ' ' || coalesce(source,'')) ~ '\mtexans\M'
    and not (
      lower(coalesce(title,'') || ' ' || coalesce(description,'') || ' ' || coalesce(source,''))
      ~ '(houston texans|nfl|nba|mlb|nhl|mls|football|baseball|basketball|hockey|soccer|preseason|training camp|quarterback|touchdown|wide receiver|running back|roster|playoff|championship|trade deadline|contract extension|injured list|coach|athlete|recruiting|nil deal|wnba|college football|high school football)'
    )
    and not (
      lower(coalesce(title,'') || ' ' || coalesce(description,'') || ' ' || coalesce(source,''))
      ~ '\m(cowboys|rangers|astros|spurs|mavericks|rockets|stars|dynamo)\M'
    )
)
update public.texas_news_feed as feed
set title = feed.title
from candidates
where feed.id = candidates.id;

comment on function public.route_texas_story_to_site() is
  'Routes explicit KTR/TD editorial matches; ambiguous short sports-team aliases require sports context so generic Texans/Rangers/Stars references do not become Sports.';
