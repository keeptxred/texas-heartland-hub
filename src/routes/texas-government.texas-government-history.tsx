import { createFileRoute } from "@tanstack/react-router";
import { GovernmentHistoryAuthorityPage, governmentHistoryAuthorityHead } from "@/components/government-history-authority-page";
import { TEXAS_GOVERNMENT_HISTORY } from "@/data/texas-government-history-authority";

export const Route = createFileRoute("/texas-government/texas-government-history")({
  head: () => governmentHistoryAuthorityHead(TEXAS_GOVERNMENT_HISTORY),
  component: TexasGovernmentHistoryPage,
});

function TexasGovernmentHistoryPage() {
  return <GovernmentHistoryAuthorityPage page={TEXAS_GOVERNMENT_HISTORY} />;
}
