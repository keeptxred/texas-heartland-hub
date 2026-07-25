import { z } from "zod";

export const importSourceTypeSchema = z.enum([
  "tpwd", "nps", "usace", "usfs", "thc", "usgs", "noaa", "twdb", "osm",
  "county_gis", "municipality", "tourism", "custom",
]);

export const importExecutionModeSchema = z.enum(["live", "dry-run", "preview"]);
export const importModeSchema = z.enum(["scheduled", "manual", "bulk"]);

export const importSourceConfigSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(2).max(160),
  type: importSourceTypeSchema,
  enabled: z.boolean(),
  endpoint: z.string().url(),
  schedule: z.string().trim().min(5).optional(),
  auth: z.object({
    type: z.enum(["none", "api-key", "bearer", "basic"]),
    secretName: z.string().trim().min(1).optional(),
  }).optional(),
  headers: z.record(z.string()).optional(),
  query: z.record(z.string()).optional(),
  timeoutMs: z.number().int().min(1_000).max(120_000).default(30_000),
  retry: z.object({
    attempts: z.number().int().min(1).max(10).default(3),
    baseDelayMs: z.number().int().min(100).max(30_000).default(500),
    maxDelayMs: z.number().int().min(500).max(120_000).default(10_000),
  }).default({ attempts: 3, baseDelayMs: 500, maxDelayMs: 10_000 }),
  cursor: z.object({ field: z.string().min(1), value: z.string().optional() }).optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const importEntityDraftSchema = z.object({
  externalId: z.string().trim().min(1).max(500),
  entityType: z.string().trim().min(1).max(100),
  name: z.string().trim().min(2).max(300),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  description: z.string().max(30_000).nullable().optional(),
  latitude: z.number().min(-90).max(90).nullable().optional(),
  longitude: z.number().min(-180).max(180).nullable().optional(),
  address: z.record(z.unknown()).nullable().optional(),
  taxonomy: z.array(z.string().trim().min(1)).default([]),
  relationships: z.array(z.object({
    type: z.string().trim().min(1),
    targetExternalId: z.string().trim().min(1),
  })).default([]),
  media: z.array(z.object({
    url: z.string().url(),
    type: z.enum(["image", "video", "document"]),
    title: z.string().max(300).optional(),
  })).default([]),
  sourceUpdatedAt: z.string().datetime({ offset: true }).nullable().optional(),
  sourceUrl: z.string().url().nullable().optional(),
  metadata: z.record(z.unknown()).default({}),
  raw: z.unknown(),
}).superRefine((value, context) => {
  const hasLatitude = value.latitude !== null && value.latitude !== undefined;
  const hasLongitude = value.longitude !== null && value.longitude !== undefined;
  if (hasLatitude !== hasLongitude) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Latitude and longitude must be supplied together",
      path: hasLatitude ? ["longitude"] : ["latitude"],
    });
  }
});

export const importRunRequestSchema = z.object({
  sourceId: z.string().uuid(),
  mode: importModeSchema.default("manual"),
  executionMode: importExecutionModeSchema.default("live"),
});

export type ImportRunRequest = z.infer<typeof importRunRequestSchema>;
