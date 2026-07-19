import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  listSocialConnections,
  disconnectSocial,
  testSocialConnection,
  facebookConnectUrl,
  type SocialConnection,
} from "@/services/socialConnections";

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
  const [busy, setBusy] = useState<string | null>(null);

  function refresh() {
    setLoading(true);
    listSocialConnections()
      .then((r) => {
        setRows(r);
        setError(null);
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    refresh();
  }, []);

  function findRow(key: PlatformKey): SocialConnection | undefined {
    return rows.find((r) => r.platform.toLowerCase() === key);
  }

  async function handleConnect(key: PlatformKey) {
    if (key === "instagram") {
      setNotice("Instagram publishes through a linked Facebook Page. Connect Facebook first; Instagram support is coming next.");
      return;
    }
    window.location.href = facebookConnectUrl();
  }

  async function handleDisconnect(key: PlatformKey) {
    setBusy(`disconnect-${key}`);
    setNotice(null);
    const res = await disconnectSocial(key);
    setBusy(null);
    if (!res.ok) setError(res.error ?? "Disconnect failed");
    else setNotice(`${key} disconnected.`);
    refresh();
  }

  async function handleTest(key: PlatformKey) {
    setBusy(`test-${key}`);
    setNotice(null);
    setError(null);
    const res = await testSocialConnection(key);
    setBusy(null);
    if (res.ok) setNotice(`✓ ${key} connection works. Linked to: ${res.account}`);
    else setError(`Test failed: ${res.error}`);
    refresh();
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
              <div className="flex flex-wrap gap-2">
                {status !== "CONNECTED" ? (
                  <Button
                    type="button"
                    disabled={loading || busy !== null}
                    onClick={() => handleConnect(p.key)}
                  >
                    {p.connectLabel}
                  </Button>
                ) : (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={busy !== null}
                      onClick={() => handleTest(p.key)}
                    >
                      {busy === `test-${p.key}` ? "Testing…" : "Test Connection"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={busy !== null}
                      onClick={() => handleDisconnect(p.key)}
                    >
                      {busy === `disconnect-${p.key}` ? "Disconnecting…" : "Disconnect"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      disabled={busy !== null}
                      onClick={() => handleConnect(p.key)}
                    >
                      Reconnect
                    </Button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}