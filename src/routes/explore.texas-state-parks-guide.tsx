import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CalendarDays,
  CheckCircle2,
  Compass,
  MapPinned,
  TentTree,
  WalletCards,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildSeo } from "@/lib/seo";

export const Route = createFileRoute("/explore/texas-state-parks-guide")({
  head: () => {
    const seo = buildSeo({
      title: "Texas State Parks Guide | Best Parks, Seasons, Camping & Reservations",
      description:
        "Plan a Texas state park trip by region, season, activity, reservation needs, camping style, and nearby Explore Texas destinations.",
      path: "/explore/texas-state-parks-guide",
      type: "article",
      image: "/images/explore/texas-state-parks-guide-hero.svg",
      imageAlt: "Illustrated Texas state parks landscape with mountains, forest, and river",
      keywords:
        "Texas state parks guide, best state parks in Texas, Texas camping, Texas hiking, Texas park reservations, Texas State Parks Pass",
      section: "Explore Texas",
      author: "Keep TX Red Editorial Team",
    });
    return { meta: seo.meta, links: seo.links };
  },
  component: TexasStateParksGuide,
});

const searchDefaults = { page: 1, pageSize: 24, sort: "relevance" as const };

const parkGroups = [
  {
    region: "Hill Country",
    summary:
      "Clear rivers, limestone canyons, spring-fed swimming holes, oak-juniper hills, and some of the state’s most popular weekend parks.",
    picks: [
      ["Garner State Park", "Frio River swimming, family camping, scenic overlooks, and summer traditions."],
      ["Pedernales Falls State Park", "Hill Country hiking, river overlooks, birding, and broad limestone shelves."],
      ["Inks Lake State Park", "Reliable lake recreation, paddling, camping, and access to nearby Hill Country stops."],
      ["Colorado Bend State Park", "Waterfalls, rugged trails, river scenery, and cave-tour opportunities when offered."],
    ],
  },
  {
    region: "West Texas and Big Bend",
    summary:
      "Desert basins, mountain trails, dark skies, dramatic geology, and long drives that reward careful itinerary planning.",
    picks: [
      ["Davis Mountains State Park", "High-desert camping, scenic drives, cooler elevations, and access to Fort Davis."],
      ["Big Bend Ranch State Park", "Remote desert backcountry, mountain biking, paddling, and some of Texas’s biggest views."],
      ["Monahans Sandhills State Park", "Wind-shaped dunes, sand exploration, sunsets, and a distinctive West Texas landscape."],
      ["Balmorhea State Park", "A historic spring-fed pool and a natural oasis in the Chihuahuan Desert."],
    ],
  },
  {
    region: "Panhandle and Plains",
    summary:
      "Canyon country, open grasslands, bison history, reservoir recreation, and wide horizons built for road trips.",
    picks: [
      ["Palo Duro Canyon State Park", "Canyon hiking, scenic drives, camping, and one of the state’s signature landscapes."],
      ["Caprock Canyons State Park", "Bison, red-rock trails, rugged camping, and a quieter canyon-country experience."],
      ["Copper Breaks State Park", "Dark skies, short trails, wildlife watching, and a peaceful Rolling Plains setting."],
      ["Lake Colorado City State Park", "An easy interstate stop for camping, lake views, and a slower travel day."],
    ],
  },
  {
    region: "Piney Woods and East Texas",
    summary:
      "Tall pines, hardwood bottomlands, quiet lakes, paddling, fishing, and shaded camping that feels far removed from the rest of Texas.",
    picks: [
      ["Caddo Lake State Park", "Bald cypress, bayous, paddling, cabins, and one of Texas’s most atmospheric waterways."],
      ["Martin Dies Jr. State Park", "Paddling trails, fishing, wildlife watching, and roomy campsites among East Texas waters."],
      ["Tyler State Park", "A forested lake, CCC-era character, family camping, and convenient access from North Texas."],
      ["Daingerfield State Park", "A compact lake park known for paddling, swimming, fall color, and wooded campsites."],
    ],
  },
  {
    region: "Gulf Coast and South Texas",
    summary:
      "Coastal wetlands, beaches, bird migration routes, subtropical habitat, and warm-weather recreation across much of the year.",
    picks: [
      ["Mustang Island State Park", "Beach camping, paddling, fishing, and direct access to the Texas coast."],
      ["Goose Island State Park", "Coastal camping, fishing, birding, and easy access to Rockport-area attractions."],
      ["Brazos Bend State Park", "Wetland trails, wildlife viewing, family hiking, and a convenient Houston-area escape."],
      ["Resaca de la Palma State Park", "Rio Grande Valley birding and subtropical habitat near Brownsville."],
    ],
  },
];

const faqItems = [
  {
    question: "Do Texas state parks require reservations?",
    answer:
      "Reservations are not universally required, but advance day-use and overnight reservations are strongly recommended for popular parks, weekends, holidays, and school breaks. A park can stop admitting walk-up visitors after reaching capacity.",
  },
  {
    question: "How far ahead can I reserve a Texas state park?",
    answer:
      "Texas Parks and Wildlife currently allows day-pass reservations up to one month before a visit and most overnight camping or lodging reservations up to five months ahead. Always confirm the current window before booking.",
  },
  {
    question: "Is the Texas State Parks Pass worth it?",
    answer:
      "It can be valuable for households that visit several parks in a year because it covers entry for the pass holder and eligible guests and includes certain discounts. Camping and activity fees still apply, and a pass does not override park capacity limits.",
  },
  {
    question: "What is the best season for Texas state parks?",
    answer:
      "There is no single best season statewide. Spring and fall are usually strongest for hiking, summer favors rivers and higher-elevation parks, and winter is often ideal for desert, coastal, and South Texas destinations.",
  },
  {
    question: "Are dogs allowed in Texas state parks?",
    answer:
      "Pets are allowed at many parks but must follow park rules, typically including leash and supervision requirements. Buildings, swimming areas, trails, or specific natural areas may have additional restrictions, so verify the individual park policy.",
  },
];

function ParkSearchLink({ name }: { name: string }) {
  return (
    <Link
      to="/explore/search"
      search={{ ...searchDefaults, q: name, types: ["park"] }}
      className="font-semibold text-primary hover:underline"
    >
      {name}
    </Link>
  );
}

function TexasStateParksGuide() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://keeptxred.com/" },
      { "@type": "ListItem", position: 2, name: "Explore Texas", item: "https://keeptxred.com/explore" },
      {
        "@type": "ListItem",
        position: 3,
        name: "Texas State Parks Guide",
        item: "https://keeptxred.com/explore/texas-state-parks-guide",
      },
    ],
  };
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Texas State Parks Guide",
    description:
      "A statewide planning guide to Texas state parks by region, season, activity, reservation needs, and camping style.",
    image: "https://keeptxred.com/images/explore/texas-state-parks-guide-hero.svg",
    author: { "@type": "Organization", name: "Keep TX Red" },
    publisher: { "@type": "Organization", name: "Keep TX Red", url: "https://keeptxred.com" },
    mainEntityOfPage: "https://keeptxred.com/explore/texas-state-parks-guide",
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
          __html: JSON.stringify([breadcrumbSchema, articleSchema, faqSchema]).replace(/</g, "\\u003c"),
        }}
      />

      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <Link to="/explore" className="hover:text-primary hover:underline">
              Explore Texas
            </Link>{" "}
            / Texas state parks guide
          </nav>
          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
                Evergreen Texas travel guide
              </p>
              <h1 className="mt-3 font-display text-5xl leading-none md:text-7xl">
                The Texas state parks guide
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
                Choose the right park by region, season, activity, camping style, and driving distance—then connect it to nearby rivers, caverns, towns, and scenic stops.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button asChild>
                  <Link to="/explore/search" search={{ ...searchDefaults, types: ["park"] }}>
                    <MapPinned /> Browse Texas parks
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/explore/trip-planner">
                    <Compass /> Build a trip
                  </Link>
                </Button>
              </div>
            </div>
            <img
              src="/images/explore/texas-state-parks-guide-hero.svg"
              alt="Illustrated Texas landscape with desert mountains, pine forest, a river, and a lone star"
              width={1600}
              height={900}
              className="w-full rounded-xl border bg-background shadow-sm"
              loading="eager"
            />
          </div>
        </div>
      </section>

      <article className="mx-auto max-w-5xl space-y-16 px-4 py-14">
        <section className="grid gap-6 md:grid-cols-3" aria-label="Texas state park planning essentials">
          <div className="rounded-lg border p-5">
            <CalendarDays className="size-6 text-primary" aria-hidden="true" />
            <h2 className="mt-3 font-display text-2xl">Reserve early</h2>
            <p className="mt-2 leading-7 text-muted-foreground">
              Popular parks can reach capacity. Secure day use, campsites, cabins, and tours before building the rest of the itinerary.
            </p>
          </div>
          <div className="rounded-lg border p-5">
            <TentTree className="size-6 text-primary" aria-hidden="true" />
            <h2 className="mt-3 font-display text-2xl">Match the season</h2>
            <p className="mt-2 leading-7 text-muted-foreground">
              Texas weather varies sharply by region. Pick the landscape and activity first, then choose the best travel window.
            </p>
          </div>
          <div className="rounded-lg border p-5">
            <WalletCards className="size-6 text-primary" aria-hidden="true" />
            <h2 className="mt-3 font-display text-2xl">Budget the full stay</h2>
            <p className="mt-2 leading-7 text-muted-foreground">
              Entrance, camping, activity, equipment, fuel, and food costs matter more than the headline campsite rate alone.
            </p>
          </div>
        </section>

        <section aria-labelledby="why-state-parks">
          <h2 id="why-state-parks" className="font-display text-4xl md:text-5xl">
            Why Texas state parks deserve a statewide guide
          </h2>
          <div className="mt-5 space-y-5 font-serif text-lg leading-8">
            <p>
              Texas state parks are not one type of destination. The system stretches from cypress bayous and Gulf beaches to Hill Country rivers, Panhandle canyons, pine forests, spring-fed pools, and Chihuahuan Desert mountains. A traveler choosing between those places is not merely comparing campgrounds. The real decision involves climate, drive time, terrain, water access, crowd levels, reservation pressure, and the kind of experience the trip needs to deliver.
            </p>
            <p>
              This guide is designed to help you make that decision. Use it with the Keep TX Red <Link to="/explore/search" search={{ ...searchDefaults, types: ["park"] }} className="text-primary hover:underline">Texas park directory</Link>, then open individual destination records to compare activities, amenities, accessibility, maps, and nearby places. For overnight planning, also browse <Link to="/explore/search" search={{ ...searchDefaults, activities: ["camping"] }} className="text-primary hover:underline">Texas camping destinations</Link> and save compatible stops in the <Link to="/explore/trip-planner" className="text-primary hover:underline">Texas trip planner</Link>.
            </p>
          </div>
        </section>

        <section aria-labelledby="choose-park">
          <h2 id="choose-park" className="font-display text-4xl md:text-5xl">
            How to choose the right Texas state park
          </h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {[
              ["Start with the experience", "Decide whether the trip is mainly for swimming, hiking, paddling, wildlife, scenery, history, stargazing, or camping. A park that excels at one may be only average at another."],
              ["Set a realistic drive radius", "A two-night trip should not lose most of its daylight to driving. For longer destinations, add a town, historic site, cavern, or scenic river stop and turn the drive into a route."],
              ["Check seasonal limits", "River conditions, heat, wildfire risk, storms, hunting closures, construction, and water availability can change the experience. Confirm alerts close to departure."],
              ["Choose the lodging level", "Primitive sites, water-only sites, electric hookups, screened shelters, cabins, and nearby hotels create very different trips. Verify the exact site before paying."],
              ["Plan around capacity", "A park pass may cover entry fees, but it does not guarantee admission when a park is full. Reserve popular destinations before arranging meals and side trips."],
              ["Build a backup", "Keep a nearby park, town, trail, museum, or scenic drive in reserve. Weather and capacity problems are easier to handle when the alternative is already mapped."],
            ].map(([title, text]) => (
              <div key={title} className="rounded-lg border p-5">
                <CheckCircle2 className="size-5 text-primary" aria-hidden="true" />
                <h3 className="mt-3 text-lg font-semibold">{title}</h3>
                <p className="mt-2 leading-7 text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="parks-by-region">
          <h2 id="parks-by-region" className="font-display text-4xl md:text-5xl">
            Texas state parks by region
          </h2>
          <p className="mt-4 max-w-4xl font-serif text-lg leading-8">
            These are starting points, not a ranking. Open each park in the Explore Texas search to compare it with nearby destinations and confirm current conditions.
          </p>
          <div className="mt-8 space-y-10">
            {parkGroups.map((group) => (
              <section key={group.region} className="border-t pt-8">
                <h3 className="font-display text-3xl">{group.region}</h3>
                <p className="mt-2 max-w-4xl leading-7 text-muted-foreground">{group.summary}</p>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {group.picks.map(([name, description]) => (
                    <div key={name} className="rounded-lg border p-5">
                      <ParkSearchLink name={name} />
                      <p className="mt-2 leading-7 text-muted-foreground">{description}</p>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>

        <section aria-labelledby="seasonal-guide">
          <div className="grid items-center gap-8 lg:grid-cols-[.95fr_1.05fr]">
            <img
              src="/images/explore/texas-state-parks-seasons.svg"
              alt="Four illustrated panels showing spring, summer, fall, and winter trips in Texas state parks"
              width={1400}
              height={700}
              className="w-full rounded-xl border bg-muted/20"
              loading="lazy"
            />
            <div>
              <h2 id="seasonal-guide" className="font-display text-4xl md:text-5xl">
                The best Texas state parks by season
              </h2>
              <div className="mt-5 space-y-4 leading-7 text-muted-foreground">
                <p><strong className="text-foreground">Spring:</strong> Prioritize wildflowers, long hikes, bird migration, waterfalls, and Hill Country or North Texas camping before summer heat settles in.</p>
                <p><strong className="text-foreground">Summer:</strong> Build around water, shade, early starts, and higher elevations. River parks and spring-fed swimming destinations are popular, so reservations matter.</p>
                <p><strong className="text-foreground">Fall:</strong> Choose hiking, camping, paddling, and East Texas foliage. Cooler evenings make this one of the most flexible seasons statewide.</p>
                <p><strong className="text-foreground">Winter:</strong> Look south and west for desert hiking, coastal birding, dark skies, and quieter campgrounds. Prepare for large temperature swings.</p>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="reservations-and-pass">
          <h2 id="reservations-and-pass" className="font-display text-4xl md:text-5xl">
            Reservations, entrance fees, and the Texas State Parks Pass
          </h2>
          <div className="mt-5 space-y-5 font-serif text-lg leading-8">
            <p>
              Texas Parks and Wildlife recommends reserving day passes for popular parks, especially on weekends and holidays. Day passes can currently be reserved up to 30 days before a visit, while most overnight camping and lodging can be booked up to five months ahead. Policies and fees can change, so use the official reservation system as the final authority.
            </p>
            <p>
              The Texas State Parks Pass currently provides a year of entry benefits for the pass holder and eligible guests, along with selected discounts. It does not include every camping or activity charge, and it does not guarantee entry after a park reaches capacity. Compare the pass price with the entrance fees your household would otherwise pay across the trips you realistically expect to take.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <a className="rounded-md border px-4 py-2 font-semibold hover:border-primary hover:text-primary" href="https://tpwd.texas.gov/state-parks/reservations/" target="_blank" rel="noreferrer">Official park reservations</a>
            <a className="rounded-md border px-4 py-2 font-semibold hover:border-primary hover:text-primary" href="https://tpwd.texas.gov/state-parks/park-information/passes/park-passes/" target="_blank" rel="noreferrer">Official park-pass details</a>
          </div>
        </section>

        <section aria-labelledby="camping-checklist">
          <h2 id="camping-checklist" className="font-display text-4xl md:text-5xl">
            A practical Texas state park camping checklist
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              "Reservation confirmation, site number, arrival window, and after-hours instructions",
              "Weather-ready shelter, stakes suited to the ground, and a sleep system for the forecast low",
              "More drinking water than the group expects to use, plus an independent backup supply",
              "Sun protection, insect protection, sturdy footwear, and a compact first-aid kit",
              "Printed or downloaded maps for areas with weak mobile service",
              "Food storage and cleanup supplies that match the park’s wildlife rules",
              "Headlamps, spare batteries, charging plan, and vehicle emergency equipment",
              "A backup activity for heat, storms, high water, closures, or crowded trailheads",
            ].map((item) => (
              <div key={item} className="flex gap-3 rounded-lg border p-4 leading-7">
                <CheckCircle2 className="mt-1 size-5 shrink-0 text-primary" aria-hidden="true" />
                <p>{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="build-route" className="rounded-xl border bg-muted/25 p-6 md:p-8">
          <h2 id="build-route" className="font-display text-3xl md:text-4xl">
            Turn one park into a complete Texas trip
          </h2>
          <p className="mt-4 max-w-4xl font-serif text-lg leading-8">
            The best state-park trips often combine one outdoor anchor with one or two nearby experiences. Pair a Hill Country park with the <Link to="/explore/caverns" className="text-primary hover:underline">Texas caverns guide</Link>, add a water-focused stop from the <Link to="/explore/scenic-rivers" className="text-primary hover:underline">Texas scenic rivers collection</Link>, or use county and regional links on each destination page to find historic sites, lakes, communities, trails, and wildlife areas nearby.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/explore/trip-planner"><Compass /> Start a Texas itinerary</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/explore/search" search={{ ...searchDefaults, types: ["park"] }}><MapPinned /> Compare parks</Link>
            </Button>
          </div>
        </section>

        <section aria-labelledby="state-park-faq">
          <h2 id="state-park-faq" className="font-display text-4xl md:text-5xl">
            Texas state park questions
          </h2>
          <div className="mt-6 divide-y rounded-lg border">
            {faqItems.map((item) => (
              <div key={item.question} className="p-5 md:p-6">
                <h3 className="text-lg font-semibold">{item.question}</h3>
                <p className="mt-2 leading-7 text-muted-foreground">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <aside className="border-t pt-8 text-sm leading-6 text-muted-foreground">
          Park fees, hours, reservation windows, amenities, closures, and rules can change. Confirm details with Texas Parks and Wildlife and the individual park before travel. Keep TX Red’s Explore Texas pages are planning resources, not official park notices.
        </aside>
      </article>
    </main>
  );
}
