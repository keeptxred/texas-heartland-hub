import { createFileRoute } from "@tanstack/react-router";
import {
  PoliticalHistoryAuthorityPage,
  politicalHistoryAuthorityHead,
} from "@/components/political-history-authority-page";
import { TEXAS_ELECTION_HISTORY } from "@/data/texas-political-history-authority";

export const Route = createFileRoute("/texas-politics/texas-election-history")({
  head: () => politicalHistoryAuthorityHead(TEXAS_ELECTION_HISTORY),
  component: TexasElectionHistoryPage,
});

function TexasElectionHistoryPage() {
  return <PoliticalHistoryAuthorityPage page={TEXAS_ELECTION_HISTORY} />;
}
