import { Fragment } from "react";
import { Link } from "@tanstack/react-router";
import { ALL_GUIDES } from "@/data/all-guides";
import { LAW_TOPICS, type LawTopic } from "@/lib/law-guides";
import { guidesForTopic } from "@/lib/guide-registry";
import { isSupportingGuideIndexable } from "@/lib/supporting-guide-indexability";

const FEATURED_LAW_TOPICS: LawTopic[] = [
  "driving",
  "landlord-tenant",
  "hoa-property",
  "self-defense-firearms",
  "criminal",
  "family",
  "probate",
  "employment",
  "consumer",
  "business",
  "education",
  "open-government",
  "elections",
  "outdoors",
  "alcohol",
  "animals",
];

const CHILD_SUPPORT_SLUG = "texas-child-support-guidelines-law";

const LAW_AUTHORITY_LINKS = [
  ["Texas Legislature", "/texas-legislature"],
  ["Texas Bill Tracker", "/bills"],
  ["2026 Election Central", "/elections/2026"],
  ["Texas Voting", "/elections/voting"],
  ["Texas Election Laws", "/news/texas-election-laws-explained"],
  ["Texas Gun Laws", "/news/texas-gun-laws-explained"],
  ["Texas Property Tax Laws", "/news/texas-property-tax-laws-explained"],
  ["New Texas Laws for 2026", "/news/texas-new-laws-2026"],
] as const;

function ChildSupportPriorityGuide() {
  const guide = ALL_GUIDES[CHILD_SUPPORT_SLUG];
  if (!isSupportingGuideIndexable(guide)) return null;

  return (
    <section className="border-t-4 border-primary bg-primary/[0.05]" aria-labelledby="texas-child-support-priority-heading">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary">★ Popular Texas law guide</span>
        <div className="mt-3 grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h2 id="texas-child-support-priority-heading" className="font-display text-4xl md:text-5xl tracking-tight">
              Texas Child Support
            </h2>
            <p className="mt-3 max-w-3xl font-serif text-lg text-muted-foreground">
              Understand Texas child-support guidelines, statutory net resources, guideline percentages, multiple households, medical support, deviations and the Family Code provisions behind the calculation.
            </p>
          </div>
          <Link
            to="/guides/$slug"
            params={{ slug: CHILD_SUPPORT_SLUG }}
            className="inline-flex min-h-11 items-center justify-center border-2 border-primary bg-primary px-5 py-3 text-xs font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
          >
            Texas child support guide →
          </Link>
        </div>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <span>Texas Family Code Chapter 154</span>
          <span>Net resources</span>
          <span>Guideline support</span>
          <span>Deviations</span>
          <span>Medical & dental support</span>
        </div>
      </div>
    </section>
  );
}

function LawAuthorityDiscovery() {
  return (
    <nav className="border-y border-border bg-background" aria-label="Texas law authority resources">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">Texas law authority network</p>
        <h2 className="mt-2 font-display text-2xl tracking-tight">Follow the law from statute to ballot</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          These core hubs connect Texas statutes, current legislation, elections, voting rules and the major law guides Keep TX Red maintains. They are deliberately cross-linked so readers and search engines can move through the same source-backed authority graph.
        </p>
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm">
          {LAW_AUTHORITY_LINKS.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="font-semibold text-foreground underline underline-offset-4 hover:text-primary"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

function TopicSection({ topic }: { topic: LawTopic }) {
  const topicInfo = LAW_TOPICS[topic];
  const guides = guidesForTopic(topic)
    .filter((meta) => meta.status === "verified")
    .map((meta) => ({ meta, guide: ALL_GUIDES[meta.slug] }))
    .filter((entry) => isSupportingGuideIndexable(entry.guide));

  if (guides.length === 0) return null;

  return (
    <section className="border-t-4 border-foreground/10 bg-primary/[0.03]" aria-labelledby={`laws-${topic}-heading`}>
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary">★ Laws You Should Know</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            {guides.length} verified {guides.length === 1 ? "guide" : "guides"}
          </span>
        </div>
        <h2 id={`laws-${topic}-heading`} className="font-display text-4xl md:text-5xl tracking-tight mt-2">
          {topicInfo.label}
        </h2>
        <p className="mt-3 max-w-3xl font-serif text-lg text-muted-foreground">{topicInfo.description}</p>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          These guides are checked against current Texas statutes and official agency sources. Each page shows its verification date and primary authorities.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {guides.map(({ meta, guide }) => (
            <Link
              key={meta.slug}
              to="/guides/$slug"
              params={{ slug: meta.slug }}
              className="group border-2 border-foreground/10 bg-card p-5 hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Verified Texas Law Guide</span>
                {meta.lastVerified ? (
                  <time className="text-[10px] text-muted-foreground" dateTime={meta.lastVerified}>
                    {meta.lastVerified}
                  </time>
                ) : null}
              </div>
              <h3 className="mt-2 font-display text-xl tracking-tight leading-snug group-hover:underline underline-offset-4">
                {guide.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground line-clamp-3">{guide.dek}</p>
              <span className="mt-4 inline-block text-[10px] font-bold uppercase tracking-widest text-primary">Read guide →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LawGuideTopicGrid({ topic }: { topic: LawTopic }) {
  const topics = topic === "driving" ? FEATURED_LAW_TOPICS : [topic];
  return (
    <>
      {topic === "driving" ? <LawAuthorityDiscovery /> : null}
      {topic === "driving" ? <ChildSupportPriorityGuide /> : null}
      {topics.map((item) => (
        <Fragment key={item}>
          <TopicSection topic={item} />
        </Fragment>
      ))}
    </>
  );
}
