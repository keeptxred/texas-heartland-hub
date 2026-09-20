with article_identity as (
  select $slug$live-2026-06-30-unusual-texas-sightings-herding-cattle-with-toys-and-mystery-ranch-mon-o70ryu$slug$::text slug
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
  'Two-Year-Old Wyatt Herds Nearly Two Dozen Cattle in a Toy Truck',
  'A viral Henrietta ranch moment showed two-year-old Wyatt tagging along in a toy truck while close to two dozen cattle followed behind him.',
  null::text,
  'Keep TX Red Newsroom',
  'ABC News and Storyful',
  'https://abcnews.com/video/132755860/',
  'https://upload.wikimedia.org/wikipedia/commons/4/49/Cattle_on_pastureland_at_the_Birdwell_Clark_Ranch_in_Henrietta%2C_Texas._%2824992924572%29.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/4/49/Cattle_on_pastureland_at_the_Birdwell_Clark_Ranch_in_Henrietta%2C_Texas._%2824992924572%29.jpg',
  'Cattle on pastureland near Henrietta, Texas',
  'Representative Henrietta cattle photograph, not Wyatt and not the ranch shown in the viral clip. USDA NRCS Texas image dated May 7, 2009. Wikimedia Commons identifies the original as 4,256 by 2,832 pixels, MIME type image/jpeg, public-domain U.S. government work and also records a CC BY 2.0 Flickr review.',
  '2026-06-30T12:00:00Z'::timestamptz,
  'news',
  jsonb_build_object(
    'updated', '2026-08-26T16:30:00Z',
    'intro', jsonb_build_array(
      'A two-year-old named Wyatt became an unlikely ranch hand in a short video from Henrietta, Texas. Driving a child-sized toy truck, he moved ahead of a group of cattle while close to two dozen animals followed behind. The scale of the scene made the small driver look even smaller, but the cattle appeared calm and accustomed to the routine around them.',
      'Storyful reported that Wyatt was filmed by his mother, Taylor Kahn, on the ranch where she works. ABC News independently carried the video and described the toddler as leading about two dozen cows. The moment traveled widely because it compressed a familiar part of rural Texas life into a striking visual: livestock, a working ranch and a child imitating the adults around him.'
    ),
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'What the video actually shows', 'paragraphs', jsonb_build_array(
        'The verified reporting is simple. Wyatt, age two, drove a small toy truck on a ranch in Henrietta while a herd of cattle followed behind. Storyful described the group as close to two dozen cows, while ABC News described it as about two dozen. Neither report suggested the child was independently managing livestock or replacing an adult ranch hand.',
        'The appeal of the clip comes from the contrast rather than from an extraordinary claim. A toddler-sized vehicle is dwarfed by full-grown cattle, yet the animals move behind him in an orderly way. That visual made the scene easy to share while still reflecting an ordinary ranch environment in which animals respond to familiar movement, feeding routines and people.'
      )),
      jsonb_build_object('heading', 'Who Wyatt is and where the moment happened', 'paragraphs', jsonb_build_array(
        'Storyful identified the child as two-year-old Wyatt and the person filming as his mother, Taylor Kahn. The report places the scene in Henrietta, a Clay County community in North Texas. Kahn said Wyatt likes to follow along and help with feeding animals on the ranch where she works.',
        'That detail matters because it explains the scene without embellishment. Wyatt was not presented as a child sent out alone to work cattle. He was copying the ranch activity he regularly sees around him. Kahn told Storyful that he wants to do what he sees everyone else doing, which is a much more grounded explanation than treating the clip as proof of a toddler literally running a cattle operation.'
      )),
      jsonb_build_object('heading', 'A representative image, not a frame from the viral clip', 'paragraphs', jsonb_build_array(
        'The featured photograph on this restored article is intentionally not a still from the viral video. The video footage is credited to Taylor Kahn through Storyful, and Keep TX Red does not have evidence of separate republication rights for a frame from that footage.',
        'Instead, this page uses a representative cattle photograph from Henrietta that Wikimedia Commons identifies as a USDA Natural Resources Conservation Service Texas image. Commons lists the original as a 4,256-by-2,832 JPEG and records both its federal public-domain status and a reviewed Creative Commons Attribution 2.0 provenance from Flickr. The photographed cattle are at Birdwell and Clark Ranch; that ranch is not being identified as the location of Wyatt''s video.'
      )),
      jsonb_build_object('heading', 'Henrietta remains cattle country', 'paragraphs', jsonb_build_array(
        'Henrietta sits in a part of North Texas where cattle and grazing remain visible pieces of the local economy and landscape. Birdwell and Clark Ranch, used only as geographic and ranching context here, describes a 14,200-acre Clay County stocker operation with a ranching heritage reaching back to the late 1800s.',
        'The ranch also documents managed grazing systems that can involve thousands of cattle moving through paddocks. That larger context helps explain why a small family video from Henrietta immediately reads as Texas ranch life: the setting is not a staged theme but a community where cattle operations remain part of the surrounding landscape.'
      )),
      jsonb_build_object('heading', 'Why the historical headline is not being fully reconstructed', 'paragraphs', jsonb_build_array(
        'The original Keep TX Red URL used a compound automated headline that began with Wyatt''s cattle-herding clip and then trailed into a second phrase about a mystery ranch. The surviving database and source archive do not contain enough evidence to identify that second subject reliably.',
        'This restoration therefore preserves the exact historical URL but restores only the subject that can be independently verified. It would be misleading to invent a second person, ranch or event merely to make the old machine-generated headline read as complete. The omitted fragment is recorded as unresolved rather than reconstructed from guesswork.'
      )),
      jsonb_build_object('heading', 'Why a small viral story still has Texas context', 'paragraphs', jsonb_build_array(
        'Not every Texas story has to involve legislation, elections or a major disaster to be worth preserving. Search users found this page because the image of a tiny truck leading a large group of cattle was unusual, memorable and specifically rooted in rural Texas.',
        'The durable value is modest but real: the restored page records who was in the video, where it happened, what reliable reporting actually established and what remains unknown. That is more useful than allowing a once-visible URL to disappear or replacing the missing record with speculation.'
      )),
      jsonb_build_object('heading', 'Restoration note', 'paragraphs', jsonb_build_array(
        'Keep TX Red originally published this historical URL in 2026 and Google Search Console recorded 9 impressions and 3 clicks before the backing article record disappeared. The URL is being restored with its exact slug and with the verified Wyatt and Henrietta facts reconstructed from ABC News and Storyful reporting.',
        'The restoration deliberately omits the unverified second subject embedded in the old compound slug. Search-history metrics are preserved, the page remains on the canonical keeptxred.com host, and the representative image is clearly labeled so it cannot be mistaken for the viral event itself.'
      ))
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('q', 'Who is Wyatt in the Texas cattle video?', 'a', 'Wyatt is the two-year-old son of Taylor Kahn. Storyful reported that Kahn filmed him driving a toy truck while close to two dozen cattle followed on the Henrietta ranch where she works.'),
      jsonb_build_object('q', 'Where was the toddler cattle video filmed?', 'a', 'Storyful identified the location as Henrietta, Texas, in Clay County.'),
      jsonb_build_object('q', 'How many cattle followed Wyatt?', 'a', 'Storyful described close to two dozen cows, while ABC News described about two dozen.'),
      jsonb_build_object('q', 'Is the featured cattle photo from Wyatt''s viral video?', 'a', 'No. It is a representative USDA NRCS Texas photograph of cattle in Henrietta. It is not Wyatt, his mother or the ranch shown in the viral clip.')
    ),
    'sources', jsonb_build_array(
      jsonb_build_object('label', 'ABC News — Texas toddler helps herd cattle in little toy truck', 'url', 'https://abcnews.com/video/132755860/'),
      jsonb_build_object('label', 'Storyful via Yahoo News — Mini Ranch Hand on Toy Truck Dwarfed by Curious Cows', 'url', 'https://www.yahoo.com/news/videos/mini-ranch-hand-toy-truck-080619305.html'),
      jsonb_build_object('label', 'Wikimedia Commons — USDA NRCS Texas cattle photograph from Henrietta', 'url', 'https://commons.wikimedia.org/wiki/File:Cattle_on_pastureland_at_the_Birdwell_Clark_Ranch_in_Henrietta,_Texas._(24992924572).jpg'),
      jsonb_build_object('label', 'Birdwell and Clark Ranch — Clay County ranch context', 'url', 'https://www.birdwellandclarkranch.com/')
    ),
    'keyTakeaways', jsonb_build_array(
      'Two-year-old Wyatt was filmed in Henrietta driving a toy truck while close to two dozen cattle followed behind.',
      'His mother, Taylor Kahn, said he regularly follows along with ranch activities and likes helping feed animals.',
      'The restored article preserves the exact historical URL while omitting an unverified second subject from the old compound headline.',
      'The featured image is a separately licensed representative Henrietta cattle photograph, not a frame from the viral clip.'
    ),
    'cta', jsonb_build_object('label', 'Explore Texas agriculture', 'href', '/texas-agriculture')
  ),
  array['Wyatt','Henrietta Texas','Clay County','Texas ranch life','cattle','rural Texas']::text[],
  31,
  false,
  canonical_identity.internal_url,
  false,
  'Texas Toddler Wyatt Leads Nearly Two Dozen Cattle in Toy Truck',
  'Texas Culture',
  array['Texas toddler cattle video','Wyatt Henrietta Texas','Henrietta ranch cattle','Texas ranch life']::text[],
  jsonb_build_array(
    jsonb_build_object('href','/texas-agriculture','kind','hub','label','Texas agriculture'),
    jsonb_build_object('href','/news','kind','hub','label','Texas newsroom')
  ),
  'The viral Henrietta clip captured a recognizable part of rural Texas life while the restored record separates verified facts from the unverified fragment of the historical automated headline.',
  array['rural','statewide']::text[],
  94,
  array['legacy_url_restored','source_refreshed','archival_image_attributed','unverified_compound_subject_omitted']::text[],
  9,
  3
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
