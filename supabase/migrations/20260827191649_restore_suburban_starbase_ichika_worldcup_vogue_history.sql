-- Restore five historical URLs with source-backed editorial content and preserved GSC metrics.

-- 1) Texas suburban/exurban growth
with a as (select 'live-2026-07-02-suburban-expansion-trends-transform-texas-economic-landscape-roszfh'::text slug), c as (select slug, '/news/'||slug internal_url from a)
insert into public.daily_articles (
 slug,category,title,dek,body,author,source_name,source_url,image_url,featured_image_url,image_alt_text,image_validation_note,published_at,kind,body_json,keywords,score,is_breaking,internal_url,is_ingested,seo_headline,discover_category,seo_keywords,internal_links,texas_impact_summary,affected_regions,content_quality_score,quality_flags,gsc_impressions,gsc_clicks
)
select c.slug,'Growth & Migration','Texas Exurbs Are Reshaping the State’s Growth Map','New Census estimates show Texas growth pushing strongly into outer-ring communities around Dallas-Fort Worth and Houston, changing where population, housing demand and infrastructure pressure are concentrated.',null,'Keep TX Red Newsroom','U.S. Census Bureau','https://www.census.gov/newsroom/press-releases/2026/vintage-2025-city-town-pop-estimates.html','https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Dallas_Texas_skyline_from_Reunion_Tower_September_2025_%28cropped%29.png/1280px-Dallas_Texas_skyline_from_Reunion_Tower_September_2025_%28cropped%29.png','https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Dallas_Texas_skyline_from_Reunion_Tower_September_2025_%28cropped%29.png/1280px-Dallas_Texas_skyline_from_Reunion_Tower_September_2025_%28cropped%29.png','Dallas skyline, representative of the North Texas metro economy','Representative regional image. Wikimedia Commons identifies the 2025 Dallas skyline photograph by IcedCowboyCoffee as CC0; the 1,280-pixel raster resolves as image/png.','2026-07-02T14:00:00Z','news',
jsonb_build_object(
 'updated','2026-08-27T19:16:49Z',
 'intro',jsonb_build_array(
  'Texas population growth is increasingly a story about the outer edges of major metropolitan areas. New Census Bureau estimates released in 2026 show the five fastest-growing U.S. cities with populations of at least 20,000 were all in Texas: Celina, Fulshear, Princeton, Melissa and Anna. Four are tied to the Dallas-Fort Worth region, while Fulshear sits outside Houston.',
  'The pattern matters because rapid population gains do more than enlarge city limits. They redirect demand for roads, schools, utilities, housing and commercial development toward communities that only a few years ago were far smaller. The historical Keep TX Red URL is restored around this verified demographic trend rather than around unsupported predictions in its old automated headline.'
 ),
 'sections',jsonb_build_array(
  jsonb_build_object('heading','The fastest-growing cities are on metropolitan fringes','paragraphs',jsonb_build_array(
   'Census estimates for July 2024 to July 2025 placed Celina first nationally with 24.6% growth, followed by Fulshear at 21.0%, Princeton at 18.1%, Melissa at 14.5% and Anna at 10.2%. Forney, Hutto and Greenville also appeared among the national top fifteen. The common thread is not downtown high-rise growth but expansion in smaller communities connected to large Texas labor markets.',
   'A separate Census analysis of metropolitan growth found Dallas-Fort Worth reached about 8.5 million residents in 2025, up 11% from April 2020. Celina had grown 276.8% over that five-year span, and much of the metro area’s strongest growth occurred farthest from the urban center.'
  )),
  jsonb_build_object('heading','Why exurban growth changes the economic map','paragraphs',jsonb_build_array(
   'When households move farther from established city centers, public and private investment follows. New subdivisions require water and sewer capacity, road improvements and public-safety coverage. School districts can face enrollment growth before the tax base and facilities fully catch up. Retail, medical offices and employers then respond to a population base that is becoming large enough to support more local services.',
   'The result is not that Dallas, Fort Worth or Houston stop mattering. Instead, the economic footprint of those metropolitan areas stretches farther outward. Commutes, freight movement, housing affordability and local tax decisions become linked across a wider geography.'
  )),
  jsonb_build_object('heading','What the numbers do and do not prove','paragraphs',jsonb_build_array(
   'Population estimates document where people are being added; they do not by themselves establish why every household moved or guarantee that the same growth rate will continue. Interest rates, housing supply, employment and local infrastructure policy can all change future patterns.',
   'What the 2025 estimates do establish is that Texas continued to dominate the national list of fast-growing midsize cities, and that the DFW fringe was one of the clearest examples of exurban expansion in the country. That is the durable fact this restoration preserves.'
  )),
  jsonb_build_object('heading','Restoration note','paragraphs',jsonb_build_array(
   'Google Search Console recorded 14 impressions for this historical URL. The original backing row later disappeared. This restoration preserves the exact slug and metric while replacing an ambiguous automated headline with Census-backed reporting and clearly attributed representative imagery.'
  ))
 ),
 'faq',jsonb_build_array(
  jsonb_build_object('q','Which Texas cities were the five fastest-growing nationally in the latest Census estimates?','a','Celina, Fulshear, Princeton, Melissa and Anna were the five fastest-growing U.S. cities of 20,000 or more from July 2024 to July 2025.'),
  jsonb_build_object('q','Which metro area contains most of those fast-growing Texas cities?','a','Four of the five—Celina, Princeton, Melissa and Anna—are in the Dallas-Fort Worth region; Fulshear is outside Houston.'),
  jsonb_build_object('q','How much did Celina grow from 2020 to 2025?','a','A Census metropolitan-growth analysis reported Celina up 276.8% from 2020 to 2025.'),
  jsonb_build_object('q','Does rapid population growth guarantee the same pace will continue?','a','No. Census estimates document recent population change; future growth can shift with housing, jobs, interest rates and infrastructure capacity.')
 ),
 'sources',jsonb_build_array(
  jsonb_build_object('label','U.S. Census Bureau — Vintage 2025 city and town population estimates','url','https://www.census.gov/newsroom/press-releases/2026/vintage-2025-city-town-pop-estimates.html'),
  jsonb_build_object('label','U.S. Census Bureau — Metro gains driven largely by exurban growth','url','https://www.census.gov/library/stories/2026/05/major-city-outer-edge-growth.html'),
  jsonb_build_object('label','Wikimedia Commons — Dallas skyline from Reunion Tower, CC0','url','https://commons.wikimedia.org/wiki/File:Dallas_Texas_skyline_from_Reunion_Tower_September_2025_(cropped).png')
 ),
 'keyTakeaways',jsonb_build_array('Texas held the five fastest-growing U.S. cities of 20,000 or more in the latest estimates.','DFW fringe communities account for four of those five cities.','Exurban growth shifts infrastructure, housing and service demand farther from traditional urban cores.'),
 'cta',jsonb_build_object('label','Explore the Texas economy','href','/texas-economy')
),
array['Texas population growth','Texas exurbs','Celina Texas','Fulshear Texas','Dallas Fort Worth growth']::text[],32,false,c.internal_url,false,'Texas Exurban Growth Is Redrawing the State’s Economic Map','Growth & Migration',array['Texas exurban growth','fastest growing Texas cities','DFW population growth']::text[],jsonb_build_array(jsonb_build_object('href','/texas-economy','kind','hub','label','Texas economy'),jsonb_build_object('href','/news','kind','hub','label','Texas newsroom')),'Fast growth on the Dallas-Fort Worth and Houston fringes is shifting housing, infrastructure and commercial demand toward outer-ring Texas communities.',array['dfw','houston','statewide']::text[],94,array['legacy_url_restored','primary_census_sources','archival_image_attributed']::text[],14,0 from c
on conflict (slug) do update set category=excluded.category,title=excluded.title,dek=excluded.dek,author=excluded.author,source_name=excluded.source_name,source_url=excluded.source_url,image_url=excluded.image_url,featured_image_url=excluded.featured_image_url,image_alt_text=excluded.image_alt_text,image_validation_note=excluded.image_validation_note,kind=excluded.kind,body_json=excluded.body_json,keywords=excluded.keywords,internal_url=excluded.internal_url,seo_headline=excluded.seo_headline,discover_category=excluded.discover_category,seo_keywords=excluded.seo_keywords,internal_links=excluded.internal_links,texas_impact_summary=excluded.texas_impact_summary,affected_regions=excluded.affected_regions,content_quality_score=excluded.content_quality_score,quality_flags=excluded.quality_flags,gsc_impressions=greatest(public.daily_articles.gsc_impressions,excluded.gsc_impressions),gsc_clicks=greatest(public.daily_articles.gsc_clicks,excluded.gsc_clicks),updated_at=now();

-- 2) Starbase
with a as (select 'live-2026-07-06-starbase-south-texas-musk-s-vision-defines-future-american-independenc-exrta0'::text slug), c as (select slug, '/news/'||slug internal_url from a)
insert into public.daily_articles (slug,category,title,dek,body,author,source_name,source_url,image_url,featured_image_url,image_alt_text,image_validation_note,published_at,kind,body_json,keywords,score,is_breaking,internal_url,is_ingested,seo_headline,discover_category,seo_keywords,internal_links,texas_impact_summary,affected_regions,content_quality_score,quality_flags,gsc_impressions,gsc_clicks)
select c.slug,'Business','Starbase Became a Texas City Around SpaceX’s South Texas Launch Site','The incorporation of Starbase formalized a new municipality around SpaceX’s Boca Chica operations, bringing jobs and aerospace investment together with debates over governance, beach access and environmental oversight.',null,'Keep TX Red Newsroom','City of Starbase','https://www.starbase.texas.gov/','https://upload.wikimedia.org/wikipedia/commons/0/01/SpaceX_Starbase_Launch_Site_Early_2026.jpg','https://upload.wikimedia.org/wikipedia/commons/0/01/SpaceX_Starbase_Launch_Site_Early_2026.jpg','Aerial NOAA view of the SpaceX Starbase launch site in South Texas','Wikimedia Commons identifies this January 2026 NOAA Emergency Response Imagery photograph as public domain U.S. government material; original is a 4,109 by 2,309 image/jpeg.', '2026-07-06T14:00:00Z','news',
jsonb_build_object(
 'updated','2026-08-27T19:16:49Z',
 'intro',jsonb_build_array(
  'Starbase is no longer just a name SpaceX uses for its South Texas launch complex. Voters approved incorporation in 2025, creating an official municipality around the company’s operations near Boca Chica. By 2026 the City of Starbase was publishing budgets, maps, commission agendas, public notices and beach-access information through its municipal website.',
  'The historical Keep TX Red URL used promotional language about Elon Musk’s vision and American independence. This restoration takes a narrower, source-backed approach: what Starbase became, why it matters economically, and why the new city also intensified debates over public access, local authority and environmental oversight.'
 ),
 'sections',jsonb_build_array(
  jsonb_build_object('heading','A company-centered community became a municipality','paragraphs',jsonb_build_array(
   'The incorporation vote passed 212 to 6, according to Associated Press reporting. Many eligible voters were SpaceX employees or people connected to the company, reflecting how closely the small community is tied to the launch operation. The new city sits near the Gulf Coast and Mexico border and surrounds infrastructure used by SpaceX’s Starship program.',
   'Municipal status gives Starbase the ordinary responsibilities of a Texas city: budgets, public meetings, records, permits and local rules. The city’s own website now publishes commission agendas, tax notices, building-permit information and beach and road access updates.'
  )),
  jsonb_build_object('heading','Economic importance and public-interest questions coexist','paragraphs',jsonb_build_array(
   'SpaceX has brought major aerospace investment and employment to the Rio Grande Valley. Its South Texas site supports development of Starship, a vehicle central to SpaceX plans and tied to NASA and national-security work. That makes the area economically and strategically important well beyond the small city’s population.',
   'At the same time, incorporation sharpened concerns raised by environmental groups, Indigenous advocates and some local officials. Associated Press reporting documented disputes about authority over beach closures, the effect of launch operations on public access and the broader question of how much local power should be concentrated in a city whose electorate and economy are closely connected to one company.'
  )),
  jsonb_build_object('heading','The city now has a public-government record','paragraphs',jsonb_build_array(
   'One reason Starbase is easier to evaluate in 2026 is that the municipality itself now produces an official paper trail. The city website lists meetings, budgets, public hearings, maps and beach-closure notices. Those records provide a better basis for coverage than slogans about what Starbase might become.',
   'That distinction matters for this restoration. The enduring story is not a prediction about national independence. It is the unusual creation of a Texas municipality around a private aerospace hub and the continuing balance between investment, local administration, public access and environmental responsibility.'
  )),
  jsonb_build_object('heading','Restoration note','paragraphs',jsonb_build_array('Search Console recorded 12 impressions for the historical Keep TX Red URL. The backing article disappeared later. This restoration preserves the exact slug and metric while grounding the subject in municipal records, Associated Press reporting and public-domain NOAA imagery.'))
 ),
 'faq',jsonb_build_array(
  jsonb_build_object('q','Is Starbase an official Texas city?','a','Yes. Voters approved incorporation, and the City of Starbase now publishes municipal meetings, budgets, maps, notices and permit information.'),
  jsonb_build_object('q','Where is Starbase?','a','Starbase is in Cameron County near Boca Chica on the South Texas Gulf Coast close to the Mexico border.'),
  jsonb_build_object('q','Why is Starbase closely associated with SpaceX?','a','The municipality formed around SpaceX’s South Texas launch and Starship development operations, and many local voters were connected to the company.'),
  jsonb_build_object('q','What controversies surround Starbase?','a','Debates have focused on public beach access, launch-related closures, environmental effects and how much authority a company-centered municipality should exercise.')
 ),
 'sources',jsonb_build_array(
  jsonb_build_object('label','City of Starbase — official municipal website','url','https://www.starbase.texas.gov/'),
  jsonb_build_object('label','Associated Press — Starbase approved as a new Texas city','url','https://apnews.com/article/7863bf3bac65e9718eef19b27978933b'),
  jsonb_build_object('label','Associated Press — How SpaceX pursued Starbase incorporation','url','https://apnews.com/article/f6404f050b7025c5ce95d0a0114df61d'),
  jsonb_build_object('label','Wikimedia Commons — NOAA Starbase launch-site imagery','url','https://commons.wikimedia.org/wiki/File:SpaceX_Starbase_Launch_Site_Early_2026.jpg')
 ),
 'keyTakeaways',jsonb_build_array('Starbase is an incorporated Texas municipality around SpaceX’s South Texas operations.','The city now produces ordinary municipal records and public notices.','Economic and aerospace investment coexist with debates over beach access, governance and environmental oversight.'),
 'cta',jsonb_build_object('label','Explore Texas business','href','/texas-business')
),array['Starbase Texas','SpaceX Texas','Boca Chica','Cameron County','Texas aerospace']::text[],34,false,c.internal_url,false,'Starbase Texas: What the SpaceX-Centered City Means','Business',array['Starbase Texas city','SpaceX South Texas','Boca Chica Starbase']::text[],jsonb_build_array(jsonb_build_object('href','/texas-business','kind','hub','label','Texas business'),jsonb_build_object('href','/texas-economy','kind','hub','label','Texas economy'),jsonb_build_object('href','/news','kind','hub','label','Texas newsroom')),'Starbase formalizes a new municipal layer around one of Texas’s most important private aerospace investments while raising continuing public-access and governance questions.',array['statewide']::text[],94,array['legacy_url_restored','official_city_source','public_domain_noaa_image','source_refreshed']::text[],12,0 from c
on conflict (slug) do update set category=excluded.category,title=excluded.title,dek=excluded.dek,author=excluded.author,source_name=excluded.source_name,source_url=excluded.source_url,image_url=excluded.image_url,featured_image_url=excluded.featured_image_url,image_alt_text=excluded.image_alt_text,image_validation_note=excluded.image_validation_note,kind=excluded.kind,body_json=excluded.body_json,keywords=excluded.keywords,internal_url=excluded.internal_url,seo_headline=excluded.seo_headline,discover_category=excluded.discover_category,seo_keywords=excluded.seo_keywords,internal_links=excluded.internal_links,texas_impact_summary=excluded.texas_impact_summary,affected_regions=excluded.affected_regions,content_quality_score=excluded.content_quality_score,quality_flags=excluded.quality_flags,gsc_impressions=greatest(public.daily_articles.gsc_impressions,excluded.gsc_impressions),gsc_clicks=greatest(public.daily_articles.gsc_clicks,excluded.gsc_clicks),updated_at=now();

-- 3) Ichika Plano
with a as (select 'live-2026-07-08-new-omakase-concept-ichika-debuts-in-plano-dining-scene-pd6r0q'::text slug), c as (select slug, '/news/'||slug internal_url from a)
insert into public.daily_articles (slug,category,title,dek,body,author,source_name,source_url,image_url,featured_image_url,image_alt_text,image_validation_note,published_at,kind,body_json,keywords,score,is_breaking,internal_url,is_ingested,seo_headline,discover_category,seo_keywords,internal_links,texas_impact_summary,affected_regions,content_quality_score,quality_flags,gsc_impressions,gsc_clicks)
select c.slug,'Non-Political','Ichika Brings Dedicated Kappo-Kaiseki Dining to Plano','Chef Leo Kekoa’s Ichika opened in Plano as a dedicated kaiseki restaurant, using an intimate counter format where chefs prepare an eight-course seasonal meal in front of diners.',null,'Keep TX Red Newsroom','D Magazine','https://www.dmagazine.com/food-drink/2026/03/preview-ichika-kaiseki-cuisine-plano/','https://upload.wikimedia.org/wikipedia/commons/3/33/Japanese_dinner%2C_kaiseki.jpg','https://upload.wikimedia.org/wikipedia/commons/3/33/Japanese_dinner%2C_kaiseki.jpg','Representative Japanese kaiseki meal','Representative kaiseki image, not an Ichika dish. Wikimedia Commons identifies the 800 by 600 JPEG by Jpatokal as CC BY-SA 3.0.', '2026-07-08T14:00:00Z','news',
jsonb_build_object(
 'updated','2026-08-27T19:16:49Z',
 'intro',jsonb_build_array(
  'Plano’s Ichika opened March 3, 2026 with a format that is more specific than the historical Keep TX Red slug suggested. D Magazine and Community Impact describe it as a restaurant dedicated to kaiseki, the highly seasonal Japanese multicourse tradition, with a kappo-style counter that lets guests watch the chefs prepare and serve each course.',
  'That distinction is important because omakase and kaiseki are not interchangeable labels. Chef and owner Leo Kekoa had already opened the omakase restaurant Kinzo in Frisco. Ichika was designed as a separate project focused on kappo-kaiseki, an eight-course seasonal progression built around restrained preparations and ingredient quality.'
 ),
 'sections',jsonb_build_array(
  jsonb_build_object('heading','A dedicated kaiseki counter in North Texas','paragraphs',jsonb_build_array(
   'D Magazine reported that Ichika offers one seating per night, five nights a week, with a menu that changes by season. Eight curved counter seats face the chefs, turning preparation and service into part of the meal. Community Impact reported the restaurant at 8240 Preston Road, Suite 175, in Plano.',
   'Kekoa described the restaurant as Texas’s first kaiseki-dedicated operation. D Magazine characterized it as North Texas’s first restaurant devoted to seasonal kaiseki and explained that Ichika is technically kappo-kaiseki because food is prepared in view of diners rather than delivered from a hidden kitchen.'
  )),
  jsonb_build_object('heading','Why the terminology matters','paragraphs',jsonb_build_array(
   'Omakase generally centers on entrusting the chef to select what is served, and in North Texas the term is often associated with sushi tasting counters. Kaiseki is a broader formal meal structure organized around seasonality, sequence, technique and presentation. Ichika uses raw, steamed, grilled, fried and cured preparations across its courses.',
   'The historical headline called Ichika an omakase concept. This restoration corrects that shorthand because both detailed local sources emphasize that Kekoa intentionally built something different from the sushi-focused omakase model he already knew.'
  )),
  jsonb_build_object('heading','A chef with deep North Texas experience','paragraphs',jsonb_build_array(
   'Kekoa grew up working in his grandfather’s Honolulu sushi restaurant and later moved to Dallas, where D Magazine reported he spent about a decade at Nobu. He opened Kinzo in Frisco in 2022 and later Hinoki with his wife before launching Ichika.',
   'Ichika’s opening adds another specialized Japanese dining format to the Dallas-Fort Worth restaurant landscape. Its significance is less about novelty for novelty’s sake than about presenting a cuisine that local diners may have encountered only through looser labels.'
  )),
  jsonb_build_object('heading','Restoration note','paragraphs',jsonb_build_array('Search Console recorded 12 impressions for the historical URL. The backing row disappeared later. This restoration preserves the exact slug while correcting the old headline’s terminology and using independent local reporting plus separately licensed representative imagery.'))
 ),
 'faq',jsonb_build_array(
  jsonb_build_object('q','When did Ichika open in Plano?','a','Community Impact reported that Ichika opened March 3, 2026.'),
  jsonb_build_object('q','Is Ichika an omakase restaurant?','a','The restaurant is better described as dedicated kappo-kaiseki. Its seasonal multicourse format differs from the sushi-focused omakase model common in North Texas.'),
  jsonb_build_object('q','Who owns Ichika?','a','Chef Leo Kekoa is the owner and one of the chefs leading the restaurant’s culinary program.'),
  jsonb_build_object('q','Where is Ichika located?','a','Ichika is at 8240 Preston Road, Suite 175, in Plano, Texas.')
 ),
 'sources',jsonb_build_array(
  jsonb_build_object('label','D Magazine — Ichika introduces Japanese kaiseki dining to North Texas','url','https://www.dmagazine.com/food-drink/2026/03/preview-ichika-kaiseki-cuisine-plano/'),
  jsonb_build_object('label','Community Impact — Ichika offers Japanese cuisine and interactive dining in Plano','url','https://communityimpact.com/plano/dining/ichika-offers-japanese-cuisine-interactive-dining-experience-in-plano/'),
  jsonb_build_object('label','D Magazine — Dallas dining trends heading into 2026','url','https://www.dmagazine.com/food-drink/2026/01/dallas-dining-trends-2026/'),
  jsonb_build_object('label','Wikimedia Commons — representative kaiseki meal','url','https://commons.wikimedia.org/wiki/File:Japanese_dinner,_kaiseki.jpg')
 ),
 'keyTakeaways',jsonb_build_array('Ichika opened March 3, 2026 in Plano.','The restaurant is dedicated to kappo-kaiseki rather than conventional omakase.','Its eight-seat counter lets diners watch chefs prepare a seasonal multicourse meal.'),
 'cta',jsonb_build_object('label','Read more Texas news','href','/news')
),array['Ichika Plano','Leo Kekoa','kaiseki Texas','Plano restaurants','North Texas dining']::text[],30,false,c.internal_url,false,'Ichika Plano Brings Kappo-Kaiseki Dining to North Texas','Non-Political',array['Ichika Plano','kaiseki Plano','Leo Kekoa Ichika']::text[],jsonb_build_array(jsonb_build_object('href','/news','kind','hub','label','Texas newsroom')),'Ichika adds a specialized Japanese dining format to Plano and the wider Dallas-Fort Worth restaurant scene.',array['dfw']::text[],94,array['legacy_url_restored','local_sources','image_attributed','headline_corrected']::text[],12,0 from c
on conflict (slug) do update set category=excluded.category,title=excluded.title,dek=excluded.dek,author=excluded.author,source_name=excluded.source_name,source_url=excluded.source_url,image_url=excluded.image_url,featured_image_url=excluded.featured_image_url,image_alt_text=excluded.image_alt_text,image_validation_note=excluded.image_validation_note,kind=excluded.kind,body_json=excluded.body_json,keywords=excluded.keywords,internal_url=excluded.internal_url,seo_headline=excluded.seo_headline,discover_category=excluded.discover_category,seo_keywords=excluded.seo_keywords,internal_links=excluded.internal_links,texas_impact_summary=excluded.texas_impact_summary,affected_regions=excluded.affected_regions,content_quality_score=excluded.content_quality_score,quality_flags=excluded.quality_flags,gsc_impressions=greatest(public.daily_articles.gsc_impressions,excluded.gsc_impressions),gsc_clicks=greatest(public.daily_articles.gsc_clicks,excluded.gsc_clicks),updated_at=now();

-- 4) Texas and the 2026 World Cup
with a as (select 'live-2026-07-10-soccer-s-rising-influence-and-the-2026-world-cup-impact-on-texas-sport-xw4uts'::text slug), c as (select slug, '/news/'||slug internal_url from a)
insert into public.daily_articles (slug,category,title,dek,body,author,source_name,source_url,image_url,featured_image_url,image_alt_text,image_validation_note,published_at,kind,body_json,keywords,score,is_breaking,internal_url,is_ingested,seo_headline,discover_category,seo_keywords,internal_links,texas_impact_summary,affected_regions,content_quality_score,quality_flags,gsc_impressions,gsc_clicks)
select c.slug,'Sports','The 2026 World Cup Strengthened Texas’s Place in American Soccer','World Cup matches and fan activity in Texas highlighted a soccer culture that already ran through North Texas and Houston, while FC Dallas reported a post-tournament rise in youth participation.',null,'Keep TX Red Newsroom','Texas Standard','https://texasstandard.org/stories/us-belgium-world-cup-mexico-england/','https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Dallas_Texas_skyline_from_Reunion_Tower_September_2025_%28cropped%29.png/1280px-Dallas_Texas_skyline_from_Reunion_Tower_September_2025_%28cropped%29.png','https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Dallas_Texas_skyline_from_Reunion_Tower_September_2025_%28cropped%29.png/1280px-Dallas_Texas_skyline_from_Reunion_Tower_September_2025_%28cropped%29.png','Dallas skyline representing the North Texas World Cup host region','Representative North Texas host-region image, not a match photo. Wikimedia Commons identifies the Dallas image as CC0 and the raster as image/png.', '2026-07-10T14:00:00Z','news',
jsonb_build_object(
 'updated','2026-08-27T19:16:49Z',
 'intro',jsonb_build_array(
  'The 2026 FIFA World Cup did not introduce soccer to Texas. It amplified a culture that was already embedded in youth clubs, immigrant communities, professional teams and stadium crowds across North Texas and Houston. Texas Standard documented packed fan activity even after the United States, Mexico and Canada were eliminated, while later Reuters reporting showed the tournament feeding directly into youth participation around FC Dallas.',
  'The historical Keep TX Red URL framed the story broadly as soccer’s rising influence. This restoration focuses on the parts that can be measured and sourced: Texas hosted major World Cup activity, North Texas already had a deep player-development system, and FC Dallas reported a 10% increase in youth participation after the tournament.'
 ),
 'sections',jsonb_build_array(
  jsonb_build_object('heading','Texas remained part of the tournament after host teams exited','paragraphs',jsonb_build_array(
   'Texas Standard reported from the tournament after all three North American host countries had been eliminated. The games continued drawing attention in Texas because international supporters, local soccer communities and visiting fans were invested in teams from around the world.',
   'That dynamic was especially visible in a state with large immigrant communities and long-running youth soccer participation. The World Cup turned existing local connections to national teams and club soccer into a shared public event rather than a short-lived novelty.'
  )),
  jsonb_build_object('heading','North Texas had a development pipeline before 2026','paragraphs',jsonb_build_array(
   'Reuters highlighted FC Dallas as one of the country’s most important development clubs, pointing to players such as Weston McKennie, Chris Richards, Ricardo Pepi and Alejandro Zendejas. The Frisco-based system gives North Texas a role in American soccer that extends beyond hosting matches.',
   'FC Dallas president Dan Hunt told Reuters that the tournament had already helped drive a 10% increase in youth participation. The club expected further demand and planned upgrades and additional field capacity, turning World Cup attention into a concrete development challenge.'
  )),
  jsonb_build_object('heading','The lasting test is access and participation','paragraphs',jsonb_build_array(
   'A World Cup can create enthusiasm, but lasting influence depends on whether children can keep playing after the event leaves town. Reuters separately reported national concerns about youth-soccer cost and fragmentation, including the barriers created by pay-to-play systems.',
   'For Texas, the durable opportunity is to convert tournament visibility into broader participation, coaching, facilities and pathways that reach more families. That is a more defensible measure of influence than attendance headlines or speculative one-time economic totals.'
  )),
  jsonb_build_object('heading','Restoration note','paragraphs',jsonb_build_array('Search Console recorded 9 impressions for this historical URL and previously showed it as indexed. The backing row later disappeared. This restoration preserves the exact slug and metric with source-backed coverage of Texas hosting, fan culture and youth-development effects.'))
 ),
 'faq',jsonb_build_array(
  jsonb_build_object('q','Did Texas have a major role in the 2026 World Cup?','a','Yes. Texas was a host-state center for matches, supporters and related activity, especially in North Texas and Houston.'),
  jsonb_build_object('q','What did FC Dallas report after the World Cup?','a','Reuters reported that FC Dallas saw a 10% increase in youth participation and expected further growth.'),
  jsonb_build_object('q','Why is North Texas important to U.S. player development?','a','FC Dallas has developed multiple U.S. internationals and operates one of the country’s most recognized youth-development systems.'),
  jsonb_build_object('q','Does World Cup attention automatically solve youth-soccer access problems?','a','No. National reporting continues to identify cost, fragmentation and pay-to-play barriers as major challenges.')
 ),
 'sources',jsonb_build_array(
  jsonb_build_object('label','Texas Standard — World Cup continues after host countries exit','url','https://texasstandard.org/stories/us-belgium-world-cup-mexico-england/'),
  jsonb_build_object('label','Reuters — Dallas talent factory expects World Cup development dividend','url','https://www.reuters.com/sports/soccer/dallas-talent-factory-confident-world-cup-will-deliver-development-dividend-2026-07-12/'),
  jsonb_build_object('label','Reuters — Youth sports access debate after U.S. World Cup exit','url','https://www.reuters.com/sports/soccer/crisis-youth-sports-comes-into-focus-after-early-us-world-cup-exit-2026-07-16/'),
  jsonb_build_object('label','Wikimedia Commons — Dallas skyline CC0 image','url','https://commons.wikimedia.org/wiki/File:Dallas_Texas_skyline_from_Reunion_Tower_September_2025_(cropped).png')
 ),
 'keyTakeaways',jsonb_build_array('Texas World Cup activity built on an existing soccer culture.','FC Dallas reported a 10% rise in youth participation after the tournament.','The long-term measure of impact will be development access, facilities and participation.'),
 'cta',jsonb_build_object('label','Explore Texas sports','href','/texas-sports')
),array['2026 World Cup Texas','Texas soccer','FC Dallas','North Texas soccer','Houston soccer']::text[],35,false,c.internal_url,false,'How the 2026 World Cup Deepened Texas Soccer’s Footprint','Sports',array['Texas World Cup 2026','FC Dallas youth soccer','Texas soccer growth']::text[],jsonb_build_array(jsonb_build_object('href','/texas-sports','kind','hub','label','Texas sports'),jsonb_build_object('href','/news','kind','hub','label','Texas newsroom')),'The tournament strengthened the visibility of soccer in Texas and produced measurable youth-participation growth in North Texas.',array['dfw','houston','statewide']::text[],94,array['legacy_url_restored','source_refreshed','representative_image_attributed']::text[],9,0 from c
on conflict (slug) do update set category=excluded.category,title=excluded.title,dek=excluded.dek,author=excluded.author,source_name=excluded.source_name,source_url=excluded.source_url,image_url=excluded.image_url,featured_image_url=excluded.featured_image_url,image_alt_text=excluded.image_alt_text,image_validation_note=excluded.image_validation_note,kind=excluded.kind,body_json=excluded.body_json,keywords=excluded.keywords,internal_url=excluded.internal_url,seo_headline=excluded.seo_headline,discover_category=excluded.discover_category,seo_keywords=excluded.seo_keywords,internal_links=excluded.internal_links,texas_impact_summary=excluded.texas_impact_summary,affected_regions=excluded.affected_regions,content_quality_score=excluded.content_quality_score,quality_flags=excluded.quality_flags,gsc_impressions=greatest(public.daily_articles.gsc_impressions,excluded.gsc_impressions),gsc_clicks=greatest(public.daily_articles.gsc_clicks,excluded.gsc_clicks),updated_at=now();

-- 5) Vogue Texas photo essay
with a as (select 'live-2026-07-06-vogue-magazine-photo-essay-explores-texas-cultural-influence-and-moder-3ec793'::text slug), c as (select slug, '/news/'||slug internal_url from a)
insert into public.daily_articles (slug,category,title,dek,body,author,source_name,source_url,image_url,featured_image_url,image_alt_text,image_validation_note,published_at,kind,body_json,keywords,score,is_breaking,internal_url,is_ingested,seo_headline,discover_category,seo_keywords,internal_links,texas_impact_summary,affected_regions,content_quality_score,quality_flags,gsc_impressions,gsc_clicks)
select c.slug,'Texas Culture','Vogue’s “Lone Star State of Mind” Put Modern Texas Culture in Focus','Vogue’s summer 2026 Texas portfolio brought ranchers, rodeo riders, church choirs, marching bands, models and other communities into a statewide portrait made for America’s 250th anniversary.',null,'Keep TX Red Newsroom','Texas Standard','https://texasstandard.org/stories/vogue-magazine-texas-photo-feature-lone-star-state-mind/','https://upload.wikimedia.org/wikipedia/commons/9/91/Flag-of-Texas.jpg','https://upload.wikimedia.org/wikipedia/commons/9/91/Flag-of-Texas.jpg','Texas flag flying in Austin','Representative Texas image, not Vogue photography. Wikimedia Commons identifies Flag-of-Texas.jpg by Makaristos as a public-domain JPEG released by the copyright holder.', '2026-07-06T14:00:00Z','news',
jsonb_build_object(
 'updated','2026-08-27T19:16:49Z',
 'intro',jsonb_build_array(
  'Vogue’s summer 2026 portfolio “Lone Star State of Mind: Snapshots of Texas Today” treated Texas as a place where several versions of American identity meet at once. The project photographed ranchers, rodeo riders, church choirs, marching bands, models, designers and other communities across the state as part of the magazine’s commemoration of America’s 250th anniversary.',
  'Texas Standard interviewed Vogue staff about the project on July 6, giving the historical Keep TX Red URL a clear, verifiable subject. This restoration summarizes that cultural conversation without reproducing Vogue’s copyrighted photographs or extended text.'
 ),
 'sections',jsonb_build_array(
  jsonb_build_object('heading','A statewide portrait rather than a single Texas stereotype','paragraphs',jsonb_build_array(
   'Texas Standard described the feature as moving from rodeos and ranchers to church choirs and marching bands. Vogue’s own published portfolio and behind-the-scenes video show the project traveling through varied communities and landscapes, including Texas Southern University, a church, a Black-owned ranch, a Houston-area dance venue and Big Bend National Park.',
   'That range is central to the project. Texas is often reduced to one visual shorthand, but the portfolio deliberately put Western imagery beside Black, Latino, Indigenous, immigrant, fashion, music and faith communities. The result was a portrait built around coexistence rather than a single definition.'
  )),
  jsonb_build_object('heading','Texas was chosen as a national story','paragraphs',jsonb_build_array(
   'In Vogue’s behind-the-scenes video, the creative team explains that the summer issue was tied to America’s 250th anniversary and that Texas was selected because its landscapes, histories and communities could support a broader story about the country. The magazine’s framing was therefore national as well as regional.',
   'Texas Standard’s interview focused on the same idea: why a fashion publication would use Texas to talk about culture and the American narrative. That makes the feature noteworthy beyond clothing or celebrity coverage; it is an example of a national publication using Texas identity as a way to discuss contemporary America.'
  )),
  jsonb_build_object('heading','The photography remains Vogue’s copyrighted work','paragraphs',jsonb_build_array(
   'The restoration does not republish Tyler Mitchell’s portfolio images. Those photographs are part of Vogue’s copyrighted editorial package and should be viewed at the original source. Keep TX Red instead uses separately licensed representative Texas imagery and summarizes the subject in original language.',
   'That distinction preserves the historical topic without substituting copied material for reporting. Readers who want the complete visual project can follow the Vogue source, while Texas Standard provides independent context about how and why the feature was assembled.'
  )),
  jsonb_build_object('heading','Restoration note','paragraphs',jsonb_build_array('Search Console recorded 8 impressions for this historical URL. The backing row later disappeared. This restoration preserves the exact slug and metric while anchoring the subject to Vogue’s June 2026 portfolio and Texas Standard’s July 6 interview.'))
 ),
 'faq',jsonb_build_array(
  jsonb_build_object('q','What was Vogue’s Texas feature called?','a','The summer 2026 portfolio was titled “Lone Star State of Mind: Snapshots of Texas Today.”'),
  jsonb_build_object('q','Why did Vogue focus on Texas?','a','The project was part of Vogue’s America 250 coverage and used Texas’s varied landscapes and communities to explore contemporary American identity.'),
  jsonb_build_object('q','Who photographed the Vogue Texas portfolio?','a','The portfolio photography was by Tyler Mitchell.'),
  jsonb_build_object('q','Does this restored page reproduce Vogue’s photographs?','a','No. It summarizes the project and uses separately licensed representative Texas imagery instead of republishing Vogue’s copyrighted photographs.')
 ),
 'sources',jsonb_build_array(
  jsonb_build_object('label','Vogue — Lone Star State of Mind: Snapshots of Texas Today','url','https://www.vogue.com/article/texas-homecoming-summer-2026'),
  jsonb_build_object('label','Vogue — Behind the scenes of Lone Star State of Mind','url','https://www.vogue.com/video/watch/behind-the-scenes-vogue-summer-2026-texas-road-trip'),
  jsonb_build_object('label','Texas Standard — Vogue photoshoot captures modern Texas','url','https://texasstandard.org/stories/vogue-magazine-texas-photo-feature-lone-star-state-mind/'),
  jsonb_build_object('label','Texas Standard — July 6 show rundown','url','https://texasstandard.org/stories/today-on-texas-standard-july-6-2026/'),
  jsonb_build_object('label','Wikimedia Commons — Flag-of-Texas.jpg','url','https://commons.wikimedia.org/wiki/File:Flag-of-Texas.jpg')
 ),
 'keyTakeaways',jsonb_build_array('Vogue’s summer 2026 Texas portfolio was part of America’s 250th-anniversary coverage.','The project intentionally presented many Texas communities rather than one stereotype.','This restoration summarizes the copyrighted project and does not republish Vogue photography.'),
 'cta',jsonb_build_object('label','Read more Texas news','href','/news')
),array['Vogue Texas','Lone Star State of Mind','Texas culture','Tyler Mitchell','Texas identity']::text[],31,false,c.internal_url,false,'Vogue’s Lone Star State of Mind Explored Modern Texas Identity','Texas Culture',array['Vogue Texas 2026','Lone Star State of Mind Texas','Tyler Mitchell Texas']::text[],jsonb_build_array(jsonb_build_object('href','/news','kind','hub','label','Texas newsroom')),'A national fashion publication used Texas communities and landscapes to frame a broader conversation about contemporary American identity.',array['statewide']::text[],94,array['legacy_url_restored','copyrighted_source_summarized','public_domain_image','source_refreshed']::text[],8,0 from c
on conflict (slug) do update set category=excluded.category,title=excluded.title,dek=excluded.dek,author=excluded.author,source_name=excluded.source_name,source_url=excluded.source_url,image_url=excluded.image_url,featured_image_url=excluded.featured_image_url,image_alt_text=excluded.image_alt_text,image_validation_note=excluded.image_validation_note,kind=excluded.kind,body_json=excluded.body_json,keywords=excluded.keywords,internal_url=excluded.internal_url,seo_headline=excluded.seo_headline,discover_category=excluded.discover_category,seo_keywords=excluded.seo_keywords,internal_links=excluded.internal_links,texas_impact_summary=excluded.texas_impact_summary,affected_regions=excluded.affected_regions,content_quality_score=excluded.content_quality_score,quality_flags=excluded.quality_flags,gsc_impressions=greatest(public.daily_articles.gsc_impressions,excluded.gsc_impressions),gsc_clicks=greatest(public.daily_articles.gsc_clicks,excluded.gsc_clicks),updated_at=now();
