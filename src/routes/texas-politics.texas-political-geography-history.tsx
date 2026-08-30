import { createFileRoute } from "@tanstack/react-router";
import { PoliticalHistoryAuthorityPage, politicalHistoryAuthorityHead } from "@/components/political-history-authority-page";
import { TEXAS_POLITICAL_GEOGRAPHY_HISTORY } from "@/data/texas-political-geography-authority";

export const Route = createFileRoute("/texas-politics/texas-political-geography-history")({ head: () => politicalHistoryAuthorityHead(TEXAS_POLITICAL_GEOGRAPHY_HISTORY), component: Page });
function Page() { return <PoliticalHistoryAuthorityPage page={TEXAS_POLITICAL_GEOGRAPHY_HISTORY} />; }
