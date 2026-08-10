-- Daily Texas news batch: five major stories and five viral stories.
-- Original Keep TX Red rewrites, deduplicated against recent published migrations.

WITH items(slug,category,title,dek,source_name,source_url,published_at,score,is_breaking,image_url,image_alt_text,body) AS (VALUES
('2026-08-08-amazon-pecos-ai-data-center-emissions','Business','Amazon’s West Texas AI Campus Could Bring a Massive New Gas-Power Footprint','A Pecos County data center project tied to Amazon is being built around a large off-grid natural-gas power system, sharpening Texas’ debate over how AI infrastructure should pay for its energy and environmental impact.','Chron','https://www.chron.com/news/article/amazon-texas-data-center-nation-s-polluting-power-22380078.php','2026-08-09T01:25:00Z'::timestamptz,39,TRUE,'/images/news/generated/2026-08-08/amazon-pecos-ai-data-center.svg','Editorial illustration of a large West Texas AI data center powered by natural-gas turbines.','A major artificial-intelligence data center planned in Pecos County is pushing Texas’ infrastructure debate into a new phase: instead of asking only whether the state grid can support giant computing campuses, policymakers may also have to decide how much private power generation should accompany them.

The West Texas project associated with Amazon is expected to rely on a large natural-gas generation complex rather than initially drawing its full load from ERCOT. Reporting on the project says the planned power system could include 35 gas turbines with capacity measured in several gigawatts. Its air permit allows a very large annual carbon-dioxide emissions ceiling, although a permitted maximum is not the same thing as guaranteed yearly emissions.

That distinction matters. Texas is already reviewing proposed data centers because their combined electricity requests dwarf the state’s historic peak demand. Off-grid generation can reduce pressure on transmission planning, but it also shifts the policy argument toward emissions, water use, fuel supply, local roads and the long-term cost of industrial development in rural counties.

Amazon has said it continues to pursue lower-carbon power options and water-saving approaches for its facilities. The company’s broader climate commitments will now be measured against the practical energy requirements of rapidly expanding AI systems.

For Texans, the Pecos County project is an important test case. State leaders have increasingly argued that large data centers should bring their own power and avoid passing infrastructure costs to ordinary customers. This project appears to follow the first half of that idea in a dramatic way. The next question is whether Texas will create equally clear standards for the environmental and community costs that come with privately supplied power on this scale.'),
('2026-08-08-midland-school-finance-lawsuit','Education','Midland ISD Lawsuit Could Reopen Texas’ School-Finance Fight','Midland ISD is challenging the state’s recapture system and mandatory tax framework, arguing that local school boards have lost too much control over money raised from local property owners.','Houston Chronicle','https://www.houstonchronicle.com/politics/texas/article/midland-texas-school-finance-lawsuit-22369155.php','2026-08-09T01:26:00Z'::timestamptz,37,FALSE,'/images/news/generated/2026-08-08/midland-school-finance-lawsuit.svg','Editorial illustration of a Texas courthouse and school-finance dispute.','A lawsuit from Midland Independent School District could force Texas courts to revisit one of the state’s longest-running political disputes: who truly controls local school property-tax dollars.

Midland’s argument focuses on the modern version of the state’s school-finance system, including recapture, often called Robin Hood. Property-wealthy districts send part of locally generated revenue into the statewide system so Texas can equalize school funding. Midland says recent changes have gone further by limiting how much local boards can set tax rates and by directing how locally raised money must be used.

The numbers make the dispute concrete. Midland expects to generate roughly $313 million locally and send more than $83 million back through recapture. District leaders argue that arrangement leaves an elected local board responsible for collecting taxes without giving it enough freedom to decide how the money should be spent for local students.

Supporters of recapture answer that Texas created the system because students in property-poor communities historically had far fewer educational resources than students in wealthy districts. Texas courts have upheld versions of the system before, and any major change could reopen difficult questions about how the state would replace redistributed revenue.

What makes the Midland case important is its legal theory. Rather than simply saying schools need more money, the district argues the state has taken so much control over local tax policy that the system may resemble a statewide property tax, which the Texas Constitution prohibits.

If courts agree, lawmakers could face another major school-finance rewrite. If Midland loses, the ruling could strengthen the state’s authority over local tax rates and recapture. Either way, the case is worth watching far beyond West Texas because every school district, taxpayer and state budget writer has a stake in the rules it challenges.'),
('2026-08-08-saisd-bluebonnet-curriculum-pilot','Education','San Antonio ISD Will Pilot Texas’ Bluebonnet Reading Curriculum at Three Struggling Schools','The district approved a limited trial of the state-backed English curriculum as leaders try to improve three elementary campuses that have posted repeated failing ratings.','San Antonio Express-News','https://www.expressnews.com/news/education/article/san-antonio-isd-bluebonnet-english-curriculum-22373166.php','2026-08-09T01:27:00Z'::timestamptz,34,FALSE,'/images/news/generated/2026-08-08/saisd-bluebonnet-curriculum.svg','Editorial illustration of school books representing San Antonio ISD’s Bluebonnet curriculum pilot.','San Antonio ISD is turning to Texas’ state-developed Bluebonnet English curriculum at three elementary schools as district leaders try to improve campuses that have struggled academically for several years.

Trustees voted 6-1 to pilot the program at Crockett, Graebner and Herff elementary schools. Each campus has received failing accountability ratings in three consecutive years, increasing the pressure on the district to produce measurable improvement before state intervention becomes a larger threat.

Bluebonnet provides teachers with a full set of state-supported instructional materials. The curriculum has also drawn criticism because some lessons include Biblical passages and references. Supporters say those materials are presented for literacy, cultural and historical context rather than religious instruction. Critics worry the curriculum may blur that line or give one religious tradition too much classroom emphasis.

Superintendent Adrian Bustillos has framed the pilot as an academic intervention rather than an ideological project. The district says teachers and parents will be able to review the material, and the limited rollout should give SAISD real classroom data before it considers broader use.

The decision also shows how accountability pressure shapes curriculum choices. A district that wants to maintain local control has an incentive to try state-supported materials if those materials come with funding, training and a promise of stronger academic results.

For families, the most important question will be performance. If reading outcomes improve, Bluebonnet supporters will point to the pilot as evidence that a more structured curriculum can help struggling campuses. If gains fail to appear, the debate will quickly move back to staffing, school leadership, student support and whether curriculum alone can solve deeper academic problems.'),
('2026-08-08-houston-minority-contracting-ruling','Politics','Federal Court Ruling Forces Houston to Rethink Race-Conscious City Contracting','A judge barred Houston from using the race-conscious portion of its minority business contracting program, putting a decades-old procurement system under constitutional pressure.','Reuters','https://m.investing.com/news/stock-market-news/us-judge-blocks-houstons-minority-contracting-program-4818209?ampMode=1','2026-08-09T01:28:00Z'::timestamptz,35,FALSE,'/images/news/generated/2026-08-08/houston-minority-contracting-ruling.svg','Editorial illustration of Houston City Hall and a federal contracting ruling.','Houston is facing a major rewrite of how it awards public contracts after a federal judge blocked the race-conscious portion of the city’s Minority, Women and Small Business Enterprise program.

The program dates to the 1980s and has used contracting goals designed to increase participation by businesses owned by minorities and women. The lawsuit was brought by business owners who argued that race-based preferences prevented them from competing on equal terms.

U.S. District Judge David Hittner concluded that Houston had not produced the type of specific evidence required to justify the racial classifications under modern equal-protection standards. The ruling bars the city from continuing the race-conscious structure as it was being administered.

The immediate effect is practical as well as legal. Houston awards billions of dollars in contracts, and hundreds of millions have historically gone to firms certified under the broader minority, women and small-business program. City officials now have to decide what portions can continue on a race-neutral basis, whether to appeal, and how to design future programs that support small businesses without violating the court’s order.

The case also matters outside Houston. Courts and local governments nationwide are reassessing affirmative-action policies after recent Supreme Court decisions tightened scrutiny of race-conscious programs. Municipal contracting is different from college admissions, but the same constitutional principles are now being tested in procurement.

For taxpayers and businesses, the next phase will determine whether Houston shifts toward income, business size, neighborhood disadvantage or other race-neutral criteria. The city still has tools to broaden competition. The ruling changes which tools it can use and raises the stakes for getting the next version legally right.'),
('2026-08-08-houston-back-to-school-changes','Texas News','Houston-Area Families Head Back to School With Major Campus and Policy Changes','Closures, new campuses, state policy changes and district reorganizations will make the 2026-27 school year look different for families across the Houston region.','Axios Houston','https://www.axios.com/local/houston/2026/08/07/houston-back-to-school-2026-27-changes','2026-08-09T01:29:00Z'::timestamptz,33,FALSE,'/images/news/generated/2026-08-08/houston-back-to-school-2026.svg','Editorial illustration of a school calendar representing Houston-area back-to-school changes.','Back-to-school season across Greater Houston is arriving with more than new schedules and supply lists. Families in several of the region’s largest districts are starting the 2026-27 year amid campus closures, consolidations, new schools and statewide policy changes.

Houston ISD has closed multiple campuses and reassigned students, while Fort Bend ISD is also consolidating elementary schools. Other districts are moving in the opposite direction: growing systems such as Conroe ISD are opening new campuses to keep pace with enrollment.

Families will also see policy changes driven by the state. Texas’ new education landscape includes the launch of Education Freedom Accounts and renewed implementation of classroom requirements that have generated political and legal debate. Those statewide policies will reach families differently depending on whether they attend traditional public schools, charter schools, private schools or use other education options.

Local changes add another layer. Cypress-Fairbanks ISD is reorganizing some special-education services, Alief ISD is launching a new all-girls leadership school, and Katy ISD has adjusted its calendar with a fall break.

The broader pattern reflects the uneven growth of metropolitan Houston. Some neighborhoods are adding students and schools while others are dealing with declining enrollment and aging campuses. Districts are trying to match facilities, staffing and programs to where students actually live now rather than where they lived a decade ago.

For parents, the practical advice is simple: do not assume last year’s routine still applies. Transportation, campus assignments, calendars and program locations may have changed. With hundreds of thousands of Houston-area students returning to class, even small policy shifts can have a large effect on traffic, family schedules and district budgets.'),
('2026-08-08-league-city-red-cat-rescue','Viral','League City’s Mysterious Bright-Red Cat Has Become a Community Rescue Mission','Animal-care workers are trying to safely trap a roaming cat whose fur appears covered in red dye or paint, while residents are being asked to report sightings without interfering.','San Antonio Express-News','https://www.expressnews.com/news/article/texas-shelter-searches-cat-covered-red-dye-paint-22380201.php','2026-08-09T01:30:00Z'::timestamptz,27,FALSE,'/images/news/generated/2026-08-08/league-city-red-cat.svg','Editorial illustration of a bright-red cat representing the League City rescue effort.','A cat with bright-red fur has turned a League City neighborhood into an unlikely rescue operation, drawing attention online while animal-care workers try to determine what happened and whether the animal is safe.

Photos circulating from the area show a cat whose coat appears heavily stained with a vivid red substance. Officials do not yet know whether the coloring is paint, dye or something else, and that uncertainty is one reason they want trained staff to handle the capture.

League City Animal Care has asked residents not to chase, corner or feed the cat. Well-meaning attempts to help can make a frightened animal harder to trap and can teach it to avoid the humane equipment rescuers are using. Instead, the shelter wants time-stamped sighting information so workers can map the cat’s movements and place traps strategically.

The story has spread because the images are impossible to ignore, but the viral element also creates a challenge. Crowds, repeated social-media posts and people driving around looking for the animal can disrupt a careful rescue plan.

Once the cat is secured, veterinary staff can determine whether the red material is toxic, whether the skin or coat has been damaged and whether there are signs of neglect or deliberate mistreatment.

For now, the most useful role for the public is a restrained one: report accurate sightings and let animal-care workers do the trapping. The mystery of how the cat turned red can wait until the first priority is handled — getting it safely off the street.'),
('2026-08-08-polk-county-exotic-sanctuary-rules','Viral','East Texas Exotic-Animal Sanctuary Fights New Polk County Restrictions','A nonprofit housing dozens of exotic animals is scrambling to meet new county rules that restrict some species and require additional permits for others.','Houston Chronicle','https://www.houstonchronicle.com/news/houston-texas/trending/article/polk-county-exotics-animals-sanctuary-22378871.php','2026-08-09T01:31:00Z'::timestamptz,28,FALSE,'/images/news/generated/2026-08-08/polk-county-exotic-sanctuary.svg','Editorial illustration representing an East Texas exotic-animal sanctuary facing new county rules.','An East Texas exotic-animal sanctuary is in a race against new county rules after Polk County tightened restrictions on nontraditional pets and captive wildlife.

Wildlife Wonderland, a nonprofit operation housing dozens of animals, says it moved to Polk County after checking whether its animals could legally be kept there. County officials later revised local rules following concerns about escapes and public safety, creating new restrictions on some reptiles and permit requirements for other species.

The sanctuary disputes parts of the county’s account, including allegations surrounding escaped animals, and says the new rules threaten its ability to keep animals already in its care. County officials argue that exotic-animal ownership creates risks that justify clearer standards, particularly when venomous species or animals capable of escaping are involved.

The dispute illustrates a recurring Texas issue. Rural and semi-rural counties often attract sanctuaries, ranches and private animal collections because land is available and local regulations may be less restrictive than in cities. When population grows or an incident occurs, local governments sometimes discover that their ordinances were never written for the scale or variety of animals now present.

The immediate question is whether Wildlife Wonderland can obtain the federal and county documentation needed to keep permitted species and find lawful placements for any animals that remain prohibited.

Online attention has focused on the personalities and unusual animals, but the underlying policy question is serious: how should counties balance property rights, animal welfare and public safety when residents keep species far outside ordinary livestock and pets? Polk County’s answer is now being tested in real time.'),
('2026-08-08-katy-purple-martin-roost','Viral','Thousands of Purple Martins Turn a Katy Parking Lot Into a Summer Wildlife Show','A massive seasonal bird roost near Interstate 10 has been drawing spectators who gather at dusk to watch thousands of purple martins swirl into their nighttime resting place.','Chron','https://www.chron.com/wildlife/article/purple-martins-katy-22370703.php','2026-08-09T01:32:00Z'::timestamptz,26,FALSE,'/images/news/generated/2026-08-08/katy-purple-martins.svg','Editorial illustration of thousands of purple martins gathering over Katy at sunset.','One of the Houston area’s biggest summer wildlife spectacles is happening in a place almost nobody would choose for nature photography: a Katy shopping-center parking lot.

Thousands of purple martins have been gathering near Interstate 10 and Westgreen Boulevard before their seasonal migration to South America. At dusk, the birds form huge moving clouds as they circle, feed and settle into nearby trees for the night.

Houston Audubon and local birders have turned the roost into a community event, with spectators bringing cameras and lawn chairs to watch the nightly arrival. At peak times, estimates have reached roughly 20,000 birds.

Purple martins are North America’s largest swallows. Before migration, they often assemble in enormous communal roosts where the location provides open flying space, abundant insects and protection from many ground predators. In an urban region, shopping centers can unexpectedly provide all three.

The roost also shows up on weather radar. Large groups of birds leaving in the morning can create expanding circular patterns that resemble small weather features, giving researchers another way to identify major gathering sites.

The spectacle is temporary. Roost locations can shift from year to year, and the birds will eventually move south. That impermanence is part of the appeal: for a few summer evenings, a routine suburban parking lot becomes one of the most dramatic wildlife-viewing spots in Greater Houston.

Anyone visiting should give the birds space, avoid disturbing roost trees and remember that the parking lot remains an active business area. The best view comes from watching the sky, not crowding the birds.'),
('2026-08-08-rangers-orioles-comeback-win','Sports','Rangers Steal a 2-1 Win From Baltimore With a Homer and a Throw at the Plate','Texas managed only three hits but still won its third straight game after Joc Pederson supplied the offense and Brandon Nimmo erased the potential tying run in the ninth.','Reuters','https://www.reuters.com/sports/baseball/joc-pederson-brandon-nimmo-lift-rangers-past-orioles--flm-2026-08-08/','2026-08-09T01:33:00Z'::timestamptz,30,FALSE,'/images/news/generated/2026-08-08/rangers-orioles-comeback.svg','Editorial baseball illustration representing the Texas Rangers’ 2-1 win over Baltimore.','The Texas Rangers found a way to win a game in which almost nothing happened offensively — until the moments that mattered most.

Texas beat the Baltimore Orioles 2-1 after Joc Pederson hit a two-run homer in the sixth inning and Brandon Nimmo delivered the defensive play of the night in the ninth. The Rangers finished with only three hits and one walk, yet turned that limited offense into a third consecutive victory.

Baltimore carried a 1-0 lead into the middle innings behind strong pitching. Pederson changed the game with one swing, putting Texas ahead despite the lineup’s difficulty creating traffic on the bases.

The lead nearly disappeared in the ninth. With Baltimore threatening to score the tying run, Nimmo made a strong throw from right field to the plate, cutting down the runner and preserving the one-run margin. Jacob Latz finished the game with his 22nd save.

Wins like this are useful in a long season because they do not depend on a team playing its cleanest offensive game. Texas was outproduced in several conventional measures but executed the decisive plays — a home run, run prevention and late defense.

The Rangers have been trying to build momentum around the .500 mark, and close wins can matter as much psychologically as they do in the standings. A lineup will not survive on three hits every night, but a team capable of stealing a game when the bats are quiet gives itself more paths into a postseason race.'),
('2026-08-08-leon-valley-aquarium-animal-rules','Viral','Leon Valley Expands Exotic-Animal Rules After Aquarium Backlash','The San Antonio-area city changed its ordinance so qualifying aquariums and zoological facilities can keep some animals previously prohibited, prompting a new fight over safety and oversight.','MySA','https://www.mysanantonio.com/news/local/article/san-antonio-aquarium-octopus-22375287.php','2026-08-09T01:34:00Z'::timestamptz,25,FALSE,'/images/news/generated/2026-08-08/leon-valley-aquarium-rules.svg','Editorial illustration representing the Leon Valley aquarium and exotic-animal ordinance debate.','A small San Antonio-area city has become the center of a larger argument over exotic animals after Leon Valley changed its local ordinance to give qualifying aquariums and zoological facilities a path to keep species that had previously been prohibited.

The City Council approved the amendments unanimously. The new framework allows certain educational animal facilities to possess dangerous or venomous species if they meet specified requirements.

Animal-welfare advocates, including PETA, objected to the change and argued that it could benefit the San Antonio Aquarium despite past safety and regulatory controversies. Critics pointed to a previous incident involving a child during an animal encounter and said the city should be tightening oversight rather than broadening exemptions.

City officials have defended the ordinance as an attempt to define the rules more clearly, not as a blanket exemption from safety standards. Facilities still face state and federal requirements where those laws apply, and the local ordinance establishes conditions for qualifying under the new category.

The dispute has gained attention because exotic-animal attractions sit in an unusual regulatory space. Cities control zoning and local animal ordinances, while federal agencies regulate only certain species and activities. That can leave gaps where public expectations of oversight do not match the actual law.

For Leon Valley, the next test will be enforcement. The political argument over the ordinance will matter less than whether the city can consistently inspect facilities, respond to complaints and show residents that the new rules protect both visitors and animals. If another high-profile incident occurs, the council is likely to face immediate pressure to revisit the policy.' )
),
prepared AS (
  SELECT *, jsonb_build_object(
    'lede', dek,
    'body', body,
    'faq', jsonb_build_array(),
    'sources', jsonb_build_array(jsonb_build_object('label', source_name || ' — original report', 'url', source_url)),
    'keyTakeaways', jsonb_build_array(dek)
  ) AS body_json
  FROM items
)
INSERT INTO public.daily_articles
(slug,internal_url,is_ingested,category,title,dek,source_name,source_url,published_at,score,is_breaking,kind,body,body_json,featured_image_url,image_url,image_alt_text)
SELECT slug,'/news/'||slug,FALSE,category,title,dek,source_name,source_url,published_at,score,is_breaking,'news',body,body_json,image_url,image_url,image_alt_text
FROM prepared
ON CONFLICT (slug) DO UPDATE SET
internal_url=EXCLUDED.internal_url,
is_ingested=EXCLUDED.is_ingested,
category=EXCLUDED.category,
title=EXCLUDED.title,
dek=EXCLUDED.dek,
source_name=EXCLUDED.source_name,
source_url=EXCLUDED.source_url,
published_at=EXCLUDED.published_at,
score=EXCLUDED.score,
is_breaking=EXCLUDED.is_breaking,
kind=EXCLUDED.kind,
body=EXCLUDED.body,
body_json=EXCLUDED.body_json,
featured_image_url=EXCLUDED.featured_image_url,
image_url=EXCLUDED.image_url,
image_alt_text=EXCLUDED.image_alt_text;
