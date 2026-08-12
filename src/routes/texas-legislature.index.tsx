import { createFileRoute } from "@tanstack/react-router";
import TexasLegislaturePage from "@/components/legislature/TexasLegislaturePage";
import { LegislatureHubTrustPanel } from "@/components/legislature/LegislatureHubTrustPanel";
import { legislatureSeo } from "@/lib/legislature-seo";

const title = "Texas Legislature";
const description = "Explore the Texas Legislature, House, Senate, current legislative session, past sessions, lawmakers, elections, laws, and policy coverage.";

export const Route = createFileRoute("/texas-legislature/")({
  head: () => legislatureSeo({ title, description, path: "/texas-legislature", breadcrumb: title }),
  component: LegislatureHubRoute,
});

function LegislatureHubRoute() {
  return <>
    <TexasLegislaturePage page="hub" />
    <LegislatureHubTrustPanel />
  </>;
}
