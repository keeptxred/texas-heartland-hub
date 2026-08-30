import { createFileRoute } from "@tanstack/react-router";
import { PoliticalHistoryAuthorityPage, politicalHistoryAuthorityHead } from "@/components/political-history-authority-page";
import { REPUBLIC_OF_TEXAS_DIPLOMACY_RECOGNITION } from "@/data/texas-republic-government-authority";

export const Route = createFileRoute("/texas-politics/republic-of-texas-diplomacy-recognition")({ head: () => politicalHistoryAuthorityHead(REPUBLIC_OF_TEXAS_DIPLOMACY_RECOGNITION), component: Page });
function Page() { return <PoliticalHistoryAuthorityPage page={REPUBLIC_OF_TEXAS_DIPLOMACY_RECOGNITION} />; }
