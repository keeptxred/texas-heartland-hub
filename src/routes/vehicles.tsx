import { createFileRoute, redirect } from "@tanstack/react-router";

const destinationForVehiclePath = (pathname: string) => {
  if (pathname === "/vehicles/plates") return { path: "/texas-vehicle-registration", hash: "#license-plates" };
  if (pathname === "/vehicles/title-transfer" || pathname === "/vehicles/duplicate-titles") {
    return { path: "/texas-vehicle-registration", hash: "#title-transfer" };
  }
  return { path: "/texas-vehicle-registration", hash: "" };
};

/**
 * Vehicle-service evergreen content belongs on TexasDefined.
 * Keep the legacy KeepTXRed URLs as permanent redirects so existing links and
 * search equity survive the ownership handoff.
 */
export const Route = createFileRoute("/vehicles")({
  beforeLoad: ({ location }) => {
    const destination = destinationForVehiclePath(location.pathname);
    throw redirect({
      href: `https://texasdefined.com${destination.path}${location.searchStr || ""}${destination.hash}`,
      statusCode: 301,
    });
  },
});
