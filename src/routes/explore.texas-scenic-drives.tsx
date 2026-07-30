import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera, Car, Compass, MapPinned, Mountain, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildSeo } from "@/lib/seo";

export const Route = createFileRoute("/explore/texas-scenic-drives")({
  head: () => {
    const seo = buildSeo({
      title: "Best Scenic Drives in Texas | Road Trips, Routes & Planning Guide",
      description:
        "Plan a Texas scenic drive with regional road-trip routes, seasonal advice, safety tips, photography guidance, and links to parks, rivers, caverns, and historic destinations.",
      path: "/explore/texas-scenic-drives",
      type: "article",
      image: "/images/explore/texas-scenic-drives-hero.svg",
      imageAlt: "Illustrated scenic Texas highway through Hill Country toward distant mountains",
      keywords:
        "Texas scenic drives, Texas road trips, best drives in Texas, Hill Country scenic drive, West Texas road trip, Texas travel routes",
      section: "Explore Texas",
      author: "Keep TX Red Editorial Team",
    });
    return { meta: seo.meta, links: seo.links };
  },
  component: TexasScenicDrivesPage,
});

const routeGroups = [
  {
    name: "Hill Country rivers and limestone hills",
    bestFor: "Wildflowers, swimming holes, small towns, overlooks, and easy weekend loops",
    season: "Spring for flowers; fall and winter for cooler hiking weather",
    route:
      "Build a loop through Fredericksburg, Johnson City, Blanco, Wimberley, and the upper Guadalupe or Frio River country. The best version is not the fastest highway route: use farm-to-market roads, stop in town centers, and reserve time for a park or spring-fed swimming destination.",
    links: [
      ["Explore Hill Country springs", "/explore/hill-country-springs"],
      ["Find spring-fed swimming", "/explore/spring-fed-swimming"],
      ["Plan around wildflower season", "/explore/texas-wildflower-seasons"],
    ],
  },
  {
    name: "Big Bend and the River Road",
    bestFor: "Desert mountains, enormous skies, geology, stargazing, and remote-road scenery",
    season: "Late fall through early spring",
    route:
      "Anchor the trip in Alpine, Marfa, Fort Davis, Presidio, or Terlingua, then connect state parks, historic communities, and the Rio Grande corridor. Distances are long and services are sparse, so fuel early, carry water, download maps, and avoid treating drive times as if they were urban estimates.",
    links: [
      ["Browse Texas state parks", "/explore/texas-state-parks-guide"],
      ["Build a multi-day itinerary", "/explore/trip-planner"],
      ["Search West Texas destinations", "/explore/search"],
    ],
  },
  {
    name: "Palo Duro and Caprock canyon country",
    bestFor: "Red-rock canyons, grasslands, bison country, sunsets, and Panhandle history",
    season: "Spring and fall; summer drives are best early or late in the day",
    route:
      "Pair Palo Duro Canyon with Caprock Canyons and nearby Plains communities. The landscape changes quickly where the level plains break into canyon systems, and the best stops combine scenic overlooks with short hikes, historic interpretation, or wildlife viewing.",
    links: [
      ["Search park destinations", "/explore/search"],
      ["Compare state-park regions", "/explore/texas-state-parks-guide"],
      ["Create a custom route", "/explore/trip-planner"],
    ],
  },
  {
    name: "Piney Woods lakes and forest roads",
    bestFor: "Shaded drives, lake stops, paddling, historic towns, and fall color",
    season: "Year-round, with spring greenery and late-fall color as highlights",
    route:
      "Use Nacogdoches, Lufkin, Tyler, Jefferson, or Marshall as a base and connect forest roads, state parks, lakes, and heritage communities. East Texas rewards slower travel: stop for short boardwalks, lake overlooks, courthouse squares, and local museums rather than racing between endpoints.",
    links: [
      ["Find Texas lakes", "/explore/search"],
      ["Browse family-friendly destinations", "/explore/search"],
      ["Plan a camping stop", "/explore/search"],
    ],
  },
  {
    name: "Gulf Coast wildlife and lighthouse route",
    bestFor: "Birding, beaches, bays, fishing towns, maritime history, and winter escapes",
    season: "Fall through spring, especially during bird migration",
    route:
      "Link coastal communities from Galveston and Freeport toward Rockport, Corpus Christi, and the lower coast. Conditions can change with storms, tides, construction, and seasonal access, so verify ferry schedules, beach rules, wildlife-refuge hours, and road conditions before departure.",
    links: [
      ["Explore Texas lighthouses", "/explore/lighthouses"],
      ["Browse scenic rivers", "/explore/scenic-rivers"],
      ["Search coastal destinations", "/explore/search"],
    ],
  },
];

const faqItems = [
  {
    question: "What is the best scenic drive in Texas?",
    answer:
      "There is no single best route because Texas landscapes vary dramatically. Hill Country loops are the easiest all-around choice, the Big Bend River Road offers the most dramatic remote scenery, and Palo Duro and Caprock country provide the strongest canyon landscapes.",
  },
  {
    question: "When is the best time for a Texas road trip?",
    answer:
      "Spring and fall are the most comfortable statewide seasons. Winter is ideal for West Texas, South Texas, and the coast, while summer works best for river routes, higher elevations, and drives planned around mornings and evenings.",
  },
  {
    question: "How should I plan fuel stops in rural Texas?",
    answer:
      "Refuel before entering remote areas, do not rely on a single small-town station, and carry water. In West Texas and parts of the Panhandle, the next dependable fuel stop may be much farther away than expected.",
  },
  {
    question: "Can I stop along Texas highways for photos?",
    answer:
      "Only stop where parking is legal and the vehicle can be completely clear of traffic. Do not block gates, enter private land, stand on narrow shoulders, or cross fencing for a photograph.",
  },
];

function TexasScenicDrivesPage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Best Scenic Drives in Texas",
    description:
      "An evergreen guide to Texas scenic drives, regional road trips, seasons, safety, photography, and destination planning.",
    image: "https://keeptxred.com/images/explore/texas-scenic-drives-hero.svg",
    datePublished: "2026-07-26",
    dateModified: "2026-07-26",
    author: { "@type": "Organization", name: "Keep TX Red Editorial Team" },
    publisher: { "@type": "Organization", name: "Keep TX Red" },
    mainEntityOfPage: "https://keeptxred.com/explore/texas-scenic-drives",
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([articleSchema, faqSchema]).replace(/</g, "\\u003c"),
        }}
      />

      <section className="border-b bg-muted/30">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:py-20">
          <div>
            <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
              <Link to="/explore" className="hover:text-primary hover:underline">Explore Texas</Link>
              {" / Texas scenic drives"}
            </nav>
            <p className="mt-8 text-xs font-bold uppercase tracking-[0.25em] text-primary">Texas road-trip guide</p>
            <h1 className="mt-3 max-w-4xl font-display text-5xl leading-none md:text-7xl">Best scenic drives in Texas</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
              Texas road trips work best when the drive is part of the destination. Use this guide to match a route with the right season, connect parks and historic places, and avoid the planning mistakes that turn a beautiful drive into a rushed day behind the wheel.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild><Link to="/explore/trip-planner"><Compass /> Build a road trip</Link></Button>
              <Button asChild variant="outline"><Link to="/explore/search" search={{ page: 1, pageSize: 24, sort: "relevance" }}><MapPinned /> Browse destinations</Link></Button>
            </div>
          </div>
          <img
            src="/images/explore/texas-scenic-drives-hero.svg"
            alt="Illustrated Texas highway passing wildflowers, hills, desert mesas, and a distant sunset"
            className="aspect-[16/10] w-full rounded-xl border object-cover shadow-sm"
            width="1600"
            height="1000"
          />
        </div>
      </section>

      <article className="mx-auto max-w-5xl space-y-14 px-4 py-14">
        <section className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-5 font-serif text-lg leading-8">
            <h2 className="font-display text-3xl md:text-4xl">How to plan a scenic Texas road trip</h2>
            <p>
              Start with one landscape rather than a list of cities. Texas is too large for a satisfying trip that tries to combine the Gulf Coast, Hill Country, Panhandle, and Big Bend in a few days. Choose a region, select one anchor destination, and add stops that fit naturally along the route.
            </p>
            <p>
              A good driving day usually includes one major attraction, one flexible stop, and enough unscheduled time for overlooks, meals, weather delays, and short walks. Use the <Link to="/explore/trip-planner" className="font-semibold text-primary hover:underline">Explore Texas trip planner</Link> to connect destinations, then verify hours, reservations, closures, fuel availability, and road conditions with official sources.
            </p>
            <p>
              Avoid judging distance by mileage alone. A 150-mile route through Houston traffic is different from 150 miles through remote desert country. Scenic roads may be slower, cell coverage may disappear, and weather can affect low-water crossings, beach access, canyon roads, and mountain routes.
            </p>
          </div>
          <aside className="rounded-xl border bg-muted/20 p-6">
            <Car className="size-7 text-primary" aria-hidden="true" />
            <h2 className="mt-3 font-display text-2xl">Before leaving</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              <li>Download maps for offline use.</li>
              <li>Check tires, fuel range, and spare-tire equipment.</li>
              <li>Carry water, sun protection, and a basic first-aid kit.</li>
              <li>Confirm park reservations and closing times.</li>
              <li>Share remote-route plans with someone at home.</li>
            </ul>
          </aside>
        </section>

        <section aria-labelledby="routes">
          <h2 id="routes" className="font-display text-3xl md:text-4xl">Five classic Texas scenic-drive regions</h2>
          <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">
            These are flexible route frameworks rather than rigid turn-by-turn itineraries. Open the linked Explore Texas guides to choose specific parks, waterways, communities, caverns, and historic places.
          </p>
          <div className="mt-8 space-y-8">
            {routeGroups.map((group, index) => (
              <section key={group.name} className="overflow-hidden rounded-xl border">
                <div className="grid gap-0 lg:grid-cols-[220px_1fr]">
                  <div className="bg-muted/30 p-6">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Route {index + 1}</p>
                    <h3 className="mt-2 font-display text-2xl">{group.name}</h3>
                  </div>
                  <div className="p-6 md:p-8">
                    <dl className="grid gap-4 text-sm sm:grid-cols-2">
                      <div><dt className="font-semibold">Best for</dt><dd className="mt-1 leading-6 text-muted-foreground">{group.bestFor}</dd></div>
                      <div><dt className="font-semibold">Best season</dt><dd className="mt-1 leading-6 text-muted-foreground">{group.season}</dd></div>
                    </dl>
                    <p className="mt-5 font-serif text-lg leading-8">{group.route}</p>
                    <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                      {group.links.map(([label, href]) => (
                        <Link key={label} to={href} className="text-sm font-semibold text-primary hover:underline">{label}</Link>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-2">
          <div>
            <Mountain className="size-7 text-primary" aria-hidden="true" />
            <h2 className="mt-3 font-display text-3xl">Match the route to the season</h2>
            <div className="mt-4 space-y-4 leading-7 text-muted-foreground">
              <p><strong className="text-foreground">Spring:</strong> Hill Country wildflowers, East Texas greenery, bird migration, and comfortable canyon hiking.</p>
              <p><strong className="text-foreground">Summer:</strong> River routes, spring-fed swimming, coastal drives, and higher-elevation West Texas stops. Plan outdoor activity early.</p>
              <p><strong className="text-foreground">Fall:</strong> Broad statewide road-trip weather, changing leaves in parts of East Texas, and comfortable park visits.</p>
              <p><strong className="text-foreground">Winter:</strong> Big Bend, South Texas, coastal wildlife routes, and uncrowded historic-town weekends.</p>
            </div>
          </div>
          <img
            src="/images/explore/texas-scenic-drives-regions.svg"
            alt="Four-panel illustration of Texas Hill Country, canyon country, Piney Woods, and Gulf Coast road trips"
            className="aspect-[4/3] w-full rounded-xl border object-cover"
            width="1200"
            height="900"
            loading="lazy"
          />
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border p-6">
            <Camera className="size-7 text-primary" aria-hidden="true" />
            <h2 className="mt-3 font-display text-2xl">Photograph safely</h2>
            <p className="mt-3 leading-7 text-muted-foreground">Use designated pullouts and legal parking. Never stop in a traffic lane, stand on a blind curve, block ranch gates, or enter private property for a photograph.</p>
          </div>
          <div className="rounded-xl border p-6">
            <ShieldCheck className="size-7 text-primary" aria-hidden="true" />
            <h2 className="mt-3 font-display text-2xl">Respect rural Texas</h2>
            <p className="mt-3 leading-7 text-muted-foreground">Most roadside land is privately owned. Leave gates, fences, livestock, wildflowers, historic structures, and ranch roads exactly as you found them.</p>
          </div>
          <div className="rounded-xl border p-6">
            <MapPinned className="size-7 text-primary" aria-hidden="true" />
            <h2 className="mt-3 font-display text-2xl">Verify every stop</h2>
            <p className="mt-3 leading-7 text-muted-foreground">Hours, fees, ferry service, fire restrictions, water crossings, and park capacity can change. Check the official source before committing to a detour.</p>
          </div>
        </section>

        <section aria-labelledby="road-trip-links" className="rounded-xl border bg-muted/20 p-7 md:p-9">
          <h2 id="road-trip-links" className="font-display text-3xl">Build the route around real destinations</h2>
          <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">Turn a scenic drive into a complete Texas trip by adding one or two anchor experiences.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild variant="outline"><Link to="/explore/texas-state-parks-guide">Texas state parks</Link></Button>
            <Button asChild variant="outline"><Link to="/explore/caverns">Texas caverns</Link></Button>
            <Button asChild variant="outline"><Link to="/explore/scenic-rivers">Scenic rivers</Link></Button>
            <Button asChild variant="outline"><Link to="/explore/lighthouses">Texas lighthouses</Link></Button>
            <Button asChild variant="outline"><Link to="/explore/texas-wildflower-seasons">Wildflower seasons</Link></Button>
          </div>
        </section>

        <section aria-labelledby="scenic-drive-faq">
          <h2 id="scenic-drive-faq" className="font-display text-3xl md:text-4xl">Texas scenic-drive questions</h2>
          <div className="mt-6 divide-y rounded-xl border">
            {faqItems.map((item) => (
              <div key={item.question} className="p-6">
                <h3 className="font-semibold">{item.question}</h3>
                <p className="mt-2 leading-7 text-muted-foreground">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
