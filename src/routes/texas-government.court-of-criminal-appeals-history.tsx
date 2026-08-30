import { createFileRoute } from "@tanstack/react-router";
import { GovernmentHistoryAuthorityPage, governmentHistoryAuthorityHead } from "@/components/government-history-authority-page";
import { TEXAS_CCA_HISTORY } from "@/data/texas-government-history-authority";

export const Route = createFileRoute("/texas-government/court-of-criminal-appeals-history")({ head: () => governmentHistoryAuthorityHead(TEXAS_CCA_HISTORY), component: Page });
function Page() { return <GovernmentHistoryAuthorityPage page={TEXAS_CCA_HISTORY} />; }
