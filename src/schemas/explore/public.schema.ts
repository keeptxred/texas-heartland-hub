import { z } from "zod";

const list = z.preprocess(
  (value) => (typeof value === "string" ? value.split(",").filter(Boolean) : value),
  z.array(z.string().trim().min(1).max(80)).max(20).optional(),
);

export const exploreSearchSchema = z
  .object({
    q: z.string().trim().max(120).optional(),
    types: list,
    regions: list,
    counties: list,
    activities: list,
    amenities: list,
    familyFriendly: z.coerce.boolean().optional(),
    petFriendly: z.coerce.boolean().optional(),
    accessible: z.coerce.boolean().optional(),
    fee: z.enum(["free", "required"]).optional(),
    lat: z.coerce.number().min(25.5).max(36.6).optional(),
    lng: z.coerce.number().min(-106.7).max(-93.4).optional(),
    radiusKm: z.coerce.number().min(1).max(500).optional(),
    page: z.coerce.number().int().min(1).max(10_000).default(1),
    pageSize: z.coerce.number().int().min(1).max(48).default(24),
    sort: z.enum(["relevance", "name", "distance"]).default("relevance"),
  })
  .refine((value) => (value.lat == null) === (value.lng == null), {
    message: "Latitude and longitude must be supplied together",
  });

export const tripPreferencesSchema = z.object({
  title: z.string().trim().min(1).max(160),
  startLocation: z.string().trim().max(160).optional(),
  region: z.string().trim().max(100).optional(),
  startDate: z.string().date().optional(),
  days: z.coerce.number().int().min(1).max(14),
  adults: z.coerce.number().int().min(1).max(20),
  children: z.coerce.number().int().min(0).max(20),
  pets: z.coerce.boolean(),
  rv: z.coerce.boolean(),
  accessible: z.coerce.boolean(),
  interests: z.array(z.string().trim().min(1).max(80)).min(1).max(12),
  maxDrivingKm: z.coerce.number().int().min(10).max(800),
  stopsPerDay: z.coerce.number().int().min(1).max(6).default(3),
});
