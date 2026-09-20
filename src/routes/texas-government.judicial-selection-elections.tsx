import { createFileRoute } from "@tanstack/react-router";
import {
  TexasJudicialSelectionHistoryPage,
  texasJudicialSelectionHistoryHead,
} from "@/components/texas-judicial-selection-history-page";

export const Route = createFileRoute("/texas-government/judicial-selection-elections")({
  head: texasJudicialSelectionHistoryHead,
  component: TexasJudicialSelectionHistoryPage,
});
