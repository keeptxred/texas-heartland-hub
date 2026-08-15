import { Fragment } from "react";
import { Link } from "@tanstack/react-router";
import { ALL_GUIDES } from "@/data/all-guides";
import { LAW_TOPICS, type LawTopic } from "@/lib/law-guides";
import { guidesForTopic } from "@/lib/guide-registry";

const FEATURED_LAW_TOPICS: LawTopic[] = [
  "driving",
  "landlord-tenant",
  "hoa-property",
  "self-defense-firearms",
  "criminal",
  "family",
  "employment",
  "consumer",
  "business",
  "education",
  "open-government",
];

function TopicSection({ topic }: { topic: LawTopic }) {
  const topicInfo = LAW_TOPICS[topic];
  const guides = guidesForTopic(topic)
    .filter((meta) => meta.status === "verified")
    .map((meta) => ({ meta, guide: ALL_GUIDES[meta.slug] }))
    .filter((entry) => Boolean(entry.guide));

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
      {topics.map((item) => (
        <Fragment key={item}>
          <TopicSection topic={item} />
        </Fragment>
      ))}
    </>
  );
}
