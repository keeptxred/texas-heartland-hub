import { createFileRoute } from "@tanstack/react-router";
import CurrentSessionAuthorityReference from "@/components/legislature/CurrentSessionAuthorityReference";
import TexasLegislaturePage from "@/components/legislature/TexasLegislaturePage";
import { legislatureSeo } from "@/lib/legislature-seo";

const title = "Current Texas Legislative Session";
const description = "Track the current Texas legislative session with links to bills, committees, House and Senate coverage, lawmakers, laws, and official legislative records.";

export const Route = createFileRoute("/texas-legislature/current-session")({
  head: () => legislatureSeo({ title, description, path: "/texas-legislature/current-session", breadcrumb: "Current Session" }),
  component: CurrentSessionPage,
});

function CurrentSessionPage() {
  return <><TexasLegislaturePage page="current" /><CurrentSessionAuthorityReference /></>;
}
