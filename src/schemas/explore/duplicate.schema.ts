import { z } from 'zod';

export const uuidSchema = z.string().uuid('Must be a valid UUID');

export const exploreMergeRequestSchema = z
  .object({
    candidateId: uuidSchema,
    survivorId: uuidSchema,
    reason: z
      .string()
      .trim()
      .max(1000, 'Reason must be 1000 characters or fewer')
      .optional()
      .nullable()
      .transform((v) => (v ? v : null)),
  })
  .strict()
  .refine((v) => v.candidateId !== v.survivorId, {
    message: 'candidateId and survivorId must differ',
    path: ['survivorId'],
  });

export type ExploreMergeRequestValidated = z.infer<typeof exploreMergeRequestSchema>;

export const exploreDuplicateListQuerySchema = z.object({
  status: z
    .enum(['pending', 'merged', 'not_duplicate', 'deferred'])
    .optional()
    .default('pending'),
  page: z.number().int().positive().max(1000).optional().default(1),
  pageSize: z.number().int().positive().max(100).optional().default(25),
  search: z.string().trim().max(200).optional(),
});

export type ExploreDuplicateListQuery = z.infer<typeof exploreDuplicateListQuerySchema>;
