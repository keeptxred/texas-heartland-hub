with article_identity as (
  select $slug$live-2026-07-07-renowned-houston-neon-artist-tim-walker-passes-in-hill-country-flood-nbqu2w$slug$::text slug
), canonical_identity as (
  select slug, '/news/' || slug internal_url from article_identity
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
  'Texas Culture',
  'Tim Walker Left Houston a Glowing Legacy in Neon',
  'The self-taught founder of the Neon Gallery shaped Houston’s visual identity for more than four decades before his death in the July 4, 2025 Hill Country flood.',
  null::text,
  'Keep TX Red Newsroom',
  'The Neon Gallery and Houston Public Media',
  'https://theneongallery.com/',
  'https://s3.amazonaws.com/texasstandard.org/txstandard/wp-content/uploads/2026/07/07112139/HPMWalkerObit-1024x619.webp',
  'https://s3.amazonaws.com/texasstandard.org/txstandard/wp-content/uploads/2026/07/07112139/HPMWalkerObit-1024x619.webp',
  'Houston neon artist Tim Walker working among illuminated signs',
  'Editorial image published with the Houston Public Media report carried by Texas Standard; source page and creator context are linked in the article.',
  '2026-07-07T12:00:00Z'::timestamptz,
  'news',
  jsonb_build_object(
    'updated', '2026-08-26T12:00:00Z',
    'intro', jsonb_build_array(
      'For more than 40 years, Tim Walker’s Neon Gallery made West Alabama Street glow. The self-taught artist bent glass into signs and sculptures that became part of Houston’s visual memory: pink flamingos, a green skyline, restaurant signs, nightclub pieces and one-off commissions that appeared in windows across the city.',
      'Walker died at 63 during the catastrophic July 4, 2025 flooding along the Guadalupe River in the Texas Hill Country. A year later, reporting from Houston Public Media and a tribute maintained by the Neon Gallery documented both the family’s loss and the unusual craft legacy he left behind.'
    ),
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'A self-taught artist built a Houston institution', 'paragraphs', jsonb_build_array(
        'Walker opened the Neon Gallery in 1983, on his 21st birthday. According to the gallery’s memorial, he initially brought his designs to neon factories and learned by watching glassblowers work. He read about the process, acquired used manufacturing equipment and taught himself how to bend and fabricate neon.',
        'Suzette Walker joined the business in 1985, married Tim the following year and collaborated with him for four decades. Their shop was both a working studio and a neighborhood display. Before customers collected finished commissions, Walker often placed the pieces in the windows, briefly turning private orders into a changing public exhibition for Montrose.'
      )),
      jsonb_build_object('heading', 'Neon as both engineering and art', 'paragraphs', jsonb_build_array(
        'Traditional neon requires more than drawing a recognizable shape. Glass tubing must be heated, bent and joined with control, then prepared and filled so it can produce a consistent glow. Walker’s work combined that technical discipline with an illustrator’s attention to line, movement and color.',
        'Houston Public Media reported that other artists regarded his skill as exceptional. The Menil Collection also sought his expertise when preparing a large neon sculpture for display, asking him how to keep the work illuminated and how to respond if it failed. That role showed the breadth of his practice: he was a maker, repairer and technical adviser in a field where experienced hands are increasingly uncommon.'
      )),
      jsonb_build_object('heading', 'His work became part of the city', 'paragraphs', jsonb_build_array(
        'Walker’s commissions reached far beyond his storefront. Houston Public Media identified surviving pieces at places including 713 Tattoo, Numbers nightclub, Nancy’s Hustle, Tiny Champions and Chroma at the Menil. His studio also created custom neon used in Beyoncé’s Houston-filmed video for “Blow.”',
        'That range helps explain why his legacy is difficult to contain in a conventional gallery inventory. Much of the work was commissioned and left the studio, dispersing across restaurants, businesses, homes and music spaces. The collection is now embedded in Houston itself, encountered one sign at a time.'
      )),
      jsonb_build_object('heading', 'Loss in the Hill Country flood', 'paragraphs', jsonb_build_array(
        'Walker was staying with family and friends at a home in Hunt when the Guadalupe River rose rapidly during the July 4 flood. Houston Public Media reported that family members escaped through a broken window as water filled the house. Walker was missing after the escape; his body was found four days later.',
        'His family considered whether the Neon Gallery could continue with other artists, but closed it after two months. The decision reflected how closely the shop’s identity and output depended on Walker’s individual skill. Fellow neon artist Jeff Davison later completed pieces Walker had left in progress, describing the responsibility as carrying unusual pressure.'
      )),
      jsonb_build_object('heading', 'A legacy that still lights Houston', 'paragraphs', jsonb_build_array(
        'The gallery may be dark, but Walker’s work remains visible around Houston. For his family, those surviving signs can bring grief and gratitude at the same time. For the city, they preserve the contribution of an artist whose commercial commissions also functioned as neighborhood landmarks and public art.',
        'His story connects Houston’s creative identity to the human cost of the Hill Country flood. It also records a craft tradition that depends on accumulated physical knowledge: the feel of heated glass, the control of breath and flame, and the judgment needed to make light follow a hand-drawn line.'
      )),
      jsonb_build_object('heading', 'Restoration note', 'paragraphs', jsonb_build_array(
        'Keep TX Red originally published this URL on July 7, 2026. It later became unavailable during a newsroom data cleanup despite recorded search visibility. The exact URL was restored on August 26, 2026 from the Neon Gallery’s memorial and Houston Public Media’s retrospective reporting.'
      ))
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('q', 'Who was Tim Walker?', 'a', 'Tim Walker was a self-taught Houston neon artist who founded the Neon Gallery in 1983 and operated it for more than four decades with his wife, Suzette.'),
      jsonb_build_object('q', 'Where can Tim Walker’s neon work still be seen?', 'a', 'Houston Public Media identified work at Houston locations including 713 Tattoo, Numbers, Nancy’s Hustle, Tiny Champions and Chroma at the Menil.'),
      jsonb_build_object('q', 'When did Tim Walker die?', 'a', 'Walker died at age 63 during the July 4, 2025 flooding along the Guadalupe River near Hunt in the Texas Hill Country.')
    ),
    'sources', jsonb_build_array(
      jsonb_build_object('label', 'The Neon Gallery — tribute to Tim Walker', 'url', 'https://theneongallery.com/'),
      jsonb_build_object('label', 'Texas Standard and Houston Public Media — Tim Walker’s Houston legacy', 'url', 'https://texasstandard.org/stories/tim-walker-artist-texas-hill-country-flood-neon-gallery/'),
      jsonb_build_object('label', 'Houston Chronicle — 2014 Neon Gallery profile', 'url', 'https://www.houstonchronicle.com/local/gray-matters/article/Neon-Gallery-5802562.php/')
    ),
    'keyTakeaways', jsonb_build_array(
      'Tim Walker founded the Neon Gallery in 1983 after teaching himself to fabricate neon.',
      'His commissions became fixtures in Houston businesses, restaurants, music venues and pop culture.',
      'Walker died during the July 4, 2025 Hill Country flood, and his family later closed the gallery.'
    ),
    'cta', jsonb_build_object('label', 'Explore Houston', 'href', '/houston')
  ),
  array['Tim Walker','Neon Gallery','Houston neon artist','Texas Hill Country flood','Houston art']::text[],
  33,
  false,
  canonical_identity.internal_url,
  false,
  'Tim Walker’s Neon Art Still Glows Across Houston',
  'Texas Culture',
  array['Tim Walker neon artist','Neon Gallery Houston','Houston neon art','Hill Country flood victims']::text[],
  jsonb_build_array(
    jsonb_build_object('href','/houston','kind','hub','label','Houston'),
    jsonb_build_object('href','/news','kind','hub','label','Texas newsroom')
  ),
  'Walker’s work remains embedded in Houston’s neighborhoods while his death links the city’s cultural history to the human toll of the 2025 Hill Country flood.',
  array['houston','hill-country','statewide']::text[],
  94,
  array['legacy_url_restored','official_memorial_sources','archival_image_attributed']::text[],
  17,
  0
from canonical_identity
on conflict (slug) do update set
  category=excluded.category, title=excluded.title, dek=excluded.dek,
  author=excluded.author, source_name=excluded.source_name, source_url=excluded.source_url,
  image_url=excluded.image_url, featured_image_url=excluded.featured_image_url,
  image_alt_text=excluded.image_alt_text, image_validation_note=excluded.image_validation_note,
  kind=excluded.kind, body_json=excluded.body_json, keywords=excluded.keywords,
  internal_url=excluded.internal_url, seo_headline=excluded.seo_headline,
  discover_category=excluded.discover_category, seo_keywords=excluded.seo_keywords,
  internal_links=excluded.internal_links, texas_impact_summary=excluded.texas_impact_summary,
  affected_regions=excluded.affected_regions, content_quality_score=excluded.content_quality_score,
  quality_flags=excluded.quality_flags,
  gsc_impressions=greatest(public.daily_articles.gsc_impressions,excluded.gsc_impressions),
  gsc_clicks=greatest(public.daily_articles.gsc_clicks,excluded.gsc_clicks), updated_at=now();
