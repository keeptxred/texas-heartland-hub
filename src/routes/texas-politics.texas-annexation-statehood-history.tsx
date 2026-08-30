import { createFileRoute } from "@tanstack/react-router";
import { PoliticalHistoryAuthorityPage, politicalHistoryAuthorityHead } from "@/components/political-history-authority-page";
import { TEXAS_ANNEXATION_STATEHOOD_HISTORY } from "@/data/texas-republic-government-authority";

export const Route = createFileRoute("/texas-politics/texas-annexation-statehood-history")({ head: () => politicalHistoryAuthorityHead(TEXAS_ANNEXATION_STATEHOOD_HISTORY), component: Page });
function Page() { return <PoliticalHistoryAuthorityPage page={TEXAS_ANNEXATION_STATEHOOD_HISTORY} />; }
