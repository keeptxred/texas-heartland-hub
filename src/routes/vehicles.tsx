import { createFileRoute, redirect } from "@tanstack/react-router";

const destinationForVehiclePath = (pathname: string) => {
  if (pathname === "/vehicles/plates") return "/texas-vehicle-registration#license-plates";
  if (pathname === "/vehicles/title-transfer" || pathname === "/vehicles/duplicate-titles") {
    return "/texas-vehicle-registration#title-transfer";
  }
  return "/texas-vehicle-registration";
};

/**
 * Vehicle-service evergreen content belongs on TexasDefined.
 * Keep the legacy KeepTXRed URLs as permanent redirects so existing links and
 * search equity survive the ownership handoff.
 */
export const Route = createFileRoute("/vehicles")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com${destinationForVehiclePath(location.pathname)}${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
