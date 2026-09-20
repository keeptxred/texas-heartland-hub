import { createFileRoute } from "@tanstack/react-router";
import { PoliticalHistoryAuthorityPage, politicalHistoryAuthorityHead } from "@/components/political-history-authority-page";
import { PRESIDENTS_OF_REPUBLIC_OF_TEXAS } from "@/data/texas-republic-government-authority";

export const Route = createFileRoute("/texas-politics/presidents-of-republic-of-texas")({ head: () => politicalHistoryAuthorityHead(PRESIDENTS_OF_REPUBLIC_OF_TEXAS), component: Page });
function Page() { return <PoliticalHistoryAuthorityPage page={PRESIDENTS_OF_REPUBLIC_OF_TEXAS} />; }
