import { createFileRoute } from "@tanstack/react-router";
import { GovernmentHistoryAuthorityPage, governmentHistoryAuthorityHead } from "@/components/government-history-authority-page";
import { TEXAS_JP_CONSTABLE_HISTORY } from "@/data/texas-local-government-authority";

export const Route = createFileRoute("/texas-government/justice-of-the-peace-constable-history")({ head: () => governmentHistoryAuthorityHead(TEXAS_JP_CONSTABLE_HISTORY), component: Page });
function Page() { return <GovernmentHistoryAuthorityPage page={TEXAS_JP_CONSTABLE_HISTORY} />; }
