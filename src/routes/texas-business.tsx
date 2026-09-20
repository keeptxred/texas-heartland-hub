import { createFileRoute } from "@tanstack/react-router";
import { TexasBusinessView } from "@/components/texas-business-view";
import { buildSeo } from "@/lib/seo";

const TEXAS_BUSINESS_TITLE = "Texas Business: Economy, Jobs & Growth";
const TEXAS_BUSINESS_DESCRIPTION = "Texas business news on the state economy, jobs, energy, corporate relocations, and the policy decisions shaping growth across Houston, Dallas, Austin, and San Antonio.";

export function texasBusinessHead(topic = "") {
  return buildSeo({
    title: TEXAS_BUSINESS_TITLE,
    description: TEXAS_BUSINESS_DESCRIPTION,
    path: "/texas-business",
    type: "website",
    imageAlt: "Keep TX Red Texas business coverage",
    noindex: Boolean(topic.trim()),
  });
}

export const Route = createFileRoute("/texas-business")({
  validateSearch: (search: Record<string, unknown>): { topic?: string } =>
    typeof search.topic === "string" && search.topic ? { topic: search.topic } : {},
  head: ({ match }) => {
    const topic = (match.search as { topic?: string } | undefined)?.topic ?? "";
    return texasBusinessHead(topic);
  },
  component: BusinessPage,
});

function BusinessPage() {
  const { topic } = Route.useSearch();
  return <TexasBusinessView topic={topic ?? ""} />;
}
