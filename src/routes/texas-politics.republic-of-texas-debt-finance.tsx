import { createFileRoute } from "@tanstack/react-router";
import { PoliticalHistoryAuthorityPage, politicalHistoryAuthorityHead } from "@/components/political-history-authority-page";
import { REPUBLIC_OF_TEXAS_DEBT_FINANCE } from "@/data/texas-republic-government-authority";

export const Route = createFileRoute("/texas-politics/republic-of-texas-debt-finance")({ head: () => politicalHistoryAuthorityHead(REPUBLIC_OF_TEXAS_DEBT_FINANCE), component: Page });
function Page() { return <PoliticalHistoryAuthorityPage page={REPUBLIC_OF_TEXAS_DEBT_FINANCE} />; }
