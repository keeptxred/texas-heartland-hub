import { createFileRoute } from "@tanstack/react-router";
import { GovernmentHistoryAuthorityPage, governmentHistoryAuthorityHead } from "@/components/government-history-authority-page";
import { getGovernmentHistoryPage } from "@/lib/government-history-route.functions";

export const Route = createFileRoute("/texas-government/speaker-of-the-house-history")({
  loader: () => getGovernmentHistoryPage({ data: { group: "state", slug: "speaker-of-the-house-history" } }),
  head: ({ loaderData }) => loaderData
    ? governmentHistoryAuthorityHead(loaderData)
    : { meta: [{ title: "Guide unavailable — Keep TX Red" }, { name: "robots", content: "noindex,follow" }] },
  component: Page,
});

function Page() {
  const page = Route.useLoaderData();
  return <GovernmentHistoryAuthorityPage page={page} />;
}
