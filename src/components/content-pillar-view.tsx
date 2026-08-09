import { AgedFeedSection } from "@/components/aged-feed-section";
import { HubView, type HubSection } from "@/components/hub-view";
import { HUBS } from "@/data/hubs";
import {
  getContentPillarByHref,
  getRelatedContentPillars,
} from "@/lib/content-pillars";
import type { FeedSection } from "@/lib/feed-routing";

type Props = {
  hubSlug: string;
  sections: HubSection[];
  feedSection: FeedSection;
  heading: string;
  paragraphs: string[];
  related?: { label: string; href: string }[];
};

export function ContentPillarView({ hubSlug, sections, feedSection, heading, paragraphs, related = [] }: Props) {
  const hub = HUBS.find((item) => item.slug === hubSlug);
  if (!hub) return null;

  const pillar = getContentPillarByHref(`/${hubSlug}`);
  const canonicalRelated = pillar
    ? getRelatedContentPillars(pillar.slug).map((item) => ({ label: item.title, href: item.href }))
    : [];
  const relatedLinks = [...canonicalRelated, ...related].filter(
    (item, index, items) => items.findIndex((candidate) => candidate.href === item.href) === index,
  );

  return (
    <>
      <HubView hub={hub} sections={sections}>
        <section className="mt-10 max-w-3xl">
          <h2 className="font-display text-2xl tracking-tight mb-3">{heading}</h2>
          <div className="space-y-4 font-serif text-base text-foreground/90 leading-relaxed">
            {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>

          {pillar?.subtopics.length ? (
            <div className="mt-6">
              <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Coverage in this pillar</h3>
              <ul className="mt-3 flex flex-wrap gap-2" aria-label={`${pillar.title} subtopics`}>
                {pillar.subtopics.map((subtopic) => (
                  <li key={subtopic} className="border border-border bg-muted/30 px-3 py-1.5 text-xs font-semibold text-foreground">
                    {subtopic}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {relatedLinks.length > 0 ? (
            <nav className="mt-7" aria-label="Related Texas coverage pillars">
              <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Related coverage</h3>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
                {relatedLinks.map((item) => (
                  <a key={item.href} href={item.href} className="text-primary hover:underline underline-offset-4">
                    {item.label} →
                  </a>
                ))}
              </div>
            </nav>
          ) : null}
        </section>
      </HubView>
      <AgedFeedSection section={feedSection} title="Latest in this pillar" />
    </>
  );
}
