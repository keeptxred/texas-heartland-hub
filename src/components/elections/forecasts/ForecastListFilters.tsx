import type { ElectionCycleId, ForecastRating, OfficeLevel } from "@/types/elections";
import {
  FORECAST_RATINGS,
  FORECAST_RATING_LABELS,
} from "@/types/elections/forecastClassifications";
import { OFFICE_LEVELS, OFFICE_LEVEL_LABELS } from "@/types/elections/raceClassifications";

interface FilterOption {
  value: string;
  label: string;
}

export interface ForecastListFiltersProps {
  sourceId: string | null;
  rating: ForecastRating | null;
  officeLevel: OfficeLevel | null;
  electionCycleId: ElectionCycleId | null;
  sources: readonly FilterOption[];
  electionCycles: readonly FilterOption[];
  onSourceChange: (value: string | null) => void;
  onRatingChange: (value: ForecastRating | null) => void;
  onOfficeLevelChange: (value: OfficeLevel | null) => void;
  onElectionCycleChange: (value: ElectionCycleId | null) => void;
}

export function ForecastListFilters({
  sourceId,
  rating,
  officeLevel,
  electionCycleId,
  sources,
  electionCycles,
  onSourceChange,
  onRatingChange,
  onOfficeLevelChange,
  onElectionCycleChange,
}: ForecastListFiltersProps) {
  return (
    <div
      aria-label="Filter election forecasts"
      className="grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      <FilterSelect
        label="Source"
        value={sourceId ?? ""}
        options={sources}
        onChange={(value) => onSourceChange(value || null)}
      />
      <FilterSelect
        label="Rating"
        value={rating ?? ""}
        options={FORECAST_RATINGS.map((value) => ({
          value,
          label: FORECAST_RATING_LABELS[value],
        }))}
        onChange={(value) =>
          onRatingChange(FORECAST_RATINGS.find((item) => item === value) ?? null)
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
        label="Election cycle"
        value={electionCycleId ?? ""}
        options={electionCycles}
        onChange={(value) =>
          onElectionCycleChange(
            electionCycles.find((item) => item.value === value) ? (value as ElectionCycleId) : null,
          )
        }
      />
    </div>
  );
}

interface FilterSelectProps {
  label: string;
  value: string;
  options: readonly FilterOption[];
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

export default ForecastListFilters;
