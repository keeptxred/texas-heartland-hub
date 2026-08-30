import { createFileRoute } from "@tanstack/react-router";
import { PoliticalHistoryAuthorityPage, politicalHistoryAuthorityHead } from "@/components/political-history-authority-page";
import { FERGUSON_ERA_TEXAS_POLITICS } from "@/data/texas-political-eras-authority";

export const Route = createFileRoute("/texas-politics/ferguson-era-texas-politics")({ head: () => politicalHistoryAuthorityHead(FERGUSON_ERA_TEXAS_POLITICS), component: Page });
function Page() { return <PoliticalHistoryAuthorityPage page={FERGUSON_ERA_TEXAS_POLITICS} />; }
