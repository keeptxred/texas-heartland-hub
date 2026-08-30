import { createFileRoute } from "@tanstack/react-router";
import { GovernmentHistoryAuthorityPage, governmentHistoryAuthorityHead } from "@/components/government-history-authority-page";
import { TEXAS_MAYOR_CITY_COUNCIL_HISTORY } from "@/data/texas-municipal-government-authority";

export const Route = createFileRoute("/texas-government/mayor-city-council-history")({ head: () => governmentHistoryAuthorityHead(TEXAS_MAYOR_CITY_COUNCIL_HISTORY), component: Page });
function Page() { return <GovernmentHistoryAuthorityPage page={TEXAS_MAYOR_CITY_COUNCIL_HISTORY} />; }
