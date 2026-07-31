import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { PillarArticle, buildPillarHead } from "@/components/pillar-article";
import { TEXAS_PILLARS } from "@/data/texas-pillars";
import { TEXAS_ISSUE_AUTHORITY, TEXAS_ISSUE_AUTHORITY_UPDATED } from "@/data/texas-issue-authority";

export const Route = createFileRoute("/texas/$slug")({
  loader: ({ params }) => {
    if (params.slug === "no-state-income-tax-2026") {
      throw redirect({
        to: "/news/$slug",
        params: { slug: "why-texas-has-no-income-tax" },
        statusCode: 301,
      });
    }
    const pillar = TEXAS_PILLARS[params.slug];
    if (!pillar) throw notFound();

    const authority = TEXAS_ISSUE_AUTHORITY[params.slug];
    return authority
      ? {
          ...pillar,
          ...authority,
          updatedISO: TEXAS_ISSUE_AUTHORITY_UPDATED,
        }
      : pillar;
  },
  head: ({ loaderData }) => (loaderData ? buildPillarHead(loaderData) : {}),
  component: PillarRoute,
});

function PillarRoute() {
  const pillar = Route.useLoaderData();
  return <PillarArticle {...pillar} />;
}
