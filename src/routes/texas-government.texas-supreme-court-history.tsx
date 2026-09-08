import { createFileRoute } from "@tanstack/react-router";
import { TexasSupremeCourtHistoryPage, texasSupremeCourtHistoryHead } from "@/components/texas-supreme-court-history-page";

export const Route = createFileRoute("/texas-government/texas-supreme-court-history")({
  head: texasSupremeCourtHistoryHead,
  component: TexasSupremeCourtHistoryPage,
});
