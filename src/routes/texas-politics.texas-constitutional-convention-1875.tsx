import { createFileRoute } from "@tanstack/react-router";
import { PoliticalHistoryAuthorityPage, politicalHistoryAuthorityHead } from "@/components/political-history-authority-page";
import { TEXAS_CONSTITUTIONAL_CONVENTION_1875 } from "@/data/texas-civil-war-reconstruction-authority";

export const Route = createFileRoute("/texas-politics/texas-constitutional-convention-1875")({ head: () => politicalHistoryAuthorityHead(TEXAS_CONSTITUTIONAL_CONVENTION_1875), component: Page });
function Page() { return <PoliticalHistoryAuthorityPage page={TEXAS_CONSTITUTIONAL_CONVENTION_1875} />; }
