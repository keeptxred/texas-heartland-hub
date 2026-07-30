import { createFileRoute } from "@tanstack/react-router";
import TexasLegislaturePage from "@/components/legislature/TexasLegislaturePage";
import { legislatureSeo } from "@/lib/legislature-seo";

const title = "Texas Senate";
const description = "Learn about the Texas Senate, its 31 districts, members, committees, elections, confirmations, current session, and legislative role.";

export const Route = createFileRoute("/texas-legislature/senate")({
  head: () => legislatureSeo({ title, description, path: "/texas-legislature/senate", breadcrumb: "Texas Senate" }),
  component: () => <TexasLegislaturePage page="senate" />,
});
