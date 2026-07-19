import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { listSocialConnections, type SocialConnection } from "@/services/socialConnections";

type PlatformKey = "facebook" | "instagram";

const PLATFORMS: Array<{
  key: PlatformKey;
  label: string;
  placeholder: string;
  connectLabel: string;
}> = [
  {
    key: "facebook",
    label: "Facebook Page",
    placeholder: "No Facebook Page linked",
    connectLabel: "Connect Facebook",
  },
  {
    key: "instagram",
    label: "Instagram Account",
    placeholder: "No Instagram account linked",
    connectLabel: "Connect Instagram",
  },
];

function statusBadge(status: string) {
  const normalized = status.toUpperCase().replace(/_/g, " ");
  const isConnected = status === "CONNECTED";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
        isConnected ? "bg-emerald-100 text-emerald-800" : "bg-neutral-200 text-neutral-700"
      }`}
    >
      {normalized}
    </span>
  );
}

export function MetaConnectionManager() {
  const [rows, setRows] = useState<SocialConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    listSocialConnections()
      .then((r) => {
        if (!cancelled) setRows(r);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function findRow(key: PlatformKey): SocialConnection | undefined {
    return rows.find((r) => r.platform.toLowerCase() === key);
  }

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold">Social Connections</h2>
        <p className="text-sm text-neutral-600">
          Manage Meta account connections used for future publishing. No credentials are stored yet.
        </p>
      </div>

      {error ? (
        <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      ) : null}
      {notice ? (
        <div className="mb-4 rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          {notice}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {PLATFORMS.map((p) => {
          const row = findRow(p.key);
          const status = row?.connection_status ?? "NOT_CONNECTED";
          return (
            <div key={p.key} className="rounded border border-neutral-200 p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-semibold">{p.label}</h3>
                {statusBadge(status)}
              </div>
              <p className="mb-3 text-sm text-neutral-600">
                {row?.account_name || p.placeholder}
              </p>
              <Button
                type="button"
                variant="outline"
                disabled={loading}
                onClick={() =>
                  setNotice(`${p.connectLabel}: Connection setup required. Meta API integration is not enabled yet.`)
                }
              >
                {p.connectLabel}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}