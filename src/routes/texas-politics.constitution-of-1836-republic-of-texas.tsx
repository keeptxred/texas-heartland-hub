import { createFileRoute } from "@tanstack/react-router";
import { PoliticalHistoryAuthorityPage, politicalHistoryAuthorityHead } from "@/components/political-history-authority-page";
import { CONSTITUTION_OF_1836_REPUBLIC_OF_TEXAS } from "@/data/texas-republic-government-authority";

export const Route = createFileRoute("/texas-politics/constitution-of-1836-republic-of-texas")({ head: () => politicalHistoryAuthorityHead(CONSTITUTION_OF_1836_REPUBLIC_OF_TEXAS), component: Page });
function Page() { return <PoliticalHistoryAuthorityPage page={CONSTITUTION_OF_1836_REPUBLIC_OF_TEXAS} />; }
