import { createFileRoute } from "@tanstack/react-router";
import { GovernmentHistoryAuthorityPage, governmentHistoryAuthorityHead } from "@/components/government-history-authority-page";
import { TEXAS_SPECIAL_DISTRICTS_HISTORY } from "@/data/texas-municipal-government-authority";

export const Route = createFileRoute("/texas-government/texas-special-district-government-history")({ head: () => governmentHistoryAuthorityHead(TEXAS_SPECIAL_DISTRICTS_HISTORY), component: Page });
function Page() { return <GovernmentHistoryAuthorityPage page={TEXAS_SPECIAL_DISTRICTS_HISTORY} />; }
