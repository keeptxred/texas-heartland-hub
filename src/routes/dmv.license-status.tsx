import { createFileRoute, redirect } from "@tanstack/react-router";

const TEXASDEFINED_DESTINATION = "https://texasdefined.com/texas-drivers-license";

/**
 * TexasDefined owns practical Texas DMV and driver-service guidance.
 * KeepTXRed retains this historical URL only as a permanent one-hop handoff.
 */
export const Route = createFileRoute("/dmv/license-status")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `${TEXASDEFINED_DESTINATION}${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
