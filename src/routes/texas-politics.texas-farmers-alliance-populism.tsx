import { createFileRoute } from "@tanstack/react-router";
import { PoliticalHistoryAuthorityPage, politicalHistoryAuthorityHead } from "@/components/political-history-authority-page";
import { TEXAS_FARMERS_ALLIANCE_POPULISM } from "@/data/texas-post-reconstruction-progressive-authority";

export const Route = createFileRoute("/texas-politics/texas-farmers-alliance-populism")({ head: () => politicalHistoryAuthorityHead(TEXAS_FARMERS_ALLIANCE_POPULISM), component: Page });
function Page() { return <PoliticalHistoryAuthorityPage page={TEXAS_FARMERS_ALLIANCE_POPULISM} />; }
