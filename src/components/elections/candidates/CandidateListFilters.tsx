import type {
  CandidateParty,
  CandidateStatus,
  IncumbencyType,
  OfficeLevel,
} from "@/types/elections";
import {
  CANDIDATE_STATUSES,
  CANDIDATE_STATUS_LABELS,
  INCUMBENCY_TYPES,
  INCUMBENCY_TYPE_LABELS,
} from "@/types/elections/candidateClassifications";
import { CANDIDATE_PARTIES } from "@/types/elections/domain";
import { OFFICE_LEVELS, OFFICE_LEVEL_LABELS } from "@/types/elections/raceClassifications";

export interface CandidateListFiltersProps {
  party: CandidateParty | null;
  officeLevel: OfficeLevel | null;
  status: CandidateStatus | null;
  incumbency: IncumbencyType | null;
  onPartyChange: (value: CandidateParty | null) => void;
  onOfficeLevelChange: (value: OfficeLevel | null) => void;
  onStatusChange: (value: CandidateStatus | null) => void;
  onIncumbencyChange: (value: IncumbencyType | null) => void;
}

export function CandidateListFilters({
  party,
  officeLevel,
  status,
  incumbency,
  onPartyChange,
  onOfficeLevelChange,
  onStatusChange,
  onIncumbencyChange,
}: CandidateListFiltersProps) {
  return (
    <div
      aria-label="Filter election candidates"
      className="grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      <FilterSelect
        label="Party"
        value={party ?? ""}
        options={CANDIDATE_PARTIES.map((value) => ({
          value,
          label: formatParty(value),
        }))}
        onChange={(value) =>
          onPartyChange(CANDIDATE_PARTIES.find((item) => item === value) ?? null)
        }
      />
      <FilterSelect
        label="Office level"
        value={officeLevel ?? ""}
        options={OFFICE_LEVELS.map((value) => ({
          value,
          label: OFFICE_LEVEL_LABELS[value],
        }))}
        onChange={(value) =>
          onOfficeLevelChange(OFFICE_LEVELS.find((item) => item === value) ?? null)
        }
      />
      <FilterSelect
        label="Candidate status"
        value={status ?? ""}
        options={CANDIDATE_STATUSES.map((value) => ({
          value,
          label: CANDIDATE_STATUS_LABELS[value],
        }))}
        onChange={(value) =>
          onStatusChange(CANDIDATE_STATUSES.find((item) => item === value) ?? null)
        }
      />
      <FilterSelect
        label="Incumbency"
        value={incumbency ?? ""}
        options={INCUMBENCY_TYPES.map((value) => ({
          value,
          label: INCUMBENCY_TYPE_LABELS[value],
        }))}
        onChange={(value) =>
          onIncumbencyChange(INCUMBENCY_TYPES.find((item) => item === value) ?? null)
        }
      />
    </div>
  );
}

interface FilterSelectProps {
  label: string;
  value: string;
  options: readonly { value: string; label: string }[];
  onChange: (value: string) => void;
}

function FilterSelect({ label, value, options, onChange }: FilterSelectProps) {
  return (
    <label className="block text-sm font-semibold text-slate-900">
      {label}
      <select
        className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">All</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function formatParty(value: CandidateParty) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default CandidateListFilters;
