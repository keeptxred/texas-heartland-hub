import { createFileRoute } from "@tanstack/react-router";
import { PoliticalHistoryAuthorityPage, politicalHistoryAuthorityHead } from "@/components/political-history-authority-page";
import { TEXAS_SECESSION_CONVENTION_1861 } from "@/data/texas-civil-war-reconstruction-authority";

export const Route = createFileRoute("/texas-politics/texas-secession-convention-1861")({ head: () => politicalHistoryAuthorityHead(TEXAS_SECESSION_CONVENTION_1861), component: Page });
function Page() { return <PoliticalHistoryAuthorityPage page={TEXAS_SECESSION_CONVENTION_1861} />; }
