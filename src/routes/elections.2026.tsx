import { createFileRoute } from "@tanstack/react-router";
import { ElectionRepositoryProvider } from "@/lib/elections/repositories";
import { ElectionHomePage } from "@/pages/elections";

const ELECTION_CENTRAL_URL = "https://keeptxred.com/elections/2026";
const ELECTION_CENTRAL_TITLE =
  "2026 Texas Election Central | Races, Candidates, Polls & Results";
const ELECTION_CENTRAL_DESCRIPTION =
  "Track verified 2026 Texas election races, candidate profiles, polls, forecasts, results, key dates, and voting information in Keep TX Red Election Central.";

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
