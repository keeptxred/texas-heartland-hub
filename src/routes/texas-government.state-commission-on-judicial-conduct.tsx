import { createFileRoute } from "@tanstack/react-router";
import {
  TexasJudicialConductAuthorityPage,
  texasJudicialConductAuthorityHead,
} from "@/components/texas-judicial-conduct-authority-page";

export const Route = createFileRoute("/texas-government/state-commission-on-judicial-conduct")({
  head: texasJudicialConductAuthorityHead,
  component: TexasJudicialConductAuthorityPage,
});
