import { listSocialConnectionsFn, type SocialConnection } from "./socialConnections.functions";

export type { SocialConnection };

function getAdminToken(): string {
  if (typeof window === "undefined") return "";
  return (
    sessionStorage.getItem("ktr-admin-passcode") ||
    (import.meta.env.VITE_ADMIN_PASSCODE as string) ||
    "keeptxred"
  );
}

export async function listSocialConnections(): Promise<SocialConnection[]> {
  const res = await listSocialConnectionsFn({ data: { token: getAdminToken() } });
  if (!res.ok) throw new Error(res.error);
  return res.rows;
}