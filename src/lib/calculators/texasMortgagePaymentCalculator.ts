import { getPhaseCalculatorDefinition } from "@/lib/calculators/phaseCalculatorSuite";
export const calculateTexasMortgagePayment = (inputs: Record<string, number>) => getPhaseCalculatorDefinition("texasMortgagePayment").calculate(inputs);
export const validateTexasMortgagePaymentInputs = (inputs: Record<string, number>) => Object.values(inputs).every(Number.isFinite);
