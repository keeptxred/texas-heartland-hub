import type {
  ReadonlyCandidateRepository,
  ReadonlyElectionCycleRepository,
  ReadonlyElectionForecastRepository,
  ReadonlyElectionPollRepository,
  ReadonlyElectionResultRepository,
  ReadonlyRaceRepository,
} from "../../../types/elections";
import type { ElectionRepositoryMode } from "./config";

export interface ElectionRepositories {
  mode: ElectionRepositoryMode;
  cycles: ReadonlyElectionCycleRepository;
  races: ReadonlyRaceRepository;
  candidates: ReadonlyCandidateRepository;
  polls: ReadonlyElectionPollRepository;
  forecasts: ReadonlyElectionForecastRepository;
  results: ReadonlyElectionResultRepository;
}
