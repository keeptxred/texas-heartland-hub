import React from "react";

export interface BreakdownRow {
  label: string;
  value: number;
  type?: "currency" | "percent" | "number";
  emphasize?: boolean;
}

interface BreakdownTableProps {
  title?: string;
  rows: BreakdownRow[];
  showTotal?: boolean;
  totalLabel?: string;
}

const formatValue = (
  value: number,
  type: BreakdownRow["type"] = "currency"
): string => {
  switch (type) {
    case "currency":
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      }).format(value);

    case "percent":
      return `${value.toFixed(2)}%`;

    case "number":
      return new Intl.NumberFormat("en-US").format(value);

    default:
      return value.toString();
  }
};

export default function BreakdownTable({
  title = "Cost Breakdown",
  rows,
  showTotal = false,
  totalLabel = "Total",
}: BreakdownTableProps) {
  const total = rows.reduce((sum, row) => sum + row.value, 0);

  return (
    <section className="mt-8">
      <h2 className="mb-4 text-2xl font-bold text-gray-900">
        {title}
      </h2>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600"
              >
                Item
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600"
              >
                Amount
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {rows.map((row, index) => (
              <tr
                key={`${row.label}-${index}`}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td
                  className={`px-6 py-4 text-sm ${
                    row.emphasize
                      ? "font-semibold text-gray-900"
                      : "text-gray-700"
                  }`}
                >
                  {row.label}
                </td>

                <td
                  className={`px-6 py-4 text-right text-sm ${
                    row.emphasize
                      ? "font-semibold text-red-700"
                      : "text-gray-900"
                  }`}
                >
                  {formatValue(row.value, row.type)}
                </td>
              </tr>
            ))}
          </tbody>

          {showTotal && (
            <tfoot className="bg-red-50">
              <tr>
                <td className="px-6 py-4 text-base font-bold text-gray-900">
                  {totalLabel}
                </td>

                <td className="px-6 py-4 text-right text-base font-bold text-red-700">
                  {formatValue(total)}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </section>
  );
}
