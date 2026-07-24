import { getPhaseCalculatorDefinition } from "@/lib/calculators/phaseCalculatorSuite";
export const calculateHomeInsurance = (inputs: Record<string, number>) => getPhaseCalculatorDefinition("homeInsurance").calculate(inputs);
export const validateHomeInsuranceInputs = (inputs: Record<string, number>) => Object.values(inputs).every(Number.isFinite);
