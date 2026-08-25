with article_identity as (
  select $slug$live-2026-07-07-texas-singer-august-ponthier-navigates-homecoming-through-new-album-pr-c5k2v9$slug$::text slug
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
  'August Ponthier Turns a Complicated Texas Homecoming Into a Debut Album',
  'On Everywhere Isn’t Texas, the Allen-raised singer-songwriter looks back at home, identity and the uneasy pull of the place that shaped them.',
  null::text,
  'Keep TX Red Newsroom',
  'August Ponthier official website',
  'https://augustponthier.com/',
  'https://f4.bcbits.com/img/a2632504893_5.jpg',
  'https://f4.bcbits.com/img/a2632504893_5.jpg',
  'Album artwork for August Ponthier’s Everywhere Isn’t Texas',
  'Official album artwork hosted by the artist’s Bandcamp page; used with clear artist and release attribution.',
  '2026-07-07T12:00:00Z'::timestamptz,
  'news',
  jsonb_build_object(
    'updated', '2026-08-25T22:00:00Z',
    'intro', jsonb_build_array(
      'August Ponthier’s debut album Everywhere Isn’t Texas treats homecoming as something more complicated than a return trip. The singer-songwriter was raised in Allen, studied jazz at the University of North Texas and later moved to Brooklyn. On the record, Texas remains a source of imagery, humor, conflict and affection rather than a setting that can be reduced to either nostalgia or rejection.',
      'The album arrived February 13, 2026. Ponthier’s official site describes them as a Texas-born indie-folk and indie-pop artist, while the official Bandcamp release identifies the project as a 10-track album. Together, those artist-controlled sources frame the record as a personal examination of growing up, queer identity, family history and the lasting influence of a contradictory home state.'
    ),
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'A Texas story told from outside Texas', 'paragraphs', jsonb_build_array(
        'Distance is central to the album’s perspective. Ponthier’s move from North Texas to New York created room to reconsider experiences that may have felt ordinary while they were happening. The title Everywhere Isn’t Texas works as both a statement of fact and an emotional discovery: leaving home does not erase the habits, memories or language a person carries with them.',
        'Ponthier’s official biography connects their music to indie folk, indie pop, alt-country and singer-songwriter traditions. Those styles suit a record built around storytelling. The Texas references are not presented as tourism or branding. They become a vocabulary for discussing family, belonging and the tension between loving a place and recognizing where it failed to make room for you.'
      )),
      jsonb_build_object('heading', 'The album’s coming-of-age perspective', 'paragraphs', jsonb_build_array(
        'The artist’s Bandcamp notes describe Everywhere Isn’t Texas as a coming-of-age album for people whose understanding of themselves arrived later than expected. Its subjects include gender envy, reconnecting with childhood, escapism, generational trauma and queer joy. That range matters because the project is not organized around a single verdict about Texas or about growing up.',
        'Instead, the songs allow conflicting emotions to coexist. A hometown can be funny, painful and formative at once. A family story can contain tenderness and damage. A person can build a new life elsewhere without pretending the old landscape has stopped exerting influence. That layered approach gives the album a specifically Texan subject while keeping its emotional questions broadly recognizable.'
      )),
      jsonb_build_object('heading', 'From earlier EPs to a full-length statement', 'paragraphs', jsonb_build_array(
        'Ponthier previously released the EPs Faking My Own Death, Shaking Hands with Elvis and Breaking the Fourth Wall. Their official biography also notes a collaboration with Lord Huron on “I Lied.” Those releases established an autobiographical writing style and a visual imagination that moves between country, folk and pop references.',
        'A 10-song debut album provides more space than an EP for recurring ideas to answer one another. The Bandcamp track list includes “World Famous,” “Ribbons + Taxes,” “Handsome,” “I’m Crying, Are You?,” the title song, “Betty,” “Karaoke Queen,” “Angry Man,” “Bloodline” and a title-track reprise. The sequence suggests a record designed as a complete narrative arc rather than a loose collection of singles.'
      )),
      jsonb_build_object('heading', 'Why the record belongs in Texas cultural coverage', 'paragraphs', jsonb_build_array(
        'Texas music coverage often focuses on artists who remain physically inside the state. Ponthier’s work shows why artists who leave are also part of the Texas story. Migration can sharpen regional identity, making familiar language and values easier to see from a distance. The result can be criticism, celebration or both.',
        'Everywhere Isn’t Texas documents that push and pull through the perspective of an Allen-raised songwriter building a life in Brooklyn. It is a homecoming record without requiring a permanent return: the journey happens through memory, songwriting and a willingness to revisit the parts of home that remain unresolved.'
      )),
      jsonb_build_object('heading', 'Restoration note', 'paragraphs', jsonb_build_array(
        'Keep TX Red originally published this URL on July 7, 2026. It later became unavailable during a newsroom data cleanup despite recorded search visibility. The exact URL was restored on August 25, 2026 using the artist’s official website and official Bandcamp release page.'
      ))
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('q', 'Where is August Ponthier from?', 'a', 'Ponthier was raised in Allen, Texas, studied jazz at the University of North Texas and later moved to Brooklyn.'),
      jsonb_build_object('q', 'When was Everywhere Isn’t Texas released?', 'a', 'The official Bandcamp page lists February 13, 2026 as the release date.'),
      jsonb_build_object('q', 'How many tracks are on the album?', 'a', 'The official release page identifies Everywhere Isn’t Texas as a 10-track album.')
    ),
    'sources', jsonb_build_array(
      jsonb_build_object('label', 'August Ponthier — official website', 'url', 'https://augustponthier.com/'),
      jsonb_build_object('label', 'August Ponthier — Everywhere Isn’t Texas on Bandcamp', 'url', 'https://augustponthier.bandcamp.com/album/everywhere-isn-t-texas')
    ),
    'keyTakeaways', jsonb_build_array(
      'Everywhere Isn’t Texas is August Ponthier’s 10-track debut album, released February 13, 2026.',
      'The record examines home, identity, family history and queer joy through the perspective of an Allen-raised artist living in Brooklyn.',
      'Ponthier’s official materials place the album within an indie-folk, indie-pop and alt-country songwriting tradition.'
    ),
    'cta', jsonb_build_object('label', 'Explore Dallas–Fort Worth', 'href', '/dallas-fort-worth')
  ),
  array['August Ponthier','Everywhere Isn’t Texas','Texas music','Allen Texas','Texas singer-songwriter']::text[],
  32,
  false,
  canonical_identity.internal_url,
  false,
  'August Ponthier’s Everywhere Isn’t Texas Explores a Complicated Homecoming',
  'Texas Culture',
  array['August Ponthier album','Everywhere Isn’t Texas','Texas indie folk','Allen Texas musician']::text[],
  jsonb_build_array(
    jsonb_build_object('href','/dallas-fort-worth','kind','hub','label','Dallas–Fort Worth'),
    jsonb_build_object('href','/news','kind','hub','label','Texas newsroom')
  ),
  'The album adds an Allen-raised, Brooklyn-based voice to the evolving story of Texas music, migration and cultural identity.',
  array['dallas-fort-worth','statewide']::text[],
  92,
  array['legacy_url_restored','official_artist_sources','artist_image_attributed']::text[],
  18,
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
