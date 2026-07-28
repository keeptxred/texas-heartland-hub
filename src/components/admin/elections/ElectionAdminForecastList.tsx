import { ElectionErrorState, ElectionLoading } from "@/components/elections";
import { useAdminElectionForecasts } from "@/hooks/elections";
import { FORECAST_RATING_LABELS } from "@/types/elections/forecastClassifications";
import { ElectionAdminMenu } from "./ElectionAdminMenu";

export function ElectionAdminForecastList() {
  const forecasts = useAdminElectionForecasts();
  return (
    <div className="space-y-8">
      <ElectionAdminMenu currentPath="/admin/elections/forecast" />
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-950">Forecast records</h2>
        <p className="mt-2 text-sm text-slate-600">
          Read-only source, race, rating, and update overview.
        </p>
        {forecasts.isLoading ? (
          <ElectionLoading variant="list" label="Loading admin forecast records" />
        ) : forecasts.error ? (
          <ElectionErrorState
            compact
            kind="admin_operation"
            technicalMessage={forecasts.error.message}
            retryAction={{ label: "Try again", onClick: () => void forecasts.refetch() }}
          />
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead>
                <tr>
                  <th className="px-3 py-2">Source</th>
                  <th className="px-3 py-2">Race</th>
                  <th className="px-3 py-2">Rating</th>
                  <th className="px-3 py-2">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {forecasts.data?.items.map((forecast) => (
                  <tr key={forecast.id}>
                    <td className="px-3 py-3 font-semibold">{forecast.sourceName}</td>
                    <td className="px-3 py-3">{forecast.race.name}</td>
                    <td className="px-3 py-3">{FORECAST_RATING_LABELS[forecast.rating]}</td>
                    <td className="px-3 py-3">
                      {new Date(forecast.updatedAt).toLocaleString("en-US")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
