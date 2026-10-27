import { createFileRoute } from "@tanstack/react-router";
import { GovernmentHistoryAuthorityPage, governmentHistoryAuthorityHead } from "@/components/government-history-authority-page";
import { getGovernmentHistoryPage } from "@/lib/government-history-route.functions";

export const Route = createFileRoute("/texas-government/county-commissioner-history")({
  loader: () => getGovernmentHistoryPage({ data: { group: "local", slug: "county-commissioner-history" } }),
  head: ({ loaderData }) => loaderData
    ? governmentHistoryAuthorityHead(loaderData)
    : { meta: [{ title: "Guide unavailable — Keep TX Red" }, { name: "robots", content: "noindex,follow" }] },
  component: Page,
});

function Page() {
  const page = Route.useLoaderData();
  return <GovernmentHistoryAuthorityPage page={page} />;
}
