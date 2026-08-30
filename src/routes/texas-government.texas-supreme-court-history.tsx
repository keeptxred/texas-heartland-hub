import { createFileRoute } from "@tanstack/react-router";
import { GovernmentHistoryAuthorityPage, governmentHistoryAuthorityHead } from "@/components/government-history-authority-page";
import { TEXAS_SUPREME_COURT_HISTORY } from "@/data/texas-government-history-authority";

export const Route = createFileRoute("/texas-government/texas-supreme-court-history")({ head: () => governmentHistoryAuthorityHead(TEXAS_SUPREME_COURT_HISTORY), component: Page });
function Page() { return <GovernmentHistoryAuthorityPage page={TEXAS_SUPREME_COURT_HISTORY} />; }
