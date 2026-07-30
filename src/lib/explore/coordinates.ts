import type { ExploreCoordinates } from '@/types/explore';

const EARTH_RADIUS_MILES = 3_958.7613;

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}

export function isValidLatitude(latitude: number): boolean {
  return Number.isFinite(latitude) && latitude >= -90 && latitude <= 90;
}

export function isValidLongitude(longitude: number): boolean {
  return Number.isFinite(longitude) && longitude >= -180 && longitude <= 180;
}

export function assertValidCoordinates(coordinates: ExploreCoordinates): void {
  if (!isValidLatitude(coordinates.latitude)) {
    throw new RangeError('Latitude must be between -90 and 90.');
  }

  if (!isValidLongitude(coordinates.longitude)) {
    throw new RangeError('Longitude must be between -180 and 180.');
  }
}

export function distanceMiles(
  origin: ExploreCoordinates,
  destination: ExploreCoordinates,
): number {
  assertValidCoordinates(origin);
  assertValidCoordinates(destination);

  const latitudeDelta = toRadians(destination.latitude - origin.latitude);
  const longitudeDelta = toRadians(destination.longitude - origin.longitude);
  const originLatitude = toRadians(origin.latitude);
  const destinationLatitude = toRadians(destination.latitude);

  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(originLatitude) *
      Math.cos(destinationLatitude) *
      Math.sin(longitudeDelta / 2) ** 2;

  return 2 * EARTH_RADIUS_MILES * Math.asin(Math.sqrt(haversine));
}

export function boundingBox(
  center: ExploreCoordinates,
  radiusMiles: number,
): {
  minLatitude: number;
  maxLatitude: number;
  minLongitude: number;
  maxLongitude: number;
} {
  assertValidCoordinates(center);

  if (!Number.isFinite(radiusMiles) || radiusMiles <= 0) {
    throw new RangeError('Radius must be greater than zero.');
  }

  const latitudeDelta = radiusMiles / 69;
  const longitudeScale = Math.max(Math.cos(toRadians(center.latitude)), 0.01);
  const longitudeDelta = radiusMiles / (69.172 * longitudeScale);

  return {
    minLatitude: Math.max(-90, center.latitude - latitudeDelta),
    maxLatitude: Math.min(90, center.latitude + latitudeDelta),
    minLongitude: Math.max(-180, center.longitude - longitudeDelta),
    maxLongitude: Math.min(180, center.longitude + longitudeDelta),
  };
}
