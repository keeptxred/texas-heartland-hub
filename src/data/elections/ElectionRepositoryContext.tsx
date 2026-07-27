import {
  createContext,
  useContext,
  useMemo,
  type PropsWithChildren,
} from "react";
import {
  createElectionRepositories,
  type ElectionRepositories,
} from "./repositoryFactory";
import type { ElectionRepositoryMode } from "./repositoryConfig";

const ElectionRepositoryContext = createContext<ElectionRepositories | null>(null);

export interface ElectionRepositoryProviderProps extends PropsWithChildren {
  mode?: ElectionRepositoryMode;
  repositories?: ElectionRepositories;
}

export function ElectionRepositoryProvider({
  children,
  mode,
  repositories,
}: ElectionRepositoryProviderProps) {
  const value = useMemo(
    () => repositories ?? createElectionRepositories(mode),
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

export function useElectionRepositoryMode(): ElectionRepositoryMode {
  return useElectionRepositories().mode;
}
