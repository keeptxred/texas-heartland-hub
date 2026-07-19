import {
  addContentSourceFn,
  listContentSourcesFn,
  updateContentSourceFn,
  deleteContentSourceFn,
  type ContentSource,
} from "./contentSources.functions";

export type { ContentSource };

export type ContentSourceInput = {
  platform: string;
  source_name: string;
  source_url?: string | null;
  category?: string | null;
  notes?: string | null;
};

function getAdminToken(): string {
  if (typeof window === "undefined") return "";
  return (
    sessionStorage.getItem("ktr-admin-passcode") ||
    (import.meta.env.VITE_ADMIN_PASSCODE as string) ||
    "keeptxred"
  );
}

export async function addContentSource(input: ContentSourceInput): Promise<ContentSource> {
  const res = await addContentSourceFn({ data: { token: getAdminToken(), ...input } });
  if (!res.ok) throw new Error(res.error);
  return res.row;
}

export async function listContentSources(): Promise<ContentSource[]> {
  const res = await listContentSourcesFn({ data: { token: getAdminToken() } });
  if (!res.ok) throw new Error(res.error);
  return res.rows;
}

export async function updateContentSource(id: string, input: ContentSourceInput): Promise<ContentSource> {
  const res = await updateContentSourceFn({ data: { token: getAdminToken(), id, ...input } });
  if (!res.ok) throw new Error(res.error);
  return res.row;
}

export async function deleteContentSource(id: string): Promise<void> {
  const res = await deleteContentSourceFn({ data: { token: getAdminToken(), id } });
  if (!res.ok) throw new Error(res.error);
}