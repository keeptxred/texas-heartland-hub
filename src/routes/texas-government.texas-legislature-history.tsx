import { createFileRoute } from "@tanstack/react-router";
import { GovernmentHistoryAuthorityPage, governmentHistoryAuthorityHead } from "@/components/government-history-authority-page";
import { TEXAS_LEGISLATURE_HISTORY } from "@/data/texas-government-history-authority";

export const Route = createFileRoute("/texas-government/texas-legislature-history")({ head: () => governmentHistoryAuthorityHead(TEXAS_LEGISLATURE_HISTORY), component: Page });
function Page() { return <GovernmentHistoryAuthorityPage page={TEXAS_LEGISLATURE_HISTORY} />; }
