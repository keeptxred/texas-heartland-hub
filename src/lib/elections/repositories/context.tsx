import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import type { ElectionRepositoryConfig } from "./config";
import { createElectionRepositories } from "./factory";
import type { ElectionRepositories } from "./types";

const ElectionRepositoryContext = createContext<ElectionRepositories | null>(null);

export interface ElectionRepositoryProviderProps {
  children: ReactNode;
  config?: ElectionRepositoryConfig;
  repositories?: ElectionRepositories;
}

export function ElectionRepositoryProvider({
  children,
  config,
  repositories,
}: ElectionRepositoryProviderProps) {
  const mode = config?.mode;
  const value = useMemo(
    () => repositories ?? createElectionRepositories(mode ? { mode } : undefined),
    [mode, repositories],
  );

  return (
    <ElectionRepositoryContext.Provider value={value}>
      {children}
    </ElectionRepositoryContext.Provider>
  );
}

export function useElectionRepositories(): ElectionRepositories {
  const repositories = useContext(ElectionRepositoryContext);

  if (!repositories) {
    throw new Error(
      "useElectionRepositories must be used within an ElectionRepositoryProvider.",
    );
  }

  return repositories;
}

export function useElectionRepositoryMode() {
  return useElectionRepositories().mode;
}
