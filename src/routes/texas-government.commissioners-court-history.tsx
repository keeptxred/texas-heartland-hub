import { createFileRoute } from "@tanstack/react-router";
import { GovernmentHistoryAuthorityPage, governmentHistoryAuthorityHead } from "@/components/government-history-authority-page";
import { TEXAS_COMMISSIONERS_COURT_HISTORY } from "@/data/texas-local-government-authority";

export const Route = createFileRoute("/texas-government/commissioners-court-history")({ head: () => governmentHistoryAuthorityHead(TEXAS_COMMISSIONERS_COURT_HISTORY), component: Page });
function Page() { return <GovernmentHistoryAuthorityPage page={TEXAS_COMMISSIONERS_COURT_HISTORY} />; }
