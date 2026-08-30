import { createFileRoute } from "@tanstack/react-router";
import { PoliticalHistoryAuthorityPage, politicalHistoryAuthorityHead } from "@/components/political-history-authority-page";
import { TEXAS_WHITE_PRIMARY_HISTORY } from "@/data/texas-political-eras-authority";

export const Route = createFileRoute("/texas-politics/texas-white-primary-history")({ head: () => politicalHistoryAuthorityHead(TEXAS_WHITE_PRIMARY_HISTORY), component: Page });
function Page() { return <PoliticalHistoryAuthorityPage page={TEXAS_WHITE_PRIMARY_HISTORY} />; }
