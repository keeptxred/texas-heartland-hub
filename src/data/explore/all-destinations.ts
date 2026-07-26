import type { ExploreEntity } from "@/types/explore/public";
import { exploreDestinations as curatedDestinations } from "./destinations";
import { destinations as coreDestinations } from "./catalog.core";
import { destinations as waterDestinations } from "./catalog.water";
import { destinations as additionalDestinations } from "./catalog.additional";

const destinationBySlug = new Map<string, ExploreEntity>();

for (const destination of [
  ...curatedDestinations,
  ...coreDestinations,
  ...waterDestinations,
  ...additionalDestinations,
]) {
  if (!destinationBySlug.has(destination.slug)) destinationBySlug.set(destination.slug, destination);
}

export const exploreDestinations = [...destinationBySlug.values()];
