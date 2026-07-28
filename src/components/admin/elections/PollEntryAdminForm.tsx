import { useState, type FormEvent } from "react";
import { validatePollEntry } from "@/lib/elections";
import type { PollEntryAdminInput, ValidPollEntryDraft } from "@/types/elections";
import {
  POLL_MODES,
  POLL_MODE_LABELS,
  POLL_POPULATIONS,
  POLL_POPULATION_LABELS,
} from "@/types/elections/pollClassifications";

const EMPTY_INPUT: PollEntryAdminInput = {
  slug: "",
  title: "",
  electionCycleId: "",
  raceId: "",
  pollsterName: "",
  fieldStartDate: "",
  fieldEndDate: "",
  releaseDate: "",
  population: "likely_voters",
  mode: "unknown",
  sampleSize: "",
  marginOfError: "",
  questionPrompt: "",
  responses: [
    { label: "", candidateId: "", percentage: "" },
    { label: "", candidateId: "", percentage: "" },
  ],
  internalPoll: false,
  partisanPoll: false,
  sourceName: "",
  sourceUrl: "",
  methodologyUrl: "",
};

export function PollEntryAdminForm({
  onValidDraft,
}: {
  onValidDraft?: (draft: ValidPollEntryDraft) => void;
}) {
  const [input, setInput] = useState(EMPTY_INPUT);
  const [errors, setErrors] = useState<readonly string[]>([]);
  const [validated, setValidated] = useState(false);

  const update = <Key extends keyof PollEntryAdminInput>(
    key: Key,
    value: PollEntryAdminInput[Key],
  ) => setInput((current) => ({ ...current, [key]: value }));

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = validatePollEntry(input);
    setErrors(result.errors);
    setValidated(Boolean(result.draft));
    if (result.draft) onValidDraft?.(result.draft);
  };

  return (
    <form
      onSubmit={submit}
      className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">Poll intake</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-950">Enter a sourced poll</h2>
        <p className="mt-2 text-sm text-slate-600">
          Enter only published toplines from the original source. This form never generates poll
          values.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Title" value={input.title} onChange={(value) => update("title", value)} />
        <Field label="Slug" value={input.slug} onChange={(value) => update("slug", value)} />
        <Field
          label="Election cycle ID"
          value={input.electionCycleId}
          onChange={(value) => update("electionCycleId", value)}
        />
        <Field label="Race ID" value={input.raceId} onChange={(value) => update("raceId", value)} />
        <Field
          label="Pollster"
          value={input.pollsterName}
          onChange={(value) => update("pollsterName", value)}
        />
        <Select
          label="Population"
          value={input.population}
          options={POLL_POPULATIONS.map((value) => ({
            value,
            label: POLL_POPULATION_LABELS[value],
          }))}
          onChange={(value) =>
            update("population", POLL_POPULATIONS.find((item) => item === value) ?? "unknown")
          }
        />
        <Select
          label="Mode"
          value={input.mode}
          options={POLL_MODES.map((value) => ({
            value,
            label: POLL_MODE_LABELS[value],
          }))}
          onChange={(value) =>
            update("mode", POLL_MODES.find((item) => item === value) ?? "unknown")
          }
        />
        <Field
          label="Sample size"
          type="number"
          value={input.sampleSize}
          onChange={(value) => update("sampleSize", value)}
        />
        <Field
          label="Field start"
          type="date"
          value={input.fieldStartDate}
          onChange={(value) => update("fieldStartDate", value)}
        />
        <Field
          label="Field end"
          type="date"
          value={input.fieldEndDate}
          onChange={(value) => update("fieldEndDate", value)}
        />
        <Field
          label="Release date"
          type="date"
          value={input.releaseDate}
          onChange={(value) => update("releaseDate", value)}
        />
        <Field
          label="Margin of error"
          type="number"
          value={input.marginOfError}
          onChange={(value) => update("marginOfError", value)}
        />
      </div>

      <Field
        label="Exact question wording"
        value={input.questionPrompt}
        onChange={(value) => update("questionPrompt", value)}
      />

      <fieldset>
        <legend className="text-sm font-bold text-slate-950">Published responses</legend>
        <div className="mt-3 space-y-3">
          {input.responses.map((response, index) => (
            <div key={index} className="grid gap-3 md:grid-cols-3">
              <Field
                label={`Response ${index + 1}`}
                value={response.label}
                onChange={(value) => updateResponse(input, update, index, "label", value)}
              />
              <Field
                label="Candidate ID"
                value={response.candidateId}
                onChange={(value) => updateResponse(input, update, index, "candidateId", value)}
              />
              <Field
                label="Percentage"
                type="number"
                value={response.percentage}
                onChange={(value) => updateResponse(input, update, index, "percentage", value)}
              />
            </div>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Original source name"
          value={input.sourceName}
          onChange={(value) => update("sourceName", value)}
        />
        <Field
          label="Original source URL"
          type="url"
          value={input.sourceUrl}
          onChange={(value) => update("sourceUrl", value)}
        />
        <Field
          label="Methodology URL"
          type="url"
          value={input.methodologyUrl}
          onChange={(value) => update("methodologyUrl", value)}
        />
      </div>

      <div className="flex flex-wrap gap-5">
        <Check
          label="Internal poll"
          checked={input.internalPoll}
          onChange={(value) => update("internalPoll", value)}
        />
        <Check
          label="Partisan poll"
          checked={input.partisanPoll}
          onChange={(value) => update("partisanPoll", value)}
        />
      </div>

      {errors.length > 0 ? (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="font-semibold text-red-900">Review the poll entry</p>
          <ul className="mt-2 list-disc pl-5 text-sm text-red-800">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {validated ? (
        <p role="status" className="text-sm font-semibold text-emerald-700">
          Poll entry validated for secure persistence.
        </p>
      ) : null}

      <button
        type="submit"
        className="rounded-lg bg-red-700 px-5 py-3 text-sm font-bold text-white hover:bg-red-800"
      >
        Validate poll entry
      </button>
    </form>
  );
}

function updateResponse(
  input: PollEntryAdminInput,
  update: <Key extends keyof PollEntryAdminInput>(
    key: Key,
    value: PollEntryAdminInput[Key],
  ) => void,
  index: number,
  key: keyof PollEntryAdminInput["responses"][number],
  value: string,
) {
  update(
    "responses",
    input.responses.map((response, responseIndex) =>
      responseIndex === index ? { ...response, [key]: value } : response,
    ),
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "number" | "date" | "url";
}) {
  return (
    <label className="block text-sm font-semibold text-slate-900">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2"
      />
    </label>
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
  options: readonly { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-sm font-semibold text-slate-900">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function Check({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm font-semibold text-slate-900">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      {label}
    </label>
  );
}

export default PollEntryAdminForm;
