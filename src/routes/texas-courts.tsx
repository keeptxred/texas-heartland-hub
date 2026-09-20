import { createFileRoute } from "@tanstack/react-router";
import { TexasCourtsAuthorityPage, texasCourtsAuthorityHead } from "@/components/texas-courts-authority-page";

export const Route = createFileRoute("/texas-courts")({
  head: texasCourtsAuthorityHead,
  component: TexasCourtsAuthorityPage,
});
