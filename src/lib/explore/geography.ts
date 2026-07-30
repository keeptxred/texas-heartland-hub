import type { ExploreEntityCard } from "@/types/explore/public";

export function haversineKm(
  from: { latitude: number; longitude: number },
  to: { latitude: number; longitude: number },
): number {
  const radians = (degrees: number) => degrees * (Math.PI / 180);
  const latitudeDelta = radians(to.latitude - from.latitude);
  const longitudeDelta = radians(to.longitude - from.longitude);
  const value =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(radians(from.latitude)) *
      Math.cos(radians(to.latitude)) *
      Math.sin(longitudeDelta / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}

export function orderStopsForRoute(items: ExploreEntityCard[]): ExploreEntityCard[] {
  if (items.length < 3) return [...items];
  const remaining = [...items.slice(1)];
  const ordered = [items[0]];
  while (remaining.length) {
    const current = ordered[ordered.length - 1];
    if (current.latitude == null || current.longitude == null) {
      ordered.push(remaining.shift()!);
      continue;
    }
    let closest = 0;
    let closestDistance = Number.POSITIVE_INFINITY;
    remaining.forEach((candidate, index) => {
      if (candidate.latitude == null || candidate.longitude == null) return;
      const distance = haversineKm(
        { latitude: current.latitude!, longitude: current.longitude! },
        { latitude: candidate.latitude, longitude: candidate.longitude },
      );
      if (distance < closestDistance) {
        closest = index;
        closestDistance = distance;
      }
    });
    ordered.push(...remaining.splice(closest, 1));
  }
  return ordered;
}
