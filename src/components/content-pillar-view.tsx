import { AgedFeedSection } from "@/components/aged-feed-section";
import { HubView, type HubSection } from "@/components/hub-view";
import { HUBS } from "@/data/hubs";
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

  return (
    <>
      <HubView hub={hub} sections={sections}>
        <section className="mt-10 max-w-3xl">
          <h2 className="font-display text-2xl tracking-tight mb-3">{heading}</h2>
          <div className="space-y-4 font-serif text-base text-foreground/90 leading-relaxed">
            {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          {related.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
              {related.map((item) => (
                <a key={item.href} href={item.href} className="text-primary hover:underline underline-offset-4">
                  {item.label} →
                </a>
              ))}
            </div>
          ) : null}
        </section>
      </HubView>
      <AgedFeedSection section={feedSection} title="Latest in this pillar" />
    </>
  );
}
