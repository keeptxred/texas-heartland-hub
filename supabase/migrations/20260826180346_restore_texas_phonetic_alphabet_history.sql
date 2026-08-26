with article_identity as (
  select $slug$live-2026-07-08-a-new-twist-on-the-lone-star-lexicon-growing-the-unofficial-texas-phon-xvw82n$slug$::text slug
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
  'How Texans Reworked a Lone Star Phonetic Alphabet',
  'W.F. Strong asked Texans to help refine a playful Texas-themed alternative to the NATO phonetic alphabet, and listeners answered with their own Lone Star suggestions.',
  null::text,
  'Keep TX Red Newsroom',
  'Texas Standard',
  'https://texasstandard.org/stories/commentary-the-texas-phonetic-alphabet-revisited-with-help-from-fellow-texans/',
  'https://upload.wikimedia.org/wikipedia/commons/9/91/Flag-of-Texas.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/9/91/Flag-of-Texas.jpg',
  'Texas flag flying in Austin under a clear blue sky',
  'Representative Texas image, not artwork from the Texas Standard commentary. Wikimedia Commons identifies the photograph as Flag-of-Texas.jpg by Makaristos, taken in Austin on June 19, 2008, 4,272 by 2,848 pixels, MIME type image/jpeg, and released into the public domain by the copyright holder.',
  '2026-07-08T15:45:00Z'::timestamptz,
  'news',
  jsonb_build_object(
    'updated', '2026-08-26T18:03:46Z',
    'intro', jsonb_build_array(
      'Texas writer and broadcaster W.F. Strong turned the familiar idea of a phonetic alphabet into a statewide language game in June 2026. Instead of the standardized words used in the NATO alphabet, Strong proposed Texas-linked words that would instantly evoke places, foods, history and habits associated with the state.',
      'The exercise did not stay a one-person list for long. Strong invited listeners to suggest alternatives, and on July 8 he returned to the idea with a follow-up for Texas Standard that highlighted the audience response. The historical Keep TX Red URL from that date is being restored around that verified follow-up rather than reconstructed from the old automated headline alone.'
    ),
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'What Strong was trying to do', 'paragraphs', jsonb_build_array(
        'The concept began with the practical reason phonetic alphabets exist: speakers use distinctive words to make letters easier to understand over radios, phones and other noisy channels. Strong borrowed that structure for humor and cultural recognition, asking what a Texas version might sound like if its words came from the state rather than from an international standard.',
        'His original June 24 commentary framed the project as a work in progress. It mixed Texas history, cities, foods, businesses, music and everyday expressions, then explicitly asked readers and listeners to improve it. The point was not to replace the NATO system in official use. It was a cultural exercise built around the problem of choosing one recognizable Texas association for each letter.'
      )),
      jsonb_build_object('heading', 'The July 8 follow-up was driven by listeners', 'paragraphs', jsonb_build_array(
        'Texas Standard published Strong''s follow-up on July 8, 2026. By then, listeners had sent competing suggestions and arguments for why certain Texas references worked better than his first choices. Strong used the responses to revisit several letters and, in some cases, conceded that a listener''s proposal was stronger.',
        'That audience participation is the most important part of the follow-up. The alphabet became less about one writer defining Texas and more about Texans debating which places, foods, phrases and historical references feel most representative. UTRGV''s ScholarWorks archive independently records the July 8 commentary, its author and publication date.'
      )),
      jsonb_build_object('heading', 'Why we are not republishing the full alphabet', 'paragraphs', jsonb_build_array(
        'Strong''s complete sequence and the listener responses are copyrighted editorial work. This restoration therefore summarizes the idea, the evolution of the project and a few high-level examples without copying the full alphabet or reproducing extended passages from the commentary.',
        'Readers who want Strong''s exact choices and the full set of listener suggestions should use the source links provided below. That preserves the historical subject of the Keep TX Red page while respecting the original publisher and author.'
      )),
      jsonb_build_object('heading', 'A Texas alphabet naturally turns into an argument about identity', 'paragraphs', jsonb_build_array(
        'The exercise works because there is rarely one uncontested answer. A single letter can point toward Texas history, a city, a food, a landscape, a brand, a musician or a phrase. Choosing among them becomes a miniature argument about which version of Texas should take priority.',
        'Strong''s follow-up showed that listeners were willing to make those arguments in detail. Some preferred historical references, some favored foods or expressions, and others focused on whether a word would actually work well when spoken aloud. The result was less a definitive alphabet than a snapshot of how Texans recognize and describe their own state.'
      )),
      jsonb_build_object('heading', 'The featured image is representative Texas imagery', 'paragraphs', jsonb_build_array(
        'The restored article does not reuse Texas Standard''s editorial artwork or any image supplied with Strong''s commentary. Instead it uses a separate photograph of the Texas flag flying in Austin.',
        'Wikimedia Commons identifies that photograph as an original 4,272-by-2,848 JPEG by Makaristos and records that the copyright holder released it into the public domain. The image is used only as representative Texas imagery and is not presented as part of Strong''s project.'
      )),
      jsonb_build_object('heading', 'Restoration note', 'paragraphs', jsonb_build_array(
        'Google Search Console recorded 16 impressions for the historical www version of this Keep TX Red URL in July 2026. The current site canonicalizes to the apex keeptxred.com host, so those historical host records are preserved as 16 impressions rather than added to any separate apex count.',
        'The backing article record later disappeared. This restoration keeps the exact historical slug, uses the verified July 8 Texas Standard and UTRGV records as its subject anchor, preserves the existing Search Console metrics and clearly separates original Keep TX Red summary from Strong''s copyrighted work.'
      ))
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('q', 'Who created the Texas phonetic alphabet discussed here?', 'a', 'Texas writer and broadcaster W.F. Strong proposed the Texas-themed phonetic alphabet in a June 24, 2026 Texas Standard commentary and revisited it with listener suggestions on July 8.'),
      jsonb_build_object('q', 'Was the Texas phonetic alphabet intended to replace the NATO phonetic alphabet?', 'a', 'No. Strong presented it as a playful Texas cultural exercise inspired by the structure and clarity purpose of the NATO phonetic alphabet.'),
      jsonb_build_object('q', 'Why did Strong revisit the alphabet?', 'a', 'He had invited Texans to suggest better words for individual letters. The July 8 follow-up highlighted listener responses and competing ideas.'),
      jsonb_build_object('q', 'Does this restored page reproduce Strong''s complete alphabet?', 'a', 'No. It summarizes the project and its listener-driven revision while directing readers to the original sources for Strong''s complete copyrighted commentary.')
    ),
    'sources', jsonb_build_array(
      jsonb_build_object('label', 'Texas Standard — Commentary: The Texas phonetic alphabet revisited — with help from fellow Texans', 'url', 'https://texasstandard.org/stories/commentary-the-texas-phonetic-alphabet-revisited-with-help-from-fellow-texans/'),
      jsonb_build_object('label', 'UTRGV ScholarWorks — The Texas phonetic alphabet revisited', 'url', 'https://scholarworks.utrgv.edu/storiesfromtexas/244/'),
      jsonb_build_object('label', 'UTRGV ScholarWorks — Commentary: Texas phonetic alphabet', 'url', 'https://scholarworks.utrgv.edu/storiesfromtexas/245/'),
      jsonb_build_object('label', 'Wikimedia Commons — Flag-of-Texas.jpg', 'url', 'https://commons.wikimedia.org/wiki/File:Flag-of-Texas.jpg')
    ),
    'keyTakeaways', jsonb_build_array(
      'W.F. Strong proposed a Texas-themed phonetic alphabet in June 2026 as a cultural variation on the familiar NATO system.',
      'His July 8 follow-up centered on suggestions from Texans who argued for different places, foods, phrases and historical references.',
      'This restoration summarizes the copyrighted commentary rather than reproducing the complete alphabet.',
      'The exact historical Keep TX Red slug and its 16 recorded impressions are preserved under the current apex canonical policy.'
    ),
    'cta', jsonb_build_object('label', 'Read more Texas news', 'href', '/texas-news')
  ),
  array['Texas phonetic alphabet','W.F. Strong','Texas Standard','Texas culture','Texas expressions','Texas identity']::text[],
  29,
  false,
  canonical_identity.internal_url,
  false,
  'Texas Phonetic Alphabet Revisited With Listener Suggestions',
  'Texas Culture',
  array['Texas phonetic alphabet','W.F. Strong Texas','Texas Standard phonetic alphabet','Texas culture commentary']::text[],
  jsonb_build_array(
    jsonb_build_object('href','/texas-news','kind','hub','label','Texas news'),
    jsonb_build_object('href','/news','kind','hub','label','Keep TX Red newsroom')
  ),
  'The listener-driven alphabet is a lighthearted example of Texans debating which historical, geographic, culinary and linguistic references best represent the state.',
  array['statewide']::text[],
  94,
  array['legacy_url_restored','source_refreshed','archival_image_attributed','copyrighted_source_summarized']::text[],
  16,
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
