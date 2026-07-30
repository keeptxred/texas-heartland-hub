export interface CoordinatePoint {
  latitude: number;
  longitude: number;
}

export interface NearbyCandidate extends CoordinatePoint {
  id: string;
}

export interface NearbyResult {
  id: string;
  distanceMiles: number;
}

const EARTH_RADIUS_MILES = 3958.7613;

export function haversineMiles(left: CoordinatePoint, right: CoordinatePoint): number {
  validateCoordinate(left);
  validateCoordinate(right);

  const latitudeDelta = toRadians(right.latitude - left.latitude);
  const longitudeDelta = toRadians(right.longitude - left.longitude);
  const leftLatitude = toRadians(left.latitude);
  const rightLatitude = toRadians(right.latitude);

  const a = Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(leftLatitude) * Math.cos(rightLatitude) * Math.sin(longitudeDelta / 2) ** 2;

  return EARTH_RADIUS_MILES * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function findNearby(
  origin: CoordinatePoint,
  candidates: readonly NearbyCandidate[],
  radiusMiles: number,
  limit = 25,
): NearbyResult[] {
  if (!Number.isFinite(radiusMiles) || radiusMiles <= 0) {
    throw new RangeError("radiusMiles must be greater than zero");
  }
  if (!Number.isInteger(limit) || limit <= 0) {
    throw new RangeError("limit must be a positive integer");
  }

  return candidates
    .map((candidate) => ({ id: candidate.id, distanceMiles: haversineMiles(origin, candidate) }))
    .filter((candidate) => candidate.distanceMiles <= radiusMiles)
    .sort((left, right) => left.distanceMiles - right.distanceMiles || left.id.localeCompare(right.id))
    .slice(0, limit);
}

function validateCoordinate(point: CoordinatePoint): void {
  if (!Number.isFinite(point.latitude) || point.latitude < -90 || point.latitude > 90) {
    throw new RangeError("latitude must be between -90 and 90");
  }
  if (!Number.isFinite(point.longitude) || point.longitude < -180 || point.longitude > 180) {
    throw new RangeError("longitude must be between -180 and 180");
  }
}

function toRadians(value: number): number {
  return value * Math.PI / 180;
}
