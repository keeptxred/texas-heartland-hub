import { createFileRoute } from "@tanstack/react-router";
import {
  TexasTrialCourtsAuthorityPage,
  texasTrialCourtsAuthorityHead,
} from "@/components/texas-trial-courts-authority-page";

export const Route = createFileRoute("/texas-government/texas-trial-courts")({
  head: texasTrialCourtsAuthorityHead,
  component: TexasTrialCourtsAuthorityPage,
});
