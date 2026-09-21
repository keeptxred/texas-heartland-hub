const VEHICLE_HANDOFF_DESTINATIONS = new Map([
  ["/vehicles/registration", "https://texasdefined.com/texas-vehicle-registration"],
  ["/vehicles/renewal", "https://texasdefined.com/texas-vehicle-registration-renewal"],
  ["/vehicles/registration-fees-taxes", "https://texasdefined.com/texas-vehicle-registration-fees-taxes"],
  ["/vehicles/new-residents", "https://texasdefined.com/find-my-dmv"],
  ["/vehicles/auto-insurance-requirements", "https://texasdefined.com/texas-vehicle-registration"],
  ["/vehicles/bonded-titles", "https://texasdefined.com/texas-vehicle-registration"],
  ["/vehicles/buying-a-car", "https://texasdefined.com/texas-vehicle-registration"],
  ["/vehicles/buying-selling", "https://texasdefined.com/texas-vehicle-registration"],
  ["/vehicles/commercial-fleet-irp", "https://texasdefined.com/texas-vehicle-registration"],
  ["/vehicles/disabled-parking", "https://texasdefined.com/texas-vehicle-registration"],
  ["/vehicles/duplicate-titles", "https://texasdefined.com/texas-vehicle-registration#title-transfer"],
  ["/vehicles/farm-antique-specialty", "https://texasdefined.com/texas-vehicle-registration"],
  ["/vehicles/financial-responsibility", "https://texasdefined.com/texas-vehicle-registration"],
  ["/vehicles/inspections", "https://texasdefined.com/texas-vehicle-registration"],
  ["/vehicles/inspections-emissions", "https://texasdefined.com/texas-vehicle-registration"],
  ["/vehicles/liens-duplicate-corrected-titles", "https://texasdefined.com/texas-vehicle-registration"],
  ["/vehicles/personalized-plates", "https://texasdefined.com/texas-vehicle-registration"],
  ["/vehicles/plates", "https://texasdefined.com/texas-vehicle-registration#license-plates"],
  ["/vehicles/private-party-sales", "https://texasdefined.com/texas-vehicle-registration"],
  ["/vehicles/salvage-rebuilt-titles", "https://texasdefined.com/texas-vehicle-registration"],
  ["/vehicles/selling-a-car", "https://texasdefined.com/texas-vehicle-registration"],
  ["/vehicles/temporary-tags", "https://texasdefined.com/texas-vehicle-registration"],
  ["/vehicles/title-transfer", "https://texasdefined.com/texas-vehicle-registration#title-transfer"],
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
  const hashIndex = destination.indexOf("#");
  if (hashIndex < 0) return `${destination}${source.search}`;
  return `${destination.slice(0, hashIndex)}${source.search}${destination.slice(hashIndex)}`;
}
