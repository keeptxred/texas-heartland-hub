import {
  getContentSourceDiagnosticsFn,
  type SourceDiagnostics,
  type SourceDiagnosticRow,
} from "./contentSourceDiagnostics.functions";

export type { SourceDiagnostics, SourceDiagnosticRow };

function getAdminToken(): string {
  if (typeof window === "undefined") return "";
  return (
    sessionStorage.getItem("ktr-admin-passcode") ||
    (import.meta.env.VITE_ADMIN_PASSCODE as string) ||
    "keeptxred"
  );
}

export async function getContentSourceDiagnostics(): Promise<SourceDiagnostics> {
  const res = await getContentSourceDiagnosticsFn({ data: { token: getAdminToken() } });
  if (!res.ok) throw new Error(res.error);
  return res.diagnostics;
}
