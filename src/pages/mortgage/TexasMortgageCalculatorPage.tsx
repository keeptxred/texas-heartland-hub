import TexasMortgageCalculator from "@/components/mortgage/TexasMortgageCalculator";

export default function TexasMortgageCalculatorPage() {
  return <main className="container mx-auto space-y-6 px-4 py-10"><h1 className="text-3xl font-bold">Texas Mortgage Calculator</h1><p>Estimate a monthly Texas mortgage payment including taxes, insurance, HOA dues, and PMI.</p><TexasMortgageCalculator /></main>;
}
