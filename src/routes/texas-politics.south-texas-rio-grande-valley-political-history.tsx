import { createFileRoute } from "@tanstack/react-router";
import { PoliticalHistoryAuthorityPage, politicalHistoryAuthorityHead } from "@/components/political-history-authority-page";
import { SOUTH_TEXAS_RGV_POLITICAL_HISTORY } from "@/data/texas-political-geography-authority";

export const Route = createFileRoute("/texas-politics/south-texas-rio-grande-valley-political-history")({
  head: () => politicalHistoryAuthorityHead(SOUTH_TEXAS_RGV_POLITICAL_HISTORY),
  component: Page,
});

function Page() {
  return <PoliticalHistoryAuthorityPage page={SOUTH_TEXAS_RGV_POLITICAL_HISTORY} />;
}
