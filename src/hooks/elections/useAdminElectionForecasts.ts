import { useQuery } from "@tanstack/react-query";
import { electionAdminQueryDefaults, electionQueryKeys } from "@/lib/elections/queries";
import { useElectionRepositories } from "@/lib/elections/repositories";

export function useAdminElectionForecasts() {
  const { forecasts } = useElectionRepositories();
  return useQuery({
    ...electionAdminQueryDefaults,
    queryKey: [...electionQueryKeys.forecasts.lists(), "admin"],
    queryFn: () =>
      forecasts.list({
        pagination: { page: 1, pageSize: 100 },
        sort: [{ field: "updated_at", direction: "desc" }],
      }),
  });
}
