import { createFileRoute } from "@tanstack/react-router";
import { PoliticalHistoryAuthorityPage, politicalHistoryAuthorityHead } from "@/components/political-history-authority-page";
import { CONSTITUTION_OF_1869_TEXAS } from "@/data/texas-civil-war-reconstruction-authority";

export const Route = createFileRoute("/texas-politics/constitution-of-1869-texas")({ head: () => politicalHistoryAuthorityHead(CONSTITUTION_OF_1869_TEXAS), component: Page });
function Page() { return <PoliticalHistoryAuthorityPage page={CONSTITUTION_OF_1869_TEXAS} />; }
