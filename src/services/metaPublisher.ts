import {
  publishFacebookPostFn,
  publishInstagramPostFn,
  type PublishResult,
} from "./metaPublisher.functions";

export type { PublishResult };

function getAdminToken(): string {
  if (typeof window === "undefined") return "";
  return (
    sessionStorage.getItem("ktr-admin-passcode") ||
    (import.meta.env.VITE_ADMIN_PASSCODE as string) ||
    "keeptxred"
  );
}

export function publishToFacebook(input: { package_id: string; queue_id?: string }): Promise<PublishResult> {
  return publishFacebookPostFn({ data: { token: getAdminToken(), ...input } });
}

export function publishToInstagram(input: { package_id: string; queue_id?: string }): Promise<PublishResult> {
  return publishInstagramPostFn({ data: { token: getAdminToken(), ...input } });
}