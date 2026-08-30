import { createFileRoute } from "@tanstack/react-router";
import { PoliticalHistoryAuthorityPage, politicalHistoryAuthorityHead } from "@/components/political-history-authority-page";
import { TEXAS_URBAN_SUBURBAN_RURAL_POLITICS_HISTORY } from "@/data/texas-political-geography-authority";

export const Route = createFileRoute("/texas-politics/texas-urban-suburban-rural-politics-history")({ head: () => politicalHistoryAuthorityHead(TEXAS_URBAN_SUBURBAN_RURAL_POLITICS_HISTORY), component: Page });
function Page() { return <PoliticalHistoryAuthorityPage page={TEXAS_URBAN_SUBURBAN_RURAL_POLITICS_HISTORY} />; }
