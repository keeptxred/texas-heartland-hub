import { createFileRoute } from "@tanstack/react-router";
import { PoliticalHistoryAuthorityPage, politicalHistoryAuthorityHead } from "@/components/political-history-authority-page";
import { TEXAS_DEMOCRATIC_PARTY_HISTORY } from "@/data/texas-party-representation-authority";

export const Route = createFileRoute("/texas-politics/texas-democratic-party-history")({
  head: () => politicalHistoryAuthorityHead(TEXAS_DEMOCRATIC_PARTY_HISTORY),
  component: Page,
});

function Page() { return <PoliticalHistoryAuthorityPage page={TEXAS_DEMOCRATIC_PARTY_HISTORY} />; }
