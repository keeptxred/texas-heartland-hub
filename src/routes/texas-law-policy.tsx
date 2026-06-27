import { createFileRoute } from "@tanstack/react-router";
import { HUBS } from "@/data/hubs";
import { HubView } from "@/components/hub-view";

const HUB = HUBS.find((h) => h.slug === "texas-policy-law")!;
const SECTIONS = [
  { title: "Border Policy", description: "Operation Lone Star, border security, and federal-state conflict.", href: "/news/texas-border-policy-full-guide" },
  { title: "Education Policy", description: "School choice, ESAs, parental rights, and ISD governance.", href: "/news/school-choice-esa-guide" },
  { title: "Public Safety", description: "DPS, criminal justice, constitutional carry, and policing.", href: "/news/constitutional-carry-one-year-later" },
  { title: "Legal Updates", description: "AG opinions, Texas Supreme Court rulings, and new statutes.", href: "/texas-laws" },
];

export const Route = createFileRoute("/texas-law-policy")({
  head: () => ({
    meta: [
      { title: "Texas Law & Policy — Border, Education, Public Safety, Legal" },
      { name: "description", content: "Texas laws, regulations, public safety, and policy changes — explained for the people who live under them." },
      { property: "og:title", content: "Texas Law & Policy — Keep TX Red" },
      { property: "og:description", content: "Texas laws, regulations, public safety, and policy changes." },
      { property: "og:url", content: "/texas-law-policy" },
    ],
    links: [{ rel: "canonical", href: "/texas-law-policy" }],
  }),
  component: () => <HubView hub={HUB} sections={SECTIONS} />,
});