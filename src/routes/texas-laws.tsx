import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
import { TEXAS_LAWS } from "@/data/representatives";
import { AgedFeedSection } from "@/components/aged-feed-section";

export const Route = createFileRoute("/texas-laws")({
  head: () => ({
    meta: [
      { title: "Texas Laws Explained — Keep TX Red" },
      { name: "description", content: "Plain-English explanations of major Texas laws — Constitutional Carry, election integrity, property tax relief, parental rights, and more." },
      { property: "og:title", content: "Texas Laws Explained" },
    ],
    links: [{ rel: "canonical", href: "/texas-laws" }],
  }),
  component: TexasLawsPage,
});

function TexasLawsPage() {
  return (
    <>
      <PageHero eyebrow="Plain English" title="TEXAS LAWS" highlight="EXPLAINED" description="The Lone Star State's most consequential statutes — what they do, who they protect, and where they stand." />
      <div className="mx-auto max-w-4xl px-4 py-14 space-y-6">
        {TEXAS_LAWS.map((law, i) => (
          <article key={law.title} className="border-l-4 border-primary pl-5 py-2">
            <p className="font-display text-xs text-primary">★ {String(i + 1).padStart(2, "0")}</p>
            <h2 className="font-display text-2xl md:text-3xl tracking-tight mt-1">{law.title}</h2>
            <p className="mt-2 text-muted-foreground leading-relaxed">{law.summary}</p>
          </article>
        ))}
      </div>
      <AgedFeedSection
        section="laws"
        title="Latest Rule & Statute Updates"
        blurb="Rule changes, Texas Register filings, and Attorney General actions from the Happening Now feed, filed here once they're more than 24 hours old."
      />
    </>
  );
}