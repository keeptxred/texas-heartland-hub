import type {
  CertificationStatus,
  ElectionCycleId,
  OfficeLevel,
  ResultReportingStatus,
} from "@/types/elections";
import {
  CERTIFICATION_STATUSES,
  CERTIFICATION_STATUS_LABELS,
  RESULT_REPORTING_STATUSES,
  RESULT_REPORTING_STATUS_LABELS,
} from "@/types/elections/resultClassifications";
import { OFFICE_LEVELS, OFFICE_LEVEL_LABELS } from "@/types/elections/raceClassifications";

interface Option {
  value: string;
  label: string;
}

export interface ResultListFiltersProps {
  officeLevel: OfficeLevel | null;
  reportingStatus: ResultReportingStatus | null;
  certificationStatus: CertificationStatus | null;
  electionCycleId: ElectionCycleId | null;
  electionCycles: readonly Option[];
  onOfficeLevelChange: (value: OfficeLevel | null) => void;
  onReportingStatusChange: (value: ResultReportingStatus | null) => void;
  onCertificationStatusChange: (value: CertificationStatus | null) => void;
  onElectionCycleChange: (value: ElectionCycleId | null) => void;
}

export function ResultListFilters(props: ResultListFiltersProps) {
  return (
    <div
      role="group"
      aria-label="Filter election results"
      className="grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      <Select
        label="Office level"
        value={props.officeLevel ?? ""}
        options={OFFICE_LEVELS.map((value) => ({ value, label: OFFICE_LEVEL_LABELS[value] }))}
        onChange={(value) =>
          props.onOfficeLevelChange(OFFICE_LEVELS.find((item) => item === value) ?? null)
        }
      />
      <Select
        label="Reporting state"
        value={props.reportingStatus ?? ""}
        options={RESULT_REPORTING_STATUSES.map((value) => ({
          value,
          label: RESULT_REPORTING_STATUS_LABELS[value],
        }))}
        onChange={(value) =>
          props.onReportingStatusChange(
            RESULT_REPORTING_STATUSES.find((item) => item === value) ?? null,
          )
        }
      />
      <Select
        label="Certification"
        value={props.certificationStatus ?? ""}
        options={CERTIFICATION_STATUSES.map((value) => ({
          value,
          label: CERTIFICATION_STATUS_LABELS[value],
        }))}
        onChange={(value) =>
          props.onCertificationStatusChange(
            CERTIFICATION_STATUSES.find((item) => item === value) ?? null,
          )
        }
      />
      <Select
        label="Election cycle"
        value={props.electionCycleId ?? ""}
        options={props.electionCycles}
        onChange={(value) =>
          props.onElectionCycleChange(
            props.electionCycles.some((item) => item.value === value)
              ? (value as ElectionCycleId)
              : null,
          )
        }
      />
    </div>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly Option[];
  onChange: (value: string) => void;
}) {
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
