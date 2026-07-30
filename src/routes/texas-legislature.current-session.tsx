import { createFileRoute } from "@tanstack/react-router";
import TexasLegislaturePage from "@/components/legislature/TexasLegislaturePage";
import { legislatureSeo } from "@/lib/legislature-seo";

const title = "Current Texas Legislative Session";
const description = "Track the current Texas legislative session with links to House and Senate coverage, lawmakers, legislative updates, laws, and election context.";

export const Route = createFileRoute("/texas-legislature/current-session")({
  head: () => legislatureSeo({ title, description, path: "/texas-legislature/current-session", breadcrumb: "Current Session" }),
  component: () => <TexasLegislaturePage page="current" />,
});
