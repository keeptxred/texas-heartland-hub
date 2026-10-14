-- Rebuild missing July 7 public affairs history from three original governor statements.
-- These notices distinguish investigation, referral and executive order from legal findings.
-- Photo is public-domain agency building, explicitly not Mission Regional Medical Center.
WITH article_identity AS (
  SELECT 'live-2026-07-07-governor-abbott-orders-prompt-investigation-into-birth-tourism-package-wf40tc'::text slug
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
  'Abbott Orders HHSC Inquiry Into Reported Birth-Tourism Packages',
  'The governor directed a July 7 inquiry into hospital-linked childbirth-package marketing, followed by an HHSC referral and a broader July 21 order. These were regulatory steps, not verdicts.',
  NULL::text,
  'Keep TX Red Newsroom',
  'Office of the Texas Governor',
  'https://gov.texas.gov/news/post/governor-abbott-directs-hhsc-to-investigate-birth-tourism-packages-to-foreign-nationals',
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/TexasHealthHumanServicesA.JPG',
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/TexasHealthHumanServicesA.JPG',
  'Archival photograph of Texas Health and Human Services Building 2 in Austin; not Mission Regional Medical Center and not a photograph of the July 2026 investigation.',
  'Public-domain photograph: TexasHealthHumanServicesA.JPG, Wikimedia Commons contributor WhisperToMe, original uploaded 2009. https://commons.wikimedia.org/wiki/File:TexasHealthHumanServicesA.JPG. Agency location only, not the subject hospital.',
  '2026-07-07T17:00:00Z'::timestamptz,
  'news',
  '{"updated":"2026-10-14T16:00:00Z","intro":["On July 7, 2026, Governor Greg Abbott directed the Texas Health and Human Services Commission (HHSC) to investigate reports that a hospital in Mission, Texas, was being associated with childbirth packages marketed to foreign nationals. The governor’s statement named Mission Regional Medical Center and instructed the state regulator to examine possible violations of state law and contractual obligations. The directive was an order to investigate; it did not itself constitute an adjudicated finding against a hospital or a patient.","The July 7 action later led to further state announcements. On July 14, the governor said HHSC had referred information concerning alleged advertising of such packages to the attorney general. On July 21, Abbott issued a broader executive order directing several professional and healthcare regulators to investigate and address unlawful schemes. These distinct steps are documented in the governor’s original releases and are separated here to preserve the chronology."],"sections":[{"heading":"What the July 7 directive actually said","paragraphs":["The governor’s July 7 release stated that HHSC should conduct an immediate, thorough investigation of Mission Regional Medical Center. The administration identified reports about marketing of childbirth packages to visitors from abroad as the reason for the inquiry and said HHSC should examine whether state rules or contractual requirements had been violated. These were allegations requiring regulatory examination, not verified judicial conclusions.","Abbott also directed HHSC to refer any violations it identified to appropriate enforcement authorities. His statement referred to civil enforcement by the Texas attorney general and potential criminal referrals to district or county prosecutors. Whether any particular statute was violated would require evidence, jurisdiction and legal process; the governor’s announcement did not replace those steps."]},{"heading":"Why a health agency was involved","paragraphs":["HHSC regulates and oversees parts of Texas healthcare, including facilities and participation in public programs. The governor’s directive focused on regulatory and contractual obligations in the healthcare setting rather than purporting to decide a person’s citizenship or immigration status. Its practical significance depended on what agency investigators could establish from records, marketing materials, healthcare relationships and applicable state requirements.","The inquiry concerned representations about services and alleged arrangements, not a categorical accusation against everyone receiving medical care in the Rio Grande Valley. Accurate coverage must distinguish statements by the administration from substantiated findings. A hospital named in an inquiry is entitled to the same separation between allegation, investigation, regulatory decision and any eventual court outcome as other institutions."]},{"heading":"The state’s July 14 follow-up","paragraphs":["One week later, on July 14, the governor announced that HHSC had submitted a referral to the attorney general based on publicly available evidence concerning marketing of childbirth packages in Mexico. The governor’s account referred to connections involving two Texas hospitals and an advertised website. A referral is an escalation of an inquiry, but is not itself proof that an enforcement action has succeeded or that liability has been established.","The later release also reiterated the governor’s request that potential violations be referred to the appropriate authorities. The distinction matters for readers tracing what actually occurred: July 7 initiated an investigation, July 14 reported a referral, and any subsequent finding or penalty would require separately verifiable official documentation. This article does not assume outcomes absent from the cited releases."]},{"heading":"A broader executive order followed on July 21","paragraphs":["On July 21, Abbott announced a statewide executive order addressing what the administration described as unlawful birth-tourism schemes. The order named HHSC, the Department of State Health Services, HHSC’s Office of Inspector General, the Texas Medical Board, the Texas Board of Nursing and the Texas Department of Licensing and Regulation as participating authorities. That broader approach came after, and should not be confused with, the hospital-specific July 7 investigation directive.","According to the governor’s summary, potential responses by the regulated agencies included license discipline, restrictions on public contracts and other enforcement measures authorized by law. Federal authorities could also receive referrals for issues within their jurisdiction. The scope of the July 21 order describes enforcement tools the administration sought to use; it does not establish that each tool was used in every matter."]},{"heading":"What readers can verify and what remains an allegation","paragraphs":["The existence and dates of the governor’s directives are verifiable from the governor’s published releases. Those records also substantiate the administration’s description of HHSC’s referral. By contrast, whether particular marketing arrangements broke a law, what individual providers knew, and which sanctions were legally justified are factual or legal questions that cannot be resolved merely by quoting a governor’s press release.","Birthright citizenship is governed by federal constitutional and statutory questions distinct from state hospital licensing. The governor used strong language about the alleged practice, but this reconstruction attributes that assessment to his office rather than adopting it as an independent court finding. Patients, facilities, regulators and prosecutors occupy different roles in any eventual review."]},{"heading":"Historical page restoration and image disclosure","paragraphs":["The original Keep TX Red story at this July 7 address is no longer present in the surviving newsroom database. This version was reconstructed on October 14, 2026 from the governor’s July 7, July 14 and July 21 announcements, preserving the original URL while openly recording the loss of the original editorial copy. The restoration date is not represented as a newly occurring July event.","The accompanying archival photograph shows a Texas Health and Human Services building in Austin, an agency-related location rather than Mission Regional Medical Center or an inspection site. It is an older photograph released into the public domain by Wikimedia Commons contributor WhisperToMe. Neither the building image nor this article implies that a pictured person or facility was found to have committed a violation."]}],"faq":[{"q":"What did Governor Abbott direct HHSC to investigate on July 7, 2026?","a":"Abbott instructed HHSC to investigate reports concerning childbirth packages marketed to foreign nationals and named Mission Regional Medical Center in the governor’s July 7 statement."},{"q":"Did the July 7 announcement establish that the hospital broke the law?","a":"No. It announced an investigation and requested referrals if violations were identified. An allegation or referral should not be confused with a final finding or court judgment."},{"q":"What happened after the governor’s July 7 directive?","a":"On July 14 Abbott announced an HHSC referral to the attorney general. On July 21 he announced a broader executive order involving multiple healthcare and professional regulators."}],"sources":[{"label":"Office of the Texas Governor — July 7, 2026 HHSC directive","url":"https://gov.texas.gov/news/post/governor-abbott-directs-hhsc-to-investigate-birth-tourism-packages-to-foreign-nationals"},{"label":"Office of the Texas Governor — July 14 HHSC referral announcement","url":"https://gov.texas.gov/news/post/governor-abbott-announces-hhsc-referral-in-birth-tourism-investigation"},{"label":"Office of the Texas Governor — July 21 executive-order announcement","url":"https://gov.texas.gov/news/post/governor-abbott-issues-executive-order-cracking-down-on-birth-tourism-schemes"},{"label":"Wikimedia Commons — public-domain photo of Texas HHSC Building 2","url":"https://commons.wikimedia.org/wiki/File:TexasHealthHumanServicesA.JPG"}],"keyTakeaways":["The July 7 action directed HHSC to investigate reported childbirth-package marketing and potential regulatory violations, rather than establishing guilt.","On July 14 the governor reported an HHSC referral; the July 21 executive order involved additional agencies.","This story is a transparently disclosed, source-based reconstruction of a historical article whose original text is unavailable."]}'::jsonb,
  ARRAY['Texas HHSC','Greg Abbott','birth tourism investigation','Mission Regional Medical Center','health regulation']::text[],
  73,
  FALSE,
  c.internal_url,
  FALSE,
  'Texas HHSC Birth Tourism Investigation: July 2026 Timeline',
  'Government',
  ARRAY['Texas birth tourism July 2026','HHSC investigation Mission Regional Medical Center','Abbott July 7 HHSC referral']::text[],
  jsonb_build_array(
    jsonb_build_object('href','/texas-politics','kind','hub','label','Texas Politics'),
    jsonb_build_object('href','/laws','kind','hub','label','Texas Laws'),
    jsonb_build_object('href','/news','kind','hub','label','Texas Newsroom')
  ),
  'The governor instructed HHSC to investigate reported hospital-linked marketing practices and refer any violations for enforcement; the later state referral and executive order are recorded separately.',
  ARRAY['rio-grande-valley','statewide']::text[],
  92,
  ARRAY['legacy_url_restored','official_source_restored','public_domain_image']::text[],
  3,
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
WHERE slug = 'live-2026-07-07-governor-abbott-orders-prompt-investigation-into-birth-tourism-package-wf40tc'
  AND image_generation_status = 'pending'
  AND featured_image_url LIKE 'https://commons.wikimedia.org/wiki/Special:Redirect/file/%'
  AND NULLIF(BTRIM(COALESCE(image_alt_text,'')),'') IS NOT NULL
  AND NULLIF(BTRIM(COALESCE(image_validation_note,'')),'') IS NOT NULL
  AND image_candidate_url IS NULL;
