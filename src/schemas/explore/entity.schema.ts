import { z } from 'zod';

import {
  EXPLORE_ENTITY_STATUSES,
  EXPLORE_VISIBILITIES,
} from '@/types/explore';

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const exploreEntityStatusSchema = z.enum(EXPLORE_ENTITY_STATUSES);
export const exploreVisibilitySchema = z.enum(EXPLORE_VISIBILITIES);

export const exploreSlugSchema = z
  .string()
  .trim()
  .min(1, 'Slug is required.')
  .max(180, 'Slug must be 180 characters or fewer.')
  .regex(slugPattern, 'Slug must use lowercase letters, numbers, and hyphens only.');

export const exploreEntityCreateSchema = z
  .object({
    entityTypeId: z.string().uuid(),
    name: z.string().trim().min(2).max(180),
    slug: exploreSlugSchema.optional(),
    alternateNames: z.array(z.string().trim().min(1).max(180)).max(50).default([]),
    shortDescription: z.string().trim().max(320).nullable().optional(),
    longDescription: z.string().trim().max(50_000).nullable().optional(),
    summary: z.string().trim().max(1_000).nullable().optional(),
    status: exploreEntityStatusSchema.default('draft'),
    visibility: exploreVisibilitySchema.default('internal'),
    sourceConfidence: z.number().int().min(0).max(100).default(0),
    featured: z.boolean().default(false),
    popularityScore: z.number().min(0).default(0),
    ownerUserId: z.string().uuid().nullable().optional(),
  })
  .superRefine((value, context) => {
    if (
      value.visibility === 'public' &&
      value.status !== 'published' &&
      value.status !== 'verified'
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['visibility'],
        message: 'Public entities must be published or verified.',
      });
    }
  });

export const exploreEntityUpdateSchema = exploreEntityCreateSchema
  .partial()
  .superRefine((value, context) => {
    if (
      value.visibility === 'public' &&
      value.status !== undefined &&
      value.status !== 'published' &&
      value.status !== 'verified'
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['visibility'],
        message: 'Public entities must be published or verified.',
      });
    }
  });

export const exploreEntityListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
  type: z.string().trim().min(1).optional(),
  status: exploreEntityStatusSchema.optional(),
  visibility: exploreVisibilitySchema.optional(),
  featured: z.coerce.boolean().optional(),
  query: z.string().trim().max(200).optional(),
  categorySlugs: z.array(z.string().trim().min(1)).max(25).optional(),
  tagSlugs: z.array(z.string().trim().min(1)).max(25).optional(),
});

export type ExploreEntityCreateValues = z.infer<typeof exploreEntityCreateSchema>;
export type ExploreEntityUpdateValues = z.infer<typeof exploreEntityUpdateSchema>;
export type ExploreEntityListQuery = z.infer<typeof exploreEntityListQuerySchema>;
