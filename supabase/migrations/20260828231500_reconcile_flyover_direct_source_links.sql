-- Replace four legacy Google News wrapper URLs in the Aug. 10 reconciliation
-- with independently verified direct publisher pages. Only unlinked rows with
-- the exact reconciliation headline are eligible; published content is never touched.

update public.texas_news_feed
set link = 'https://www.ksat.com/video/sports/2026/08/13/faith-speed-gold-san-antonio-s-tate-taylor-dominates-world-athletics-u20-championships/',
    source = 'KSAT'
where title = 'Faith, speed, gold: San Antonio''s Tate Taylor dominates World Athletics U20 Championships'
  and internal_slug is null
  and texasdefined_slug is null;

update public.texas_news_feed
set link = 'https://www.nbcdfw.com/news/local/3-alligators-shot-fort-worth-nature-center-reward-offered/4060038/',
    source = 'NBC 5 Dallas-Fort Worth'
where title = '3 alligators shot in Fort Worth nature preserve, reward offered'
  and internal_slug is null
  and texasdefined_slug is null;

update public.texas_news_feed
set link = 'https://www.fox26houston.com/news/texas-appeals-court-upholds-state-fair-gun-ban.amp',
    source = 'FOX 26 Houston'
where title = 'Texas appeals court upholds State Fair gun ban'
  and internal_slug is null
  and texasdefined_slug is null;

update public.texas_news_feed
set link = 'https://www.kristv.com/news/local-news/in-your-neighborhood/corpus-christi/michelle-and-bryan-hofmann-say-goodbye-to-kris-6-news-after-years-serving-the-coastal-bend',
    source = 'KRIS 6 News Corpus Christi'
where title = 'Michelle and Bryan Hofmann say goodbye to KRIS 6 News after years serving the Coastal Bend'
  and internal_slug is null
  and texasdefined_slug is null;
