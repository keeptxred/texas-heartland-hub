import { createFileRoute } from "@tanstack/react-router";
import { GovernmentHistoryAuthorityPage, governmentHistoryAuthorityHead } from "@/components/government-history-authority-page";
import { TEXAS_CITY_MANAGER_HISTORY } from "@/data/texas-municipal-government-authority";

export const Route = createFileRoute("/texas-government/city-manager-government-history")({ head: () => governmentHistoryAuthorityHead(TEXAS_CITY_MANAGER_HISTORY), component: Page });
function Page() { return <GovernmentHistoryAuthorityPage page={TEXAS_CITY_MANAGER_HISTORY} />; }
