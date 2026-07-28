import { useState, type FormEvent } from "react";
import { createPollFileWorkflowOutput, validatePollEntry } from "@/lib/elections";
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
  electionCycleId: "election-cycle-2026-texas-general",
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
  const [output, setOutput] = useState<ReturnType<typeof createPollFileWorkflowOutput> | null>(
    null,
  );
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const update = <Key extends keyof PollEntryAdminInput>(
    key: Key,
    value: PollEntryAdminInput[Key],
  ) => {
    setInput((current) => ({ ...current, [key]: value }));
    setOutput(null);
    setCopyStatus(null);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = validatePollEntry(input);
    setErrors(result.errors);
    setCopyStatus(null);
    if (result.draft) {
      const nextOutput = createPollFileWorkflowOutput(result.draft);
      setOutput(nextOutput);
      onValidDraft?.(result.draft);
    } else {
      setOutput(null);
    }
  };

  const copyJson = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output.json);
      setCopyStatus("Normalized JSON copied.");
    } catch {
      setCopyStatus("Copy failed. Select the JSON below and copy it manually.");
    }
  };

  const downloadJson = () => {
    if (!output) return;
    const url = URL.createObjectURL(new Blob([output.json], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = output.filename;
    link.click();
    URL.revokeObjectURL(url);
    setCopyStatus(`Downloaded ${output.filename}.`);
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
          Enter only published toplines from the original source. The validated record can be copied
          or downloaded, added to <code>src/data/elections/2026/polls.json</code>, and reviewed in a
          GitHub pull request. This form never generates poll values.
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

      <button
        type="submit"
        className="rounded-lg bg-red-700 px-5 py-3 text-sm font-bold text-white hover:bg-red-800"
      >
        Validate and generate JSON
      </button>

      {output ? (
        <section aria-labelledby="poll-json-output" className="rounded-lg border bg-slate-50 p-4">
          <h3 id="poll-json-output" className="font-bold text-slate-950">
            Normalized poll record
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            The record is marked <code>in_review</code> and <code>pending_review</code>. Verify the
            source and change those fields to <code>published</code> and <code>verified</code> during
            pull-request review.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void copyJson()}
              className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800"
            >
              Copy JSON
            </button>
            <button
              type="button"
              onClick={downloadJson}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-950 hover:bg-slate-100"
            >
              Download JSON
            </button>
          </div>
          {copyStatus ? (
            <p role="status" className="mt-3 text-sm font-semibold text-emerald-700">
              {copyStatus}
            </p>
          ) : null}
          <textarea
            readOnly
            value={output.json}
            aria-label="Normalized poll JSON"
            className="mt-4 h-80 w-full rounded-lg border border-slate-300 bg-white p-3 font-mono text-xs"
          />
        </section>
      ) : null}
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
