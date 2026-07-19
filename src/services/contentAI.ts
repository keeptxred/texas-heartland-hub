import { generateContentPackageFn, type ContentAIResult } from "./contentAI.functions";

export type ContentItem = {
  headline: string;
  source?: string;
  description?: string;
  category?: string;
  publishedAt?: string;
};

export type { ContentAIResult };

function getAdminToken(): string {
  if (typeof window === "undefined") return "";
  return (
    sessionStorage.getItem("ktr-admin-passcode") ||
    (import.meta.env.VITE_ADMIN_PASSCODE as string) ||
    "keeptxred"
  );
}

export async function generateContentPackage(item: ContentItem): Promise<ContentAIResult> {
  const res = await generateContentPackageFn({
    data: {
      token: getAdminToken(),
      headline: item.headline,
      source: item.source ?? "",
      description: item.description ?? "",
      category: item.category ?? "",
      publishedAt: item.publishedAt ?? "",
    },
  });
  if (!res.ok) throw new Error(res.error);
  return res.data;
}