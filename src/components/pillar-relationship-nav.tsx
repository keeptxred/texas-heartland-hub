import {
  getContentPillar,
  getRelatedContentPillars,
  type ContentPillarSlug,
} from "@/lib/content-pillars";

export function PillarRelationshipNav({ pillarSlug }: { pillarSlug: ContentPillarSlug }) {
  const pillar = getContentPillar(pillarSlug);
  const related = getRelatedContentPillars(pillarSlug);

  return (
    <section className="mt-10 max-w-4xl border-t border-border pt-6" aria-labelledby={`${pillarSlug}-coverage-map`}>
      <h2 id={`${pillarSlug}-coverage-map`} className="font-display text-xl tracking-tight">Explore this Texas topic</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{pillar.description}</p>

      <div className="mt-4">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Covered here</h3>
        <ul className="mt-2 flex flex-wrap gap-2">
          {pillar.subtopics.map((subtopic) => (
            <li key={subtopic} className="border border-border bg-muted/30 px-3 py-1.5 text-xs font-semibold">
              {subtopic}
            </li>
          ))}
        </ul>
      </div>

      <nav className="mt-5" aria-label={`Related coverage for ${pillar.title}`}>
        <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Related coverage</h3>
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
          {related.map((item) => (
            <a key={item.slug} href={item.href} className="text-primary hover:underline underline-offset-4">
              {item.title} →
            </a>
          ))}
        </div>
      </nav>
    </section>
  );
}
