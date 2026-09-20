import { createFileRoute } from "@tanstack/react-router";
import { ElectionVotingAnswerPage } from "@/components/elections/voting/ElectionVotingAnswerPage";
import { VOTER_REGISTRATION_CARD_ANSWER } from "@/data/election-voting-answers";
import { buildVotingAnswerHead } from "@/lib/elections/voting-answer-seo";

const canonicalPath = "/elections/voting/voter-registration-card";

export const Route = createFileRoute("/elections/voting/voter-registration-card")({
  head: () => buildVotingAnswerHead(VOTER_REGISTRATION_CARD_ANSWER, canonicalPath),
  component: Page,
});

function Page() {
  return <ElectionVotingAnswerPage data={VOTER_REGISTRATION_CARD_ANSWER} canonicalPath={canonicalPath} />;
}
