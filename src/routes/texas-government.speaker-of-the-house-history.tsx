import { createFileRoute } from "@tanstack/react-router";
import { GovernmentHistoryAuthorityPage, governmentHistoryAuthorityHead } from "@/components/government-history-authority-page";
import { TEXAS_SPEAKER_HISTORY } from "@/data/texas-government-history-authority";

export const Route = createFileRoute("/texas-government/speaker-of-the-house-history")({ head: () => governmentHistoryAuthorityHead(TEXAS_SPEAKER_HISTORY), component: Page });
function Page() { return <GovernmentHistoryAuthorityPage page={TEXAS_SPEAKER_HISTORY} />; }
