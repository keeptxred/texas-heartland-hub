import { createFileRoute } from "@tanstack/react-router";
import { PoliticalHistoryAuthorityPage, politicalHistoryAuthorityHead } from "@/components/political-history-authority-page";
import { DEMOCRATIC_RESTORATION_TEXAS } from "@/data/texas-post-reconstruction-progressive-authority";

export const Route = createFileRoute("/texas-politics/democratic-restoration-texas-1874-1900")({ head: () => politicalHistoryAuthorityHead(DEMOCRATIC_RESTORATION_TEXAS), component: Page });
function Page() { return <PoliticalHistoryAuthorityPage page={DEMOCRATIC_RESTORATION_TEXAS} />; }
