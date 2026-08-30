import { createFileRoute } from "@tanstack/react-router";
import { PoliticalHistoryAuthorityPage, politicalHistoryAuthorityHead } from "@/components/political-history-authority-page";
import { TEXAS_POPULIST_PROGRESSIVE_ERA } from "@/data/texas-political-eras-authority";

export const Route = createFileRoute("/texas-politics/texas-populist-progressive-era")({ head: () => politicalHistoryAuthorityHead(TEXAS_POPULIST_PROGRESSIVE_ERA), component: Page });
function Page() { return <PoliticalHistoryAuthorityPage page={TEXAS_POPULIST_PROGRESSIVE_ERA} />; }
