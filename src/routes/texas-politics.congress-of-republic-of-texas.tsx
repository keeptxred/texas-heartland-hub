import { createFileRoute } from "@tanstack/react-router";
import { PoliticalHistoryAuthorityPage, politicalHistoryAuthorityHead } from "@/components/political-history-authority-page";
import { CONGRESS_OF_REPUBLIC_OF_TEXAS } from "@/data/texas-republic-government-authority";

export const Route = createFileRoute("/texas-politics/congress-of-republic-of-texas")({ head: () => politicalHistoryAuthorityHead(CONGRESS_OF_REPUBLIC_OF_TEXAS), component: Page });
function Page() { return <PoliticalHistoryAuthorityPage page={CONGRESS_OF_REPUBLIC_OF_TEXAS} />; }
