import React, { useState } from "react";
import CalculatorLayout from "@/components/calculators/CalculatorLayout";
import { CalculatorSlider } from "@/components/calculators/CalculatorInputs";
import BreakdownTable from "@/components/calculators/BreakdownTable";
import { rankTexasCities } from "@/lib/calculators/relocationDecisionTools";

export default function BestTexasCityFinder() {
  const [weights, setWeights] = useState({ housing: 5, jobs: 5, family: 5, outdoors: 3, nightlife: 2, commute: 4 });
  const results = rankTexasCities(weights);
  const update = (key: keyof typeof weights, value: number) => setWeights({ ...weights, [key]: value });
  return <CalculatorLayout title="Best Texas City Finder" description="Rank major Texas metros based on affordability, jobs, family fit, outdoor access, nightlife, and commute preferences." canonicalUrl="https://keeptxred.com/tools/best-texas-city-finder" lastUpdated="July 2026">
    <div className="space-y-8"><div className="grid gap-5 md:grid-cols-2">{Object.entries(weights).map(([key, value]) => <CalculatorSlider key={key} id={key} label={`${key[0].toUpperCase()}${key.slice(1)} importance`} value={value} min={1} max={10} onChange={(v) => update(key as keyof typeof weights, v)} />)}</div>
    <BreakdownTable title="Your Best Texas City Matches" rows={results.map((r) => ({ label: r.city, value: r.score }))} /></div>
  </CalculatorLayout>;
}