import { createFileRoute } from "@tanstack/react-router";
import {
  PoliticalHistoryAuthorityPage,
  politicalHistoryAuthorityHead,
} from "@/components/political-history-authority-page";
import { TEXAS_VOTING_RIGHTS_HISTORY } from "@/data/texas-political-history-authority";

export const Route = createFileRoute("/texas-politics/voting-rights-history")({
  head: () => politicalHistoryAuthorityHead(TEXAS_VOTING_RIGHTS_HISTORY),
  component: TexasVotingRightsHistoryPage,
});

function TexasVotingRightsHistoryPage() {
  return <PoliticalHistoryAuthorityPage page={TEXAS_VOTING_RIGHTS_HISTORY} />;
}
