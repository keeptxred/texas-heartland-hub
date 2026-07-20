import { publishFeedItemFn, type PublishArticleResult } from "./publishArticle.functions";

export type { PublishArticleResult };

function getAdminToken(): string {
  if (typeof window === "undefined") return "";
  return (
    sessionStorage.getItem("ktr-admin-passcode") ||
    (import.meta.env.VITE_ADMIN_PASSCODE as string) ||
    "keeptxred"
  );
}

export function publishFeedItem(feed_item_id: number): Promise<PublishArticleResult> {
  return publishFeedItemFn({ data: { token: getAdminToken(), feed_item_id } });
}
