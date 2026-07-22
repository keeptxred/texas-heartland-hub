import { getPhaseCalculatorDefinition } from "@/lib/calculators/phaseCalculatorSuite";
export const calculateSalaryComparison = (inputs: Record<string, number>) => getPhaseCalculatorDefinition("salaryComparison").calculate(inputs);
export const validateSalaryComparisonInputs = (inputs: Record<string, number>) => Object.values(inputs).every(Number.isFinite);
