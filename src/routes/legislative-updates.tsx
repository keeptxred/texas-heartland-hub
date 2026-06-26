import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
import { ACTIVE_BILLS } from "@/data/representatives";

export const Route = createFileRoute("/legislative-updates")({
  head: () => ({
    meta: [
      { title: "Texas Legislative Updates — Keep TX Red" },
      { name: "description", content: "Live tracking of bills moving through the Texas Legislature — property tax, border, education, energy, and election integrity." },
      { property: "og:title", content: "Texas Legislative Updates" },
    ],
    links: [{ rel: "canonical", href: "/legislative-updates" }],
  }),
  component: LegislativeUpdatesPage,
});

const STATUS_COLOR: Record<string, string> = {
  "Signed": "bg-accent text-accent-foreground",
  "Engrossed": "bg-primary text-primary-foreground",
  "Passed Senate": "bg-primary text-primary-foreground",
  "In Conference": "bg-secondary text-secondary-foreground",
  "In Committee": "bg-muted text-foreground",
};

function LegislativeUpdatesPage() {
  return (
    <>
      <PageHero eyebrow="Capitol Watch" title="LEGISLATIVE" highlight="UPDATES" description="What's moving in Austin this week — committee votes, floor action, and the bills the Republican caucus is pushing across the finish line." />
      <div className="mx-auto max-w-5xl px-4 py-14">
        <div className="border-2 border-foreground/10 bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-secondary-foreground text-xs uppercase tracking-widest">
              <tr>
                <th className="text-left p-4">Bill</th>
                <th className="text-left p-4 hidden md:table-cell">Topic</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4 hidden lg:table-cell">Summary</th>
              </tr>
            </thead>
            <tbody>
              {ACTIVE_BILLS.map((b) => (
                <tr key={b.bill} className="border-t border-foreground/10">
                  <td className="p-4 font-display text-xl">{b.bill}<div className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans">{b.chamber}</div></td>
                  <td className="p-4 hidden md:table-cell">{b.topic}</td>
                  <td className="p-4"><span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 ${STATUS_COLOR[b.status] || "bg-muted"}`}>{b.status}</span></td>
                  <td className="p-4 hidden lg:table-cell text-muted-foreground">{b.summary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6 text-xs text-muted-foreground italic">Bill statuses updated weekly. For real-time tracking, see the official <a className="text-primary underline" href="https://capitol.texas.gov/" target="_blank" rel="noopener noreferrer">Texas Legislature Online</a>.</p>
      </div>
    </>
  );
}