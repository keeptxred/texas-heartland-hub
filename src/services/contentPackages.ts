import {
  saveContentPackageFn,
  listContentPackagesFn,
  deleteContentPackageFn,
  updateContentPackageAssetFn,
  updateContentPackageWorkflowFn,
  type SavedPackage,
} from "./contentPackages.functions";
import type { ContentAIResult } from "./contentAI";

export type { SavedPackage };
export type WorkflowStatus = "DRAFT" | "ASSET_READY" | "READY_TO_POST" | "PUBLISHED";
export type AssetType = "IMAGE" | "REEL";

function getAdminToken(): string {
  if (typeof window === "undefined") return "";
  return (
    sessionStorage.getItem("ktr-admin-passcode") ||
    (import.meta.env.VITE_ADMIN_PASSCODE as string) ||
    "keeptxred"
  );
}

export async function saveContentPackage(input: {
  sourceTitle: string;
  sourceUrl?: string | null;
  category?: string | null;
  ai: ContentAIResult;
}): Promise<string> {
  const res = await saveContentPackageFn({
    data: {
      token: getAdminToken(),
      source_title: input.sourceTitle,
      source_url: input.sourceUrl ?? null,
      category: input.category ?? null,
      facebook: {
        hook: input.ai.facebookPost.hook,
        body: input.ai.facebookPost.body,
        cta: input.ai.facebookPost.callToAction,
        hashtags: input.ai.facebookPost.hashtags.join(" "),
      },
      instagram: {
        hook: input.ai.instagramReel.hook,
        script: input.ai.instagramReel.script,
        caption: input.ai.instagramReel.caption,
        hashtags: input.ai.instagramReel.hashtags.join(" "),
      },
      seo: {
        title: input.ai.seoPackage.title,
        description: input.ai.seoPackage.metaDescription,
        keywords: input.ai.seoPackage.suggestedKeywords.join(", "),
      },
    },
  });
  if (!res.ok) throw new Error(res.error);
  return res.id;
}

export async function listContentPackages(): Promise<SavedPackage[]> {
  const res = await listContentPackagesFn({ data: { token: getAdminToken() } });
  if (!res.ok) throw new Error(res.error);
  return res.rows;
}

export async function deleteContentPackage(id: string): Promise<void> {
  const res = await deleteContentPackageFn({ data: { token: getAdminToken(), id } });
  if (!res.ok) throw new Error(res.error);
}

export async function updateContentPackageAsset(input: {
  id: string;
  asset_type: AssetType | null;
  asset_url?: string | null;
  asset_source_account?: string | null;
  asset_notes?: string | null;
}): Promise<void> {
  const res = await updateContentPackageAssetFn({ data: { token: getAdminToken(), ...input } });
  if (!res.ok) throw new Error(res.error);
}

export async function setContentPackageWorkflow(id: string, workflow_status: WorkflowStatus): Promise<void> {
  const res = await updateContentPackageWorkflowFn({
    data: { token: getAdminToken(), id, workflow_status },
  });
  if (!res.ok) throw new Error(res.error);
}