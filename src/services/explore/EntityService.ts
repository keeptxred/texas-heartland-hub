import { ExploreDuplicateEntityError, ExploreValidationError } from "@/lib/explore/errors";
import { ensureExploreSlug } from "@/lib/explore/slug";
import {
  exploreEntityCreateSchema,
  exploreEntityUpdateSchema,
} from "@/schemas/explore/entity.schema";
import { entityRepository, type EntityRepository } from "@/repositories/explore/EntityRepository";
import type {
  ExploreEntity,
  ExploreEntityCreateInput,
  ExploreEntityUpdateInput,
} from "@/types/explore";

export class EntityService {
  constructor(private readonly repository: EntityRepository = entityRepository) {}

  async create(input: ExploreEntityCreateInput): Promise<ExploreEntity> {
    const parsed = exploreEntityCreateSchema.safeParse(input);
    if (!parsed.success) {
      throw new ExploreValidationError("Explore entity validation failed.", {
        issues: parsed.error.flatten(),
      });
    }

    const slug = parsed.data.slug ?? ensureExploreSlug(parsed.data.name);
    const existing = await this.repository.findBySlug(slug);
    if (existing) {
      throw new ExploreDuplicateEntityError(`An Explore entity already uses the slug "${slug}".`, {
        slug,
        existingEntityId: existing.id,
      });
    }

    return this.repository.create({ ...parsed.data, slug });
  }

  async update(id: string, input: ExploreEntityUpdateInput): Promise<ExploreEntity> {
    const parsed = exploreEntityUpdateSchema.safeParse(input);
    if (!parsed.success) {
      throw new ExploreValidationError("Explore entity validation failed.", {
        issues: parsed.error.flatten(),
      });
    }

    if (parsed.data.slug) {
      const existing = await this.repository.findBySlug(parsed.data.slug);
      if (existing && existing.id !== id) {
        throw new ExploreDuplicateEntityError(
          `An Explore entity already uses the slug "${parsed.data.slug}".`,
          { slug: parsed.data.slug, existingEntityId: existing.id },
        );
      }
    }

    return this.repository.update(id, parsed.data);
  }

  async publish(id: string): Promise<ExploreEntity> {
    return this.repository.update(id, {
      status: "published",
      visibility: "public",
    });
  }

  async verify(id: string): Promise<ExploreEntity> {
    const entity = await this.repository.requireById(id);
    if (entity.status !== "published" && entity.status !== "verified") {
      throw new ExploreValidationError("Only published entities can be verified.", {
        entityId: id,
        status: entity.status,
      });
    }

    return this.repository.update(id, {
      status: "verified",
      visibility: "public",
    });
  }

  async archive(id: string): Promise<ExploreEntity> {
    return this.repository.archive(id);
  }
}

export const entityService = new EntityService();
