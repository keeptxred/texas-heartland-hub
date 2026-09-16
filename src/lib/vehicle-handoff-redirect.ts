const VEHICLE_HANDOFF_DESTINATIONS = new Map([
  ["/vehicles/registration", "https://texasdefined.com/texas-vehicle-registration"],
  ["/vehicles/renewal", "https://texasdefined.com/texas-vehicle-registration-renewal"],
  ["/vehicles/registration-fees-taxes", "https://texasdefined.com/texas-vehicle-registration-fees-taxes"],
  ["/vehicles/new-residents", "https://texasdefined.com/find-my-dmv"],
  ["/dmv", "https://texasdefined.com/texas-dmv"],
]);

function normalizePathname(pathname: string): string {
  if (pathname === "/") return pathname;
  return pathname.endsWith("/") ? pathname.replace(/\/+$/, "") || "/" : pathname;
}

export function buildVehicleHandoffLocation(requestUrl: string | URL): string | null {
  const source = requestUrl instanceof URL ? requestUrl : new URL(requestUrl);
  const destination = VEHICLE_HANDOFF_DESTINATIONS.get(normalizePathname(source.pathname).toLowerCase());
  if (!destination) return null;

  // These are permanent ownership transfers, so preserve the complete original
  // query string instead of passing through the normal KTR tracking cleanup.
  return `${destination}${source.search}`;
}
