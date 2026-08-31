import { createFileRoute } from "@tanstack/react-router";
import { PoliticalHistoryAuthorityPage, politicalHistoryAuthorityHead } from "@/components/political-history-authority-page";
import { TEXAS_WOMEN_POLITICAL_HISTORY } from "@/data/texas-party-representation-authority";

export const Route = createFileRoute("/texas-politics/texas-women-suffrage-political-representation-history")({
  head: () => politicalHistoryAuthorityHead(TEXAS_WOMEN_POLITICAL_HISTORY),
  component: Page,
});

function Page() { return <PoliticalHistoryAuthorityPage page={TEXAS_WOMEN_POLITICAL_HISTORY} />; }
