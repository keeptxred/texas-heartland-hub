-- Persist externally verified Aug. 10 Flyover recovery candidates without
-- publishing them. URLs are stable keys; generated feed IDs are never hardcoded.

with recovered(story_key,expected_site,target_section,title,source,link,description,pub_date,caveat) as (values
('don-nelson','keeptxred','Sports','Don Nelson, Hall of Fame coach and five-time NBA champion as a player, dies at 86','NBA / Associated Press','https://www.nba.com/news/don-nelson-second-winningest-nba-coach-who-won-5-titles-as-a-celtics-player-dies-at-86','Source-backed recovery for the Aug. 10 Flyover benchmark. Don Nelson died at 86; editorial review required.','2026-08-09T20:31:00Z'::timestamptz,null),
('rangers-jonah-bride','keeptxred','Sports','Texas Rangers select Jonah Bride from Triple-A Round Rock and option Alejandro Osuna','Texas Rangers / MLB','https://www.mlb.com/rangers/roster/transactions/2026/08','Official MLB transaction log verifies the Aug. 9 roster moves; editorial review required.','2026-08-09T18:00:00Z'::timestamptz,null),
('caseys-pak-a-sak','keeptxred','Business','Casey’s agrees to acquire 24 Pak-A-Sak stores in Texas','C-Store Dive','https://www.cstoredive.com/news/caseys-to-acquire-24-store-texas-chain/827472/','Source-backed recovery of the 24-store Pak-A-Sak acquisition; editorial review required.','2026-08-11T12:00:00Z'::timestamptz,null),
('sushi-door-dash-dispute','keeptxred','Business','Houston sushi restaurant ends DoorDash BOGO deal after repeated disputed orders','Chron','https://www.chron.com/food/article/houston-restaurant-doordash-scammer-22378079.php','Source-backed recovery for Sushi by the Heights and the DoorDash promotion dispute; editorial review required.','2026-08-10T12:00:00Z'::timestamptz,null),
('kaylee-hottle-scholarship','texasdefined','Texas Culture','Texas School for the Deaf establishes Kaylee Hottle memorial scholarship','FOX 7 Austin','https://www.fox7austin.com/news/kaylee-hottle-memorial-scholarship-texas-school-for-the-deaf','FOX 7 verifies the memorial scholarship; editorial review required.','2026-08-06T19:57:00Z'::timestamptz,'Do not state the Flyover dollar amount unless separately verified.'),
('richardson-lego-public-safety','texasdefined','Texas Culture','Richardson unveils LEGO replica of its police and fire public safety campus','Richardson Police Department','https://www.richardsonpolice.net/Home/Components/News/News/8814/5439?backlist=%2F','Official Richardson Police source verifies the John Capers LEGO replica; editorial review required.','2026-07-20T16:00:00Z'::timestamptz,null),
('nueces-1862-history','texasdefined','Texas History','Battle of the Nueces: Confederate soldiers attack German Unionists fleeing Texas in 1862','Texas State Historical Association','https://www.tshaonline.org/handbook/entries/nueces-battle-of-the','Authoritative TSHA history source verifies the Aug. 10, 1862 event; editorial review required.','1862-08-10T12:00:00Z'::timestamptz,null),
('lakeside-fentanyl-children','keeptxred','Texas News','North Texas couple wanted after four children under 10 test positive for fentanyl','CBS Texas','https://www.cbsnews.com/texas/news/north-texas-couple-wanted-child-endangerment-fentanyl-investigation-august-2026/','CBS Texas source verifies the police allegations; editorial review and careful attribution required.','2026-08-08T19:26:00Z'::timestamptz,'Preserve allegation language and attribution.'),
('texas-born-county-ranking','texasdefined','Texas Culture','Texas counties ranked by share of residents born in the state','Stacker','https://stacker.com/stories/texas/counties-most-born-and-bred-residents-texas/','Stacker/Census methodology verifies Jim Hogg at 95.9% and Calhoun at 79.1%; editorial review required.','2026-08-07T12:00:00Z'::timestamptz,null),
('eds-plano-implosion','texasdefined','Texas Business','Old EDS Plano campus imploded for AT&T’s new headquarters project','Dallas Morning News / Yahoo','https://currently.att.yahoo.com/att/old-eds-god-pod-imploded-230000176.html','Source-backed recovery of the Plano EDS demolition for the AT&T headquarters project; editorial review required.','2026-08-07T23:00:00Z'::timestamptz,null),
('bastrop-council-retreat','keeptxred','Politics','Bastrop City Council holds offsite workshops in Fredericksburg, drawing criticism','Texas Scorecard','https://texasscorecard.com/local/bastrops-city-council-holds-meetings-over-100-miles-away/','Source-backed recovery of the Fredericksburg workshops and Rep. Stan Gerdes response; editorial review required.','2026-08-07T12:00:00Z'::timestamptz,null),
('dallas-pedestrian-waymo','keeptxred','Texas News','Dallas pedestrian dies after SUV impact throws him into Waymo vehicle','CBS Texas','https://www.cbsnews.com/texas/news/waymo-involved-deadly-crash-man-hit-dallas-8-8-2026/','CBS Texas verifies the Maple Avenue fatal crash; editorial review and precise causation wording required.','2026-08-08T21:45:00Z'::timestamptz,'Preserve police/Waymo attribution and avoid overstating autonomous-vehicle causation.'),
('texas-stadium-mavericks-redevelopment','keeptxred','Business','Irving mayor prioritizes redevelopment of former Texas Stadium site','CBS Texas','https://www.cbsnews.com/texas/news/irving-new-mayor-85-develop-old-texas-stadium-site-cowboys-left-14-years-ago/','CBS Texas verifies Al Zapanta’s priority and the 80-acre former stadium site; editorial review required.','2026-08-09T10:00:00Z'::timestamptz,'Do not state Mavericks-specific discussions unless separately sourced.')
), inserted as (
  insert into public.texas_news_feed(title,source,link,description,pub_date,trend_source,target_site,target_section,routing_type,ready_for_rewrite,viral_score,viral_scored_at,classification_confidence,viral_signals)
  select title,source,link,description,pub_date,'Texas Flyover Aug 10 recovery',expected_site,target_section,'SEO_ARTICLE',false,0,now(),1,
    jsonb_strip_nulls(jsonb_build_object('editorial_lane','REVIEW','auto_publish_eligible',false,'flyover_aug10_recovery',true,'source_caveat',caveat))
  from recovered
  on conflict (link) do nothing
  returning link
)
update public.texas_news_feed f
set target_site=r.expected_site,
    target_section=r.target_section,
    ready_for_rewrite=false,
    viral_score=0,
    viral_scored_at=coalesce(f.viral_scored_at,now()),
    classification_confidence=coalesce(f.classification_confidence,1),
    viral_signals=coalesce(f.viral_signals,'{}'::jsonb)||jsonb_strip_nulls(jsonb_build_object('editorial_lane','REVIEW','auto_publish_eligible',false,'flyover_aug10_recovery',true,'source_caveat',r.caveat))
from recovered r
where f.link=r.link and f.internal_slug is null;

with recovered(story_key,link,caveat) as (values
('don-nelson','https://www.nba.com/news/don-nelson-second-winningest-nba-coach-who-won-5-titles-as-a-celtics-player-dies-at-86',null),
('rangers-jonah-bride','https://www.mlb.com/rangers/roster/transactions/2026/08',null),
('caseys-pak-a-sak','https://www.cstoredive.com/news/caseys-to-acquire-24-store-texas-chain/827472/',null),
('sushi-door-dash-dispute','https://www.chron.com/food/article/houston-restaurant-doordash-scammer-22378079.php',null),
('kaylee-hottle-scholarship','https://www.fox7austin.com/news/kaylee-hottle-memorial-scholarship-texas-school-for-the-deaf','Dollar amount remains separately review-gated.'),
('richardson-lego-public-safety','https://www.richardsonpolice.net/Home/Components/News/News/8814/5439?backlist=%2F',null),
('nueces-1862-history','https://www.tshaonline.org/handbook/entries/nueces-battle-of-the',null),
('lakeside-fentanyl-children','https://www.cbsnews.com/texas/news/north-texas-couple-wanted-child-endangerment-fentanyl-investigation-august-2026/','Allegation-sensitive.'),
('texas-born-county-ranking','https://stacker.com/stories/texas/counties-most-born-and-bred-residents-texas/',null),
('eds-plano-implosion','https://currently.att.yahoo.com/att/old-eds-god-pod-imploded-230000176.html',null),
('bastrop-council-retreat','https://texasscorecard.com/local/bastrops-city-council-holds-meetings-over-100-miles-away/',null),
('dallas-pedestrian-waymo','https://www.cbsnews.com/texas/news/waymo-involved-deadly-crash-man-hit-dallas-8-8-2026/','Fatality/causation-sensitive.'),
('texas-stadium-mavericks-redevelopment','https://www.cbsnews.com/texas/news/irving-new-mayor-85-develop-old-texas-stadium-site-cowboys-left-14-years-ago/','Mavericks-specific detail separately review-gated.')
)
update public.flyover_aug10_reconciliation r
set disposition='review_ready',
    feed_id=f.id,
    feed_title=f.title,
    evidence_note='Verified source recovered; editorial review required.'||case when recovered.caveat is null then '' else ' '||recovered.caveat end,
    last_verified_at=now(),
    updated_at=now()
from recovered
join public.texas_news_feed f on f.link=recovered.link
where r.story_key=recovered.story_key;

-- Resolve known exact feed candidates without hardcoding generated IDs.
with exact(story_key,title) as (values
('state-fair-gun-ban','Texas appeals court upholds State Fair gun ban'),
('fort-worth-alligators-shot','3 alligators shot in Fort Worth nature preserve, reward offered'),
('ingram-school-flood-repairs','Ingram ISD students return to class as flood repairs continue'),
('tate-taylor-sprint-double','Faith, speed, gold: San Antonio''s Tate Taylor dominates World Athletics U20 Championships'),
('cowboys-quinnen-williams','Quinnen Williams signs three-year, $105.9 million extension with Cowboys'),
('kris6-anchor-layoffs','Michelle and Bryan Hofmann say goodbye to KRIS 6 News after years serving the Coastal Bend')
)
update public.flyover_aug10_reconciliation r
set disposition='review_ready',feed_id=f.id,feed_title=f.title,last_verified_at=now(),updated_at=now()
from exact join public.texas_news_feed f on f.title=exact.title
where r.story_key=exact.story_key and f.internal_slug is null;

-- Enforce the expected routing and review hold on every review-ready feed row.
update public.texas_news_feed f
set target_site=r.expected_site,
    ready_for_rewrite=false,
    viral_signals=coalesce(f.viral_signals,'{}'::jsonb)||jsonb_build_object('editorial_lane','REVIEW','auto_publish_eligible',false,'flyover_aug10_reconciliation',true)
from public.flyover_aug10_reconciliation r
where r.disposition='review_ready' and r.feed_id=f.id and f.internal_slug is null;

update public.flyover_aug10_reconciliation
set disposition='out_of_scope',feed_id=null,feed_title=null,
    evidence_note='Recovered source places Zac Waters in Lehi, Utah; do not force this item onto a Texas site.',last_verified_at=now(),updated_at=now()
where story_key='3d-printed-wheelchair';

update public.flyover_aug10_reconciliation
set disposition='source_needed',feed_id=null,feed_title=null,
    evidence_note='Texas Flyover links the claim to KENS 5, but the source blocks automated verification; keep held until the patient details are independently verified.',last_verified_at=now(),updated_at=now()
where story_key='st-louis-encephalitis';

update public.flyover_aug10_reconciliation
set disposition='published',published_slug='2026-08-09-heb-store-upgrades-texas',last_verified_at=now(),updated_at=now()
where story_key='heb-store-upgrades' and exists(select 1 from public.daily_articles where slug='2026-08-09-heb-store-upgrades-texas');

update public.flyover_aug10_reconciliation
set disposition='published',published_slug='2026-08-10-canyon-lake-full-capacity-recovery',last_verified_at=now(),updated_at=now()
where story_key='canyon-lake-full' and exists(select 1 from public.texasdefined_articles where slug='2026-08-10-canyon-lake-full-capacity-recovery' and status='published');
