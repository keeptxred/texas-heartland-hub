import {
  addQueueEntryFn,
  listQueueEntriesFn,
  updateQueueStatusFn,
  deleteQueueEntryFn,
  type QueueEntry,
  type QueueStatus,
} from "./publishingQueue.functions";

export type { QueueEntry, QueueStatus };

function getAdminToken(): string {
  if (typeof window === "undefined") return "";
  return (
    sessionStorage.getItem("ktr-admin-passcode") ||
    (import.meta.env.VITE_ADMIN_PASSCODE as string) ||
    "keeptxred"
  );
}

export async function addQueueEntry(input: {
  content_package_id: string;
  platform: string;
  notes?: string | null;
}): Promise<QueueEntry> {
  const res = await addQueueEntryFn({ data: { token: getAdminToken(), ...input } });
  if (!res.ok) throw new Error(res.error);
  return res.row;
}

export async function listQueueEntries(): Promise<QueueEntry[]> {
  const res = await listQueueEntriesFn({ data: { token: getAdminToken() } });
  if (!res.ok) throw new Error(res.error);
  return res.rows;
}

export async function setQueueStatus(id: string, status: QueueStatus): Promise<void> {
  const res = await updateQueueStatusFn({ data: { token: getAdminToken(), id, status } });
  if (!res.ok) throw new Error(res.error);
}

export async function deleteQueueEntry(id: string): Promise<void> {
  const res = await deleteQueueEntryFn({ data: { token: getAdminToken(), id } });
  if (!res.ok) throw new Error(res.error);
}