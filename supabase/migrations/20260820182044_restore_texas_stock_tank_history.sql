with article_identity as (
  select
    $slug$live-2026-06-29-the-history-behind-the-texas-stock-tank-name-bxkvg7$slug$::text slug
), canonical_identity as (
  select slug, '/news/' || slug internal_url
  from article_identity
)
insert into public.daily_articles (
  slug, category, title, dek, body, author, source_name, source_url,
  image_url, featured_image_url, image_alt_text, image_validation_note,
  published_at, kind, body_json, keywords, score, is_breaking,
  internal_url, is_ingested, seo_headline, discover_category, seo_keywords,
  internal_links, texas_impact_summary, affected_regions,
  content_quality_score, quality_flags, gsc_impressions, gsc_clicks
)
select
  canonical_identity.slug,
  'Texas History'::text category,
  'Why Texans Call a Ranch Pond a Stock Tank'::text title,
  'Texas ranch language preserves a practical distinction: a stock tank may be a metal trough, but across the state the same name commonly means a man-made pond built for livestock.'::text dek,
  null::text body,
  'Keep TX Red Newsroom'::text author,
  'Texas A&M AgriLife'::text source_name,
  'https://mytexas.ag.tamu.edu/publications/a-pond-to-call-my-own-understanding-water-law-in-texas/'::text source_url,
  'https://texashistory.unt.edu/ark:/67531/metapth40125/m1/1/med_res/'::text image_url,
  'https://texashistory.unt.edu/ark:/67531/metapth40125/m1/1/med_res/'::text featured_image_url,
  'Historic black-and-white photograph of cattle gathered around a watering trough in Presidio County, Texas'::text image_alt_text,
  'Archival photograph hosted by The Portal to Texas History; creator unknown; Marfa Public Library collection, ARK 67531/metapth40125.'::text image_validation_note,
  '2026-06-29T12:00:00Z'::timestamptz published_at,
  'evergreen'::text kind,
  jsonb_build_object(
    'updated', '2026-08-20',
    'intro', jsonb_build_array(
      'In much of Texas, the word tank does not necessarily mean a metal container. Ranchers, landowners and rural families often use stock tank for a dug or dammed pond that catches runoff and supplies water to cattle, horses, wildlife and sometimes fish. The usage can confuse newcomers because farm stores also sell galvanized stock tanks—the familiar round or oval troughs that have recently become backyard pools. Both meanings come from the same practical purpose: holding water for livestock.',
      'The Texas phrase is less a quirky nickname than a piece of working ranch vocabulary. Water availability shaped where cattle could graze, how long a pasture could be used and whether a ranch could withstand dry weather. A pond built primarily to water stock naturally became a stock tank, and everyday speech shortened that to tank.'
    ),
    'sections', jsonb_build_array(
      jsonb_build_object(
        'heading', 'Why a pond became a tank',
        'paragraphs', jsonb_build_array(
          'Historically, tank described a place or structure that stored water. On a ranch, the important distinction was function rather than construction material. A metal or concrete trough filled from a well was a stock tank, but so was an excavated basin that captured rain and runoff for livestock. Over time, the pond meaning became especially durable in Texas and other parts of the Southwest.',
          'Texas A&M AgriLife notes that Texas has more than one million ponds and small farm lakes commonly called tanks. Many were first constructed for ranching. That scale helps explain why the term remains familiar even as former ranchland becomes residential property and some tanks are managed primarily for fishing, wildlife or scenery.'
        )
      ),
      jsonb_build_object(
        'heading', 'What stock tanks did for Texas ranches',
        'paragraphs', jsonb_build_array(
          'A dependable livestock-water source lets ranchers distribute animals across a property instead of concentrating every herd near a creek or well. Stock tanks also capture rainfall that might otherwise leave the property as runoff. Their usefulness depends on soil, watershed size, evaporation, maintenance and drought conditions, so a pond that looks permanent during a wet cycle can become unreliable during a long Texas summer.',
          'The historical record includes both ponds and engineered containers. The Portal to Texas History preserves a 1902 patent from Amarillo inventor Wayne C. Wright for an improved livestock water tank connecting an elevated reservoir with a ground-level trough. Archival photographs from Presidio County likewise show cattle gathered around constructed watering facilities. Together, those records illustrate why tank became a broad ranch term rather than the name of one specific design.'
        )
      ),
      jsonb_build_object(
        'heading', 'The stock-tank exemption in Texas water law',
        'paragraphs', jsonb_build_array(
          'The phrase also appears in modern discussions of Texas water law. Texas A&M AgriLife explains that Water Code Section 11.142 allows certain dams, ponds or reservoirs holding no more than 200 acre-feet to be built without a state surface-water permit when they are used for domestic and livestock purposes or fish and wildlife. This is commonly called the stock-tank exemption.',
          'The exemption is not permission to ignore every rule. The source of the water, whether the pond intercepts a defined watercourse, its storage capacity and its actual use can change the legal analysis. A landowner who shifts an exempt livestock pond to a commercial use may need a permit. Groundwater districts, dam-safety requirements and local rules can also matter. Anyone planning construction should verify the current requirements with Texas regulators and qualified local professionals.'
        )
      ),
      jsonb_build_object(
        'heading', 'Stock tank, farm pond or lake?',
        'paragraphs', jsonb_build_array(
          'The labels overlap. Farm pond describes size and setting, stock tank emphasizes livestock use, and lake is often chosen for larger or more recreational water bodies. None of those everyday names alone settles ownership, permitting or hydrology. In ordinary Texas conversation, a person who says the cattle are down at the tank is usually describing a pond or watering place, not an armored vehicle and not necessarily a galvanized trough.',
          'That double meaning is also why stock-tank pools sound both modern and old-fashioned. The pool trend repurposes the manufactured trough version, while the ranch-pond meaning continues independently. What connects them is the original idea of a durable reservoir built to keep animals supplied with water.'
        )
      ),
      jsonb_build_object(
        'heading', 'Restoration note',
        'paragraphs', jsonb_build_array(
          'Keep TX Red originally published this URL on June 29, 2026. The page later became unavailable during a newsroom data cleanup even though Google had already recorded search visibility for it. It was restored on August 20, 2026 with primary and institutional sources, a clearer explanation of Texas usage and the original URL preserved.'
        )
      )
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('q', 'Why do Texans call a pond a tank?', 'a', 'The pond was built or used to store water for livestock, or stock. Ranch usage broadened tank from a manufactured container to the dug or dammed watering pond itself.'),
      jsonb_build_object('q', 'Is a stock tank always a pond?', 'a', 'No. Stock tank can mean a metal or concrete livestock trough, while in Texas it also commonly means a man-made ranch pond.'),
      jsonb_build_object('q', 'Do Texas stock tanks require a water permit?', 'a', 'Some small ponds used for domestic, livestock, fish or wildlife purposes may qualify for the Water Code Section 11.142 exemption, but water source, capacity and use matter. Landowners should confirm current requirements before construction.')
    ),
    'sources', jsonb_build_array(
      jsonb_build_object('label', 'Texas A&M AgriLife — A Pond to Call My Own: Understanding Water Law in Texas', 'url', 'https://mytexas.ag.tamu.edu/publications/a-pond-to-call-my-own-understanding-water-law-in-texas/'),
      jsonb_build_object('label', 'The Portal to Texas History — 1902 Stock Tank Patent', 'url', 'https://texashistory.unt.edu/ark:/67531/metapth510152/'),
      jsonb_build_object('label', 'The Portal to Texas History — Cattle at a Watering Trough', 'url', 'https://texashistory.unt.edu/ark:/67531/metapth40125/')
    ),
    'keyTakeaways', jsonb_build_array(
      'In Texas ranch vocabulary, stock tank commonly means a man-made livestock pond as well as a manufactured trough.',
      'Texas A&M AgriLife says the state has more than one million ponds and small farm lakes commonly called tanks.',
      'The stock-tank water-law exemption is conditional; pond size, water source and use still matter.'
    ),
    'cta', jsonb_build_object('label', 'Explore Texas resources', 'href', '/texas-resources')
  ) body_json,
  array['Texas stock tank','ranch pond','Texas ranching','Texas water law','livestock water']::text[] keywords,
  36::integer score,
  false::boolean is_breaking,
  canonical_identity.internal_url,
  false::boolean is_ingested,
  'Why Texans Call a Ranch Pond a Stock Tank'::text seo_headline,
  'Texas History'::text discover_category,
  array['why Texans call ponds tanks','Texas stock tank meaning','stock tank exemption Texas','Texas ranch pond history']::text[] seo_keywords,
  jsonb_build_array(
    jsonb_build_object('href','/texas-agriculture','kind','hub','label','Texas agriculture'),
    jsonb_build_object('href','/texas-resources','kind','hub','label','Texas resources')
  ) internal_links,
  'Stock tanks are part of the water infrastructure and working vocabulary that shaped Texas ranching and continue to affect land and water decisions.'::text texas_impact_summary,
  array['statewide','rural']::text[] affected_regions,
  94::integer content_quality_score,
  array['legacy_url_restored','source_refreshed','archival_image_attributed']::text[] quality_flags,
  31::integer gsc_impressions,
  0::integer gsc_clicks
from canonical_identity
on conflict (slug) do update set
  category = excluded.category,
  title = excluded.title,
  dek = excluded.dek,
  author = excluded.author,
  source_name = excluded.source_name,
  source_url = excluded.source_url,
  image_url = excluded.image_url,
  featured_image_url = excluded.featured_image_url,
  image_alt_text = excluded.image_alt_text,
  image_validation_note = excluded.image_validation_note,
  kind = excluded.kind,
  body_json = excluded.body_json,
  keywords = excluded.keywords,
  internal_url = excluded.internal_url,
  seo_headline = excluded.seo_headline,
  discover_category = excluded.discover_category,
  seo_keywords = excluded.seo_keywords,
  internal_links = excluded.internal_links,
  texas_impact_summary = excluded.texas_impact_summary,
  affected_regions = excluded.affected_regions,
  content_quality_score = excluded.content_quality_score,
  quality_flags = excluded.quality_flags,
  gsc_impressions = greatest(public.daily_articles.gsc_impressions, excluded.gsc_impressions),
  gsc_clicks = greatest(public.daily_articles.gsc_clicks, excluded.gsc_clicks),
  updated_at = now();
