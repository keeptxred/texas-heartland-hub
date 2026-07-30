import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Building2, GraduationCap, Landmark, MapPin, Newspaper, Trees, Users, Vote } from "lucide-react";
import { EntityGrid } from "./EntityGrid";
import { COUNTIES, TAX_RATE_DATASET } from "@/data/counties";
import { geographyPath } from "@/lib/explore/geography-pages";
import type { ExploreGeographyPage } from "@/types/explore/public";

const PARK_TYPES = new Set(["state_park", "national_park", "county_park", "city_park", "trail", "lake", "river", "wildlife_area", "nature_preserve"]);
const SCHOOL_TYPES = new Set(["school", "school_district", "college", "university"]);

function unique(values: Array<string | null | undefined>) {
  return [...new Set(values.filter((value): value is string => Boolean(value)))].sort();
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return <section aria-labelledby={id} className="scroll-mt-24"><h2 id={id} className="font-display text-3xl md:text-4xl">{title}</h2><div className="mt-5">{children}</div></section>;
}

function ResourceCard({ title, description, href }: { title: string; description: string; href: string }) {
  return <a href={href} className="rounded-lg border p-5 transition-colors hover:border-primary hover:bg-primary/5"><h3 className="font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p></a>;
}

export function CountyAuthorityPage({ data }: { data: ExploreGeographyPage }) {
  const county = COUNTIES.find((item) => item.name.toLowerCase() === data.name.toLowerCase());
  const label = `${data.name} County`;
  const canonicalPath = geographyPath("county", data.name);
  const cities = unique(data.items.map((item) => item.city));
  const parks = data.items.filter((item) => PARK_TYPES.has(item.entityType));
  const schools = data.items.filter((item) => SCHOOL_TYPES.has(item.entityType));
  const attractions = data.items.filter((item) => !PARK_TYPES.has(item.entityType) && !SCHOOL_TYPES.has(item.entityType));
  const schoolDistricts = county?.schoolDistricts ?? [];
  const faq = [
    { question: `What can visitors find in ${label}?`, answer: `${label} currently has ${data.total.toLocaleString("en-US")} published parks, attractions, historic places, waterways, trails, and other destinations in the KeepTXRed Explore Texas directory.` },
    county ? { question: `What is the ${label} property-tax rate?`, answer: `The county rate in the KeepTXRed dataset is ${county.countyRate.toFixed(4)} per $100 of taxable value for tax year ${county.taxYear}. A total bill can also include city, school, college, hospital, utility, emergency-services, and other special-district rates.` } : null,
    cities.length ? { question: `Which cities are represented on this ${label} page?`, answer: `Published destination records currently reference ${cities.slice(0, 12).join(", ")}${cities.length > 12 ? ", and additional communities" : ""}.` } : null,
  ].filter((item): item is { question: string; answer: string } => Boolean(item));

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": ["WebPage", "CollectionPage"], "@id": `https://keeptxred.com${canonicalPath}#webpage`, url: `https://keeptxred.com${canonicalPath}`, name: `${label}, Texas authority guide`, description: `County guide to demographics, economy, schools, taxes, districts, representatives, cities, parks, attractions, elections, and news for ${label}, Texas.`, about: { "@id": `https://keeptxred.com${canonicalPath}#county` } },
      { "@type": "AdministrativeArea", "@id": `https://keeptxred.com${canonicalPath}#county`, name: `${label}, Texas`, url: `https://keeptxred.com${canonicalPath}`, containedInPlace: { "@type": "State", name: "Texas" } },
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Explore Texas", item: "https://keeptxred.com/explore" }, { "@type": "ListItem", position: 2, name: label, item: `https://keeptxred.com${canonicalPath}` }] },
      data.items.length ? { "@type": "ItemList", name: `Parks and attractions in ${label}`, numberOfItems: data.items.length, itemListElement: data.items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, url: `https://keeptxred.com/explore/${item.slug}` })) } : null,
      county ? { "@type": "Dataset", name: `${label} property-tax data`, description: `County, school-district, city-average, and special-district property-tax data for ${label}.`, temporalCoverage: String(county.taxYear), dateModified: TAX_RATE_DATASET.lastUpdated, creator: { "@type": "Organization", name: county.dataSource } } : null,
      faq.length ? { "@type": "FAQPage", mainEntity: faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) } : null,
    ].filter(Boolean),
  };
  const nav = ["demographics", "economy", "employers", "schools", "property-taxes", "legislative-districts", "representatives", "cities", "parks", "attractions", "elections", "news"];

  return <main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    <section className="border-b bg-muted/30"><div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground"><Link to="/explore" className="hover:text-primary hover:underline">Explore Texas</Link> / {label}</nav>
      <p className="mt-8 text-xs font-bold uppercase tracking-[0.25em] text-primary">Texas county authority guide</p>
      <h1 className="mt-3 max-w-5xl font-display text-5xl leading-none md:text-7xl">{label}, Texas</h1>
      <p className="mt-5 max-w-4xl text-lg leading-8 text-muted-foreground">A single county reference for local taxes, schools, communities, government representation, elections, parks, attractions, and related KeepTXRed coverage.</p>
      <div className="mt-8 flex flex-wrap gap-2 text-sm">{nav.map((item) => <a key={item} href={`#${item}`} className="rounded-full border px-3 py-1.5 capitalize hover:border-primary hover:text-primary">{item.replaceAll("-", " ")}</a>)}</div>
    </div></section>

    <div className="mx-auto max-w-6xl space-y-16 px-4 py-14">
      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" aria-label="County overview">
        <div className="rounded-lg border p-5"><MapPin className="size-5 text-primary"/><p className="mt-3 text-sm text-muted-foreground">Texas region</p><p className="font-semibold">{county?.region || "Texas"}</p></div>
        <div className="rounded-lg border p-5"><Trees className="size-5 text-primary"/><p className="mt-3 text-sm text-muted-foreground">Published destinations</p><p className="font-semibold">{data.total.toLocaleString("en-US")}</p></div>
        <div className="rounded-lg border p-5"><Building2 className="size-5 text-primary"/><p className="mt-3 text-sm text-muted-foreground">Cities represented</p><p className="font-semibold">{cities.length.toLocaleString("en-US")}</p></div>
        <div className="rounded-lg border p-5"><Landmark className="size-5 text-primary"/><p className="mt-3 text-sm text-muted-foreground">Tax data year</p><p className="font-semibold">{county?.taxYear || "Not published"}</p></div>
      </section>

      <Section id="demographics" title={`Demographics of ${label}`}><div className="grid gap-4 md:grid-cols-2"><ResourceCard title="Population and household profile" description="Population, age, income, poverty, education, housing, and veteran figures must retain their Census or ACS estimate year." href="https://www.census.gov/quickfacts/"/><ResourceCard title="Data-quality standard" description="Unlabeled estimates are not presented as current facts; missing values remain hidden until a verified source year is attached." href="https://www.census.gov/programs-surveys/acs"/></div></Section>
      <Section id="economy" title={`${label} economy`}><div className="grid gap-4 md:grid-cols-2"><ResourceCard title="Employment and labor force" description="County employment, unemployment, earnings, industry, and establishment data should use the latest published reporting period." href="https://www.bls.gov/eag/"/><ResourceCard title="Regional economic context" description={`${label} is part of the ${county?.region || "Texas"} region. KeepTXRed economic coverage supplies broader state context.`} href="/texas-economy"/></div></Section>
      <Section id="employers" title={`Major employers in ${label}`}><p className="max-w-4xl leading-7 text-muted-foreground">Employer rankings appear only when an official county, city, workforce-board, or economic-development source provides a verifiable list and reporting year. Employment counts are never invented.</p></Section>
      <Section id="schools" title="School districts and education"><div className="grid gap-4 md:grid-cols-2">{schoolDistricts.length ? schoolDistricts.map((district) => <div key={district.name} className="rounded-lg border p-5"><GraduationCap className="size-5 text-primary"/><h3 className="mt-3 font-semibold">{district.name}</h3><p className="mt-2 text-sm text-muted-foreground">{county?.taxYear} tax rate: {district.rate.toFixed(4)} per $100 of taxable value</p></div>) : <p className="text-muted-foreground">No verified school-district tax records are attached to this county profile.</p>}{schools.map((school) => <Link key={school.id} to="/explore/$slug" params={{ slug: school.slug }} className="rounded-lg border p-5 hover:border-primary"><h3 className="font-semibold">{school.name}</h3><p className="mt-2 text-sm text-muted-foreground">{school.summary}</p></Link>)}</div></Section>
      <Section id="property-taxes" title={`${label} property taxes`}>{county ? <div className="overflow-x-auto rounded-lg border"><table className="w-full min-w-[620px] text-left text-sm"><caption className="sr-only">{label} tax rates for {county.taxYear}</caption><thead className="bg-muted/40"><tr><th className="p-4">Taxing layer</th><th className="p-4">Rate per $100</th><th className="p-4">Year</th></tr></thead><tbody>{[["County", county.countyRate], ["Average city component", county.cityAvgRate], ["Average special-district component", county.specialDistrictRate]].map(([name, rate]) => <tr key={String(name)} className="border-t"><td className="p-4">{name}</td><td className="p-4">{Number(rate).toFixed(4)}</td><td className="p-4">{county.taxYear}</td></tr>)}</tbody></table><p className="border-t p-4 text-sm text-muted-foreground">These components do not equal every homeowner’s final rate. City, ISD, hospital, college, MUD, PID, ESD, and other rates vary by address.</p></div> : <p className="text-muted-foreground">Verified county tax data is not currently available.</p>}</Section>
      <Section id="legislative-districts" title={`Legislative districts overlapping ${label}`}><div className="grid gap-4 md:grid-cols-3"><ResourceCard title="Texas House districts" description="Current Texas House districts, members, and profiles." href="/texas-legislature/house"/><ResourceCard title="Texas Senate districts" description="Current Texas Senate districts, members, and profiles." href="/texas-legislature/senate"/><ResourceCard title="U.S. congressional districts" description="Congressional races, candidates, and results connected to Texas counties." href="/elections"/></div></Section>
      <Section id="representatives" title={`Representatives serving ${label}`}><div className="rounded-lg border p-6"><Users className="size-6 text-primary"/><p className="mt-3 leading-7 text-muted-foreground">Officeholders remain in the shared Legislature and Election Central data models so profiles are not duplicated. A county can overlap multiple Texas House, Texas Senate, and U.S. House districts.</p><a href="/texas-legislature" className="mt-4 inline-block font-semibold text-primary hover:underline">Browse current representatives</a></div></Section>
      <Section id="cities" title={`Cities and communities in ${label}`}>{cities.length ? <div className="flex flex-wrap gap-2">{cities.map((city) => <span key={city} className="rounded-full border px-4 py-2 text-sm">{city}</span>)}</div> : <p className="text-muted-foreground">No verified city relationships are attached to current Explore Texas records for this county.</p>}</Section>
      <Section id="parks" title={`Parks and outdoor recreation in ${label}`}>{parks.length ? <EntityGrid items={parks}/> : <p className="text-muted-foreground">No verified park or outdoor-recreation records are currently published for this county.</p>}</Section>
      <Section id="attractions" title={`Attractions and landmarks in ${label}`}>{attractions.length ? <EntityGrid items={attractions}/> : <p className="text-muted-foreground">No verified attraction records are currently published for this county.</p>}</Section>
      <Section id="elections" title={`${label} election history`}><div className="rounded-lg border p-6"><Vote className="size-6 text-primary"/><p className="mt-3 leading-7 text-muted-foreground">Election records retain the election year, office, candidates, turnout, vote totals, and source in the shared Election Central dataset. Future results are never hardcoded.</p><a href="/elections/results" className="mt-4 inline-block font-semibold text-primary hover:underline">View election results</a></div></Section>
      <Section id="news" title={`Related ${label} news`}><div className="rounded-lg border p-6"><Newspaper className="size-6 text-primary"/><p className="mt-3 leading-7 text-muted-foreground">Coverage is matched by county, city, district, representative, and validated geographic metadata. Unpublished stories and articles without working internal slugs are excluded.</p><a href={`/search?q=${encodeURIComponent(label)}`} className="mt-4 inline-block font-semibold text-primary hover:underline">Search KeepTXRed coverage</a></div></Section>
      {faq.length > 0 && <Section id="county-faq" title={`${label} frequently asked questions`}><div className="space-y-4">{faq.map((item) => <details key={item.question} className="rounded-lg border p-5"><summary className="cursor-pointer font-semibold">{item.question}</summary><p className="mt-3 leading-7 text-muted-foreground">{item.answer}</p></details>)}</div></Section>}
      <section className="rounded-lg border bg-muted/20 p-6" aria-labelledby="sources"><h2 id="sources" className="font-display text-2xl">Sources and data notes</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">Property-tax data: {county?.dataSource || "Texas Comptroller dataset"}, tax year {county?.taxYear || TAX_RATE_DATASET.taxYear}; updated {TAX_RATE_DATASET.lastUpdated}. Destination, city, park, and attraction relationships come from verified Explore Texas records. Time-sensitive fields remain source-dated and are hidden when a verified relationship is unavailable.</p></section>
    </div>
  </main>;
}
