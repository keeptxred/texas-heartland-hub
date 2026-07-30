import { createFileRoute } from "@tanstack/react-router";
import { ElectionRepositoryProvider } from "@/lib/elections/repositories";
import { ElectionHomePage } from "@/pages/elections";

const ELECTION_CENTRAL_URL = "https://keeptxred.com/elections/2026";
const ELECTION_CENTRAL_TITLE =
  "2026 Texas Election Central | Races, Candidates, Polls & Results";
const ELECTION_CENTRAL_DESCRIPTION =
  "Track verified 2026 Texas election races, candidate profiles, polls, forecasts, results, key dates, and voting information in Keep TX Red Election Central.";

const electionCentralSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${ELECTION_CENTRAL_URL}#webpage`,
  url: ELECTION_CENTRAL_URL,
  name: ELECTION_CENTRAL_TITLE,
  description: ELECTION_CENTRAL_DESCRIPTION,
  inLanguage: "en-US",
  isPartOf: {
    "@type": "WebSite",
    "@id": "https://keeptxred.com/#website",
    url: "https://keeptxred.com",
    name: "Keep TX Red",
  },
  about: [
    { "@type": "Thing", name: "2026 Texas elections" },
    { "@type": "Thing", name: "Voting in Texas" },
  ],
  mainEntity: {
    "@type": "ItemList",
    name: "2026 Texas Election Central resources",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Texas election races",
        url: "https://keeptxred.com/elections/races",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Texas election candidates",
        url: "https://keeptxred.com/elections/candidates",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Texas election polls",
        url: "https://keeptxred.com/elections/polls",
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Texas election forecasts",
        url: "https://keeptxred.com/elections/forecast",
      },
      {
        "@type": "ListItem",
        position: 5,
        name: "Texas election results",
        url: "https://keeptxred.com/elections/results",
      },
      {
        "@type": "ListItem",
        position: 6,
        name: "Texas voting information",
        url: "https://keeptxred.com/elections/voting",
      },
      {
        "@type": "ListItem",
        position: 7,
        name: "Texas statewide elections",
        url: "https://keeptxred.com/elections/statewide",
      },
      {
        "@type": "ListItem",
        position: 8,
        name: "Texas legislative elections",
        url: "https://keeptxred.com/elections/legislative",
      },
      {
        "@type": "ListItem",
        position: 9,
        name: "Texas election districts",
        url: "https://keeptxred.com/elections/districts",
      },
    ],
  },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Keep TX Red",
        item: "https://keeptxred.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "2026 Texas Election Central",
        item: ELECTION_CENTRAL_URL,
      },
    ],
  },
};

export const Route = createFileRoute("/elections/2026")({
  head: () => ({
    meta: [
      { title: ELECTION_CENTRAL_TITLE },
      { name: "description", content: ELECTION_CENTRAL_DESCRIPTION },
      {
        name: "keywords",
        content:
          "2026 Texas elections, Texas election candidates, Texas election polls, Texas election results, Texas races, Texas voting",
      },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: ELECTION_CENTRAL_TITLE },
      { property: "og:description", content: ELECTION_CENTRAL_DESCRIPTION },
      { property: "og:url", content: ELECTION_CENTRAL_URL },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Keep TX Red" },
      { property: "og:locale", content: "en_US" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: ELECTION_CENTRAL_TITLE },
      { name: "twitter:description", content: ELECTION_CENTRAL_DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: ELECTION_CENTRAL_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(electionCentralSchema),
      },
    ],
  }),
  component: ElectionCentral2026Route,
});

function ElectionCentral2026Route() {
  return (
    <ElectionRepositoryProvider>
      <ElectionHomePage />
    </ElectionRepositoryProvider>
  );
}
