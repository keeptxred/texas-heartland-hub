-- Replace the July 18 article's state-race framing with a fully sourced account.
-- The public URL is retained so existing links and search signals resolve to the
-- corrected article. James Talarico is the Democratic nominee for the 2026
-- U.S. Senate election in Texas. Reid Hoffman's reported $10 million went to
-- Lone Star Rising, an independent-expenditure-only committee, not directly
-- to Talarico's authorized campaign committee.

WITH corrected AS (
  SELECT jsonb_build_object(
    'updated', '2026-07-31',
    'intro', jsonb_build_array(
      $p$LinkedIn co-founder Reid Hoffman contributed $10 million in June 2026 to Lone Star Rising, a federal super PAC supporting Democratic nominee James Talarico in Texas's 2026 U.S. Senate election. The money did not go directly to Talarico's campaign. Federal Election Commission records identify Lone Star Rising as an unauthorized, independent-expenditure-only committee, which means it operates separately from the candidate's authorized committee.$p$,
      $p$That distinction changes the legal and political meaning of the story. Talarico is a Texas state representative, but the office he is seeking in 2026 is a seat in the United States Senate. The contest is a statewide federal election, not a Texas Senate district race, and its fundraising is governed by federal campaign-finance law.$p$
    ),
    'sections', jsonb_build_array(
      jsonb_build_object(
        'heading', 'What the FEC records show',
        'paragraphs', jsonb_build_array(
          $p$The Federal Election Commission lists Lone Star Rising under committee ID C00918268. Its committee profile classifies it as an active quarterly super PAC and an unauthorized committee. Through June 30, 2026, the committee reported about $21.7 million in total receipts and approximately $12.7 million in cash on hand.$p$,
          $p$Reporting based on the committee's second-quarter filing identified a $10 million June contribution from Hoffman. The contribution represented nearly 80 percent of the almost $13 million that Lone Star Rising raised during the quarter. Hoffman had also previously contributed $1 million in February and $500,000 in January to the same outside group.$p$
        )
      ),
      jsonb_build_object(
        'heading', 'The race is for the United States Senate',
        'paragraphs', jsonb_build_array(
          $p$FEC candidate records list James Talarico as a Democratic candidate for the U.S. Senate from Texas under candidate ID S6TX00479. He is the Democratic nominee in the November 2026 statewide general election. His Republican opponent is Texas Attorney General Ken Paxton.$p$,
          $p$References to a Texas Senate seat or a Texas Senate district are incorrect in this context. The Texas Senate is the upper chamber of the state Legislature and has 31 geographic districts. The U.S. Senate is part of Congress, and Texans vote statewide to elect the state's two U.S. senators.$p$
        )
      ),
      jsonb_build_object(
        'heading', 'The $10 million was not a direct campaign contribution',
        'paragraphs', jsonb_build_array(
          $p$Lone Star Rising is not Talarico's authorized candidate committee. It is an outside organization that may pay for independent advertising and other political activity supporting or opposing federal candidates. The FEC describes super PACs as independent-expenditure-only committees that may accept unlimited contributions from individuals, corporations, labor organizations and other political committees.$p$,
          $p$Federal rules prohibit a super PAC from using those funds to make a direct contribution to a federal candidate or from financing coordinated communications with a candidate or campaign. Accordingly, the $10 million should be described as a contribution to a pro-Talarico super PAC, not as money donated to Talarico or placed under his campaign's control.$p$
        )
      ),
      jsonb_build_object(
        'heading', 'Federal contribution rules apply',
        'paragraphs', jsonb_build_array(
          $p$Direct donations to an authorized federal candidate committee follow a different set of limits. For the 2025-2026 cycle, the FEC says an individual may contribute up to $3,500 per election to a candidate committee. Primary, runoff and general elections generally have separate limits.$p$,
          $p$Those candidate limits do not cap contributions to an independent-expenditure-only super PAC. The legal separation is central: a donor may provide an unlimited amount to the outside committee, but the committee must make its spending decisions independently and may not convert those funds into direct or coordinated support for the candidate.$p$
        )
      ),
      jsonb_build_object(
        'heading', 'Why the donation matters politically',
        'paragraphs', jsonb_build_array(
          $p$A contribution of this size gives Lone Star Rising substantial capacity to purchase advertising, conduct voter communications and finance other independent activity in an expensive statewide federal contest. Texas contains numerous major media markets, so outside spending can materially expand the volume and geographic reach of campaign messages.$p$,
          $p$The filing also adds scrutiny to Talarico's campaign-finance message. Talarico has criticized the influence of wealthy donors and has advocated restrictions on super PACs. Supporters may argue that candidates cannot control independent groups operating under current law, while opponents may point to the outside support when challenging his reform platform. Those are political arguments; the verified fact is that the funds went to the independent committee.$p$
        )
      ),
      jsonb_build_object(
        'heading', 'How to read the fundraising totals',
        'paragraphs', jsonb_build_array(
          $p$Candidate fundraising and super PAC fundraising should be reported separately. Talarico for Texas is the candidate's principal campaign committee. Lone Star Rising is an unauthorized outside committee. Combining their receipts without explaining the separation can mislead readers about how much money the candidate directly raised or controls.$p$,
          $p$The same distinction applies to spending. Candidate committees purchase their own advertising and campaign services, while super PACs report independent expenditures and other disbursements separately. FEC committee IDs, filings and transaction records provide the authoritative trail for determining which organization received or spent each dollar.$p$
        )
      ),
      jsonb_build_object(
        'heading', 'What Texans should take from the filing',
        'paragraphs', jsonb_build_array(
          $p$The accurate description is straightforward: Hoffman gave $10 million to Lone Star Rising, a super PAC supporting Talarico's campaign for the U.S. Senate. The contribution was part of federal election activity tied to a statewide Texas contest, and the filing is publicly available for voters to examine through the FEC.$p$,
          $p$The filing does not show a $10 million direct donation to Talarico's campaign, nor does it concern a race for the Texas Senate. Keeping those entities separate is necessary for voters comparing campaign resources, evaluating donor influence and understanding the federal rules governing the 2026 election.$p$
        )
      )
    ),
    'faq', jsonb_build_array(
      jsonb_build_object(
        'q', 'What office is James Talarico running for in 2026?',
        'a', 'James Talarico is the Democratic nominee for the United States Senate in Texas. It is a statewide federal election, not a race for the Texas Senate.'
      ),
      jsonb_build_object(
        'q', 'Did Reid Hoffman give $10 million directly to Talarico?',
        'a', 'No. FEC filings show the contribution went to Lone Star Rising, an unauthorized super PAC supporting Talarico. It did not go to Talarico for Texas, his authorized candidate committee.'
      ),
      jsonb_build_object(
        'q', 'Can a super PAC accept a $10 million contribution?',
        'a', 'Yes. Federal independent-expenditure-only committees may accept unlimited contributions, but they cannot make direct contributions to federal candidates or coordinate their spending with a candidate or campaign.'
      ),
      jsonb_build_object(
        'q', 'Which campaign-finance laws govern this money?',
        'a', 'Federal campaign-finance law and FEC reporting rules apply because the activity concerns a U.S. Senate election and a federally registered super PAC.'
      )
    ),
    'sources', jsonb_build_array(
      jsonb_build_object('label', 'FEC — Lone Star Rising PAC (C00918268)', 'url', 'https://www.fec.gov/data/committee/C00918268/'),
      jsonb_build_object('label', 'FEC — James Talarico candidate record (S6TX00479)', 'url', 'https://www.fec.gov/data/candidate/S6TX00479/'),
      jsonb_build_object('label', 'FEC — Registering as a Super PAC', 'url', 'https://www.fec.gov/help-candidates-and-committees/filing-pac-reports/registering-super-pac/'),
      jsonb_build_object('label', 'FEC — 2025-2026 candidate contribution limits', 'url', 'https://www.fec.gov/help-candidates-and-committees/candidate-taking-receipts/contribution-limits/'),
      jsonb_build_object('label', 'Texas Tribune — Hoffman contribution to pro-Talarico super PAC', 'url', 'https://www.texastribune.org/2026/07/16/texas-senate-james-talarico-super-pac-reid-hoffman-10-million-lone-star-rising/')
    ),
    'entities', jsonb_build_array(
      jsonb_build_object(
        'type', 'Person',
        'name', 'James Talarico',
        'identifier', 'candidate-james-talarico-democratic-race-2026-us-senate',
        'url', 'https://keeptxred.com/elections/candidates/james-talarico-democratic-race-2026-us-senate',
        'sameAs', 'https://www.fec.gov/data/candidate/S6TX00479/'
      ),
      jsonb_build_object(
        'type', 'Event',
        'name', '2026 Texas U.S. Senate election',
        'identifier', 'race-2026-us-senate',
        'url', 'https://keeptxred.com/elections/races/2026-us-senate'
      ),
      jsonb_build_object(
        'type', 'Organization',
        'name', 'Lone Star Rising PAC',
        'identifier', 'C00918268',
        'sameAs', 'https://www.fec.gov/data/committee/C00918268/'
      )
    ),
    'keyTakeaways', jsonb_build_array(
      'James Talarico is running for the U.S. Senate in a statewide federal election.',
      'Reid Hoffman contributed $10 million to Lone Star Rising, not directly to Talarico or his authorized campaign committee.',
      'Lone Star Rising is FEC committee C00918268, an unauthorized independent-expenditure-only committee.',
      'Federal super PAC rules—not Texas state campaign-finance rules—govern the contribution.'
    )
  ) AS content
), corrected_with_text AS (
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
  FROM corrected
)
UPDATE public.daily_articles AS article
SET
  title = 'Reid Hoffman Gives $10M to Super PAC Backing Talarico''s U.S. Senate Bid',
  seo_headline = 'Reid Hoffman Gives $10M to Pro-Talarico U.S. Senate Super PAC',
  headline_variants = jsonb_build_object(
    'a', 'Reid Hoffman Gives $10M to Pro-Talarico U.S. Senate Super PAC',
    'b', '$10M Hoffman Contribution Boosts Super PAC Backing Talarico'
  ),
  dek = 'FEC records show Reid Hoffman gave $10 million to a super PAC supporting James Talarico''s 2026 U.S. Senate campaign in Texas.',
  category = 'Elections',
  discover_category = 'politics',
  source_name = 'Federal Election Commission',
  source_url = 'https://www.fec.gov/data/committee/C00918268/',
  keywords = ARRAY[
    'james talarico',
    'reid hoffman',
    '2026 texas us senate election',
    'lone star rising pac',
    'federal election commission',
    'super pac',
    'campaign finance'
  ],
  seo_keywords = ARRAY[
    'james talarico us senate',
    'reid hoffman 10 million donation',
    'lone star rising super pac',
    'texas us senate race 2026',
    'fec campaign finance'
  ],
  body = corrected_with_text.body_text,
  body_json = corrected_with_text.content
FROM corrected_with_text
WHERE article.slug = 'live-2026-07-18-silicon-valley-injects-historic-10-million-into-texas-senate-race-to-s-tvf41v';

-- Correct the associated discovery-feed metadata while retaining its original
-- source link and stable internal article relationship.
UPDATE public.texas_news_feed
SET
  title = 'Reid Hoffman Gives $10M to Super PAC Backing Talarico''s U.S. Senate Bid',
  source = 'Federal Election Commission / Texas Tribune',
  description = 'FEC records show the $10 million went to Lone Star Rising, an independent super PAC supporting James Talarico in the 2026 Texas U.S. Senate election.'
WHERE internal_slug = 'live-2026-07-18-silicon-valley-injects-historic-10-million-into-texas-senate-race-to-s-tvf41v';
