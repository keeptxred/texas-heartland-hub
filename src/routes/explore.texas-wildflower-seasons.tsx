import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, Camera, Car, Flower2, MapPinned, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildSeo } from "@/lib/seo";

export const Route = createFileRoute("/explore/texas-wildflower-seasons")({
  head: () => {
    const seo = buildSeo({
      title: "Texas Wildflower Seasons | Best Times, Regions & Road Trips",
      description:
        "Plan a Texas wildflower trip with a month-by-month bloom guide, regional timing, bluebonnet season advice, photography tips, scenic-drive ideas, and responsible viewing rules.",
      path: "/explore/texas-wildflower-seasons",
      type: "article",
      image: "/images/explore/texas-wildflower-guide-hero.svg",
      keywords:
        "Texas wildflower season, Texas bluebonnet season, Texas wildflower road trip, best time to see bluebonnets, Texas spring flowers, Texas wildflower guide",
    });
    return { meta: seo.meta, links: seo.links };
  },
  component: TexasWildflowerSeasonsPage,
});

const faqItems = [
  {
    question: "When is peak wildflower season in Texas?",
    answer:
      "The broadest statewide display usually occurs from March through May, but timing shifts with winter temperatures, rainfall, elevation, and region. South Texas may begin earlier, while the Panhandle and higher elevations often peak later.",
  },
  {
    question: "When do Texas bluebonnets usually bloom?",
    answer:
      "Bluebonnets commonly begin appearing in March and may remain showy into April or early May in cooler areas. The exact peak can move by several weeks from one year to the next.",
  },
  {
    question: "Where are the best places to see Texas wildflowers?",
    answer:
      "Reliable viewing areas include the Hill Country, Central Texas, North Texas prairies, East Texas roadsides, South Texas brush country, the Panhandle, and public parks throughout the state. Conditions vary annually, so build a flexible route with several nearby stops.",
  },
  {
    question: "Is it legal to pick bluebonnets in Texas?",
    answer:
      "There is no single statewide ban aimed specifically at picking bluebonnets, but collecting may be prohibited on private property, in parks, on protected lands, or where stopping creates a traffic or safety hazard. The best practice is to leave flowers in place and take photographs instead.",
  },
  {
    question: "How can I photograph wildflowers without damaging them?",
    answer:
      "Stay on established paths, roadside pull-offs, or already-open ground; avoid sitting or placing equipment on blooms; keep children and pets close; and use longer focal lengths to create the appearance of being surrounded by flowers without entering dense patches.",
  },
];

const regions = [
  {
    name: "Hill Country and Central Texas",
    timing: "Mid-March through April",
    copy:
      "This is the classic bluebonnet road-trip region, with limestone hills, ranch roads, oak-lined valleys, and mixed displays of bluebonnets, Indian paintbrush, phlox, verbena, and coreopsis. Weekdays and early mornings offer the best chance to avoid roadside congestion.",
  },
  {
    name: "North Texas and the Blackland Prairie",
    timing: "Late March through May",
    copy:
      "Prairie remnants, lake margins, park roads, and lightly managed roadsides can produce broad sweeps of bluebonnets, paintbrush, primrose, and later-season sunflowers. A wet winter followed by mild spring weather can create especially strong displays.",
  },
  {
    name: "East Texas and the Piney Woods",
    timing: "March through May",
    copy:
      "Wildflower viewing here is less about endless open fields and more about woodland edges, dogwoods, azaleas, native irises, phlox, and sunny roadside openings. Combine flowers with forest trails, lakes, and historic towns.",
  },
  {
    name: "South Texas and the Gulf Coast",
    timing: "February through April, with rain-driven repeats",
    copy:
      "Warmer temperatures can bring earlier color. Look for coreopsis, phlox, verbena, prickly poppy, and coastal prairie flowers. Tropical weather and seasonal rainfall can also trigger later flushes that do not match the Central Texas calendar.",
  },
  {
    name: "West Texas and Big Bend country",
    timing: "February through April; later at elevation",
    copy:
      "Desert blooms are highly dependent on rain. In favorable years, roadsides and desert flats can carry spectacular color, while mountain zones bloom later. Because distances are long and services are limited, verify fuel, weather, park access, and road conditions before leaving.",
  },
  {
    name: "Panhandle and High Plains",
    timing: "April through June",
    copy:
      "Cooler nights and northern latitude push the season later. Prairie wildflowers, yucca, sunflowers, and canyon-country blooms can extend the Texas viewing season after Central Texas has begun to fade.",
  },
];

function TexasWildflowerSeasonsPage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Texas Wildflower Seasons: Best Times, Regions and Road Trips",
    description:
      "A statewide planning guide to Texas wildflower timing, regions, road trips, photography, and responsible viewing.",
    image: "https://keeptxred.com/images/explore/texas-wildflower-guide-hero.svg",
    mainEntityOfPage: "https://keeptxred.com/explore/texas-wildflower-seasons",
    datePublished: "2026-07-26",
    dateModified: "2026-07-26",
    author: { "@type": "Organization", name: "Keep TX Red" },
    publisher: { "@type": "Organization", name: "Keep TX Red" },
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
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-16">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <Link to="/explore" className="hover:text-primary hover:underline">Explore Texas</Link>{" "}/ Texas wildflower seasons
          </nav>
          <div className="mt-8 grid items-center gap-8 lg:grid-cols-[1.05fr_.95fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Texas outdoors</p>
              <h1 className="mt-3 font-display text-5xl leading-none md:text-7xl">Texas wildflower seasons</h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
                A practical guide to bluebonnet season, regional bloom timing, scenic drives, photography, and responsible wildflower viewing across Texas.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button asChild><Link to="/explore/search" search={{ page: 1, pageSize: 24, sort: "relevance", types: ["park"] }}><MapPinned /> Find parks</Link></Button>
                <Button asChild variant="outline"><Link to="/explore/trip-planner"><Car /> Build a road trip</Link></Button>
              </div>
            </div>
            <img src="/images/explore/texas-wildflower-guide-hero.svg" alt="Illustrated Texas hills, bluebonnets, Indian paintbrush, and a winding spring road" className="w-full rounded-xl border bg-background" width="1600" height="900" />
          </div>
        </div>
      </section>

      <article className="mx-auto max-w-4xl space-y-14 px-4 py-14">
        <section className="prose prose-lg max-w-none dark:prose-invert">
          <h2>Why Texas wildflower timing changes every year</h2>
          <p>
            Texas does not have one universal wildflower week. The state spans deserts, coastal prairie, pine forest, limestone hills, high plains, and mountain country. A warm South Texas roadside may be colorful while the Panhandle is still dealing with late cold fronts. Even within one county, a sunny south-facing slope can bloom before a shaded creek bottom.
          </p>
          <p>
            Rainfall is the biggest wild card. Many annual wildflowers germinate after fall or winter moisture, develop low leaf rosettes through the cool season, and then grow rapidly when spring warmth arrives. A dry planting season can reduce the number of plants. A late freeze can delay flowers. Heavy spring rain may extend the display, while an abrupt heat wave can shorten it. Plan around a season rather than a single date, and keep several destinations within driving distance.
          </p>
        </section>

        <section aria-labelledby="calendar-heading">
          <h2 id="calendar-heading" className="font-display text-3xl md:text-4xl">Texas wildflowers month by month</h2>
          <img src="/images/explore/texas-wildflower-season-calendar.svg" alt="Illustrated seasonal calendar for Texas wildflowers from winter through fall" className="mt-6 w-full rounded-xl border" width="1400" height="780" loading="lazy" />
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="rounded-lg border p-5"><h3 className="font-display text-2xl">January and February</h3><p className="mt-2 leading-7 text-muted-foreground">Most of Texas is in preparation mode, but South and West Texas can produce early flowers after favorable rain. This is a good time to scout routes, watch roadside vegetation, and reserve popular spring campsites.</p></div>
            <div className="rounded-lg border p-5"><h3 className="font-display text-2xl">March</h3><p className="mt-2 leading-7 text-muted-foreground">The main season begins. Bluebonnets and paintbrush often appear first in warmer counties, then spread north and west. Early March trips work best when you remain flexible and follow recent local observations.</p></div>
            <div className="rounded-lg border p-5"><h3 className="font-display text-2xl">April</h3><p className="mt-2 leading-7 text-muted-foreground">April is the safest single month for a broad Texas wildflower trip. Bluebonnets may still dominate, while paintbrush, phlox, verbena, evening primrose, coreopsis, and other species create mixed-color fields.</p></div>
            <div className="rounded-lg border p-5"><h3 className="font-display text-2xl">May and June</h3><p className="mt-2 leading-7 text-muted-foreground">The bluebonnet peak fades in warmer areas, but later flowers take over. North Texas, the Panhandle, and higher elevations may still be colorful. Sunflowers, coneflowers, blanketflower, and prairie species become more prominent.</p></div>
            <div className="rounded-lg border p-5"><h3 className="font-display text-2xl">July through September</h3><p className="mt-2 leading-7 text-muted-foreground">Summer heat reduces roadside color in many areas, but sunflowers, prairie flowers, mountain blooms, and rain-triggered displays continue. Visit early, carry water, and avoid exposed midday hikes.</p></div>
            <div className="rounded-lg border p-5"><h3 className="font-display text-2xl">October through December</h3><p className="mt-2 leading-7 text-muted-foreground">Fall asters, goldeneye, sunflowers, and other yellow blooms can brighten prairies and roadsides. Autumn is also an excellent time to combine remaining flowers with scenic rivers, state parks, and fall foliage.</p></div>
          </div>
        </section>

        <section aria-labelledby="regional-heading">
          <h2 id="regional-heading" className="font-display text-3xl md:text-4xl">Best wildflower timing by Texas region</h2>
          <div className="mt-6 space-y-5">
            {regions.map((region) => (
              <div key={region.name} className="rounded-lg border p-5 md:p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2"><h3 className="font-display text-2xl">{region.name}</h3><span className="text-sm font-semibold text-primary">{region.timing}</span></div>
                <p className="mt-3 leading-7 text-muted-foreground">{region.copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="prose prose-lg max-w-none dark:prose-invert">
          <h2>How to plan a Texas wildflower road trip</h2>
          <p>
            Start with one anchor destination, then identify two or three backups within the same region. A good route might combine a public park, a scenic farm-to-market road, a small town, and a second nature stop. The goal is not to chase one famous field. It is to create a route that remains worthwhile even when one location is past peak, crowded, recently mowed, or closed.
          </p>
          <p>
            Use the <Link to="/explore/texas-state-parks-guide">Texas State Parks Guide</Link> to choose a public-land anchor, search <Link to="/explore/search" search={{ page: 1, pageSize: 24, sort: "relevance", activities: ["hiking"] }}>Texas hiking destinations</Link>, or add a stop from the <Link to="/explore/scenic-rivers">Texas scenic rivers guide</Link>. In the Hill Country, a morning wildflower drive can pair naturally with a later <Link to="/explore/caverns">cavern tour</Link>, especially when afternoon heat or storms make roadside stops less comfortable.
          </p>
          <h3>Build around light, traffic, and weather</h3>
          <p>
            Sunrise and the first two hours of daylight usually offer softer light, calmer wind, cooler temperatures, and lighter traffic. Late afternoon can also be beautiful, but popular roads are often busier. Avoid stopping on narrow shoulders, blind curves, bridges, private driveways, or soft ground. When a safe pull-off is unavailable, keep moving and find another location.
          </p>
        </section>

        <section aria-labelledby="responsible-heading" className="rounded-xl border bg-muted/20 p-6 md:p-8">
          <div className="flex items-center gap-3"><ShieldCheck className="size-7 text-primary" aria-hidden="true" /><h2 id="responsible-heading" className="font-display text-3xl">Responsible wildflower viewing</h2></div>
          <ul className="mt-5 grid gap-3 leading-7 text-muted-foreground">
            <li><strong className="text-foreground">Respect property.</strong> A field visible from the road may still be privately owned. Enter only where access is clearly permitted.</li>
            <li><strong className="text-foreground">Protect the plants.</strong> Stay on paths or open ground, and never flatten a patch for a photograph.</li>
            <li><strong className="text-foreground">Protect pollinators.</strong> Leave flowers in place so they can feed wildlife and produce seed.</li>
            <li><strong className="text-foreground">Protect your family.</strong> Watch for traffic, uneven ground, snakes, insects, fire ants, and changing weather.</li>
            <li><strong className="text-foreground">Keep pets controlled.</strong> Use a leash where required and prevent running through flowers or sensitive habitat.</li>
          </ul>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          <div className="rounded-lg border p-5"><CalendarDays className="size-6 text-primary" /><h2 className="mt-3 font-display text-2xl">Watch a window</h2><p className="mt-2 leading-7 text-muted-foreground">Plan for a two- to four-week period instead of betting the trip on one predicted peak date.</p></div>
          <div className="rounded-lg border p-5"><Camera className="size-6 text-primary" /><h2 className="mt-3 font-display text-2xl">Use perspective</h2><p className="mt-2 leading-7 text-muted-foreground">A low camera angle or longer lens can make a modest patch look immersive without stepping into it.</p></div>
          <div className="rounded-lg border p-5"><Flower2 className="size-6 text-primary" /><h2 className="mt-3 font-display text-2xl">Look beyond blue</h2><p className="mt-2 leading-7 text-muted-foreground">Paintbrush, phlox, verbena, primrose, coreopsis, coneflower, and sunflower extend the season.</p></div>
        </section>

        <section aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="font-display text-3xl md:text-4xl">Texas wildflower questions</h2>
          <div className="mt-6 divide-y rounded-lg border">
            {faqItems.map((item) => (
              <div key={item.question} className="p-5 md:p-6"><h3 className="font-semibold">{item.question}</h3><p className="mt-2 leading-7 text-muted-foreground">{item.answer}</p></div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border p-7 text-center">
          <h2 className="font-display text-3xl">Turn bloom season into a Texas trip</h2>
          <p className="mx-auto mt-3 max-w-2xl leading-7 text-muted-foreground">Choose a park, add nearby attractions, and keep alternate stops ready for changing bloom conditions.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3"><Button asChild><Link to="/explore/trip-planner"><Car /> Open the trip planner</Link></Button><Button asChild variant="outline"><Link to="/explore/search" search={{ page: 1, pageSize: 24, sort: "relevance" }}><MapPinned /> Browse destinations</Link></Button></div>
        </section>
      </article>
    </main>
  );
}
