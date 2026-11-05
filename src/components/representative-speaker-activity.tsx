import type { SpeakerActivityRecord } from "@/data/representative-speaker-activity";
import { SPEAKER_ARCHIVE_URL, SPEAKER_OFFICE_URL } from "@/data/representative-speaker-activity";

/** Legislative leadership records are not personal sponsorship or roll-call votes. */
export function RepresentativeSpeakerActivity({ records }: { records: readonly SpeakerActivityRecord[] }) {
  if (!records.length) return null;
  const kinds = [...new Set(records.map(record => record.kind))];
  return (
    <section id="activity" data-speaker-research="verified" className="scroll-mt-24 rounded-xl border bg-card p-6">
      <h2 className="text-2xl font-bold">89th Legislature: documented Speaker actions</h2>
      <p className="mt-3 leading-7">
        The Speaker of the Texas House presides over the chamber, directs committee appointments and
        issues official procedural notices. Unlike an ordinary member&apos;s bill-role ledger, this is
        a dated selection of primary-source Speaker-office documents and statements from the 89th
        Legislature. A statement about another member&apos;s bill is <strong>not</strong> evidence that
        Dustin Burrows authored, sponsored, voted for, or enacted that bill.
      </p>
      <p className="mt-3 text-sm text-muted-foreground">
        <strong>Coverage and freshness:</strong> {records.length} distinct official documents are listed,
        across {kinds.length} record types. This source-checked 89th Legislature research sample
        is a selected archive, not a complete record of Speaker decisions, House votes, or the
        eventual legal status of the measures discussed. Reviewed November 5, 2026;
        future Speaker actions are not represented until a documented update.
      </p>
      <ul className="mt-5 space-y-4">
        {records.map(record => (
          <li key={record.sourceUrl} className="rounded-lg border p-4">
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <time dateTime={record.date}>{record.date}</time><span aria-hidden="true">·</span><span>{record.kind}</span>
            </div>
            <a className="mt-2 inline-block font-semibold text-primary underline-offset-4 hover:underline" href={record.sourceUrl} target="_blank" rel="noopener noreferrer">
              {record.title} <span className="sr-only">(official document opens in new tab)</span>
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-6 border-t pt-5 text-sm leading-6 text-muted-foreground">
        <strong>Coverage and freshness:</strong> This selection documents dated House Speaker
        appointments, interim committee charges, public statements and chamber proceedings from
        2025–2026 during the 89th Legislature, not a complete list of the Speaker's actions.
        The underlying documents are maintained by the Texas House and Texas Legislative Reference
        Library; each title links directly to its dated primary record. This independent KTR
        chronology was reviewed November 5, 2026. Future proclamations, corrections and official
        updates can change the archive, so check the linked official sources for the latest
        information. A missing document or bill sponsorship in this selection is not evidence
        that the Speaker took no other legislative action.
      </div>
      <p className="mt-5 text-sm leading-6 text-muted-foreground">
        Source indexes: <a className="underline" href={SPEAKER_ARCHIVE_URL} target="_blank" rel="noopener noreferrer">Texas Legislative Reference Library Speaker releases</a>
        {", "}and <a className="underline" href={SPEAKER_OFFICE_URL} target="_blank" rel="noopener noreferrer">Texas House Speaker proclamations and duties</a>.
        The official Texas House profile does not attribute individual 89th-session sponsorships to
        this Speaker in KTR&apos;s current source ledger. We therefore do not show a manufactured bill count.
      </p>
    </section>
  );
}
