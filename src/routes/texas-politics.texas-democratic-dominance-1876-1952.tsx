import { createFileRoute } from "@tanstack/react-router";
import { PoliticalHistoryAuthorityPage, politicalHistoryAuthorityHead } from "@/components/political-history-authority-page";
import { TEXAS_DEMOCRATIC_DOMINANCE_1876_1952 } from "@/data/texas-political-eras-authority";

export const Route = createFileRoute("/texas-politics/texas-democratic-dominance-1876-1952")({ head: () => politicalHistoryAuthorityHead(TEXAS_DEMOCRATIC_DOMINANCE_1876_1952), component: Page });
function Page() { return <PoliticalHistoryAuthorityPage page={TEXAS_DEMOCRATIC_DOMINANCE_1876_1952} />; }
