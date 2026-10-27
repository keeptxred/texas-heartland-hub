import { createFileRoute } from "@tanstack/react-router";
import {
  PoliticalHistoryAuthorityPage,
  politicalHistoryAuthorityHead,
} from "@/components/political-history-authority-page";
import { getTexasPoliticalHistoryPage } from "@/lib/texas-political-history-route.functions";

export const Route = createFileRoute("/texas-politics/voting-rights-history")({
  loader: () => getTexasPoliticalHistoryPage({ data: { slug: "voting-rights-history" } }),
  head: ({ loaderData }) => loaderData
    ? politicalHistoryAuthorityHead(loaderData)
    : { meta: [{ name: "robots", content: "noindex,follow" }] },
  component: TexasVotingRightsHistoryPage,
});

function TexasVotingRightsHistoryPage() {
  const page = Route.useLoaderData();
  return <PoliticalHistoryAuthorityPage page={page} />;
}
