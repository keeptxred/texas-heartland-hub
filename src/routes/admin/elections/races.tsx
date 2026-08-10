import { createFileRoute, Link } from "@tanstack/react-router";
import { ElectionAdminRaceList } from "@/components/admin/elections";
import { ElectionRepositoryProvider } from "@/lib/elections/repositories";

export const Route = createFileRoute("/admin/elections/races")({
  head: () => ({
    meta: [
      { title: "Election Races — Keep TX Red Admin" },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: AdminElectionRacesPage,
});

function AdminElectionRacesPage() {
  const unlocked = typeof window !== "undefined" && sessionStorage.getItem("ktr-admin-ok") === "1";
  if (!unlocked) {
    return (
      <main className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl">Admin access required</h1>
        <Link to="/admin" className="mt-6 inline-flex font-semibold text-red-700">
          Open admin
        </Link>
      </main>
    );
  }
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <ElectionRepositoryProvider>
          <ElectionAdminRaceList />
        </ElectionRepositoryProvider>
      </div>
    </main>
  );
}
