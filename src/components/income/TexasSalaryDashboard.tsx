import { useState } from "react";
import { analyzeTexasSalary } from "@/lib/income/texasSalaryEngine";
import { formatSalaryCurrency, explainLifestyleScore } from "@/lib/income/texasSalaryHelpers";
import type { FilingStatus, PayFrequency } from "@/types/income/TexasSalaryCalculator";

const defaults = { salary: 100000, filingStatus: "married" as FilingStatus, payFrequency: "monthly" as PayFrequency, dependents: 2, retirement: 0.06, insurance: 500, otherDeductions: 0 };

export default function TexasSalaryDashboard() {
  const [salary, setSalary] = useState(defaults.salary);
  const [filingStatus, setFilingStatus] = useState<FilingStatus>(defaults.filingStatus);
  const [payFrequency, setPayFrequency] = useState<PayFrequency>(defaults.payFrequency);
  const [dependents, setDependents] = useState(defaults.dependents);
  const [retirement, setRetirement] = useState(defaults.retirement);
  const [insurance, setInsurance] = useState(defaults.insurance);
  const [otherDeductions, setOtherDeductions] = useState(defaults.otherDeductions);
  const [result, setResult] = useState<ReturnType<typeof analyzeTexasSalary> | null>(null);
  const error = salary <= 0 ? "Annual salary must be greater than zero." : retirement < 0 || retirement > 1 ? "Enter retirement contributions as a decimal from 0 to 1, such as 0.06 for 6%." : "";

  const calculate = () => {
    if (error) return;
    setResult(analyzeTexasSalary({ annualSalary: salary, filingStatus, payFrequency, dependents, retirementContribution: retirement, healthInsurance: insurance, otherDeductions }));
  };
  const reset = () => { setSalary(defaults.salary); setFilingStatus(defaults.filingStatus); setPayFrequency(defaults.payFrequency); setDependents(defaults.dependents); setRetirement(defaults.retirement); setInsurance(defaults.insurance); setOtherDeductions(defaults.otherDeductions); setResult(null); };

  return (
    <div className="space-y-8">
      <div className="grid gap-5 md:grid-cols-2">
        <label>Annual salary<input min={1} max={5000000} type="number" value={salary} onChange={(event) => setSalary(Number(event.target.value) || 0)} className="w-full rounded-lg border p-3" /></label>
        <label>Filing status<select value={filingStatus} onChange={(event) => setFilingStatus(event.target.value as FilingStatus)} className="w-full rounded-lg border p-3"><option value="single">Single</option><option value="married">Married</option><option value="head_of_household">Head of Household</option></select></label>
        <label>Pay frequency<select value={payFrequency} onChange={(event) => setPayFrequency(event.target.value as PayFrequency)} className="w-full rounded-lg border p-3"><option value="weekly">Weekly</option><option value="biweekly">Biweekly</option><option value="semimonthly">Twice monthly</option><option value="monthly">Monthly</option></select></label>
        <label>Dependents<input min={0} max={20} type="number" value={dependents} onChange={(event) => setDependents(Number(event.target.value) || 0)} className="w-full rounded-lg border p-3" /></label>
        <label>401(k) contribution decimal<input min={0} max={1} type="number" step="0.01" value={retirement} onChange={(event) => setRetirement(Number(event.target.value) || 0)} className="w-full rounded-lg border p-3" /><span className="text-xs text-gray-500">Enter 0.06 for 6%.</span></label>
        <label>Monthly health insurance<input min={0} max={20000} type="number" value={insurance} onChange={(event) => setInsurance(Number(event.target.value) || 0)} className="w-full rounded-lg border p-3" /></label>
        <label>Other monthly deductions<input min={0} max={50000} type="number" value={otherDeductions} onChange={(event) => setOtherDeductions(Number(event.target.value) || 0)} className="w-full rounded-lg border p-3" /></label>
      </div>
      {error ? <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p> : null}
      <div className="flex flex-wrap gap-2"><button type="button" onClick={calculate} className="rounded-lg border px-6 py-3 font-semibold">Calculate Texas take-home pay</button><button type="button" onClick={reset} className="rounded-lg border px-6 py-3 font-semibold">Reset</button></div>
      <p className="rounded-lg bg-amber-50 p-4 text-sm text-amber-900">Federal income-tax withholding, credits, deduction eligibility, Social Security limits, Medicare rules, and employer payroll treatment vary. This tool provides an educational estimate, not a tax return or payroll guarantee.</p>
      {result && (
        <div className="space-y-4 rounded-xl border p-6">
          <h2 className="text-2xl font-bold">Lifestyle score: {result.affordability.lifestyleScore}/100</h2>
          <p>{explainLifestyleScore(result)}</p>
          <p>Gross pay per paycheck: <strong>{formatSalaryCurrency(result.paycheck.grossPay)}</strong></p>
          <p>Estimated taxes per paycheck: <strong>{formatSalaryCurrency(result.paycheck.taxes)}</strong></p>
          <p>Estimated deductions per paycheck: <strong>{formatSalaryCurrency(result.paycheck.deductions)}</strong></p>
          <p>Take-home pay per paycheck: <strong>{formatSalaryCurrency(result.paycheck.takeHomePay)}</strong></p>
          <p>Monthly take home: <strong>{formatSalaryCurrency(result.paycheck.monthlyTakeHomePay)}</strong></p>
          <p>Recommended housing: <strong>{formatSalaryCurrency(result.affordability.recommendedHousingBudget)}</strong></p>
        </div>
      )}
    </div>
  );
}
