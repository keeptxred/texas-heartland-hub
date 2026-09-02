import { Link } from "@tanstack/react-router";
import { CitationTrustPanel } from "@/components/authority/CitationTrustPanel";
import { ElectionLayout, ElectionNavigation } from "@/components/elections";
import type { VotingAnswerPageData } from "@/data/election-voting-answers";
import { ELECTION_ROUTES } from "@/lib/elections";

export function ElectionVotingAnswerPage({ data, canonicalPath }: { data: VotingAnswerPageData; canonicalPath: string }) {
  return (
    <ElectionLayout
      title={data.title}
      description={data.description}
      canonicalUrl={`https://keeptxred.com${canonicalPath}`}
      navigation={<ElectionNavigation currentPath={ELECTION_ROUTES.voting} />}
    >
      <div className="space-y-8">
        <section className="rounded-xl border-l-4 border-primary bg-primary/5 p-6" aria-labelledby="voting-quick-answer">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-primary">Quick answer</p>
          <h2 id="voting-quick-answer" className="mt-2 font-display text-2xl tracking-tight text-foreground">The practical answer</h2>
          <p className="mt-3 max-w-4xl text-base font-semibold leading-7 text-foreground">{data.quickAnswer}</p>
          <p className="mt-4 text-xs uppercase tracking-[0.16em] text-muted-foreground">Updated {data.updated}</p>
        </section>

        <div className="divide-y divide-border rounded-xl border border-border bg-card px-6 shadow-sm">
          {data.sections.map((section, index) => (
            <section key={section.heading} className="py-7">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-primary">{String(index + 1).padStart(2, "0")}</p>
              <h2 className="mt-2 font-display text-3xl leading-tight text-foreground">{section.heading}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph} className="mt-4 max-w-4xl leading-7 text-muted-foreground">{paragraph}</p>)}
              {section.links?.length ? (
                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm">
                  {section.links.map((link) => link.external ? (
                    <a key={`${link.href}-${link.label}`} href={link.href} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline underline-offset-4">{link.label} ↗</a>
                  ) : (
                    <Link key={`${link.href}-${link.label}`} to={link.href} className="font-semibold text-primary underline underline-offset-4">{link.label}</Link>
                  ))}
                </div>
              ) : null}
            </section>
          ))}
        </div>

        <section className="rounded-xl border border-border bg-card p-6 shadow-sm" aria-labelledby="voting-faq-heading">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Fast answers</p>
          <h2 id="voting-faq-heading" className="mt-2 font-display text-3xl tracking-tight text-foreground">Frequently asked questions</h2>
          <div className="mt-5 divide-y divide-border border-y border-border">
            {data.faq.map((item) => (
              <details key={item.question} className="group py-5">
                <summary className="cursor-pointer list-none pr-8 font-display text-xl marker:hidden">{item.question}<span className="float-right text-primary group-open:rotate-45">+</span></summary>
                <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <CitationTrustPanel
          sources={data.sources}
          methodology="This page summarizes current Texas voting logistics from official Texas Secretary of State and county-election resources. It does not determine an individual's eligibility, ballot, identification outcome or polling assignment; voter-specific details should be confirmed with the official voter portal or local election authority."
          lastVerified="September 1, 2026. Verify voter-specific and local details again near the election because locations, hours and election administration details can change."
          title="Voting logistics sources and methodology"
        />

        <div className="flex flex-wrap gap-4">
          <Link to="/elections/voting" className="font-semibold text-primary underline underline-offset-4">Back to Texas voting dates, ID and ballot research →</Link>
        </div>
      </div>
    </ElectionLayout>
  );
}
