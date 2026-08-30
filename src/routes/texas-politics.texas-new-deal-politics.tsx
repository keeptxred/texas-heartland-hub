import { createFileRoute } from "@tanstack/react-router";
import { PoliticalHistoryAuthorityPage, politicalHistoryAuthorityHead } from "@/components/political-history-authority-page";
import { TEXAS_NEW_DEAL_POLITICS } from "@/data/texas-political-eras-authority";

export const Route = createFileRoute("/texas-politics/texas-new-deal-politics")({ head: () => politicalHistoryAuthorityHead(TEXAS_NEW_DEAL_POLITICS), component: Page });
function Page() { return <PoliticalHistoryAuthorityPage page={TEXAS_NEW_DEAL_POLITICS} />; }
