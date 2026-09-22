import { createFileRoute, redirect } from "@tanstack/react-router";

const PLATE_GUIDE_PATHS = new Set([
  "/vehicles/plates",
  "/vehicles/personalized-plates",
  "/vehicles/disabled-parking",
  "/vehicles/farm-antique-specialty",
]);

const TITLE_GUIDE_PATHS = new Set([
  "/vehicles/title-transfer",
  "/vehicles/duplicate-titles",
  "/vehicles/buying-a-car",
  "/vehicles/buying-selling",
  "/vehicles/selling-a-car",
  "/vehicles/private-party-sales",
  "/vehicles/bonded-titles",
  "/vehicles/salvage-rebuilt-titles",
  "/vehicles/liens-duplicate-corrected-titles",
]);

const destinationForVehiclePath = (pathname: string) => {
  if (PLATE_GUIDE_PATHS.has(pathname)) {
    return { path: "/texas-vehicle-registration", hash: "#license-plates" };
  }
  if (TITLE_GUIDE_PATHS.has(pathname)) {
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
