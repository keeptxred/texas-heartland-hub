export const VEHICLE_HANDOFF_DESTINATIONS: Readonly<Record<string, string>> = {
  "/vehicles/registration": "https://texasdefined.com/texas-vehicle-registration",
  "/vehicles/renewal": "https://texasdefined.com/texas-vehicle-registration-renewal",
  "/vehicles/registration-fees-taxes": "https://texasdefined.com/texas-vehicle-registration-fees-taxes",
  "/vehicles/new-residents": "https://texasdefined.com/find-my-dmv",
  "/dmv": "https://texasdefined.com/texas-dmv",

  // Retired KTR vehicle evergreen routes. These mirror the historical
  // /vehicles parent-route handoff exactly so direct requests and client
  // navigation resolve to the same TexasDefined owner.
  "/vehicles/auto-insurance-requirements": "https://texasdefined.com/texas-vehicle-registration",
  "/vehicles/bonded-titles": "https://texasdefined.com/texas-vehicle-registration",
  "/vehicles/buying-a-car": "https://texasdefined.com/texas-vehicle-registration",
  "/vehicles/buying-selling": "https://texasdefined.com/texas-vehicle-registration",
  "/vehicles/commercial-fleet-irp": "https://texasdefined.com/texas-vehicle-registration",
  "/vehicles/disabled-parking": "https://texasdefined.com/texas-vehicle-registration",
  "/vehicles/duplicate-titles": "https://texasdefined.com/texas-vehicle-registration#title-transfer",
  "/vehicles/farm-antique-specialty": "https://texasdefined.com/texas-vehicle-registration",
  "/vehicles/financial-responsibility": "https://texasdefined.com/texas-vehicle-registration",
  "/vehicles/inspections": "https://texasdefined.com/texas-vehicle-registration",
  "/vehicles/inspections-emissions": "https://texasdefined.com/texas-vehicle-registration",
  "/vehicles/liens-duplicate-corrected-titles": "https://texasdefined.com/texas-vehicle-registration",
  "/vehicles/personalized-plates": "https://texasdefined.com/texas-vehicle-registration",
  "/vehicles/plates": "https://texasdefined.com/texas-vehicle-registration#license-plates",
  "/vehicles/private-party-sales": "https://texasdefined.com/texas-vehicle-registration",
  "/vehicles/salvage-rebuilt-titles": "https://texasdefined.com/texas-vehicle-registration",
  "/vehicles/selling-a-car": "https://texasdefined.com/texas-vehicle-registration",
  "/vehicles/temporary-tags": "https://texasdefined.com/texas-vehicle-registration",
  "/vehicles/title-transfer": "https://texasdefined.com/texas-vehicle-registration#title-transfer",
};

export const RETIRED_VEHICLE_EVERGREEN_PATHS = Object.freeze([
  "/vehicles/auto-insurance-requirements",
  "/vehicles/bonded-titles",
  "/vehicles/buying-a-car",
  "/vehicles/buying-selling",
  "/vehicles/commercial-fleet-irp",
  "/vehicles/disabled-parking",
  "/vehicles/duplicate-titles",
  "/vehicles/farm-antique-specialty",
  "/vehicles/financial-responsibility",
  "/vehicles/inspections",
  "/vehicles/inspections-emissions",
  "/vehicles/liens-duplicate-corrected-titles",
  "/vehicles/personalized-plates",
  "/vehicles/plates",
  "/vehicles/private-party-sales",
  "/vehicles/salvage-rebuilt-titles",
  "/vehicles/selling-a-car",
  "/vehicles/temporary-tags",
  "/vehicles/title-transfer",
] as const);

function normalizePathname(pathname: string): string {
  if (pathname === "/") return pathname;
  return pathname.endsWith("/") ? pathname.replace(/\/+$/, "") || "/" : pathname;
}

function appendSearchBeforeHash(destination: string, search: string): string {
  if (!search) return destination;
  const hashIndex = destination.indexOf("#");
  if (hashIndex < 0) return `${destination}${search}`;
  return `${destination.slice(0, hashIndex)}${search}${destination.slice(hashIndex)}`;
}

export function buildVehicleHandoffLocation(requestUrl: string | URL): string | null {
  const source = requestUrl instanceof URL ? requestUrl : new URL(requestUrl);
  const destination =
    VEHICLE_HANDOFF_DESTINATIONS[normalizePathname(source.pathname).toLowerCase()];
  if (!destination) return null;

  // Preserve the exact original query bytes and keep query parameters before
  // any destination fragment such as #title-transfer or #license-plates.
  return appendSearchBeforeHash(destination, source.search);
}
