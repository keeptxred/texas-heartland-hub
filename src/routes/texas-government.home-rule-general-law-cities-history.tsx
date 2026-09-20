import { createFileRoute } from "@tanstack/react-router";
import { GovernmentHistoryAuthorityPage, governmentHistoryAuthorityHead } from "@/components/government-history-authority-page";
import { TEXAS_HOME_RULE_GENERAL_LAW_HISTORY } from "@/data/texas-municipal-government-authority";

export const Route = createFileRoute("/texas-government/home-rule-general-law-cities-history")({ head: () => governmentHistoryAuthorityHead(TEXAS_HOME_RULE_GENERAL_LAW_HISTORY), component: Page });
function Page() { return <GovernmentHistoryAuthorityPage page={TEXAS_HOME_RULE_GENERAL_LAW_HISTORY} />; }
