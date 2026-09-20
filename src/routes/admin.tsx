import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Keep TX Red" },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: AdminLayout,
});

const STORAGE_KEY = "ktr-admin-ok";
const PASSCODE = (import.meta.env.VITE_ADMIN_PASSCODE as string) || "keeptxred";

function AdminLayout() {
  const [ok, setOk] = useState(false);
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem(STORAGE_KEY) === "1") {
      setOk(true);
    }
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pass === PASSCODE) {
      sessionStorage.setItem(STORAGE_KEY, "1");
      sessionStorage.setItem("ktr-admin-passcode", pass);
      setOk(true);
    } else {
      setErr("Incorrect passcode.");
    }
  }

  if (!ok) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-muted/30 px-4">
        <form onSubmit={submit} className="w-full max-w-sm border-2 border-foreground/10 bg-white p-6 space-y-4">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">★ Restricted</div>
            <h1 className="font-display text-2xl mt-1">Admin Access</h1>
            <p className="text-sm text-muted-foreground mt-1">Enter the admin passcode to continue.</p>
          </div>
          <Input
            type="password"
            value={pass}
            onChange={(e) => { setPass(e.target.value); setErr(""); }}
            placeholder="Passcode"
            autoFocus
          />
          {err ? <p className="text-xs text-destructive">{err}</p> : null}
          <Button type="submit" className="w-full">Unlock</Button>
        </form>
      </div>
    );
  }

  return (
    <>
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-2 text-xs font-bold uppercase tracking-widest">
          <Link to="/admin" className="text-muted-foreground hover:text-primary">Dashboard</Link>
          <Link to="/admin/newsroom" className="text-primary hover:underline">Newsroom Control Center</Link>
          <Link to="/admin/source-provenance" className="text-muted-foreground hover:text-primary">Source Provenance</Link>
        </div>
      </nav>
      <Outlet />
    </>
  );
}
