import { Link } from "@tanstack/react-router";
import { issueGuideBySlug } from "@/data/issue-guides";
import type { ArticleIssueMatch } from "@/lib/article-issue-guides";

export function ArticleIssueContext({ matches }: { matches: ArticleIssueMatch[] }) {
  const guides = matches
    .map((match) => ({ match, guide: issueGuideBySlug[match.slug] }))
    .filter((item) => Boolean(item.guide));

  if (guides.length === 0) return null;

  return (
    <aside className="not-prose my-10 border-y border-border bg-muted/30 px-5 py-6" aria-labelledby="policy-context-heading">
      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">Policy context</p>
      <h2 id="policy-context-heading" className="mt-1 font-display text-2xl tracking-tight text-foreground">Understand the issue behind this story</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
        These evergreen KTR guides explain the law, agencies, primary sources and policy framework connected to this coverage.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {guides.map(({ guide }) => guide ? (
          <Link
            key={guide.slug}
            to="/issues/$slug"
            params={{ slug: guide.slug }}
            className="block border border-border bg-background px-4 py-4 transition hover:border-primary"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{guide.category}</span>
            <span className="mt-1 block font-semibold leading-snug text-foreground">{guide.title}</span>
            <span className="mt-2 block text-xs leading-5 text-muted-foreground">{guide.dek}</span>
          </Link>
        ) : null)}
      </div>
    </aside>
  );
}
