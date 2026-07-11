import React from "react";

export interface ResultItem {
  label: string;
  value: number | string;
  type?: "currency" | "percent" | "number" | "text";
  decimals?: number;
  highlight?: boolean;
}

interface CalculatorResultsProps {
  title?: string;
  results: ResultItem[];
}

const formatValue = (
  value: number | string,
  type: ResultItem["type"] = "text",
  decimals = 0
): string => {
  if (typeof value === "string") return value;

  switch (type) {
    case "currency":
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: decimals,
        minimumFractionDigits: decimals,
      }).format(value);

    case "percent":
      return `${value.toFixed(decimals)}%`;

    case "number":
      return new Intl.NumberFormat("en-US", {
        maximumFractionDigits: decimals,
        minimumFractionDigits: decimals,
      }).format(value);

    default:
      return value.toString();
  }
};

export default function CalculatorResults({
  title = "Results",
  results,
}: CalculatorResultsProps) {
  if (!results.length) return null;

  const primary =
    results.find((r) => r.highlight) ?? results[0];

  const remaining = results.filter((r) => r !== primary);

  return (
    <section className="space-y-6">

      <header>
        <h2 className="text-2xl font-bold text-gray-900">
          {title}
        </h2>
      </header>

      <div className="rounded-xl border border-red-100 bg-red-50 p-6">

        <p className="text-sm uppercase tracking-wide text-red-700">
          {primary.label}
        </p>

        <h3 className="mt-2 text-4xl font-bold text-red-700">
          {formatValue(
            primary.value,
            primary.type,
            primary.decimals
          )}
        </h3>

      </div>

      {remaining.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">

          {remaining.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border bg-white p-5 shadow-sm"
            >
              <p className="text-sm text-gray-500">
                {item.label}
              </p>

              <p className="mt-2 text-2xl font-semibold text-gray-900">
                {formatValue(
                  item.value,
                  item.type,
                  item.decimals
                )}
              </p>
            </div>
          ))}

        </div>
      )}

    </section>
  );
}
