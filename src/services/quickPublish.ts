import { quickPublishToFacebookFn, type QuickPublishResult } from "./quickPublish.functions";

export type { QuickPublishResult };

function getAdminToken(): string {
  if (typeof window === "undefined") return "";
  return (
    sessionStorage.getItem("ktr-admin-passcode") ||
    (import.meta.env.VITE_ADMIN_PASSCODE as string) ||
    "keeptxred"
  );
}

export function quickPublishToFacebook(input: {
  headline: string;
  source?: string;
  source_url?: string | null;
  feed_item_id?: number | null;
  caption?: string;
  asset_url?: string | null;
  slug?: string | null;
}): Promise<QuickPublishResult> {
  return quickPublishToFacebookFn({
    data: {
      token: getAdminToken(),
      headline: input.headline,
      source: input.source ?? "",
      source_url: input.source_url ?? null,
      feed_item_id: input.feed_item_id ?? null,
      caption: input.caption ?? "",
      asset_url: input.asset_url ?? null,
      slug: input.slug ?? null,
    },
  });
}