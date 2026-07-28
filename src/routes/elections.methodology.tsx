import { createFileRoute } from "@tanstack/react-router";
import { ElectionLayout, ElectionNavigation } from "@/components/elections";
import { ELECTION_ROUTES } from "@/lib/elections";

export const Route = createFileRoute("/elections/methodology")({
  head: () => ({
    meta: [
      { title: "Election Central Methodology | KeepTXRed" },
      {
        name: "description",
        content:
          "Learn how KeepTXRed sources, verifies, updates, and labels public Texas election information.",
      },
    ],
    links: [{ rel: "canonical", href: "https://keeptxred.com/elections/methodology" }],
  }),
  component: Page,
});
function Page() {
  return (
    <ElectionLayout
      title="Election Central Methodology"
      description="How KeepTXRed attributes, verifies, updates, and labels public election information."
      canonicalUrl="https://keeptxred.com/elections/methodology"
      navigation={<ElectionNavigation currentPath={ELECTION_ROUTES.methodology} />}
    >
      <div className="max-w-3xl space-y-6 text-base leading-7 text-slate-700">
        <section>
          <h2 className="text-2xl font-bold text-slate-950">Source-backed records</h2>
          <p className="mt-2">
            Election Central displays public, read-only records with source attribution and update
            times. Polls, forecasts, and official results remain distinct data products.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-slate-950">Verification and corrections</h2>
          <p className="mt-2">
            Publication, verification, and freshness labels describe editorial review and data age.
            Election-night totals remain unofficial until certified by the responsible authority.
          </p>
        </section>
      </div>
    </ElectionLayout>
  );
}
