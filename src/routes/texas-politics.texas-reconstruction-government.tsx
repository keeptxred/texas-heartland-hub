import { createFileRoute } from "@tanstack/react-router";
import { PoliticalHistoryAuthorityPage, politicalHistoryAuthorityHead } from "@/components/political-history-authority-page";
import { TEXAS_RECONSTRUCTION_GOVERNMENT } from "@/data/texas-civil-war-reconstruction-authority";

export const Route = createFileRoute("/texas-politics/texas-reconstruction-government")({ head: () => politicalHistoryAuthorityHead(TEXAS_RECONSTRUCTION_GOVERNMENT), component: Page });
function Page() { return <PoliticalHistoryAuthorityPage page={TEXAS_RECONSTRUCTION_GOVERNMENT} />; }
