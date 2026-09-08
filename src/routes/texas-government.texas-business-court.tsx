import { createFileRoute } from "@tanstack/react-router";
import {
  TexasBusinessCourtAuthorityPage,
  texasBusinessCourtAuthorityHead,
} from "@/components/texas-business-court-authority-page";

export const Route = createFileRoute("/texas-government/texas-business-court")({
  head: texasBusinessCourtAuthorityHead,
  component: TexasBusinessCourtAuthorityPage,
});
