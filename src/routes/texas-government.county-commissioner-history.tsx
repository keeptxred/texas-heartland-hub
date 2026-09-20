import { createFileRoute } from "@tanstack/react-router";
import { GovernmentHistoryAuthorityPage, governmentHistoryAuthorityHead } from "@/components/government-history-authority-page";
import { TEXAS_COUNTY_COMMISSIONER_HISTORY } from "@/data/texas-local-government-authority";

export const Route = createFileRoute("/texas-government/county-commissioner-history")({ head: () => governmentHistoryAuthorityHead(TEXAS_COUNTY_COMMISSIONER_HISTORY), component: Page });
function Page() { return <GovernmentHistoryAuthorityPage page={TEXAS_COUNTY_COMMISSIONER_HISTORY} />; }
