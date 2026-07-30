import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ImportExecutionMode } from "@/types/explore/import";

const keys = {
  sources: ["explore-import-sources"] as const,
  jobs: ["explore-import-jobs"] as const,
  records: ["explore-import-records"] as const,
  rollbacks: ["explore-import-rollbacks"] as const,
};

export function useImportSources() {
  return useQuery({
    queryKey: keys.sources,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("explore_import_sources" as never)
        .select("*")
        .order("name");
      if (error) throw error;
      return data as unknown as Array<Record<string, unknown>>;
    },
  });
}

export function useImportJobs() {
  return useQuery({
    queryKey: keys.jobs,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("explore_import_jobs" as never)
        .select("*,explore_import_sources(name,source_type)")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data as unknown as Array<Record<string, unknown>>;
    },
    refetchInterval: 15_000,
  });
}

export function useImportReviewQueue() {
  return useQuery({
    queryKey: keys.records,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("explore_import_records" as never)
        .select("*")
        .eq("review_status", "pending")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data as unknown as Array<Record<string, unknown>>;
    },
  });
}

export function useImportRollbacks() {
  return useQuery({
    queryKey: keys.rollbacks,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("explore_import_rollbacks" as never)
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data as unknown as Array<Record<string, unknown>>;
    },
  });
}

export function useEnqueueImport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      sourceId,
      executionMode,
    }: {
      sourceId: string;
      executionMode: ImportExecutionMode;
    }) => {
      const { data: userData } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("explore_import_jobs" as never)
        .insert({
          source_id: sourceId,
          mode: "manual",
          execution_mode: executionMode,
          status: "queued",
          requested_by: userData.user?.id ?? null,
        } as never)
        .select("id")
        .single();
      if (error) throw error;
      return data as unknown as { id: string };
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: keys.jobs }),
  });
}

export function useReviewImportRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: "approved" | "rejected" | "merged";
    }) => {
      const { data: userData } = await supabase.auth.getUser();
      const { error } = await supabase
        .from("explore_import_records" as never)
        .update({
          review_status: status,
          reviewed_by: userData.user?.id ?? null,
          reviewed_at: new Date().toISOString(),
        } as never)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: keys.records }),
  });
}
