import { createFileRoute } from "@tanstack/react-router";
import { GovernmentHistoryAuthorityPage, governmentHistoryAuthorityHead } from "@/components/government-history-authority-page";
import { TEXAS_JUDICIAL_SELECTION_HISTORY } from "@/data/texas-government-history-authority";

export const Route = createFileRoute("/texas-government/judicial-selection-elections")({ head: () => governmentHistoryAuthorityHead(TEXAS_JUDICIAL_SELECTION_HISTORY), component: Page });
function Page() { return <GovernmentHistoryAuthorityPage page={TEXAS_JUDICIAL_SELECTION_HISTORY} />; }
