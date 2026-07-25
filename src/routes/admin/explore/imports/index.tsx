import { createFileRoute, Link } from "@tanstack/react-router";
import { ImportDashboard } from "@/components/admin/explore/imports/ImportDashboard";

export const Route = createFileRoute("/admin/explore/imports/")({
  head: () => ({
    meta: [
      { title: "Explore Texas Imports — Keep TX Red Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ExploreImportAdminPage,
});

function ExploreImportAdminPage() {
  const unlocked = typeof window !== "undefined" && sessionStorage.getItem("ktr-admin-ok") === "1";
  if (!unlocked) {
    return (
      <main className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl">Admin access required</h1>
        <p className="mt-2 text-muted-foreground">Unlock the editorial dashboard before opening Explore Texas imports.</p>
        <Link to="/admin" className="mt-6 inline-flex h-10 items-center bg-primary px-4 font-semibold text-primary-foreground">Open admin</Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-muted/20">
      <header className="border-b-4 border-primary bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <Link to="/admin" className="text-xs font-bold uppercase tracking-widest text-accent">← Editorial Dashboard</Link>
          <h1 className="mt-2 font-display text-4xl">Explore Texas Import Operations</h1>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <ImportDashboard />
      </div>
    </main>
  );
}
