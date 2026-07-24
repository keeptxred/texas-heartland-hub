import { getPhaseCalculatorDefinition } from "@/lib/calculators/phaseCalculatorSuite";
export const calculateTexasDownPaymentAssistance = (inputs: Record<string, number>) => getPhaseCalculatorDefinition("texasDownPaymentAssistance").calculate(inputs);
export const validateTexasDownPaymentAssistanceInputs = (inputs: Record<string, number>) => Object.values(inputs).every(Number.isFinite);
