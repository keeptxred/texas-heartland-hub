import { createFileRoute } from "@tanstack/react-router";
import { PoliticalHistoryAuthorityPage, politicalHistoryAuthorityHead } from "@/components/political-history-authority-page";
import { getPoliticsHistoricalAuthorityPage } from "@/lib/politics-history-route.functions";

export const Route = createFileRoute("/texas-politics/constitution-of-1869-texas")({
  loader: () => getPoliticsHistoricalAuthorityPage({ data: { group: "civil-war", slug: "constitution-of-1869-texas" } }),
  head: ({ loaderData }) => loaderData
    ? politicalHistoryAuthorityHead(loaderData)
    : { meta: [{ title: "Page unavailable — Keep TX Red" }, { name: "robots", content: "noindex,follow" }] },
  component: Page,
});

function Page() {
  const page = Route.useLoaderData();
  return <PoliticalHistoryAuthorityPage page={page} />;
}
