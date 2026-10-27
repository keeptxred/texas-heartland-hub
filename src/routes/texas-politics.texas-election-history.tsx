import { createFileRoute } from "@tanstack/react-router";
import {
  PoliticalHistoryAuthorityPage,
  politicalHistoryAuthorityHead,
} from "@/components/political-history-authority-page";
import { getTexasPoliticalHistoryPage } from "@/lib/texas-political-history-route.functions";

export const Route = createFileRoute("/texas-politics/texas-election-history")({
  loader: () => getTexasPoliticalHistoryPage({ data: { slug: "texas-election-history" } }),
  head: ({ loaderData }) => loaderData
    ? politicalHistoryAuthorityHead(loaderData)
    : { meta: [{ name: "robots", content: "noindex,follow" }] },
  component: TexasElectionHistoryPage,
});

function TexasElectionHistoryPage() {
  const page = Route.useLoaderData();
  return <PoliticalHistoryAuthorityPage page={page} />;
}
