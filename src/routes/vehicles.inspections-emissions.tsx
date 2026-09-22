import { createFileRoute, redirect } from "@tanstack/react-router";

const TEXASDEFINED_PATH = "/texas-vehicle-registration";
const TEXASDEFINED_HASH = "";

/**
 * TexasDefined owns practical Texas vehicle-service guidance.
 * KeepTXRed retains this historical URL only as a permanent one-hop handoff.
 */
export const Route = createFileRoute("/vehicles/inspections-emissions")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com${TEXASDEFINED_PATH}${location.searchStr || ""}${TEXASDEFINED_HASH}`,
      statusCode: 301,
    });
  },
});
