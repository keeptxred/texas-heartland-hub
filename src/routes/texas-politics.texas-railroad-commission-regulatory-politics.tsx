import { createFileRoute } from "@tanstack/react-router";
import { PoliticalHistoryAuthorityPage, politicalHistoryAuthorityHead } from "@/components/political-history-authority-page";
import { TEXAS_RAILROAD_COMMISSION_REGULATORY_POLITICS } from "@/data/texas-post-reconstruction-progressive-authority";

export const Route = createFileRoute("/texas-politics/texas-railroad-commission-regulatory-politics")({ head: () => politicalHistoryAuthorityHead(TEXAS_RAILROAD_COMMISSION_REGULATORY_POLITICS), component: Page });
function Page() { return <PoliticalHistoryAuthorityPage page={TEXAS_RAILROAD_COMMISSION_REGULATORY_POLITICS} />; }
