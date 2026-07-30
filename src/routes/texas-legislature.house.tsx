import { createFileRoute } from "@tanstack/react-router";
import TexasLegislaturePage from "@/components/legislature/TexasLegislaturePage";
import { legislatureSeo } from "@/lib/legislature-seo";

const title = "Texas House of Representatives";
const description = "Learn about the Texas House of Representatives, its 150 districts, members, committees, elections, current session, and legislative role.";

export const Route = createFileRoute("/texas-legislature/house")({
  head: () => legislatureSeo({ title, description, path: "/texas-legislature/house", breadcrumb: "Texas House" }),
  component: () => <TexasLegislaturePage page="house" />,
});
