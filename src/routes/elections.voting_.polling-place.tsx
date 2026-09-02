import { createFileRoute } from "@tanstack/react-router";
import { ElectionVotingAnswerPage } from "@/components/elections/voting/ElectionVotingAnswerPage";
import { POLLING_PLACE_ANSWER } from "@/data/election-voting-answers";
import { buildVotingAnswerHead } from "@/lib/elections/voting-answer-seo";

const canonicalPath = "/elections/voting/polling-place";

export const Route = createFileRoute("/elections/voting/polling-place")({
  head: () => buildVotingAnswerHead(POLLING_PLACE_ANSWER, canonicalPath),
  component: Page,
});

function Page() {
  return <ElectionVotingAnswerPage data={POLLING_PLACE_ANSWER} canonicalPath={canonicalPath} />;
}
