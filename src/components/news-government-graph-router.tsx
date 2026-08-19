import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  getGovernmentGraphLinksForText,
  type PublicGovernmentGraphLink,
} from "@/lib/government-graph.functions";

type NewsLoaderData = {
  article?: { title?: string; dek?: string };
  body?: {
    intro?: string[];
    sections?: Array<{ heading?: string; paragraphs?: string[]; bullets?: string[] }>;
    keyTakeaways?: string[];
  };
};

function loaderText(data: NewsLoaderData | undefined): string {
  if (!data) return "";
  return [
    data.article?.title,
    data.article?.dek,
    ...(data.body?.intro ?? []),
    ...(data.body?.sections ?? []).flatMap((section) => [
      section.heading,
      ...(section.paragraphs ?? []),
      ...(section.bullets ?? []),
    ]),
    ...(data.body?.keyTakeaways ?? []),
  ]
    .filter((value): value is string => typeof value === "string" && value.trim().length > 0)
    .join(" ");
}

export function NewsGovernmentGraphRouter() {
  const loaderData = useRouterState({
    select: (state) =>
      state.matches.find((match) => match.routeId === "/news/$slug")?.loaderData as
        | NewsLoaderData
        | undefined,
  });
  const text = useMemo(() => loaderText(loaderData), [loaderData]);
  const [links, setLinks] = useState<PublicGovernmentGraphLink[]>([]);

  useEffect(() => {
    let cancelled = false;
    if (!text) {
      setLinks([]);
      return () => {
        cancelled = true;
      };
    }

    void getGovernmentGraphLinksForText({ data: { text, limit: 6 } })
      .then((nextLinks) => {
        if (!cancelled) setLinks(nextLinks);
      })
      .catch(() => {
        if (!cancelled) setLinks([]);
      });

    return () => {
      cancelled = true;
    };
  }, [text]);

  if (!text || links.length === 0) return null;

  return (
    <aside
      className="mx-auto mt-12 max-w-6xl px-4"
      aria-labelledby="news-government-graph-heading"
    >
      <div className="rounded-xl border bg-muted/30 p-5 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
          Keep TX Red reference network
        </p>
        <h2 id="news-government-graph-heading" className="mt-2 font-display text-2xl tracking-tight">
          Related Texas government, law and policy
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          Continue from this story into KTR&apos;s permanent government, legislative, legal, policy and data reference pages.
        </p>
        <nav className="mt-5 flex flex-wrap gap-2" aria-label="Related permanent Keep TX Red references">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="rounded-full border bg-background px-3 py-2 text-sm font-semibold hover:border-primary hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}

export default NewsGovernmentGraphRouter;
