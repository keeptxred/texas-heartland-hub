import { createFileRoute } from "@tanstack/react-router";
import {
  PoliticalHistoryAuthorityPage,
  politicalHistoryAuthorityHead,
} from "@/components/political-history-authority-page";
import { TEXAS_CONSTITUTIONAL_HISTORY } from "@/data/texas-political-history-authority";

export const Route = createFileRoute("/texas-politics/texas-constitutional-history")({
  head: () => politicalHistoryAuthorityHead(TEXAS_CONSTITUTIONAL_HISTORY),
  component: TexasConstitutionalHistoryPage,
});

function TexasConstitutionalHistoryPage() {
  return <PoliticalHistoryAuthorityPage page={TEXAS_CONSTITUTIONAL_HISTORY} />;
}
