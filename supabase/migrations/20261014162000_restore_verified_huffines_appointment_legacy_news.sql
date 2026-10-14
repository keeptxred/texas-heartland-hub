-- Reconstruct a missing July 2 2026 public-affairs article from primary sources.
-- The historical editorial copy is NOT in the database; never claim verbatim restoration.
-- Source evidence: governor's July 2 release, Texas Tribune July 2 reporting,
-- Comptroller August 1 swearing-in. Gage Skidmore's 2018 photograph is CC BY-SA 2.0.
WITH article_identity AS (
  SELECT 'live-2026-07-02-governor-abbott-selects-don-huffines-to-serve-as-new-texas-comptroller-whlu3f'::text slug
), canonical_identity AS (
  SELECT slug, '/news/' || slug internal_url FROM article_identity
)
INSERT INTO public.daily_articles (
  slug, category, title, dek, body, author, source_name, source_url,
  image_url, featured_image_url, image_alt_text, image_validation_note,
  published_at, kind, body_json, keywords, score, is_breaking,
  internal_url, is_ingested, seo_headline, discover_category, seo_keywords,
  internal_links, texas_impact_summary, affected_regions,
  content_quality_score, quality_flags, gsc_impressions, gsc_clicks
)
SELECT
  c.slug,
  'Government',
  'Abbott Appoints Don Huffines as Texas Comptroller',
  'Abbott named the former state senator comptroller on July 2, 2026, ahead of his August 1 swearing-in. The original historical news URL is restored with independently checked official reporting.',
  NULL::text,
  'Keep TX Red Newsroom',
  'Office of the Texas Governor',
  'https://gov.texas.gov/es/news/post/governor-abbott-appoints-don-huffines-as-comptroller-of-public-accounts',
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/Don_Huffines_(26782316157).jpg',
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/Don_Huffines_(26782316157).jpg',
  'Don Huffines speaking at a public event in April 2018; archival Gage Skidmore photograph, not an image of the 2026 appointment.',
  'Gage Skidmore, Don Huffines (26782316157).jpg, Wikimedia Commons, CC BY-SA 2.0; https://creativecommons.org/licenses/by-sa/2.0/ . Original photograph dated April 21, 2018. No alterations represented.',
  '2026-07-02T17:00:00Z'::timestamptz,
  'news',
  '{"updated":"2026-10-14T16:00:00Z","intro":["Governor Greg Abbott announced on July 2, 2026 that he had selected former state senator Don Huffines to serve as Texas comptroller of public accounts. The announcement identified an August 1 start date and placed a Dallas-area businessman and former legislator in charge of one of the state’s most consequential financial offices. The appointment was an executive action, not a declaration that a later statewide election had already been decided.","The governor’s appointment announcement and contemporary Texas Tribune reporting establish the decision and its political context. A separate August 1 statement from the comptroller’s office confirms that Huffines subsequently took the oath. This reconstruction preserves an earlier Keep TX Red news address whose original editorial copy is no longer available; it relies on the cited public records rather than attempting to reproduce the vanished article."],"sections":[{"heading":"What Abbott announced on July 2","paragraphs":["Abbott’s office announced that Huffines had been appointed comptroller of public accounts, naming him as the incoming officer on July 2, 2026. The announcement described his private-sector experience, his past service in the Texas Senate, and the administration’s stated priorities for fiscal oversight. The official release identified August 1 as the intended effective date, distinguishing the announcement itself from the later assumption of duties.","The Texas Tribune reported the appointment on the day it was announced. Its coverage explained that the selection followed the planned departure of acting comptroller Kelly Hancock and that Huffines was pursuing a full elected term. Those are separate facts: a governor can announce an appointment for a vacancy, while voters determine the outcome of the regular election for the office."]},{"heading":"What the comptroller actually does","paragraphs":["The comptroller is Texas’ chief tax administrator and a central official in state finance. According to the governor’s appointment release, the office collects state taxes and fees, disburses state funds, manages unclaimed property and provides information about government spending. These functions affect state and local governments, businesses and residents regardless of the officeholder’s political affiliation.","Because tax collections help determine the resources available to the state, the position has a substantial role in fiscal administration and public reporting. The governor’s release also identifies oversight of the Economic Stabilization Fund among the office’s responsibilities. Appointment to this office is therefore not simply a ceremonial personnel change; it places an individual in a position responsible for established financial and administrative duties."]},{"heading":"Huffines’ experience before the appointment","paragraphs":["Huffines had served in the Texas Senate representing District 16 from 2015 to 2019. The governor’s release described him as a Dallas-area native and co-founder of Huffines Communities, a real-estate development business in the Dallas–Fort Worth region. His legislative and business backgrounds were central elements of Abbott’s stated reasons for appointing him.","His record is also a political one, not merely a business biography. The Texas Tribune noted that Huffines previously challenged Abbott in a Republican gubernatorial primary and later sought the comptroller’s office. Readers should distinguish this verified electoral history from campaign assessments or predictions: the July appointment established who would be selected for the position, not how a subsequent election would turn out."]},{"heading":"The transition was confirmed in August","paragraphs":["On August 1, 2026, the Texas comptroller’s office issued a statement confirming that Huffines had been sworn in. That later announcement is the strongest available confirmation that the July appointment progressed into actual service. It also described his pledges regarding government spending, efficiency and property-tax relief, which are policy goals attributed to the officeholder rather than outcomes that this article claims were already achieved.","The distinction between promises and completed actions matters for accurate historical reporting. An appointment creates authority and responsibilities under the law; a statement of priorities describes how an officeholder says those responsibilities will be approached. Changes in spending, tax policy or administrative practice must be assessed against separate documented actions, budgets and official records after the swearing-in."]},{"heading":"Why this appointment mattered to Texans","paragraphs":["Texas businesses interact with the comptroller when complying with state tax requirements, while residents can use the office’s unclaimed-property programs and fiscal reports. Local governments and state agencies also depend on processes and information managed by the office. For that reason, changes in leadership have practical significance beyond the political circumstances that produce them.","The July announcement was particularly notable because it connected a contested elected-office landscape with an appointment to an existing vacancy. Readers following the 2026 elections should be able to identify precisely what was established at each stage: Abbott announced the selection July 2, the intended start date was August 1, and the comptroller’s office later confirmed the swearing-in. None of those events independently proves a future election result."]},{"heading":"Historical URL and editorial reconstruction","paragraphs":["The original Keep TX Red story at this address was published during July 2026, but its original database article record did not survive later newsroom changes. This October 14 reconstruction keeps the same historical URL and original event date while disclosing that the wording and sourcing have been rebuilt from a governor’s announcement, contemporary independent reporting and the agency’s subsequent confirmation.","The photograph accompanying this reconstruction is an older image of Huffines speaking at a 2018 event, not a photograph of the July 2026 appointment or August swearing-in. Photographer Gage Skidmore published it under Creative Commons Attribution-ShareAlike 2.0. The image’s age and attribution are stated to avoid presenting archival photography as coverage of a different event."]}],"faq":[{"q":"When did Governor Abbott announce Don Huffines as Texas comptroller?","a":"Governor Greg Abbott announced the appointment on July 2, 2026, with an intended effective date of August 1, 2026."},{"q":"Did Don Huffines actually take office?","a":"Yes. The Texas Comptroller of Public Accounts issued an August 1, 2026 statement confirming that Huffines had been sworn in."},{"q":"Is this the same text as the original July Keep TX Red article?","a":"No. The original article record was unavailable. Keep TX Red reconstructed this historical page on October 14, 2026 from the linked official announcements and independent reporting, preserving the original URL."}],"sources":[{"label":"Office of the Texas Governor — July 2 Huffines appointment announcement","url":"https://gov.texas.gov/es/news/post/governor-abbott-appoints-don-huffines-as-comptroller-of-public-accounts"},{"label":"The Texas Tribune — July 2 reporting by Alejandro Serrano","url":"https://www.texastribune.org/2026/07/02/texas-comptroller-greg-abbott-appoints-don-huffines/"},{"label":"Texas Comptroller — August 1 swearing-in announcement","url":"https://comptroller.texas.gov/about/media-center/news/20260801-don-huffines-sworn-in-as-texas-comptroller-refuses-salary-calls-for-property-tax-relief-1785512488796"},{"label":"Wikimedia Commons — Gage Skidmore photograph and CC BY-SA 2.0 license","url":"https://commons.wikimedia.org/wiki/File:Don_Huffines_(26782316157).jpg"}],"keyTakeaways":["Abbott publicly appointed Don Huffines as Texas comptroller on July 2, 2026, identifying August 1 as the start date.","The comptroller’s office confirmed Huffines was sworn in on August 1.","This article was reconstructed from cited records after the original news body became unavailable; the July 2026 URL is preserved."]}'::jsonb,
  ARRAY['Don Huffines','Texas comptroller','Greg Abbott','Texas government','2026 Texas elections']::text[],
  72,
  FALSE,
  c.internal_url,
  FALSE,
  'Abbott Appointed Don Huffines Texas Comptroller in July 2026',
  'Government',
  ARRAY['Don Huffines appointed comptroller','Texas comptroller August 2026','Abbott Don Huffines appointment']::text[],
  jsonb_build_array(
    jsonb_build_object('href','/elections','kind','hub','label','Texas Elections'),
    jsonb_build_object('href','/texas-politics','kind','hub','label','Texas Politics'),
    jsonb_build_object('href','/news','kind','hub','label','Newsroom')
  ),
  'The comptroller administers state taxation, financial disbursements and unclaimed-property programs; this governor appointment changed leadership of those functions.',
  ARRAY['statewide','dallas-fort-worth']::text[],
  93,
  ARRAY['legacy_url_restored','official_source_restored','licensed_image_attributed']::text[],
  2,
  0
FROM canonical_identity c
ON CONFLICT (slug) DO UPDATE SET
  category = EXCLUDED.category,
  title = EXCLUDED.title,
  dek = EXCLUDED.dek,
  author = EXCLUDED.author,
  source_name = EXCLUDED.source_name,
  source_url = EXCLUDED.source_url,
  image_url = EXCLUDED.image_url,
  featured_image_url = EXCLUDED.featured_image_url,
  image_alt_text = EXCLUDED.image_alt_text,
  image_validation_note = EXCLUDED.image_validation_note,
  kind = EXCLUDED.kind,
  body_json = EXCLUDED.body_json,
  keywords = EXCLUDED.keywords,
  internal_url = EXCLUDED.internal_url,
  seo_headline = EXCLUDED.seo_headline,
  discover_category = EXCLUDED.discover_category,
  seo_keywords = EXCLUDED.seo_keywords,
  internal_links = EXCLUDED.internal_links,
  texas_impact_summary = EXCLUDED.texas_impact_summary,
  affected_regions = EXCLUDED.affected_regions,
  content_quality_score = EXCLUDED.content_quality_score,
  quality_flags = EXCLUDED.quality_flags,
  gsc_impressions = GREATEST(public.daily_articles.gsc_impressions,EXCLUDED.gsc_impressions),
  gsc_clicks = GREATEST(public.daily_articles.gsc_clicks,EXCLUDED.gsc_clicks);

-- Queue the licensed Commons photograph for the existing image audit.
-- The audit itself is responsible for checking image bytes/metadata and
-- recording real Cloudflare visual-match provenance before granting 'ready'.
UPDATE public.daily_articles
SET image_candidate_url = featured_image_url,
    image_candidate_alt_text = image_alt_text
WHERE slug = 'live-2026-07-02-governor-abbott-selects-don-huffines-to-serve-as-new-texas-comptroller-whlu3f'
  AND image_generation_status = 'pending'
  AND featured_image_url LIKE 'https://commons.wikimedia.org/wiki/Special:Redirect/file/%'
  AND NULLIF(BTRIM(COALESCE(image_alt_text,'')),'') IS NOT NULL
  AND NULLIF(BTRIM(COALESCE(image_validation_note,'')),'') IS NOT NULL
  AND image_candidate_url IS NULL;
