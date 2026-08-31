import { createFileRoute } from "@tanstack/react-router";
import { PoliticalHistoryAuthorityPage, politicalHistoryAuthorityHead } from "@/components/political-history-authority-page";
import { TEXAS_REPUBLICAN_PARTY_HISTORY } from "@/data/texas-party-representation-authority";

export const Route = createFileRoute("/texas-politics/texas-republican-party-history")({
  head: () => politicalHistoryAuthorityHead(TEXAS_REPUBLICAN_PARTY_HISTORY),
  component: Page,
});

function Page() { return <PoliticalHistoryAuthorityPage page={TEXAS_REPUBLICAN_PARTY_HISTORY} />; }
