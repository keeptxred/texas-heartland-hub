import { createFileRoute, redirect } from "@tanstack/react-router";

import { buildVehicleHandoffLocation } from "@/lib/vehicle-handoff-redirect";

/**
 * Vehicle-service evergreen content belongs on TexasDefined.
 * Keep the legacy KeepTXRed URLs as permanent redirects so existing links and
 * search equity survive the ownership handoff.
 */
export const Route = createFileRoute("/vehicles")({
  beforeLoad: ({ location }) => {
    const destination =
      buildVehicleHandoffLocation(
        `https://keeptxred.com${location.pathname}${location.searchStr || ""}`,
      ) ??
      `https://texasdefined.com/texas-vehicle-registration${location.searchStr || ""}`;

    throw redirect({
      href: destination,
      statusCode: 301,
    });
  },
});
