import { createFileRoute } from "@tanstack/react-router";
import { PoliticalHistoryAuthorityPage, politicalHistoryAuthorityHead } from "@/components/political-history-authority-page";
import { getRepublicHistoryPage } from "@/lib/republic-history-route.functions";

export const Route = createFileRoute("/texas-politics/constitution-of-1836-republic-of-texas")({
  loader: () => getRepublicHistoryPage({ data: { slug: "constitution-of-1836-republic-of-texas" } }),
  head: ({ loaderData }) => loaderData
    ? politicalHistoryAuthorityHead(loaderData)
    : { meta: [{ title: "Page unavailable — Keep TX Red" }, { name: "robots", content: "noindex,follow" }] },
  component: Page,
});

function Page() {
  const page = Route.useLoaderData();
  return <PoliticalHistoryAuthorityPage page={page} />;
}
