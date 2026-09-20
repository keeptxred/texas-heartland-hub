import { createFileRoute } from "@tanstack/react-router";
import { GovernmentHistoryAuthorityPage, governmentHistoryAuthorityHead } from "@/components/government-history-authority-page";
import { TEXAS_TAX_ASSESSOR_COLLECTOR_HISTORY } from "@/data/texas-local-government-authority";

export const Route = createFileRoute("/texas-government/tax-assessor-collector-history")({ head: () => governmentHistoryAuthorityHead(TEXAS_TAX_ASSESSOR_COLLECTOR_HISTORY), component: Page });
function Page() { return <GovernmentHistoryAuthorityPage page={TEXAS_TAX_ASSESSOR_COLLECTOR_HISTORY} />; }
