import { createFileRoute } from "@tanstack/react-router";
import { ElectionVotingAnswerPage } from "@/components/elections/voting/ElectionVotingAnswerPage";
import { POLLING_HOURS_ANSWER } from "@/data/election-voting-answers";
import { buildVotingAnswerHead } from "@/lib/elections/voting-answer-seo";

const canonicalPath = "/elections/voting/polling-hours";

export const Route = createFileRoute("/elections/voting/polling-hours")({
  head: () => buildVotingAnswerHead(POLLING_HOURS_ANSWER, canonicalPath),
  component: Page,
});

function Page() {
  return <ElectionVotingAnswerPage data={POLLING_HOURS_ANSWER} canonicalPath={canonicalPath} />;
}
