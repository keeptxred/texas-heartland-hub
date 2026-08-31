import { createFileRoute } from "@tanstack/react-router";
import { PoliticalHistoryAuthorityPage, politicalHistoryAuthorityHead } from "@/components/political-history-authority-page";
import { TEXAS_MEXICAN_AMERICAN_POLITICAL_HISTORY } from "@/data/texas-party-representation-authority";

export const Route = createFileRoute("/texas-politics/texas-mexican-american-political-organization-history")({
  head: () => politicalHistoryAuthorityHead(TEXAS_MEXICAN_AMERICAN_POLITICAL_HISTORY),
  component: Page,
});

function Page() { return <PoliticalHistoryAuthorityPage page={TEXAS_MEXICAN_AMERICAN_POLITICAL_HISTORY} />; }
