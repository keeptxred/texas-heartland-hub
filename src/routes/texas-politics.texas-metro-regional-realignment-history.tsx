import { createFileRoute } from "@tanstack/react-router";
import { PoliticalHistoryAuthorityPage, politicalHistoryAuthorityHead } from "@/components/political-history-authority-page";
import { TEXAS_METRO_REGIONAL_REALIGNMENT_HISTORY } from "@/data/texas-political-geography-authority";

export const Route = createFileRoute("/texas-politics/texas-metro-regional-realignment-history")({ head: () => politicalHistoryAuthorityHead(TEXAS_METRO_REGIONAL_REALIGNMENT_HISTORY), component: Page });
function Page() { return <PoliticalHistoryAuthorityPage page={TEXAS_METRO_REGIONAL_REALIGNMENT_HISTORY} />; }
