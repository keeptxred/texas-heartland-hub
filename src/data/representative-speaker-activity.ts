/** Primary-source documents for House Speaker Dustin Burrows, 89th Legislature.
 * Titles and dates transcribed from the Texas Legislative Reference Library's
 * Speaker archive and House Speaker proclamations, reviewed 2026-11-05.
 * These are Speaker-office actions and public statements, NOT individual bill
 * sponsorship, voting records, enacted laws, or evidence of authorship.
 * A document linked here may be a statement about another legislator's bill.
 */
export type SpeakerActivityRecord = {
  date: string;
  kind: "Appointment" | "Interim directive" | "House proceedings" | "Public statement";
  title: string;
  sourceUrl: string;
};

export const DUSTIN_BURROWS_SPEAKER_ACTIVITY: readonly SpeakerActivityRecord[] = [
  {
    "date": "2026-07-31",
    "kind": "Interim directive",
    "title": "State Affairs interim hearing on 765-kV transmission lines",
    "sourceUrl": "https://lrl.texas.gov/scanned/leadershipdocs/burrows07312026.pdf"
  },
  {
    "date": "2026-04-20",
    "kind": "Interim directive",
    "title": "Supplemental State Affairs charge on online gaming and child safety",
    "sourceUrl": "https://lrl.texas.gov/scanned/leadershipdocs/burrows04202026_press.pdf"
  },
  {
    "date": "2026-03-26",
    "kind": "Appointment",
    "title": "Select Committee on General Aviation appointments",
    "sourceUrl": "https://www.house.texas.gov/pdfs/speaker/Select-Committee-on-General-Aviation.pdf"
  },
  {
    "date": "2026-03-26",
    "kind": "Appointment",
    "title": "Select Committee on Governmental Oversight appointments",
    "sourceUrl": "https://www.house.texas.gov/pdfs/speaker/Select-Committee-on-Governmental-Oversight.pdf"
  },
  {
    "date": "2026-03-26",
    "kind": "Appointment",
    "title": "Select Committee on Health Care Affordability appointments",
    "sourceUrl": "https://www.house.texas.gov/pdfs/speaker/Select-Committee-on-Health-Care-Affordability.pdf"
  },
  {
    "date": "2025-10-13",
    "kind": "Appointment",
    "title": "House and Senate General Investigating Committees on July 2025 flooding",
    "sourceUrl": "https://lrl.texas.gov/scanned/leadershipdocs/burrows10132025.pdf"
  },
  {
    "date": "2025-09-12",
    "kind": "Appointment",
    "title": "Select Committee on Civil Discourse and Freedom of Speech in Higher Education",
    "sourceUrl": "https://www.house.texas.gov/pdfs/speaker/PROC-SelectCommDiscourseHigherEd-signed.pdf"
  },
  {
    "date": "2025-08-25",
    "kind": "Public statement",
    "title": "House passage of second-special-session priorities",
    "sourceUrl": "https://lrl.texas.gov/scanned/leadershipdocs/burrows08252025.pdf"
  },
  {
    "date": "2025-08-21",
    "kind": "Public statement",
    "title": "House passage of disaster preparedness and relief bills",
    "sourceUrl": "https://lrl.texas.gov/scanned/leadershipdocs/burrows08212025.pdf"
  },
  {
    "date": "2025-08-20",
    "kind": "Public statement",
    "title": "House passage of congressional redistricting legislation",
    "sourceUrl": "https://lrl.texas.gov/scanned/leadershipdocs/burrows08202025.pdf"
  },
  {
    "date": "2025-07-21",
    "kind": "Appointment",
    "title": "Creation of the House Select Committee on Congressional Redistricting",
    "sourceUrl": "https://lrl.texas.gov/scanned/leadershipdocs/burrows07212025.pdf"
  },
  {
    "date": "2025-07-15",
    "kind": "Appointment",
    "title": "Appointments to the House Select Committee on Disaster Preparedness and Flooding",
    "sourceUrl": "https://lrl.texas.gov/scanned/leadershipdocs/burrows07152025.pdf"
  },
  {
    "date": "2025-07-10",
    "kind": "Appointment",
    "title": "Joint House and Senate select committees on disaster preparedness and flooding",
    "sourceUrl": "https://lrl.texas.gov/scanned/leadershipdocs/burrows07102025.pdf"
  },
  {
    "date": "2025-06-02",
    "kind": "House proceedings",
    "title": "Speaker's end-of-regular-session report",
    "sourceUrl": "https://lrl.texas.gov/scanned/leadershipdocs/burrows06022025_sinedie.pdf"
  },
  {
    "date": "2025-04-17",
    "kind": "Public statement",
    "title": "House passage of school choice legislation",
    "sourceUrl": "https://lrl.texas.gov/scanned/leadershipdocs/burrows04172025_sb2.pdf"
  },
  {
    "date": "2025-04-15",
    "kind": "House proceedings",
    "title": "First emergency calendar of the 89th Texas House",
    "sourceUrl": "https://lrl.texas.gov/scanned/leadershipdocs/burrows04152025.pdf"
  },
  {
    "date": "2025-04-09",
    "kind": "Public statement",
    "title": "House passage of government efficiency reforms",
    "sourceUrl": "https://lrl.texas.gov/scanned/leadershipdocs/burrows04092025.pdf"
  },
  {
    "date": "2025-02-24",
    "kind": "Public statement",
    "title": "House property-tax relief proposal",
    "sourceUrl": "https://lrl.texas.gov/scanned/leadershipdocs/burrows02242025.pdf"
  },
  {
    "date": "2025-02-13",
    "kind": "Appointment",
    "title": "89th Legislature standing committee assignments",
    "sourceUrl": "https://lrl.texas.gov/scanned/leadershipdocs/burrows02132025.pdf"
  }
] as const;

export const SPEAKER_ARCHIVE_URL = "https://lrl.texas.gov/legeleaders/leadership/searchproc.cfm?authorSpeaker=5778&type=newsRelease";
export const SPEAKER_OFFICE_URL = "https://house.texas.gov/speaker";

export function speakerActivityFor(slug: string): readonly SpeakerActivityRecord[] {
  return slug === "dustin-burrows" ? DUSTIN_BURROWS_SPEAKER_ACTIVITY : [];
}
