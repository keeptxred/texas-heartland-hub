-- 2026-10-14 editorial triage of all 46 previously unresolved historical live-* URLs.
-- 32 dated/off-topic or unverifiable culture/entertainment/sports listicles:
-- retire from KeepTXRed without making up old copy or unrelated 301s.
-- 14 potentially relevant public-affairs leads remain pending ONLY for fresh
-- externally verified developments, never automatic old-story reconstruction.
-- This is a reversible ledger classification; NO article or URL is deleted.
WITH retired(slug) AS (VALUES ('live-2026-07-03-culinary-excellence-recognized-as-texas-chefs-secure-multiple-national-snwsbm'),
('live-2026-07-08-tracing-the-high-stakes-evolution-of-the-modern-film-industry-l9fs4x'),
('live-2026-07-09-lone-star-legends-texas-soccer-stars-who-defied-the-odds-on-the-global-bmn4yk'),
('live-2026-07-02-university-of-texas-student-savitha-shan-honored-with-education-access-wbhegm'),
('live-2026-07-07-north-american-exit-reshapes-world-cup-landscape-for-texas-host-cities-k12dm'),
('live-2026-07-07-texas-stars-in-hollywood-recognizing-the-lone-star-roots-of-marvel-cin-u1ocki'),
('live-2026-07-10-australian-spotted-jellyfish-migration-reaches-texas-coastal-waters-y9qwxy'),
('live-2026-06-28-new-texas-taco-rankings-highlight-top-emerging-taquerias-sluic1'),
('live-2026-07-02-texas-dining-costs-rise-as-free-chips-and-salsa-disappear-from-menus-m2gxi1'),
('live-2026-07-06-houston-international-communities-celebrate-historic-african-milestone-ie9nty'),
('live-2026-07-07-frisco-community-dynamics-evolve-amid-rising-national-influence-and-lo-w4ikwi'),
('live-2026-07-08-vatican-excommunication-order-impacts-traditionalist-catholic-chapels--cnskpe'),
('live-2026-07-10-exporting-the-pitmaster-craft-tracking-the-influence-of-texas-barbecue-upeiin'),
('live-2026-07-11-the-decades-of-rhythm-exploring-ten-musical-genres-that-define-the-lon-xjemxh'),
('live-2026-07-12-unpacking-the-linguistic-legacy-of-texas-s-massive-geography-mtb4tm'),
('live-2026-06-29-top-texas-authors-and-stories-for-your-summer-reading-list-2llurw'),
('live-2026-06-30-ranch-water-meet-dirty-martini-qoev0b'),
('live-2026-07-02-tracing-the-legacy-of-the-lone-star-state-landmark-eras-in-texas-music-r2h0es'),
('live-2026-07-03-digital-strategy-and-content-evolution-in-texas-media-publishing-ej8wov'),
('live-2026-07-03-exploring-the-hidden-gems-of-the-texas-gulf-coast-shoreline-ljn1lp'),
('live-2026-07-10-texas-high-school-bbq-competition-highlights-top-student-pitmasters-iv0cpg'),
('live-2026-06-27-houston-hip-hop-legend-dj-screw-catalog-headed-to-global-streaming-pla-rx7omf'),
('live-2026-07-03-texas-political-landscape-shifts-as-cultural-identity-and-masculinity--2alk3h'),
('live-2026-07-04-interactive-independence-day-entertainment-features-texas-culture-and--55dj6'),
('live-2026-07-04-preserving-the-tradition-of-the-iconic-texas-dance-hall-and-honky-tonk-dzii3l'),
('live-2026-07-06-echoes-of-the-lone-star-how-musical-identity-shapes-the-texas-brand-fda2ch'),
('live-2026-07-07-texas-cultural-trends-the-growing-popularity-of-lone-star-state-intera-qurtrv'),
('live-2026-07-08-texas-author-explores-healing-through-nature-in-new-memoir-midstream-atqlha'),
('live-2026-07-08-vatican-schism-impacting-texas-catholic-communities-and-parish-leaders-f8fcln'),
('live-2026-07-09-mexican-empalmes-gaining-popularity-across-the-texas-culinary-landscap-8tz159'),
('live-2026-07-09-the-full-story-behind-gracie-the-giraffe-s-famous-hill-country-expedit-mcnvrp'),
('live-2026-07-09-thermostat-wars-why-the-78-degree-recommendation-heat-up-texas-politic-32038b'))
UPDATE public.article_url_registry r
SET recovery_status='retired_low_value',
    retired_reason='Editorial triage 2026-10-14: expired one-off or out-of-scope lifestyle, culture, sports, religion or generic headline, not suitable for current KeepTXRed political coverage. Original copy absent; no current-event republication or invented redirect.',
    notes=concat_ws(' | ',NULLIF(r.notes,''),'EDITORIAL_TRIAGE_2026_10_14: no KeepTXRed reconstruction; reconsider only as a new, independently sourced TexasDefined story where appropriate.')
FROM retired t
WHERE r.slug=t.slug
  AND r.recovery_status='pending'
  AND r.gsc_clicks=0
  AND NOT EXISTS(SELECT 1 FROM public.daily_articles d WHERE d.slug=r.slug)
  AND NOT EXISTS(SELECT 1 FROM public.article_slug_redirects s WHERE s.old_slug=r.slug)
  AND POSITION('EDITORIAL_TRIAGE_2026_10_14' IN COALESCE(r.notes,''))=0;

-- Preserve the remaining public-affairs leads as possible reporting assignments,
-- not permission to restore old copy. This deliberately does not label the
-- headline's assertions verified.
WITH followups(slug) AS (VALUES
  ('live-2026-07-09-texas-community-colleges-rebound-with-new-workforce-focus-uq2vra'),
  ('live-2026-07-10-hollywood-expands-texas-footprint-as-motion-picture-association-partne-ew4vce'),
  ('live-2026-07-02-austin-robotics-firm-unveils-massive-facility-for-humanoid-machine-dev-90almg'),
  ('live-2026-07-03-legislative-inquiry-reveals-critical-infrastructure-gaps-following-hil-cvjzgm'),
  ('live-2026-07-09-senate-district-8-showdown-why-the-paxton-talarico-battle-in-collin-co-j37z7b'),
  ('live-2026-07-10-federal-agency-faces-scrutiny-after-houston-officer-involved-shooting--s2fagc'),
  ('live-2026-06-29-renowned-texas-reporter-details-encounters-with-convicted-con-artist-tyf6qk'),
  ('live-2026-06-30-governor-abbott-criticizes-recent-judicial-action-on-birthright-citize-ikvhrm'),
  ('live-2026-07-01-fort-worth-leadership-faces-scrutiny-over-lobbying-connections-and-dat-h90fs5'),
  ('live-2026-07-02-governor-abbott-bolsters-texas-dc-relations-and-high-demand-job-traini-yxw3hq'),
  ('live-2026-06-28-governor-abbott-announces-texas-semiconductor-innovation-fund-grant-to-bx1y0k'),
  ('live-2026-07-01-shift-in-ice-enforcement-tactics-impacts-texas-communities-as-arrest-d-gh8kzg'),
  ('live-2026-07-07-scrutiny-intensifies-over-ken-paxton-s-residential-voting-records-amid-58gii3'),
  ('live-2026-07-09-mexican-officials-pursue-legal-action-after-houston-ice-shooting-incid-96qjk3')
)
UPDATE public.article_url_registry r
SET notes=concat_ws(' | ',NULLIF(r.notes,''),
  'EDITORIAL_TRIAGE_2026_10_14: follow-up candidate ONLY; find a new material October development and confirm official records before a new article. Do not promote this July URL as recent news.')
FROM followups f
WHERE r.slug=f.slug
  AND r.recovery_status='pending'
  AND r.gsc_clicks=0
  AND NOT EXISTS(SELECT 1 FROM public.daily_articles d WHERE d.slug=r.slug)
  AND NOT EXISTS(SELECT 1 FROM public.article_slug_redirects s WHERE s.old_slug=r.slug)
  AND POSITION('EDITORIAL_TRIAGE_2026_10_14' IN COALESCE(r.notes,''))=0;