import { createFileRoute } from "@tanstack/react-router";
import { PoliticalHistoryAuthorityPage, politicalHistoryAuthorityHead } from "@/components/political-history-authority-page";
import { TEXAS_PROGRESSIVE_ERA_POLITICS } from "@/data/texas-post-reconstruction-progressive-authority";

export const Route = createFileRoute("/texas-politics/texas-progressive-era-politics")({ head: () => politicalHistoryAuthorityHead(TEXAS_PROGRESSIVE_ERA_POLITICS), component: Page });
function Page() { return <PoliticalHistoryAuthorityPage page={TEXAS_PROGRESSIVE_ERA_POLITICS} />; }
