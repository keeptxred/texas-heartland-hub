import { Link, createFileRoute } from "@tanstack/react-router";
import {
  TexasBusinessCourtAuthorityPage,
  texasBusinessCourtAuthorityHead,
} from "@/components/texas-business-court-authority-page";

function TexasBusinessCourtRoute() {
  return (
    <>
      <TexasBusinessCourtAuthorityPage />
      <aside className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8" aria-label="Related appellate guide">
        <div className="rounded-xl border bg-card p-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Next in the judiciary guide</p>
          <Link to="/texas-government/fifteenth-court-of-appeals" className="mt-2 inline-block text-lg font-bold hover:text-primary hover:underline">
            Texas Fifteenth Court of Appeals: jurisdiction, justices, history and statewide elections →
          </Link>
        </div>
      </aside>
    </>
  );
}

export const Route = createFileRoute("/texas-government/texas-business-court")({
  head: texasBusinessCourtAuthorityHead,
  component: TexasBusinessCourtRoute,
});
