import { createFileRoute } from "@tanstack/react-router";
import { ElectionLayout, ElectionNavigation } from "@/components/elections";
import { ELECTION_ROUTES } from "@/lib/elections";

export const Route = createFileRoute("/elections/voting")({
  head: () => ({
    meta: [
      { title: "Texas Voting Information | KeepTXRed Election Central" },
      {
        name: "description",
        content:
          "Find public Texas voter registration and voting-location resources from KeepTXRed Election Central.",
      },
    ],
    links: [{ rel: "canonical", href: "https://keeptxred.com/elections/voting" }],
  }),
  component: Page,
});
function Page() {
  return (
    <ElectionLayout
      title="Texas Voting Information"
      description="Public resources for registration, voting dates, locations, and ballot preparation."
      canonicalUrl="https://keeptxred.com/elections/voting"
      navigation={<ElectionNavigation currentPath={ELECTION_ROUTES.voting} />}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <a
          className="rounded-xl border border-slate-200 bg-white p-6 font-semibold text-red-700 shadow-sm hover:underline"
          href="/register-to-vote"
        >
          Texas voter registration guide
        </a>
        <a
          className="rounded-xl border border-slate-200 bg-white p-6 font-semibold text-red-700 shadow-sm hover:underline"
          href="/voting-locations"
        >
          Public voting-location resources
        </a>
      </div>
    </ElectionLayout>
  );
}
