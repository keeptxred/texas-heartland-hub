import { createFileRoute } from "@tanstack/react-router";
import { PoliticalHistoryAuthorityPage, politicalHistoryAuthorityHead } from "@/components/political-history-authority-page";
import { getPoliticsHistoricalAuthorityPage } from "@/lib/politics-history-route.functions";

export const Route = createFileRoute("/texas-politics/texas-civil-rights-era-politics")({
  loader: () => getPoliticsHistoricalAuthorityPage({ data: { group: "eras", slug: "texas-civil-rights-era-politics" } }),
  head: ({ loaderData }) => loaderData
    ? politicalHistoryAuthorityHead(loaderData)
    : { meta: [{ title: "Page unavailable — Keep TX Red" }, { name: "robots", content: "noindex,follow" }] },
  component: Page,
});

function Page() {
  const page = Route.useLoaderData();
  return <PoliticalHistoryAuthorityPage page={page} />;
}
