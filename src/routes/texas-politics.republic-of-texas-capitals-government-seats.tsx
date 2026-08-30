import { createFileRoute } from "@tanstack/react-router";
import { PoliticalHistoryAuthorityPage, politicalHistoryAuthorityHead } from "@/components/political-history-authority-page";
import { REPUBLIC_OF_TEXAS_CAPITALS_HISTORY } from "@/data/texas-republic-government-authority";

export const Route = createFileRoute("/texas-politics/republic-of-texas-capitals-government-seats")({ head: () => politicalHistoryAuthorityHead(REPUBLIC_OF_TEXAS_CAPITALS_HISTORY), component: Page });
function Page() { return <PoliticalHistoryAuthorityPage page={REPUBLIC_OF_TEXAS_CAPITALS_HISTORY} />; }
