import { createFileRoute } from "@tanstack/react-router";
import { ElectionRepositoryProvider } from "@/lib/elections/repositories";
import { ElectionCandidateListPage } from "@/pages/elections";

export const Route = createFileRoute("/elections/candidates")({
  head: () => ({
    meta: [
      {
        title: "Texas Election Candidates | KeepTXRed Election Central",
      },
      {
        name: "description",
        content:
          "Browse verified candidate information for published Texas election races, including party, filing, incumbency, and race details.",
      },
      {
        property: "og:title",
        content: "Texas Election Candidates | KeepTXRed Election Central",
      },
      {
        property: "og:description",
        content:
          "Review published candidate profiles for Texas statewide, congressional, legislative, county, and local races.",
      },
      { property: "og:url", content: "/elections/candidates" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://keeptxred.com/elections/candidates",
      },
    ],
  }),
  component: ElectionCandidatesRoute,
});

function ElectionCandidatesRoute() {
  return (
    <ElectionRepositoryProvider>
      <ElectionCandidateListPage />
    </ElectionRepositoryProvider>
  );
}
