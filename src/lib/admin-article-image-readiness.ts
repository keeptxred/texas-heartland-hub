import { isLegacyGeneratedNewsAsset } from "./facebook-image-readiness";

export type AdminArticleImageReadiness = {
  failed: boolean;
  legacyPlaceholder: boolean;
  needsImage: boolean;
};

export function assessAdminArticleImage(
  featuredImageUrl: string | null | undefined,
  imageGenerationStatus: string | null | undefined,
): AdminArticleImageReadiness {
  const failed = imageGenerationStatus?.trim().toLowerCase() === "failed";
  const legacyPlaceholder = isLegacyGeneratedNewsAsset(featuredImageUrl);

  return {
    failed,
    legacyPlaceholder,
    needsImage: failed || !featuredImageUrl || legacyPlaceholder,
  };
}
