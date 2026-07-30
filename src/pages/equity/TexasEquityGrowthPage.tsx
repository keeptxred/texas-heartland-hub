import TexasEquityGrowthDashboard from "@/components/equity/TexasEquityGrowthDashboard";

export default function TexasEquityGrowthPage() {
  return (
    <main className="container mx-auto space-y-6 px-4 py-10">
      <h1 className="text-3xl font-bold">Texas Home Equity Growth Calculator</h1>
      <p>Estimate how mortgage principal reduction and home appreciation may build equity over time.</p>
      <TexasEquityGrowthDashboard />
    </main>
  );
}
