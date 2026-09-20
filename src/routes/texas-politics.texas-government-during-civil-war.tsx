import { createFileRoute } from "@tanstack/react-router";
import { PoliticalHistoryAuthorityPage, politicalHistoryAuthorityHead } from "@/components/political-history-authority-page";
import { TEXAS_GOVERNMENT_DURING_CIVIL_WAR } from "@/data/texas-civil-war-reconstruction-authority";

export const Route = createFileRoute("/texas-politics/texas-government-during-civil-war")({ head: () => politicalHistoryAuthorityHead(TEXAS_GOVERNMENT_DURING_CIVIL_WAR), component: Page });
function Page() { return <PoliticalHistoryAuthorityPage page={TEXAS_GOVERNMENT_DURING_CIVIL_WAR} />; }
