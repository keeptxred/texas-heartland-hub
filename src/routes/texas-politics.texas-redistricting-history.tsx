import { createFileRoute } from "@tanstack/react-router";
import {
  PoliticalHistoryAuthorityPage,
  politicalHistoryAuthorityHead,
} from "@/components/political-history-authority-page";
import { TEXAS_REDISTRICTING_HISTORY } from "@/data/texas-political-history-authority";

export const Route = createFileRoute("/texas-politics/texas-redistricting-history")({
  head: () => politicalHistoryAuthorityHead(TEXAS_REDISTRICTING_HISTORY),
  component: TexasRedistrictingHistoryPage,
});

function TexasRedistrictingHistoryPage() {
  return <PoliticalHistoryAuthorityPage page={TEXAS_REDISTRICTING_HISTORY} />;
}
