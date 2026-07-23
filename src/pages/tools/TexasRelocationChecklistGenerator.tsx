import React, { useState } from "react";
import CalculatorLayout from "@/components/calculators/CalculatorLayout";
import SharedRelocationProfile from "@/components/calculators/SharedRelocationProfile";
import ShareResults from "@/components/calculators/ShareResults";
import { buildRelocationChecklist, defaultRelocationProfile } from "@/lib/calculators/relocationTools";

export default function TexasRelocationChecklistGenerator() {
  const [profile, setProfile] = useState(defaultRelocationProfile);
  const checklist = buildRelocationChecklist(profile);
  return <CalculatorLayout title="Texas Relocation Checklist Generator" description="Create a personalized moving-to-Texas checklist organized by the weeks before your move and your first month in Texas." canonicalUrl="https://keeptxred.com/tools/texas-relocation-checklist-generator" lastUpdated="July 2026" schema={{ "@context": "https://schema.org", "@type": "WebApplication", name: "Texas Relocation Checklist Generator", applicationCategory: "LifestyleApplication" }}>
    <div className="space-y-8">
      <SharedRelocationProfile value={profile} onChange={setProfile} showCommute={false} />
      <div className="space-y-5">
        {checklist.map((section) => <section key={section.phase} className="rounded-xl border bg-white p-5">
          <h2 className="mb-4 text-lg font-bold text-gray-900">{section.phase}</h2>
          <div className="space-y-3">
            {section.items.map((item) => <label key={item} className="flex items-start gap-3 text-gray-800">
              <input type="checkbox" className="mt-1 h-5 w-5" />
              <span>{item}</span>
            </label>)}
          </div>
        </section>)}
      </div>
      <button type="button" onClick={() => window.print()} className="rounded-lg bg-red-700 px-5 py-3 font-semibold text-white hover:bg-red-800">Print checklist</button>
      <ShareResults title="Texas Relocation Checklist Generator" summary={`Texas relocation checklist for a household of ${profile.householdSize} moving to ${profile.destinationCity}.`} />
    </div>
  </CalculatorLayout>;
}
