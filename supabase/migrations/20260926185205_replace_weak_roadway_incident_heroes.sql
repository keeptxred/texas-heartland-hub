-- Replace three generated empty-roadway heroes that passed an older loose
-- topical validator even though the stories were about protests or ICE shootings.
-- The replacements are truthful archive photographs with explicit context.

with fixes(slug, hero_url, alt_text, note) as (
  values
    (
      '2026-09-22-protesters-gather-at-texas-capitol-a-day-after-austin-ice-shooting',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Crowd_at_the_Texas_State_Capitol_for_the_No_Kings_Day_Protest_on_June_14,_2025_(54604569560).jpg',
      'Archive photograph of a protest crowd at the Texas State Capitol in Austin; not the September 2026 ICE-shooting protest.',
      'authoritative-image-exempt: manually reviewed exact-activity/exact-venue archive photograph of a protest crowd at the Texas State Capitol; Andy Thrasher, CC0 1.0. Representative protest image only; not the September 2026 event.'
    ),
    (
      '2026-09-22-ice-officer-shoots-man-in-north-austin',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/U_S_Immigration_and_Customs_Enforcement_conducts_Operation_Secure_Streets_(50044962302).jpg',
      'Archive U.S. Immigration and Customs Enforcement operation photograph; not the North Austin shooting.',
      'authoritative-image-exempt: manually reviewed U.S. Immigration and Customs Enforcement archive operation photograph; public-domain U.S. federal government work. Representative agency image only; not the North Austin shooting or a reenactment.'
    ),
    (
      '2026-09-21-man-injured-in-shooting-by-ice-officer-in-north-austin',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/U_S_Immigration_and_Customs_Enforcement_conducts_Operation_Secure_Streets_(50044962302).jpg',
      'Archive U.S. Immigration and Customs Enforcement operation photograph; not the North Austin shooting.',
      'authoritative-image-exempt: manually reviewed U.S. Immigration and Customs Enforcement archive operation photograph; public-domain U.S. federal government work. Representative agency image only; not the North Austin shooting or a reenactment.'
    )
)
update public.daily_articles da
set featured_image_url = fixes.hero_url,
    image_url = fixes.hero_url,
    image_alt_text = fixes.alt_text,
    image_generation_status = 'ready',
    image_validation_note = fixes.note,
    image_candidate_url = null,
    image_candidate_alt_text = null,
    quality_flags = array_remove(array_remove(coalesce(da.quality_flags, '{}'::text[]), 'image_requires_visual_validation'), 'missing_image')
from fixes
where da.slug = fixes.slug;
