import {
  addReelCandidateFn,
  listReelCandidatesFn,
  updateReelCandidateStatusFn,
  deleteReelCandidateFn,
  type ReelCandidate,
} from "./reelCandidates.functions";

export type { ReelCandidate };

export type ReelStatus = "NEW" | "APPROVED" | "SKIPPED";

function getAdminToken(): string {
  if (typeof window === "undefined") return "";
  return (
    sessionStorage.getItem("ktr-admin-passcode") ||
    (import.meta.env.VITE_ADMIN_PASSCODE as string) ||
    "keeptxred"
  );
}

export async function addReelCandidate(input: {
  source_platform: string;
  source_account: string;
  source_url: string;
  title?: string | null;
  topic?: string | null;
  notes?: string | null;
}): Promise<ReelCandidate> {
  const res = await addReelCandidateFn({ data: { token: getAdminToken(), ...input } });
  if (!res.ok) throw new Error(res.error);
  return res.row;
}

export async function listReelCandidates(): Promise<ReelCandidate[]> {
  const res = await listReelCandidatesFn({ data: { token: getAdminToken() } });
  if (!res.ok) throw new Error(res.error);
  return res.rows;
}

export async function setReelCandidateStatus(id: string, status: ReelStatus): Promise<void> {
  const res = await updateReelCandidateStatusFn({ data: { token: getAdminToken(), id, status } });
  if (!res.ok) throw new Error(res.error);
}

export async function deleteReelCandidate(id: string): Promise<void> {
  const res = await deleteReelCandidateFn({ data: { token: getAdminToken(), id } });
  if (!res.ok) throw new Error(res.error);
}