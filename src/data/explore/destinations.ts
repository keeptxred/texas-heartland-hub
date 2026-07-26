import type { ExploreEntity } from "@/types/explore/public";

const updatedAt = "2026-07-26T00:00:00.000Z";

const records = `
big-bend-national-park|Big Bend National Park|park|Big Bend National Park|Brewster|West Texas|29.2498|-103.2502|Remote desert, mountain, and river country along the Rio Grande.|https://www.nps.gov/bibe/index.htm|hiking,camping,scenic,wildlife,stargazing|camping,visitor center,restrooms,scenic drives|1|0|1|1
guadalupe-mountains-national-park|Guadalupe Mountains National Park|park|Salt Flat|Culberson|West Texas|31.923|-104.866|High desert trails and the highest natural point in Texas.|https://www.nps.gov/gumo/index.htm|hiking,camping,scenic,wildlife|camping,visitor center,restrooms|1|0|1|1
padre-island-national-seashore|Padre Island National Seashore|park|Corpus Christi|Kleberg|Gulf Coast|27.047|-97.376|Protected barrier-island beaches, dunes, wildlife, fishing, and primitive camping.|https://www.nps.gov/pais/index.htm|camping,fishing,birding,swimming,wildlife|camping,visitor center,restrooms,beach access|1|1|1|1
san-antonio-missions-national-historical-park|San Antonio Missions National Historical Park|historic_site|San Antonio|Bexar|South Texas|29.361|-98.479|Four Spanish colonial missions connected by trails along the San Antonio River.|https://www.nps.gov/saan/index.htm|history,walking,biking,scenic|visitor center,restrooms,paved trails|1|1|1|0
enchanted-rock-state-natural-area|Enchanted Rock State Natural Area|park|Fredericksburg|Gillespie|Hill Country|30.506|-98.819|A massive pink granite dome with hiking, climbing, camping, and Hill Country views.|https://tpwd.texas.gov/state-parks/enchanted-rock|hiking,camping,climbing,scenic,stargazing|camping,restrooms,picnic areas,trails|1|1|1|1
garner-state-park|Garner State Park|park|Concan|Uvalde|Hill Country|29.586|-99.743|Frio River swimming, limestone hills, trails, cabins, and camping.|https://tpwd.texas.gov/state-parks/garner|swimming,paddling,hiking,camping,family|camping,cabins,restrooms,river access,picnic areas|1|1|1|1
palo-duro-canyon-state-park|Palo Duro Canyon State Park|park|Canyon|Randall|Panhandle|34.984|-101.702|A dramatic Panhandle canyon with scenic drives, trails, camping, and wide-open views.|https://tpwd.texas.gov/state-parks/palo-duro-canyon|hiking,biking,camping,scenic,wildlife|camping,cabins,restrooms,scenic drive,trails|1|1|1|1
caddo-lake-state-park|Caddo Lake State Park|lake|Karnack|Harrison|East Texas|32.68|-94.176|Bald cypress wetlands, paddling trails, fishing, cabins, and East Texas wildlife.|https://tpwd.texas.gov/state-parks/caddo-lake|paddling,fishing,camping,birding,wildlife|camping,cabins,boat ramp,canoe rentals,restrooms|1|1|1|1
mustang-island-state-park|Mustang Island State Park|park|Port Aransas|Nueces|Gulf Coast|27.672|-97.176|Gulf beach camping, paddling, fishing, birding, and coastal recreation.|https://tpwd.texas.gov/state-parks/mustang-island|swimming,fishing,paddling,camping,birding|camping,restrooms,showers,beach access,paddling trails|1|1|1|1
dinosaur-valley-state-park|Dinosaur Valley State Park|park|Glen Rose|Somervell|North Texas|32.246|-97.813|Dinosaur tracks, river access, hiking, camping, and family outings.|https://tpwd.texas.gov/state-parks/dinosaur-valley|hiking,camping,swimming,family,wildlife|camping,restrooms,river access,trails,picnic areas|1|1|1|1
caprock-canyons-state-park|Caprock Canyons State Park & Trailway|park|Quitaque|Briscoe|Panhandle|34.411|-101.064|Red-rock canyons, trails, camping, and the Texas State Bison Herd.|https://tpwd.texas.gov/state-parks/caprock-canyons|hiking,biking,camping,wildlife,scenic|camping,restrooms,trails,lake access|1|1|1|1
hamilton-pool-preserve|Hamilton Pool Preserve|natural_area|Dripping Springs|Travis|Hill Country|30.342|-98.126|A protected Hill Country grotto, waterfall, and short nature trail.|https://parks.traviscountytx.gov/parks/hamilton-pool-preserve|hiking,scenic,wildlife,family|trails,restrooms,picnic areas|1|0|0|1
balmorhea-state-park|Balmorhea State Park|park|Toyahvale|Reeves|West Texas|30.944|-103.786|A spring-fed desert pool with swimming, camping, and historic CCC structures.|https://tpwd.texas.gov/state-parks/balmorhea|swimming,camping,wildlife,family|camping,lodging,restrooms,pool|1|1|1|1
brazos-bend-state-park|Brazos Bend State Park|park|Needville|Fort Bend|Gulf Coast|29.371|-95.631|Wetlands, wildlife, trails, camping, and astronomy southwest of Houston.|https://tpwd.texas.gov/state-parks/brazos-bend|hiking,camping,birding,wildlife,stargazing|camping,restrooms,trails,nature center|1|1|1|1
colorado-bend-state-park|Colorado Bend State Park|park|Bend|San Saba|Hill Country|31.022|-98.442|Waterfalls, caves, river access, rugged trails, and primitive camping.|https://tpwd.texas.gov/state-parks/colorado-bend|hiking,camping,fishing,paddling,caving|camping,restrooms,river access,trails|1|1|0|1
davis-mountains-state-park|Davis Mountains State Park|park|Fort Davis|Jeff Davis|West Texas|30.599|-103.925|Mountain scenery, trails, camping, birding, and historic Indian Lodge.|https://tpwd.texas.gov/state-parks/davis-mountains|hiking,camping,birding,scenic,wildlife|camping,lodging,restrooms,trails|1|1|1|1
devils-river-state-natural-area|Devils River State Natural Area|natural_area|Del Rio|Val Verde|West Texas|29.926|-100.983|A remote, clear-water river landscape for paddling, hiking, and primitive camping.|https://tpwd.texas.gov/state-parks/devils-river|paddling,fishing,hiking,camping,wildlife|primitive camping,river access,trails|0|0|0|1
fort-davis-national-historic-site|Fort Davis National Historic Site|historic_site|Fort Davis|Jeff Davis|West Texas|30.599|-103.894|A preserved frontier military post beneath the Davis Mountains.|https://www.nps.gov/foda/index.htm|history,walking,family|visitor center,restrooms,trails|1|1|1|1
galveston-island-state-park|Galveston Island State Park|park|Galveston|Galveston|Gulf Coast|29.198|-94.956|Beach and bay access with camping, paddling, fishing, and birding.|https://tpwd.texas.gov/state-parks/galveston-island|swimming,fishing,paddling,camping,birding|camping,restrooms,showers,beach access,boat ramp|1|1|1|1
goliad-state-park|Goliad State Park & Historic Site|historic_site|Goliad|Goliad|South Texas|28.656|-97.382|Mission history, riverside camping, paddling, and South Texas heritage.|https://tpwd.texas.gov/state-parks/goliad|history,camping,paddling,fishing,family|camping,restrooms,river access,historic site|1|1|1|1
government-canyon-state-natural-area|Government Canyon State Natural Area|natural_area|San Antonio|Bexar|South Texas|29.549|-98.765|Hill Country wilderness, dinosaur tracks, and extensive trails near San Antonio.|https://tpwd.texas.gov/state-parks/government-canyon|hiking,biking,camping,wildlife,family|camping,restrooms,trails,visitor center|1|1|1|1
guadalupe-river-state-park|Guadalupe River State Park|park|Spring Branch|Comal|Hill Country|29.854|-98.504|River swimming, paddling, camping, and wooded Hill Country trails.|https://tpwd.texas.gov/state-parks/guadalupe-river|swimming,paddling,hiking,camping,fishing|camping,restrooms,river access,trails|1|1|1|1
hueco-tanks-state-park|Hueco Tanks State Park & Historic Site|historic_site|El Paso|El Paso|West Texas|31.917|-106.041|Rock formations, Indigenous pictographs, guided access, climbing, and desert history.|https://tpwd.texas.gov/state-parks/hueco-tanks|history,hiking,climbing,birding,scenic|visitor center,restrooms,camping,guided tours|1|0|1|1
inks-lake-state-park|Inks Lake State Park|lake|Burnet|Burnet|Hill Country|30.737|-98.369|A constant-level Highland Lakes destination for swimming, paddling, and camping.|https://tpwd.texas.gov/state-parks/inks-lake|swimming,paddling,fishing,camping,hiking|camping,cabins,boat ramp,restrooms,store|1|1|1|1
lake-bob-sandlin-state-park|Lake Bob Sandlin State Park|lake|Pittsburg|Titus|East Texas|33.058|-95.091|East Texas lake recreation with fishing, paddling, camping, and wooded trails.|https://tpwd.texas.gov/state-parks/lake-bob-sandlin|fishing,paddling,camping,hiking,swimming|camping,cabins,boat ramp,restrooms|1|1|1|1
lake-brownwood-state-park|Lake Brownwood State Park|lake|Brownwood|Brown|Central Texas|31.856|-99.03|Historic CCC facilities, lake recreation, cabins, camping, and trails.|https://tpwd.texas.gov/state-parks/lake-brownwood|fishing,boating,swimming,camping,hiking|camping,cabins,boat ramp,restrooms|1|1|1|1
lake-corpus-christi-state-park|Lake Corpus Christi State Park|lake|Mathis|San Patricio|South Texas|28.062|-97.872|Lake swimming, boating, fishing, camping, and a landmark CCC recreation hall.|https://tpwd.texas.gov/state-parks/lake-corpus-christi|fishing,boating,swimming,camping,birding|camping,cabins,boat ramp,restrooms|1|1|1|1
lake-livingston-state-park|Lake Livingston State Park|lake|Livingston|Polk|East Texas|30.656|-95.001|Pineywoods camping, fishing, boating, swimming, and family recreation.|https://tpwd.texas.gov/state-parks/lake-livingston|fishing,boating,swimming,camping,hiking|camping,cabins,boat ramp,restrooms,store|1|1|1|1
lake-mineral-wells-state-park|Lake Mineral Wells State Park & Trailway|lake|Mineral Wells|Parker|North Texas|32.812|-98.043|Lake recreation, climbing, camping, and a long multiuse trailway.|https://tpwd.texas.gov/state-parks/lake-mineral-wells|hiking,biking,climbing,fishing,camping|camping,screened shelters,boat ramp,restrooms,trails|1|1|1|1
lake-somerville-state-park|Lake Somerville State Park & Trailway|lake|Somerville|Burleson|Central Texas|30.309|-96.64|Two park units linked by trails with boating, fishing, camping, and wildlife viewing.|https://tpwd.texas.gov/state-parks/lake-somerville|fishing,boating,hiking,biking,camping|camping,boat ramp,restrooms,trails|1|1|1|1
lockhart-state-park|Lockhart State Park|park|Lockhart|Caldwell|Central Texas|29.852|-97.697|A compact CCC-era park with golf, swimming, trails, camping, and creek scenery.|https://tpwd.texas.gov/state-parks/lockhart|golf,swimming,hiking,camping,family|camping,pool,golf course,restrooms|1|1|1|1
lost-maples-state-natural-area|Lost Maples State Natural Area|natural_area|Vanderpool|Bandera|Hill Country|29.807|-99.611|Canyon trails, limestone cliffs, camping, and celebrated fall foliage.|https://tpwd.texas.gov/state-parks/lost-maples|hiking,camping,birding,scenic,wildlife|camping,restrooms,trails,picnic areas|1|1|0|1
mckinney-falls-state-park|McKinney Falls State Park|park|Austin|Travis|Central Texas|30.183|-97.722|Waterfalls, swimming holes, trails, camping, and history inside Austin.|https://tpwd.texas.gov/state-parks/mckinney-falls|hiking,biking,swimming,camping,fishing|camping,cabins,restrooms,trails|1|1|1|1
monahans-sandhills-state-park|Monahans Sandhills State Park|park|Monahans|Ward|West Texas|31.619|-102.812|Wind-shaped dunes, sand sliding, camping, and wide West Texas skies.|https://tpwd.texas.gov/state-parks/monahans-sandhills|sand sliding,camping,hiking,scenic,family|camping,restrooms,sand disk rentals|1|1|1|1
pedernales-falls-state-park|Pedernales Falls State Park|park|Johnson City|Blanco|Hill Country|30.308|-98.257|Limestone river scenery, hiking, camping, swimming areas, and wildlife.|https://tpwd.texas.gov/state-parks/pedernales-falls|hiking,camping,swimming,fishing,wildlife|camping,restrooms,trails,river access|1|1|1|1
possum-kingdom-state-park|Possum Kingdom State Park|lake|Caddo|Palo Pinto|North Texas|32.874|-98.559|Clear-water lake recreation with boating, fishing, swimming, and camping.|https://tpwd.texas.gov/state-parks/possum-kingdom|boating,fishing,swimming,camping,hiking|camping,cabins,boat ramp,restrooms|1|1|1|1
seminole-canyon-state-park|Seminole Canyon State Park & Historic Site|historic_site|Comstock|Val Verde|West Texas|29.701|-101.317|Canyon trails and guided access to ancient Lower Pecos rock art.|https://tpwd.texas.gov/state-parks/seminole-canyon|history,hiking,camping,scenic,birding|camping,visitor center,restrooms,guided tours|1|1|1|1
south-llano-river-state-park|South Llano River State Park|park|Junction|Kimble|Hill Country|30.446|-99.805|Spring-fed river recreation, camping, birding, paddling, and trails.|https://tpwd.texas.gov/state-parks/south-llano-river|paddling,swimming,hiking,camping,birding|camping,restrooms,river access,trails|1|1|1|1
village-creek-state-park|Village Creek State Park|park|Lumberton|Hardin|East Texas|30.252|-94.177|Paddling, fishing, camping, and forest trails along a scenic East Texas creek.|https://tpwd.texas.gov/state-parks/village-creek|paddling,fishing,hiking,camping,birding|camping,cabins,canoe launch,restrooms|1|1|1|1
big-thicket-national-preserve|Big Thicket National Preserve|natural_area|Kountze|Hardin|East Texas|30.454|-94.386|A biologically diverse preserve of forests, wetlands, waterways, and trails.|https://www.nps.gov/bith/index.htm|hiking,paddling,birding,wildlife,scenic|visitor center,trails,boat access|1|1|1|0
waco-mammoth-national-monument|Waco Mammoth National Monument|historic_site|Waco|McLennan|Central Texas|31.607|-97.175|An indoor fossil site preserving a nursery herd of Columbian mammoths.|https://www.nps.gov/waco/index.htm|history,family,walking|visitor center,restrooms,paved trails|1|0|1|1
amistad-national-recreation-area|Amistad National Recreation Area|lake|Del Rio|Val Verde|West Texas|29.465|-101.05|A vast reservoir for boating, fishing, paddling, camping, and desert scenery.|https://www.nps.gov/amis/index.htm|boating,fishing,paddling,camping,scenic|boat ramps,camping,visitor center,restrooms|1|1|1|0
lake-meredith-national-recreation-area|Lake Meredith National Recreation Area|lake|Fritch|Hutchinson|Panhandle|35.624|-101.705|Panhandle boating, fishing, camping, hiking, and canyon scenery.|https://www.nps.gov/lamr/index.htm|boating,fishing,camping,hiking,scenic|boat ramps,camping,restrooms,trails|1|1|1|0
lyndon-b-johnson-national-historical-park|Lyndon B. Johnson National Historical Park|historic_site|Johnson City|Blanco|Hill Country|30.241|-98.625|Presidential history across Johnson City and the LBJ Ranch.|https://www.nps.gov/lyjo/index.htm|history,driving,walking,family|visitor center,restrooms,historic buildings|1|1|1|0
alibates-flint-quarries-national-monument|Alibates Flint Quarries National Monument|historic_site|Fritch|Potter|Panhandle|35.581|-101.706|Ancient flint quarry landscapes interpreted through guided tours.|https://www.nps.gov/alfl/index.htm|history,hiking,scenic,family|visitor center,restrooms,guided tours|1|0|1|0
chamizal-national-memorial|Chamizal National Memorial|historic_site|El Paso|El Paso|West Texas|31.768|-106.454|A cultural and historic site interpreting the peaceful settlement of a border dispute.|https://www.nps.gov/cham/index.htm|history,walking,arts,family|visitor center,theater,restrooms,grounds|1|1|1|0
the-alamo|The Alamo|historic_site|San Antonio|Bexar|South Texas|29.426|-98.486|A central Texas Revolution landmark and museum in downtown San Antonio.|https://www.thealamo.org/|history,walking,family|museum,restrooms,guided tours|1|0|1|0
texas-state-capitol|Texas State Capitol|historic_site|Austin|Travis|Central Texas|30.275|-97.74|The historic seat of Texas government with public grounds, tours, and exhibits.|https://tspb.texas.gov/plan/tours/tours.html|history,walking,architecture,family|visitor center,restrooms,guided tours|1|0|1|0
san-jacinto-battleground|San Jacinto Battleground State Historic Site|historic_site|La Porte|Harris|Gulf Coast|29.75|-95.08|The battlefield where Texas secured independence, marked by the San Jacinto Monument.|https://tpwd.texas.gov/state-parks/san-jacinto-battleground|history,walking,family,scenic|museum,monument,restrooms,picnic areas|1|1|1|0
battleship-texas|Battleship Texas|historic_site|Galveston|Galveston|Gulf Coast|29.307|-94.793|A preserved early twentieth-century battleship and major Texas naval landmark.|https://battleshiptexas.org/|history,family,walking|museum,restrooms,guided tours|1|0|0|1
washington-on-the-brazos|Washington-on-the-Brazos State Historic Site|historic_site|Washington|Washington|Central Texas|30.325|-96.153|The site where delegates declared Texas independence in 1836.|https://thc.texas.gov/historic-sites/washington-brazos-state-historic-site|history,walking,family|museum,visitor center,restrooms,picnic areas|1|1|1|1
sea-rim-state-park|Sea Rim State Park|park|Sabine Pass|Jefferson|Gulf Coast|29.676|-94.043|Gulf beaches and coastal marshes with paddling, fishing, camping, and birding.|https://tpwd.texas.gov/state-parks/sea-rim|swimming,paddling,fishing,camping,birding|camping,boardwalk,boat ramp,restrooms,beach access|1|1|1|1
goose-island-state-park|Goose Island State Park|park|Rockport|Aransas|Gulf Coast|28.135|-96.986|Bayfront camping, fishing, birding, and the celebrated Big Tree.|https://tpwd.texas.gov/state-parks/goose-island|fishing,camping,birding,wildlife,family|camping,fishing pier,boat ramp,restrooms|1|1|1|1
huntsville-state-park|Huntsville State Park|lake|Huntsville|Walker|East Texas|30.628|-95.526|Pineywoods trails, lake swimming, paddling, fishing, and camping.|https://tpwd.texas.gov/state-parks/huntsville|hiking,swimming,paddling,fishing,camping|camping,screened shelters,boat rentals,restrooms|1|1|1|1
mother-neff-state-park|Mother Neff State Park|park|Moody|Coryell|Central Texas|31.325|-97.469|Texas's oldest state park, with prairie, woodland trails, camping, and CCC history.|https://tpwd.texas.gov/state-parks/mother-neff|hiking,camping,history,birding,family|camping,cabins,restrooms,trails|1|1|1|1
fort-richardson-state-park|Fort Richardson State Park & Historic Site|historic_site|Jacksboro|Jack|North Texas|33.208|-98.163|A restored frontier fort with trails, camping, fishing, and military history.|https://tpwd.texas.gov/state-parks/fort-richardson|history,hiking,camping,fishing,family|camping,historic buildings,restrooms,trails|1|1|1|1
copper-breaks-state-park|Copper Breaks State Park|park|Quanah|Hardeman|Panhandle|34.112|-99.751|Rugged breaks, prairie, camping, trails, and internationally recognized dark skies.|https://tpwd.texas.gov/state-parks/copper-breaks|hiking,camping,stargazing,wildlife,fishing|camping,restrooms,trails,lake access|1|1|1|1
cedar-hill-state-park|Cedar Hill State Park|lake|Cedar Hill|Dallas|North Texas|32.621|-96.979|Joe Pool Lake recreation, camping, mountain biking, and prairie history near Dallas.|https://tpwd.texas.gov/state-parks/cedar-hill|boating,fishing,swimming,biking,camping|camping,boat ramp,restrooms,trails|1|1|1|1
ray-roberts-lake-state-park|Ray Roberts Lake State Park|lake|Pilot Point|Denton|North Texas|33.37|-97.05|A large North Texas lake with two park units, trails, camping, and boating.|https://tpwd.texas.gov/state-parks/ray-roberts-lake|boating,fishing,swimming,hiking,camping|camping,lodging,boat ramp,restrooms,trails|1|1|1|1
eisenhower-state-park|Eisenhower State Park|lake|Denison|Grayson|North Texas|33.819|-96.599|Lake Texoma cliffs, swimming, fishing, trails, and camping near Denison.|https://tpwd.texas.gov/state-parks/eisenhower|fishing,swimming,hiking,camping,boating|camping,cabins,boat ramp,restrooms|1|1|1|1
bentsen-rio-grande-valley-state-park|Bentsen-Rio Grande Valley State Park|park|Mission|Hidalgo|South Texas|26.186|-98.381|A premier Lower Rio Grande Valley birding destination and World Birding Center site.|https://tpwd.texas.gov/state-parks/bentsen-rio-grande-valley|birding,wildlife,walking,biking,family|visitor center,tram,restrooms,trails|1|0|1|1
resaca-de-la-palma-state-park|Resaca de la Palma State Park|park|Brownsville|Cameron|South Texas|25.995|-97.582|Resaca wetlands, tropical woodland, trails, and exceptional Valley birding.|https://tpwd.texas.gov/state-parks/resaca-de-la-palma|birding,wildlife,walking,biking,family|visitor center,tram,restrooms,trails|1|0|1|1
abilene-state-park|Abilene State Park|park|Tuscola|Taylor|West Texas|32.240731|-99.879139|Shaded Elm Creek recreation with historic CCC structures, trails, camping, fishing, and a seasonal swimming pool.|https://tpwd.texas.gov/state-parks/abilene|hiking,camping,fishing,birding,biking,swimming|camping,yurts,screened shelters,restrooms,trails,pool|1|1|1|1
albert-bessie-kronkosky-state-natural-area|Albert & Bessie Kronkosky State Natural Area|natural_area|Boerne|Bandera|Hill Country|29.77|-98.82|A protected Hill Country landscape preserving springs, canyons, grasslands, and diverse wildlife while public-use planning continues.|https://tpwd.texas.gov/state-parks/albert-bessie-kronkosky|wildlife,conservation,nature study,scenic|protected habitat|0|0|0|0
atlanta-state-park|Atlanta State Park|lake|Atlanta|Cass|East Texas|33.230731|-94.249693|A peaceful pine-and-hardwood retreat on Wright Patman Lake for fishing, boating, swimming, camping, and birding.|https://tpwd.texas.gov/state-parks/atlanta|fishing,boating,swimming,camping,birding,hiking|camping,boat ramp,swim area,restrooms,trails|1|1|1|1
bastrop-state-park|Bastrop State Park|park|Bastrop|Bastrop|Central Texas|30.111|-97.286|Lost Pines scenery, CCC architecture, trails, camping, cabins, and a scenic drive connecting to Buescher State Park.|https://tpwd.texas.gov/state-parks/bastrop|hiking,camping,biking,swimming,golf,wildlife|camping,cabins,pool,restrooms,trails,golf course|1|1|1|1
big-bend-ranch-state-park|Big Bend Ranch State Park|park|Presidio|Presidio|West Texas|29.47|-103.92|Texas's largest state park, with rugged Chihuahuan Desert mountains, Rio Grande access, primitive camping, and remote backcountry trails.|https://tpwd.texas.gov/state-parks/big-bend-ranch|hiking,camping,biking,paddling,horseback riding,scenic,wildlife|primitive camping,visitor center,restrooms,trails,river access|0|1|0|1
big-spring-state-park|Big Spring State Park|park|Big Spring|Howard|West Texas|32.232288|-101.490728|A day-use park atop Scenic Mountain with panoramic views, CCC-built structures, picnicking, playgrounds, and a loop road.|https://tpwd.texas.gov/state-parks/big-spring|scenic,walking,biking,picnicking,history,family|pavilion,picnic areas,playground,restrooms,interpretive center|1|1|1|0
`.trim().split("\n");

function sourceName(url: string): string {
  if (url.includes("nps.gov")) return "National Park Service";
  if (url.includes("tpwd.texas.gov")) return "Texas Parks and Wildlife Department";
  if (url.includes("thc.texas.gov")) return "Texas Historical Commission";
  if (url.includes("traviscountytx.gov")) return "Travis County Parks";
  if (url.includes("tspb.texas.gov")) return "State Preservation Board";
  if (url.includes("thealamo.org")) return "The Alamo Trust";
  if (url.includes("battleshiptexas.org")) return "Battleship Texas Foundation";
  return "Official destination website";
}

export const exploreDestinations: ExploreEntity[] = records.map((record) => {
  const [
    id, name, entityType, city, county, region, latitude, longitude, summary, officialUrl,
    activities, amenities, familyFriendly, petFriendly, accessible, feeRequired,
  ] = record.split("|");

  return {
    id,
    name,
    slug: id,
    entityType,
    city,
    county,
    region,
    latitude: Number(latitude),
    longitude: Number(longitude),
    summary,
    description: summary,
    officialUrl,
    heroImageUrl: null,
    heroImageAlt: null,
    activities: activities ? activities.split(",") : [],
    amenities: amenities ? amenities.split(",") : [],
    isFamilyFriendly: familyFriendly === "1",
    isPetFriendly: petFriendly === "1",
    isAccessible: accessible === "1",
    feeRequired: feeRequired === "1",
    alternateNames: [],
    phone: null,
    email: null,
    address: null,
    profile: {},
    hours: null,
    fees: null,
    regulations: null,
    seasonalGuidance: null,
    categories: [entityType.replaceAll("_", " "), region],
    tags: [...(activities ? activities.split(",") : []), city.toLowerCase()],
    sourceUrl: officialUrl,
    sourceName: sourceName(officialUrl),
    sourceUpdatedAt: null,
    updatedAt,
    observations: [],
    related: [],
    nearby: [],
  };
});
