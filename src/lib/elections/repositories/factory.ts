import {
  electionRepositoryConfig,
  type ElectionRepositoryConfig,
  type ElectionRepositoryMode,
} from "./config";
import { createMockElectionRepositories } from "./mock";
import { createStaticElectionRepositories } from "./static";
import type { ElectionRepositories } from "./types";

export class UnsupportedElectionRepositoryModeError extends Error {
  readonly mode: ElectionRepositoryMode;

  constructor(mode: ElectionRepositoryMode) {
    super(
      mode === "supabase"
        ? "Election repository mode \"supabase\" is configured but its implementation is not connected yet."
        : `Election repository mode \"${mode}\" is not supported yet.`,
    );
    this.name = "UnsupportedElectionRepositoryModeError";
    this.mode = mode;
  }
}

export function createElectionRepositories(
  config: ElectionRepositoryConfig = electionRepositoryConfig,
): ElectionRepositories {
  switch (config.mode) {
    case "mock":
      return createMockElectionRepositories();
    case "static":
      return createStaticElectionRepositories();
    case "supabase":
    case "api":
      throw new UnsupportedElectionRepositoryModeError(config.mode);
    default: {
      const neverMode: never = config.mode;
      throw new Error(`Unhandled election repository mode: ${String(neverMode)}`);
    }
  }
}
