import { createFileRoute } from "@tanstack/react-router";
import {
  TexasFifteenthCourtAuthorityPage,
  texasFifteenthCourtAuthorityHead,
} from "@/components/texas-fifteenth-court-authority-page";

export const Route = createFileRoute("/texas-government/fifteenth-court-of-appeals")({
  head: texasFifteenthCourtAuthorityHead,
  component: TexasFifteenthCourtAuthorityPage,
});
