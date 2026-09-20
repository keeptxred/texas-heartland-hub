import { createFileRoute } from "@tanstack/react-router";
import { PoliticalHistoryAuthorityPage, politicalHistoryAuthorityHead } from "@/components/political-history-authority-page";
import { REPUBLIC_TO_STATE_GOVERNMENT_TRANSITION } from "@/data/texas-republic-government-authority";

export const Route = createFileRoute("/texas-politics/republic-to-state-government-transition")({ head: () => politicalHistoryAuthorityHead(REPUBLIC_TO_STATE_GOVERNMENT_TRANSITION), component: Page });
function Page() { return <PoliticalHistoryAuthorityPage page={REPUBLIC_TO_STATE_GOVERNMENT_TRANSITION} />; }
