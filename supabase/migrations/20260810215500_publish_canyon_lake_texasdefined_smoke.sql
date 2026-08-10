-- Ensure the Aug. 10 Canyon Lake story exists in the shared feed from a real
-- public source, then publish it through the guarded TexasDefined queue RPC.

INSERT INTO public.texas_news_feed (title, source, link, description, pub_date)
VALUES (
  'Cherished Texas lake retains 100% capacity for the first time in nearly 5 years',
  'MySA',
  'https://www.mysanantonio.com/lifestyle/outdoors/article/canyon-lake-water-levels-22374263.php',
  'Canyon Lake is at full conservation capacity after a rapid July refill. The reservoir was about 61.1% full on July 7 and gained roughly 157,000 acre-feet over the following month.',
  '2026-08-09T12:00:00Z'::timestamptz
)
ON CONFLICT (link) DO UPDATE SET
  title = EXCLUDED.title,
  source = EXCLUDED.source,
  description = EXCLUDED.description,
  pub_date = EXCLUDED.pub_date;

DO $$
DECLARE
  v_feed_id bigint;
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.texasdefined_articles
    WHERE slug = '2026-08-10-canyon-lake-full-capacity-recovery'
      AND status = 'published'
  ) THEN
    RETURN;
  END IF;

  SELECT id INTO v_feed_id
  FROM public.texasdefined_ready_queue
  WHERE link = 'https://www.mysanantonio.com/lifestyle/outdoors/article/canyon-lake-water-levels-22374263.php'
  LIMIT 1;

  IF v_feed_id IS NULL THEN
    RAISE EXCEPTION 'Canyon Lake source item was not routed to TexasDefined';
  END IF;

  PERFORM public.publish_texasdefined_queue_item(
    v_feed_id,
    '2026-08-10-canyon-lake-full-capacity-recovery',
    'Canyon Lake Reaches Full Capacity After a Dramatic Summer Refill',
    'After starting July at roughly 61% full, Canyon Lake has held near full capacity since late July following storms that added about 157,000 acre-feet of water.',
    'lakes-rivers',
    'hill-country',
    'https://texasdefined.com/images/explore/lakes-rivers/guadalupe-river-state-park.jpg',
    'Clear Hill Country water along the Guadalupe River watershed in Central Texas',
    'a-hollis',
    ARRAY['Canyon Lake','Hill Country','Texas lakes','reservoirs','Guadalupe River'],
    jsonb_build_array(
      jsonb_build_object('type','paragraph','text',$p$Canyon Lake has reached a milestone that looked remote at the beginning of July. The Hill Country reservoir has held near full conservation capacity since late July, its first sustained stretch at that level in nearly five years. The change followed heavy mid-summer rainfall across Central Texas and represents one of the sharpest reservoir recoveries of the season.$p$),
      jsonb_build_object('type','paragraph','text',$p$On July 7, Canyon Lake was reported at about 61.1% full. By early August it was holding roughly 388,000 acre-feet of water, with conservation storage full. Over about a month the reservoir gained approximately 157,000 acre-feet. That is a dramatic reversal for a lake whose lower shoreline had become a familiar part of the landscape during the recent dry years.$p$),
      jsonb_build_object('type','heading','text','Why the refill matters'),
      jsonb_build_object('type','paragraph','text',$p$Reservoir levels rise and fall with rainfall, watershed inflows, releases and water demand, but this rebound stands out for its speed. A lake that entered July well below full crossed back into full conservation storage in a matter of weeks. For residents and visitors who have watched the lake retreat during drought, the refill changes both the visual character of the reservoir and the baseline from which water managers enter the rest of summer.$p$),
      jsonb_build_object('type','paragraph','text',$p$Full capacity does not mean every water concern in Central Texas has disappeared. Drought conditions can vary sharply from one watershed to another, and a full Canyon Lake does not guarantee identical conditions on nearby rivers or other reservoirs. Storage can also change as inflows settle and managed releases continue. Still, starting from a full conservation pool provides a substantially stronger position than the lake had only weeks earlier.$p$),
      jsonb_build_object('type','heading','text','A different lake for late-summer visitors'),
      jsonb_build_object('type','paragraph','text',$p$For people planning a trip, the refill means familiar shorelines may look very different from visits made during the low-water years. Coves, ramps and edges of the reservoir that had spent long periods exposed may now be back under water. That can change views, paddling routes and the feel of recreation areas around the lake. Visitors should still check current park, ramp and release conditions before heading out because access and downstream conditions can change independently of the headline storage percentage.$p$),
      jsonb_build_object('type','paragraph','text',$p$The reservoir’s recovery is also a reminder of how quickly Texas water conditions can move in either direction. Long dry stretches can lower lakes gradually, while concentrated rainfall over the right part of a watershed can produce a rapid refill. Canyon Lake’s July change is an unusually clear example: roughly 61% full at the start of the month, then full conservation storage after the storms.$p$),
      jsonb_build_object('type','heading','text','The numbers behind the turnaround'),
      jsonb_build_object('type','paragraph','text',$p$By August 7, published reservoir data showed Canyon Lake at 100% of conservation capacity, with the water surface a little above the normal conservation-pool elevation. The reservoir remained well below its flood-pool ceiling, leaving flood-control space even while conservation storage was full. The approximately 157,000 acre-feet gained since early July captures the scale of the turnaround better than the percentage alone.$p$),
      jsonb_build_object('type','paragraph','text',$p$For Texas Defined, the story belongs with the state’s lakes and rivers rather than the political news cycle: it is a practical snapshot of how weather reshaped a major Hill Country destination in a single month. The lake will continue to move with rainfall, releases and demand, but for now Canyon Lake has something it has not enjoyed for years — a sustained return to full conservation capacity.$p$)
    ),
    ARRAY['hill-country-water'],
    ARRAY['canyon-lake']
  );
END;
$$;
