import { createFileRoute } from "@tanstack/react-router";
import {
  PoliticalHistoryAuthorityPage,
  politicalHistoryAuthorityHead,
} from "@/components/political-history-authority-page";
import { getTexasPoliticalHistoryPage } from "@/lib/texas-political-history-route.functions";

export const Route = createFileRoute("/texas-politics/texas-redistricting-history")({
  loader: () => getTexasPoliticalHistoryPage({ data: { slug: "texas-redistricting-history" } }),
  head: ({ loaderData }) => loaderData
    ? politicalHistoryAuthorityHead(loaderData)
    : { meta: [{ name: "robots", content: "noindex,follow" }] },
  component: TexasRedistrictingHistoryPage,
});

function TexasRedistrictingHistoryPage() {
  const page = Route.useLoaderData();
  return <PoliticalHistoryAuthorityPage page={page} />;
}
