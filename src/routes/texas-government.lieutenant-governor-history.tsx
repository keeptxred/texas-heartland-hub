import { createFileRoute } from "@tanstack/react-router";
import { GovernmentHistoryAuthorityPage, governmentHistoryAuthorityHead } from "@/components/government-history-authority-page";
import { TEXAS_LIEUTENANT_GOVERNOR_HISTORY } from "@/data/texas-government-history-authority";

export const Route = createFileRoute("/texas-government/lieutenant-governor-history")({ head: () => governmentHistoryAuthorityHead(TEXAS_LIEUTENANT_GOVERNOR_HISTORY), component: Page });
function Page() { return <GovernmentHistoryAuthorityPage page={TEXAS_LIEUTENANT_GOVERNOR_HISTORY} />; }
