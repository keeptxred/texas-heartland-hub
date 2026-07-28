import type {
  VoterRegistrationCreateInput,
  VoterRegistrationRecord,
  VoterRegistrationUpdateInput,
} from "./voterRegistration";
import type {
  VoterEligibilityStatus,
  VoterRegistrationMethod,
  VoterRegistrationStatus,
} from "./voterRegistrationClassifications";
import type {
  VoterRegistrationCountyOverview,
  VoterRegistrationDetail,
  VoterRegistrationSummary,
} from "./voterRegistrationProjections";
import type {
  CountyId,
  ElectionCycleId,
  VoterRegistrationId,
  VoterRegistrationSlug,
} from "./identifiers";
import type { RacePage, RacePagination, SortDirection } from "./raceRepository";

export const VOTER_REGISTRATION_SORT_FIELDS = [
  "county_name",
  "status",
  "eligibility_status",
  "registration_deadline",
  "updated_at",
] as const;
export type VoterRegistrationSortField = (typeof VOTER_REGISTRATION_SORT_FIELDS)[number];

export interface VoterRegistrationSort {
  field: VoterRegistrationSortField;
  direction: SortDirection;
}

export interface VoterRegistrationFilters {
  ids?: readonly VoterRegistrationId[];
  electionCycleIds?: readonly ElectionCycleId[];
  countyIds?: readonly CountyId[];
  statuses?: readonly VoterRegistrationStatus[];
  eligibilityStatuses?: readonly VoterEligibilityStatus[];
  registrationMethods?: readonly VoterRegistrationMethod[];
  search?: string;
}

export interface VoterRegistrationListQuery {
  filters?: VoterRegistrationFilters;
  pagination?: RacePagination;
  sort?: readonly VoterRegistrationSort[];
}

export interface VoterRegistrationRepository {
  findById(id: VoterRegistrationId): Promise<VoterRegistrationRecord | null>;
  findBySlug(slug: VoterRegistrationSlug): Promise<VoterRegistrationRecord | null>;
  findDetailById(id: VoterRegistrationId): Promise<VoterRegistrationDetail | null>;
  list(query?: VoterRegistrationListQuery): Promise<RacePage<VoterRegistrationSummary>>;
  listCore(query?: VoterRegistrationListQuery): Promise<RacePage<VoterRegistrationRecord>>;
  getCountyOverview(countyId: CountyId, electionCycleId: ElectionCycleId): Promise<VoterRegistrationCountyOverview | null>;
  count(filters?: VoterRegistrationFilters): Promise<number>;
  create(input: VoterRegistrationCreateInput): Promise<VoterRegistrationRecord>;
  update(id: VoterRegistrationId, input: VoterRegistrationUpdateInput): Promise<VoterRegistrationRecord>;
  delete(id: VoterRegistrationId): Promise<boolean>;
}

export type ReadonlyVoterRegistrationRepository = Pick<
  VoterRegistrationRepository,
  "findById" | "findBySlug" | "findDetailById" | "list" | "listCore" | "getCountyOverview" | "count"
>;
