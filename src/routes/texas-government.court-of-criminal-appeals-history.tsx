import { createFileRoute } from "@tanstack/react-router";
import {
  TexasCourtOfCriminalAppealsHistoryPage,
  texasCourtOfCriminalAppealsHistoryHead,
} from "@/components/texas-court-of-criminal-appeals-history-page";

export const Route = createFileRoute("/texas-government/court-of-criminal-appeals-history")({
  head: texasCourtOfCriminalAppealsHistoryHead,
  component: TexasCourtOfCriminalAppealsHistoryPage,
});
