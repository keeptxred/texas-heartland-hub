import { createFileRoute } from "@tanstack/react-router";
import { GovernmentHistoryAuthorityPage, governmentHistoryAuthorityHead } from "@/components/government-history-authority-page";
import { TEXAS_MUNICIPAL_ELECTIONS_HISTORY } from "@/data/texas-municipal-government-authority";

export const Route = createFileRoute("/texas-government/municipal-elections-representation-history")({ head: () => governmentHistoryAuthorityHead(TEXAS_MUNICIPAL_ELECTIONS_HISTORY), component: Page });
function Page() { return <GovernmentHistoryAuthorityPage page={TEXAS_MUNICIPAL_ELECTIONS_HISTORY} />; }
