-- Expand target-site routing vocabulary for the broader Texas discovery source
-- mix. Preserve the review hold for unmatched items and all publication gates.
-- Backfill only recent, unlinked review rows; published/linked inventory is not
-- reassigned.

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
  has_sports_context := haystack ~ '(nfl|nba|mlb|nhl|mls|wnba|football|baseball|basketball|hockey|soccer|golf|volleyball|softball|swimming|diving|track and field|cross country|tennis|preseason|season opener|training camp|quarterback|touchdown|wide receiver|running back|roster|playoff|championship|heisman|coach|athlete|athletics|recruiting|red raiders|longhorns|aggies|horned frogs)';

  is_sports := has_explicit_team
    or (has_ambiguous_team_alias and has_sports_context)
    or haystack ~ '(nfl|nba|mlb|nhl|mls|wnba|college football|high school football|\mfootball\M|\mbaseball\M|\mbasketball\M|\mhockey\M|\msoccer\M|\mgolf\M|\mvolleyball\M|\msoftball\M|swimming and diving|track and field|cross country|\mtennis\M|heisman|season opener|athletics|athlete|championship|playoff|roster|injured list|trade deadline|contract extension|recruiting|nil deal)';

  is_hard_news := haystack ~ '(election|vot(e|er|ing)|ballot|candidate|campaign|runoff|legislature|legislation|house bill|senate bill|governor|\mgov\.?\M|attorney general|ken paxton|paxton|james talarico|talarico|secretary of state|court|judge|lawsuit|ruling|appeal|police|sheriff|dps|crime|shooting|killed|homicide|fentanyl|public safety|emergency|disaster|hurricane|tornado|flood|wildfire|\mfire\M|fire chief|drought|school district|\misd\M|school board|superintendent|tea |texas education agency|city council|county commissioners|mayor|zoning|annexation|transportation commission|speed limit|drainage improvement|water conservation|property tax|appraisal|tax rate|budget|ercot|grid|utility|regulation|regulatory|border security|operation lone star|public health|hospital|outbreak|deed fraud|extradition|federal authorities)';

  is_lifestyle := haystack ~ '(restaurant|barbecue|bbq|coffee shop|coffee chain|bakery|chef|food hall|dining|brewery|taproom|festival|concert|fair|music venue|entertainment venue|arcade|collectibles|action park|sportsplex|theme park|water park|zoo|aquarium|travel|tourism|road trip|attraction|museum|historic site|texas history|on this day|anniversary|state park|national park|nature center|public park|park trail|undeveloped parks|trail|camping|hiking|lake|reservoir|river|fishing|wildlife|alligator|bat experience|small town|human interest|community feature|best of texas|ranking|opening soon|grand opening|new location|retail opening)';

  is_material_business := haystack ~ '(layoff|bankruptcy|acquisition|acquire|merger|headquarters|corporate campus|factory|manufacturing plant|data center|billion-dollar|million-dollar investment|major investment|\binvestment\b|jobs created|job gains|job cuts|workforce reduction|workforce grant|employer|earnings|ipo|public funding|tax incentive|economic development|redevelopment|antitrust|regulatory action|corporate expansion|plans expansion|\bexpands?\b|\blease[sd]?\b|facility expansion)'
    and not is_lifestyle;

  if is_sports then
    new.target_site := 'keeptxred';
    new.target_section := 'Sports';
  elsif is_hard_news then
    new.target_site := 'keeptxred';
    new.target_section := case
      when haystack ~ '(election|vot(e|er|ing)|ballot|candidate|campaign|runoff)' then 'Elections'
      when haystack ~ '(legislature|legislation|house bill|senate bill|governor|\mgov\.?\M|attorney general|ken paxton|paxton|james talarico|talarico|secretary of state|court|judge|lawsuit|ruling|appeal)' then 'Politics'
      when is_material_business then 'Business'
      else 'Texas News'
    end;
  elsif is_material_business then
    new.target_site := 'keeptxred';
    new.target_section := 'Business';
  elsif is_lifestyle then
    new.target_site := 'texasdefined';
    new.target_section := case
      when haystack ~ '(state park|national park|nature center|public park|park trail|undeveloped parks|trail|camping|hiking|lake|reservoir|river|fishing|wildlife|alligator|zoo|aquarium|bat experience|travel|tourism|road trip|attraction)' then 'Explore'
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

-- Re-run routing only for recent, unlinked review inventory. The trigger calls
-- the function above; unmatched rows remain in review. Utility-page rows that
-- were explicitly de-queued are excluded.
update public.texas_news_feed
set title = title
where target_site = 'review'
  and internal_slug is null
  and created_at >= now() - interval '14 days'
  and coalesce((viral_signals->>'low_value_utility_page')::boolean, false) is not true;

comment on function public.route_texas_story_to_site() is
  'Routes explicit KTR hard-news/business/sports and TexasDefined lifestyle matches; expanded for statewide primary/regional discovery while unmatched items remain held for review.';
