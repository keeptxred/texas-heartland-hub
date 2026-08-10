-- Refresh the legacy /news/isd-tax-burdens story with the latest complete
-- statewide school-tax data available as of 2026-08-07.
--
-- Editorial note: the prior article ranked "counties" even though the Texas
-- Comptroller source reports tax rates by school district/taxing unit. Because
-- districts can cross county lines and counties can contain multiple ISDs with
-- different M&O and I&S rates, rolling that list forward as a county ranking
-- would imply a precision the source data does not provide. This migration
-- retires that framing, preserves the stable URL, and explains what is known
-- for Tax Year 2025 and what is still pending for Tax Year 2026.

WITH refreshed AS (
  SELECT jsonb_build_object(
    'updated', '2026-08-07',
    'intro', jsonb_build_array(
      $p$Texas school property-tax rates have changed substantially since the 2024 data used in the original version of this story. The newest complete statewide list published by the Texas Comptroller is for Tax Year 2025. Texas Education Agency guidance for Tax Year 2026 is already available, but district-specific 2026 maximum compressed rates are still being finalized and local school boards have not yet completed adoption of all 2026 tax rates.$p$,
      $p$That timing matters. A statewide "2026 county ranking" published today would mix final 2025 tax rates with preliminary 2026 compression rules. Keep TX Red is therefore retiring the old county-ranking format rather than relabeling older figures as 2026 data. This page now explains the latest official statewide numbers, how school tax rates actually work, and what Texans should watch as 2026 rates are adopted.$p$
    ),
    'sections', jsonb_build_array(
      jsonb_build_object(
        'heading', 'The latest complete statewide data is Tax Year 2025',
        'paragraphs', jsonb_build_array(
          $p$The Texas Comptroller's Property Tax Assistance Division currently publishes statewide School District Rates and Levies through Tax Year 2025. The list is built from tax-rate information reported by local appraisal districts and includes the rates imposed by individual school districts. The Comptroller says the school-district data is published with the School District Property Value Study and may later be updated as more accurate information becomes available.$p$,
          $p$That makes the 2025 file the appropriate source for statewide comparisons today. It would not be accurate to call those adopted 2025 rates "2026 rates," even though Texans are already in the 2026 calendar year and school districts are preparing their next tax-rate decisions.$p$
        )
      ),
      jsonb_build_object(
        'heading', 'Why we are no longer calling this a county ranking',
        'paragraphs', jsonb_build_array(
          $p$School property taxes are imposed by independent school districts, not by counties. A county can contain several school districts with different tax rates, and a school district can extend across county boundaries. As a result, there is no single school-district tax rate that applies to every homeowner in most Texas counties.$p$,
          $p$The original version of this article converted district data into a list of counties with the "highest school tax burdens." That shorthand can hide meaningful differences between households in the same county. A more useful comparison identifies the actual school district, its adopted M&O rate, its I&S debt rate when applicable, the taxable value of the home after exemptions, and the resulting school-tax bill.$p$
        )
      ),
      jsonb_build_object(
        'heading', 'What changes for Tax Year 2026',
        'paragraphs', jsonb_build_array(
          $p$On June 18, 2026, the Texas Education Agency set the statewide Tier One compression calculation for Tax Year 2026. The state maximum compressed rate is $0.6254 per $100 of taxable value. Because local property-value growth can produce additional compression, an individual district's Tier One maximum compressed rate may be lower.$p$,
          $p$TEA also set the 2026 local-compression floor at $0.5628 per $100, producing a possible Tier One maximum-compressed-rate range of $0.5628 to $0.6254. TEA says district-specific 2026 maximum compressed rates are determined after its summer data collection and made available in August. Districts then use those approved values as they adopt their 2026 tax rates under state law.$p$
        )
      ),
      jsonb_build_object(
        'heading', 'The 2026 ceiling for M&O tax effort',
        'paragraphs', jsonb_build_array(
          $p$TEA says the maximum M&O tax rate for a Texas school district in Tax Year 2026 is generally $0.7954 per $100 of taxable value: the $0.6254 state maximum compressed Tier One rate plus as many as 17 cents of Tier Two enrichment. Districts receiving greater local compression will have a lower maximum M&O rate. TEA notes an exception for certain Harris County districts with special statutory authorization.$p$,
          $p$The M&O rate is only part of a district's total property-tax rate. A district may also levy an Interest and Sinking, or I&S, rate to pay voter-approved debt. That is one reason two districts with similar operating tax effort can still produce different total school tax rates and different bills for homeowners.$p$
        )
      ),
      jsonb_build_object(
        'heading', 'Rate is not the same thing as tax burden',
        'paragraphs', jsonb_build_array(
          $p$A tax rate alone does not tell you how much a homeowner pays. The bill also depends on taxable property value, homestead and other exemptions, appraisal limits, and the specific taxing units serving the property. Two homeowners facing the same school-district rate can owe very different amounts because their taxable values are different.$p$,
          $p$Likewise, a county with expensive homes can generate large school-tax levies even when its district rates are not the highest in Texas. A rural district can have a comparatively high rate but a smaller dollar levy because taxable property values are lower. For readers comparing places to live, the most useful number is the estimated tax bill for a particular property and school district, not a county label by itself.$p$
        )
      ),
      jsonb_build_object(
        'heading', 'How to compare Texas school taxes correctly',
        'paragraphs', jsonb_build_array(
          $p$Start with the school district that serves the property. Check the district's total adopted rate and, when available, separate the M&O and I&S portions. Then apply the rate to the property's taxable value after the exemptions that actually apply to that owner. The county appraisal district and county tax assessor-collector are the best local sources for parcel-specific values and adopted taxing-unit rates.$p$,
          $p$For statewide comparisons, the Comptroller's School District Rates and Levies file provides a consistent source across Texas. Keep TX Red's property-tax data pipeline also uses the Comptroller's 2025 files for school districts, counties, cities and special districts so our county and tax tools are based on the same statewide source.$p$
        )
      ),
      jsonb_build_object(
        'heading', 'When a true 2026 comparison will be possible',
        'paragraphs', jsonb_build_array(
          $p$TEA's 2026 compression guidance is now final at the statewide level, but that is not the same as having every district's adopted 2026 total tax rate. TEA said district-specific maximum compressed rates would become available in August after its Local Property Value Survey process. School boards must then adopt local rates, including any debt-service component.$p$,
          $p$Once those local 2026 rates are adopted and the statewide reporting is complete, Keep TX Red can make an apples-to-apples 2026 comparison. Until then, the latest complete statewide adopted-rate dataset remains Tax Year 2025. We will not present preliminary or prior-year figures as final 2026 tax rates.$p$
        )
      ),
      jsonb_build_object(
        'heading', 'What changed from the original story',
        'paragraphs', jsonb_build_array(
          $p$This article originally highlighted ten Texas counties using 2024 school-tax information. It has been substantially updated because newer statewide data is available and because county-level labels can obscure the fact that school districts, rather than counties, impose school property-tax rates. The stable URL has been retained so existing links continue to work.$p$,
          $p$The current version uses the Texas Comptroller as the authority for the latest complete statewide adopted-rate dataset and the Texas Education Agency as the authority for 2026 school-finance compression rules. When complete 2026 adopted district rates become available statewide, this page should be refreshed again using those final figures.$p$
        )
      )
    ),
    'faq', jsonb_build_array(
      jsonb_build_object(
        'q', 'Are 2026 Texas school district tax rates final?',
        'a', 'Not statewide. TEA has published the 2026 compression rules, but district-specific maximum compressed rates and locally adopted total rates follow the summer property-value and local adoption process.'
      ),
      jsonb_build_object(
        'q', 'What is the latest complete statewide school tax-rate dataset?',
        'a', 'The Texas Comptroller currently publishes a complete statewide School District Rates and Levies file for Tax Year 2025.'
      ),
      jsonb_build_object(
        'q', 'What is the 2026 Texas state maximum compressed rate?',
        'a', 'TEA set the Tax Year 2026 state maximum compressed rate at $0.6254 per $100 of taxable value, with a local-compression floor of $0.5628.'
      ),
      jsonb_build_object(
        'q', 'Does every homeowner in a Texas county pay the same school tax rate?',
        'a', 'No. School districts set school property-tax rates. Counties can contain multiple districts, and some districts cross county lines, so the applicable rate depends on the property’s school district.'
      ),
      jsonb_build_object(
        'q', 'What is the highest M&O rate allowed in 2026?',
        'a', 'TEA says the general maximum M&O rate for Tax Year 2026 is $0.7954 per $100, though districts with additional local compression have lower maximums and TEA notes a special statutory exception for certain Harris County districts.'
      )
    ),
    'sources', jsonb_build_array(
      jsonb_build_object('label', 'Texas Comptroller — Tax Rates and Levies', 'url', 'https://comptroller.texas.gov/taxes/property-tax/rates/'),
      jsonb_build_object('label', 'Texas Comptroller — 2025 School District Rates and Levies', 'url', 'https://comptroller.texas.gov/taxes/property-tax/docs/2025-school-district-rates-levies.xlsx'),
      jsonb_build_object('label', 'Texas Education Agency — Tax Year 2026 Maximum Compressed Tax Rates', 'url', 'https://tea.texas.gov/taa-letters/tax-year-2026-maximum-compressed-tax-rates')
    ),
    'keyTakeaways', jsonb_build_array(
      'Tax Year 2025 is the latest complete statewide adopted school-district rate dataset published by the Texas Comptroller.',
      'TEA set the 2026 state maximum compressed rate at $0.6254 per $100 and the local-compression floor at $0.5628.',
      'The general 2026 maximum M&O rate is $0.7954 per $100, before any lower limit produced by local compression.',
      'School districts—not counties—impose school property-tax rates, so a single county ranking can misstate what individual homeowners actually pay.',
      'Keep TX Red will not label preliminary or prior-year figures as final 2026 tax rates.'
    )
  ) AS content
), refreshed_with_text AS (
  SELECT
    content,
    (
      SELECT string_agg(value, ' ')
      FROM jsonb_array_elements_text(
        jsonb_path_query_array(content, '$.intro[*]') ||
        jsonb_path_query_array(content, '$.sections[*].paragraphs[*]') ||
        jsonb_path_query_array(content, '$.faq[*].a') ||
        jsonb_path_query_array(content, '$.keyTakeaways[*]')
      )
    ) AS body_text
  FROM refreshed
)
UPDATE public.daily_articles AS article
SET
  title = 'Texas School Tax Burdens: The Latest 2025 Data and What Changes in 2026',
  seo_headline = 'Texas School Property Tax Rates: Latest 2025 Data and 2026 Changes',
  headline_variants = jsonb_build_object(
    'a', 'Texas School Tax Burdens: The Latest 2025 Data and What Changes in 2026',
    'b', 'Texas School Property Taxes Changed Again. Here Is What the Latest Data Shows'
  ),
  dek = 'The old 2024 county ranking is outdated. Here is the latest complete statewide school-tax data, the 2026 compression rules, and why district-level comparisons are more accurate than county rankings.',
  category = 'Tax & Spending',
  discover_category = 'business',
  source_name = 'Texas Comptroller / Texas Education Agency',
  source_url = 'https://comptroller.texas.gov/taxes/property-tax/rates/',
  keywords = ARRAY[
    'texas school property taxes',
    'texas school district tax rates',
    'texas property tax 2025',
    'texas property tax 2026',
    'school tax compression',
    'maximum compressed tax rate',
    'texas comptroller'
  ],
  seo_keywords = ARRAY[
    'texas school tax rates 2025',
    'texas school property taxes 2026',
    'texas maximum compressed tax rate 2026',
    'texas isd property tax rates',
    'texas school tax burden'
  ],
  body = refreshed_with_text.body_text,
  body_json = refreshed_with_text.content
FROM refreshed_with_text
WHERE article.slug = 'isd-tax-burdens';

-- Keep the discovery-feed card synchronized when this legacy story also has a
-- matching feed record.
UPDATE public.texas_news_feed
SET
  title = 'Texas School Tax Burdens: The Latest 2025 Data and What Changes in 2026',
  source = 'Texas Comptroller / Texas Education Agency',
  description = 'The latest complete statewide school-tax dataset is Tax Year 2025. TEA has published 2026 compression rules, but final local 2026 rates are still being adopted.'
WHERE internal_slug = 'isd-tax-burdens';
