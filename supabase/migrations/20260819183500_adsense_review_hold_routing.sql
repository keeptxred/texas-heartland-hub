-- AdSense Phase 34: unmatched feed items must not default to KeepTXRed.
-- Explicitly classified hard news, material business, sports, and lifestyle
-- keep their existing destinations. Anything that matches none of those
-- editorial classes is held for review instead of becoming KTR inventory.

CREATE OR REPLACE FUNCTION public.route_texas_story_to_site()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  haystack text := lower(
    coalesce(NEW.title, '') || ' ' ||
    coalesce(NEW.description, '') || ' ' ||
    coalesce(NEW.source, '')
  );
  is_sports boolean;
  is_hard_news boolean;
  is_material_business boolean;
  is_lifestyle boolean;
BEGIN
  is_sports := haystack ~ '(cowboys|texans|rangers|astros|spurs|mavericks|rockets|stars|dynamo|fc dallas|wnba|college football|high school football|athlete|championship|playoff|roster|injured list|trade deadline|contract extension|recruiting|nil deal)';

  is_hard_news := haystack ~ '(election|vot(e|er|ing)|ballot|candidate|campaign|runoff|legislature|legislation|house bill|senate bill|governor|attorney general|secretary of state|court|judge|lawsuit|ruling|appeal|police|sheriff|dps|crime|shooting|killed|homicide|fentanyl|public safety|emergency|disaster|hurricane|tornado|flood|wildfire|drought|school district|tea |texas education agency|city council|county commissioners|mayor|property tax|appraisal|tax rate|budget|ercot|grid|utility|regulation|regulatory|border security|operation lone star|public health|hospital|outbreak)';

  is_material_business := haystack ~ '(layoff|bankruptcy|acquisition|acquire|merger|headquarters|corporate campus|factory|manufacturing plant|data center|billion-dollar|million-dollar investment|major investment|jobs created|job cuts|workforce reduction|employer|earnings|ipo|public funding|tax incentive|economic development|redevelopment|antitrust|regulatory action)';

  is_lifestyle := haystack ~ '(restaurant|barbecue|bbq|coffee shop|coffee chain|bakery|chef|food hall|dining|brewery|taproom|festival|concert|fair|travel|tourism|road trip|attraction|museum|historic site|texas history|on this day|anniversary|state park|national park|nature center|trail|camping|hiking|lake|reservoir|river|fishing|wildlife|alligator|small town|human interest|community feature|best of texas|ranking|opening soon|grand opening)';

  IF is_sports THEN
    NEW.target_site := 'keeptxred';
    NEW.target_section := 'Sports';
  ELSIF is_hard_news THEN
    NEW.target_site := 'keeptxred';
    NEW.target_section := CASE
      WHEN haystack ~ '(election|vot(e|er|ing)|ballot|candidate|campaign|runoff)' THEN 'Elections'
      WHEN haystack ~ '(legislature|legislation|house bill|senate bill|governor|attorney general|secretary of state|court|judge|lawsuit|ruling|appeal)' THEN 'Politics'
      WHEN is_material_business THEN 'Business'
      ELSE 'Texas News'
    END;
  ELSIF is_material_business THEN
    NEW.target_site := 'keeptxred';
    NEW.target_section := 'Business';
  ELSIF is_lifestyle THEN
    NEW.target_site := 'texasdefined';
    NEW.target_section := CASE
      WHEN haystack ~ '(state park|national park|nature center|trail|camping|hiking|lake|reservoir|river|fishing|wildlife|alligator|travel|tourism|road trip|attraction)' THEN 'Explore'
      WHEN haystack ~ '(texas history|on this day|anniversary|historic site|museum)' THEN 'History'
      WHEN haystack ~ '(restaurant|barbecue|bbq|coffee shop|coffee chain|bakery|chef|food hall|dining|brewery|taproom)' THEN 'Food & Drink'
      ELSE 'Texas Life'
    END;
  ELSE
    NEW.target_site := 'review';
    NEW.target_section := 'Unclassified';
  END IF;

  RETURN NEW;
END;
$$;

-- Backfill only currently-unlinked catch-all rows. Already-linked rows remain
-- untouched so this migration cannot orphan or silently change live stories.
WITH fallback AS (
  SELECT id
  FROM public.texas_news_feed
  WHERE target_site = 'keeptxred'
    AND target_section = 'Texas News'
    AND internal_slug IS NULL
    AND NOT (
      lower(coalesce(title,'') || ' ' || coalesce(description,'') || ' ' || coalesce(source,'')) ~ '(cowboys|texans|rangers|astros|spurs|mavericks|rockets|stars|dynamo|fc dallas|wnba|college football|high school football|athlete|championship|playoff|roster|injured list|trade deadline|contract extension|recruiting|nil deal)'
      OR lower(coalesce(title,'') || ' ' || coalesce(description,'') || ' ' || coalesce(source,'')) ~ '(election|vot(e|er|ing)|ballot|candidate|campaign|runoff|legislature|legislation|house bill|senate bill|governor|attorney general|secretary of state|court|judge|lawsuit|ruling|appeal|police|sheriff|dps|crime|shooting|killed|homicide|fentanyl|public safety|emergency|disaster|hurricane|tornado|flood|wildfire|drought|school district|tea |texas education agency|city council|county commissioners|mayor|property tax|appraisal|tax rate|budget|ercot|grid|utility|regulation|regulatory|border security|operation lone star|public health|hospital|outbreak)'
      OR lower(coalesce(title,'') || ' ' || coalesce(description,'') || ' ' || coalesce(source,'')) ~ '(layoff|bankruptcy|acquisition|acquire|merger|headquarters|corporate campus|factory|manufacturing plant|data center|billion-dollar|million-dollar investment|major investment|jobs created|job cuts|workforce reduction|employer|earnings|ipo|public funding|tax incentive|economic development|redevelopment|antitrust|regulatory action)'
      OR lower(coalesce(title,'') || ' ' || coalesce(description,'') || ' ' || coalesce(source,'')) ~ '(restaurant|barbecue|bbq|coffee shop|coffee chain|bakery|chef|food hall|dining|brewery|taproom|festival|concert|fair|travel|tourism|road trip|attraction|museum|historic site|texas history|on this day|anniversary|state park|national park|nature center|trail|camping|hiking|lake|reservoir|river|fishing|wildlife|alligator|small town|human interest|community feature|best of texas|ranking|opening soon|grand opening)'
    )
)
UPDATE public.texas_news_feed AS feed
SET target_site = 'review', target_section = 'Unclassified'
FROM fallback
WHERE feed.id = fallback.id;

COMMENT ON FUNCTION public.route_texas_story_to_site() IS
  'Routes explicit KTR/TD editorial matches and holds unmatched feed items in review instead of defaulting them to KeepTXRed.';
