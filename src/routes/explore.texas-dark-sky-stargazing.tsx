import { createFileRoute } from "@tanstack/react-router";
import { Binoculars, CalendarDays, Camera, MoonStar, ShieldCheck, TentTree } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildSeo } from "@/lib/seo";

export const Route = createFileRoute("/explore/texas-dark-sky-stargazing")({
  head: () => {
    const seo = buildSeo({
      title: "Texas Dark Sky & Stargazing Guide | Best Regions, Seasons & Trip Planning",
      description:
        "Plan a Texas stargazing trip with the best dark-sky regions, seasonal viewing advice, moon-phase planning, camping tips, photography guidance, and nearby Explore Texas destinations.",
      path: "/explore/texas-dark-sky-stargazing",
      type: "article",
      image: "/images/explore/texas-dark-sky-stargazing-hero.svg",
      imageAlt: "Milky Way over a remote Texas desert campsite and mountains",
      keywords:
        "Texas stargazing, Texas dark sky parks, best places to see stars in Texas, Big Bend stargazing, Texas astrophotography, dark sky camping Texas",
      section: "Explore Texas",
      author: "Keep TX Red Editorial Team",
    });
    return { meta: seo.meta, links: seo.links };
  },
  component: TexasDarkSkyStargazingGuide,
});

const regions = [
  {
    title: "Big Bend and the Trans-Pecos",
    summary:
      "Texas's most dependable dark-sky country combines vast public lands, high desert, mountain silhouettes, low humidity, and long distances from major city glow.",
    ideas: ["Big Bend National Park", "Big Bend Ranch State Park", "Davis Mountains State Park", "Fort Davis and the surrounding high country"],
  },
  {
    title: "Panhandle canyon country",
    summary:
      "Open horizons and dry air make the Panhandle a strong option when you want broad sky views without driving to far West Texas.",
    ideas: ["Caprock Canyons State Park", "Palo Duro Canyon State Park", "Copper Breaks State Park", "Lake Meredith and nearby public lands"],
  },
  {
    title: "Hill Country's darker western edge",
    summary:
      "The farther west you travel from Austin and San Antonio, the easier it becomes to find ranch country, granite hills, and small communities with less skyglow.",
    ideas: ["Enchanted Rock area", "South Llano River State Park", "Kickapoo Cavern State Park", "Western Hill Country scenic routes"],
  },
  {
    title: "South Texas brush country",
    summary:
      "Sparse settlement, wide ranchlands, and warm-season access can produce rewarding views of the southern sky when humidity and clouds cooperate.",
    ideas: ["Lower Rio Grande Valley wildlife areas", "Brush-country ranch roads", "Coastal bend public lands away from cities", "Remote county parks and campgrounds"],
  },
];

const faqItems = [
  {
    question: "What is the best time of year for stargazing in Texas?",
    answer:
      "Fall through early spring often brings cooler temperatures, lower humidity, and longer nights. Summer can still be excellent in dry West Texas, but heat, monsoon storms, insects, and late sunsets require more planning.",
  },
  {
    question: "Does the moon matter for stargazing?",
    answer:
      "Yes. A bright moon washes out faint stars and the Milky Way. Plan near a new moon for the darkest sky, or use a bright moon deliberately for illuminated landscapes and easier nighttime navigation.",
  },
  {
    question: "Can I stargaze at a Texas state park after closing time?",
    answer:
      "Only when park access, camping, or a scheduled program allows it. Hours and nighttime rules vary, so confirm access before driving and never remain in a closed day-use area without authorization.",
  },
  {
    question: "What should beginners bring?",
    answer:
      "Start with warm layers, water, a chair or blanket, a dim red flashlight, an offline sky map, insect protection, and binoculars. A telescope is optional and can add setup complexity on a first trip.",
  },
];

function TexasDarkSkyStargazingGuide() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Texas Dark Sky and Stargazing Guide",
    description:
      "A practical guide to Texas stargazing regions, seasons, moon phases, camping, safety, and night-sky photography.",
    image: "https://keeptxred.com/images/explore/texas-dark-sky-stargazing-hero.svg",
    author: { "@type": "Organization", name: "Keep TX Red Editorial Team" },
    publisher: { "@type": "Organization", name: "Keep TX Red" },
    datePublished: "2026-07-26",
    dateModified: "2026-07-26",
    mainEntityOfPage: "https://keeptxred.com/explore/texas-dark-sky-stargazing",
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }} />

      <section className="border-b bg-slate-950 text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:py-20">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-300">Explore Texas after dark</p>
            <h1 className="mt-3 font-display text-5xl leading-none md:text-7xl">Texas dark sky and stargazing guide</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
              Find the right region, season, moon phase, campsite, and gear for a Texas night-sky trip—from Big Bend and the Davis Mountains to canyon country and the western Hill Country.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg"><a href="https://texasdefined.com/explore/trip-planner">Plan a stargazing trip</a></Button>
              <Button asChild size="lg" variant="outline"><a href="https://texasdefined.com/explore/search?activities=camping">Find camping</a></Button>
            </div>
          </div>
          <img src="/images/explore/texas-dark-sky-stargazing-hero.svg" alt="Milky Way over a remote Texas desert campsite and mountains" width="1600" height="1000" className="w-full rounded-xl border border-white/15" />
        </div>
      </section>

      <article className="mx-auto max-w-4xl space-y-14 px-4 py-14">
        <section className="space-y-5 font-serif text-lg leading-8">
          <h2 className="font-display text-4xl">Why Texas is built for night-sky road trips</h2>
          <p>Texas offers something few states can match: enormous distances, dry western air, elevated mountain basins, open plains, and public lands where the horizon can remain dark for miles. The experience changes dramatically by region. West Texas offers the deepest darkness, while the Panhandle and western Hill Country provide more accessible alternatives for travelers starting near major cities.</p>
          <p>The best trip is not simply the place with the darkest map color. It is the place where you can legally remain after sunset, safely park or camp, understand the weather, and pair nighttime viewing with worthwhile daytime stops. Use the <a href="https://texasdefined.com/explore/texas-scenic-drives" className="font-semibold text-primary hover:underline">Texas scenic drives guide</a> to shape the route, then add parks, caverns, historic places, and communities through the <a href="https://texasdefined.com/explore/trip-planner" className="font-semibold text-primary hover:underline">Explore Texas trip planner</a>.</p>
        </section>

        <section>
          <h2 className="font-display text-4xl">Best Texas regions for stargazing</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {regions.map((region) => (
              <div key={region.title} className="rounded-xl border p-6">
                <h3 className="font-display text-2xl">{region.title}</h3>
                <p className="mt-3 leading-7 text-muted-foreground">{region.summary}</p>
                <ul className="mt-4 space-y-2 text-sm">
                  {region.ideas.map((idea) => <li key={idea}>• {idea}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <img src="/images/explore/texas-dark-sky-planning.svg" alt="Illustrated stargazing planning wheel showing moon, weather, access, and gear" width="1200" height="900" className="w-full rounded-xl border" loading="lazy" />
          <div>
            <h2 className="font-display text-4xl">Plan around the moon, weather, and access</h2>
            <div className="mt-5 space-y-4 leading-7 text-muted-foreground">
              <p><strong className="text-foreground">Moon:</strong> Choose dates near the new moon for faint stars and the Milky Way. A first-quarter moon can still work if it sets before your main viewing window.</p>
              <p><strong className="text-foreground">Clouds and humidity:</strong> A remote location cannot overcome a solid cloud deck. Check hourly cloud cover, dew point, wind, and storm risk before leaving.</p>
              <p><strong className="text-foreground">Legal access:</strong> Confirm gate hours, camping reservations, after-hours policies, and any astronomy-program registration. Never improvise a roadside viewing stop on a narrow shoulder.</p>
              <p><strong className="text-foreground">Wildlife and terrain:</strong> Use a red light, watch for snakes and uneven ground, and avoid walking away from camp without a known route back.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-display text-4xl">A simple stargazing kit</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              [MoonStar, "Red-light discipline", "Use the dimmest red light that lets you move safely and protect everyone’s night vision."],
              [Binoculars, "Binoculars first", "They are easier to pack and aim than a telescope and reveal star clusters, the Moon, and bright deep-sky objects."],
              [TentTree, "Comfortable camp", "Bring a reclining chair, layers, water, and a blanket so you can remain still long enough for your eyes to adapt."],
              [Camera, "Photo basics", "Use a tripod, manual focus, wide aperture, and short test exposures before attempting a longer session."],
              [CalendarDays, "Offline plan", "Save directions, reservation details, moon timing, and a sky map before entering areas with weak service."],
              [ShieldCheck, "Safe return", "Mark the vehicle or campsite, tell someone your route, and avoid fatigue on the drive home."],
            ].map(([Icon, title, text]) => {
              const ItemIcon = Icon as typeof MoonStar;
              return <div key={String(title)} className="rounded-xl border bg-muted/20 p-5"><ItemIcon className="h-6 w-6 text-primary" /><h3 className="mt-3 font-semibold">{String(title)}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{String(text)}</p></div>;
            })}
          </div>
        </section>

        <section className="space-y-5 font-serif text-lg leading-8">
          <h2 className="font-display text-4xl">Build a complete dark-sky weekend</h2>
          <p>Anchor the trip with an overnight destination from the <a href="https://texasdefined.com/explore/texas-state-parks-guide" className="font-semibold text-primary hover:underline">Texas state parks guide</a>. Add a daytime hike, a spring-fed stop, or one of the destinations in the <a href="https://texasdefined.com/explore/caverns" className="font-semibold text-primary hover:underline">Texas caverns guide</a>. In West Texas, allow generous driving time and avoid stacking too many distant stops into one day.</p>
          <p>Spring wildflowers can add daylight scenery, but the brightest bloom weekends may also increase traffic and campsite demand. The <a href="https://texasdefined.com/explore/texas-wildflower-seasons" className="font-semibold text-primary hover:underline">Texas wildflower seasons guide</a> can help you decide whether to combine both experiences or schedule a quieter astronomy-focused trip.</p>
        </section>

        <section>
          <h2 className="font-display text-4xl">Frequently asked questions</h2>
          <div className="mt-6 space-y-4">
            {faqItems.map((item) => <details key={item.question} className="rounded-lg border p-5"><summary className="cursor-pointer font-semibold">{item.question}</summary><p className="mt-3 leading-7 text-muted-foreground">{item.answer}</p></details>)}
          </div>
        </section>

        <section className="rounded-xl border bg-muted/20 p-7 text-center">
          <h2 className="font-display text-3xl">Start building your Texas night-sky trip</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">Choose a legal overnight anchor, add nearby daytime stops, and verify moon, clouds, wind, access, and road conditions before departure.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3"><Button asChild><a href="https://texasdefined.com/explore/trip-planner">Open the trip planner</a></Button><Button asChild variant="outline"><a href="https://texasdefined.com/explore/search">Browse destinations</a></Button></div>
        </section>
      </article>
    </main>
  );
}
