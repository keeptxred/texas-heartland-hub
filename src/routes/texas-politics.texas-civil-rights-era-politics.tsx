import { createFileRoute } from "@tanstack/react-router";
import { PoliticalHistoryAuthorityPage, politicalHistoryAuthorityHead } from "@/components/political-history-authority-page";
import { TEXAS_CIVIL_RIGHTS_ERA_POLITICS } from "@/data/texas-political-eras-authority";

export const Route = createFileRoute("/texas-politics/texas-civil-rights-era-politics")({ head: () => politicalHistoryAuthorityHead(TEXAS_CIVIL_RIGHTS_ERA_POLITICS), component: Page });
function Page() { return <PoliticalHistoryAuthorityPage page={TEXAS_CIVIL_RIGHTS_ERA_POLITICS} />; }
