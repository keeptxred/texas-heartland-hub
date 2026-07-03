import { createFileRoute, Link } from "@tanstack/react-router";
import { buildSeo } from "@/lib/seo";
import heroFlag from "@/assets/hero-flag.jpg";
import noIncomeTax from "@/assets/texas/no-income-tax.jpg";
import propertyTaxes from "@/assets/texas/property-taxes.jpg";
import movingToTexas from "@/assets/texas/moving-to-texas.jpg";

const PILLARS = [
  {
    slug: "no-state-income-tax-2026",
    title: "Why Texas Has No State Income Tax in 2026 (And What They Don't Tell You)",
    dek: "Texas keeps more of your paycheck — but the system behind it is more complex than most people realize.",
    image: noIncomeTax,
  },
  {
    slug: "property-taxes-2026",
    title: "Texas Property Taxes in 2026: Why They Keep Rising (and What Homeowners Miss)",
    dek: "How Texas funds its schools, cities, and services — and why homeowners see higher bills every year.",
    image: propertyTaxes,
  },
  {
    slug: "moving-to-texas-2026",
    title: "Moving to Texas in 2026: The Honest Pros, Cons, and Hidden Costs No One Talks About",
    dek: "Jobs, housing, weather, and lifestyle — a realistic breakdown of what actually changes when you move to Texas.",
    image: movingToTexas,
  },
];

export const Route = createFileRoute("/texas/")({
  head: () => {
    const seo = buildSeo({
      title: "Texas Pillar Hub | Taxes, Property, and Moving to Texas",
      description:
        "Texas-focused evergreen guides on the state income tax structure, property taxes, and what to know before moving to Texas.",
      path: "/texas",
      image: heroFlag,
      imageAlt: "Texas flag over the state capitol",
      type: "website",
      keywords: "Texas guides, Texas taxes, Texas property taxes, moving to Texas",
    });
    return { meta: seo.meta, links: seo.links };
  },
  component: TexasHub,
});

function TexasHub() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary">★ Texas Pillar Hub</span>
      <h1 className="font-display text-5xl md:text-7xl tracking-tight mt-2 leading-none">
        Texas, Explained.
      </h1>
      <p className="mt-4 max-w-3xl font-serif text-lg text-muted-foreground">
        Grounded, factual, Texas-first guides to the systems that actually shape life in the state — taxes, property, and
        the real cost of moving here.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mt-10">
        {PILLARS.map((p) => (
          <Link
            key={p.slug}
            to="/texas/$slug"
            params={{ slug: p.slug }}
            className="group block border-2 border-foreground/10 bg-card hover:border-primary transition-colors"
          >
            <div className="aspect-[16/10] overflow-hidden bg-muted">
              <img
                src={p.image}
                alt={p.title}
                loading="lazy"
                width={1024}
                height={640}
                className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-5">
              <h2 className="font-display text-xl tracking-tight leading-snug group-hover:text-primary">
                {p.title}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{p.dek}</p>
              <span className="mt-3 inline-block text-[10px] font-bold uppercase tracking-widest text-primary">
                Read the guide →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}