import { useMemo } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { buildPollingTrend } from "@/lib/elections/pollingTrend";
import type { ElectionPollSummary } from "@/types/elections";

const SERIES_COLORS = ["#b91c1c", "#1d4ed8", "#047857", "#7e22ce", "#c2410c"] as const;

interface PollingTrendChartProps {
  polls: readonly ElectionPollSummary[];
}

export function PollingTrendChart({ polls }: PollingTrendChartProps) {
  const trend = useMemo(() => buildPollingTrend(polls), [polls]);
  const config = useMemo<ChartConfig>(
    () =>
      Object.fromEntries(
        trend.candidates.map((candidate, index) => [
          candidate.key,
          {
            label: candidate.name,
            color: SERIES_COLORS[index % SERIES_COLORS.length],
          },
        ]),
      ),
    [trend.candidates],
  );

  if (trend.points.length === 0 || trend.candidates.length === 0) return null;

  return (
    <section
      aria-labelledby="polling-trend-heading"
      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <div className="mb-4">
        <h2 id="polling-trend-heading" className="text-lg font-bold text-slate-950">
          Polling trend
        </h2>
        <p className="text-sm text-slate-600">
          Published candidate toplines by poll field-end date. Values are not interpolated.
        </p>
      </div>
      <ChartContainer config={config} className="min-h-[260px] w-full">
        <LineChart data={trend.points} margin={{ left: 4, right: 16, top: 8, bottom: 8 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={formatShortDate}
            tickLine={false}
            axisLine={false}
            minTickGap={28}
          />
          <YAxis
            domain={[0, 100]}
            tickFormatter={(value: number) => `${value}%`}
            tickLine={false}
            axisLine={false}
            width={42}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(value) =>
                  typeof value === "string" ? formatLongDate(value) : value
                }
                formatter={(value, name) => (
                  <span>
                    {config[String(name)]?.label}: {Number(value).toFixed(1)}%
                  </span>
                )}
              />
            }
          />
          {trend.candidates.map((candidate, index) => (
            <Line
              key={candidate.key}
              type="linear"
              dataKey={candidate.key}
              name={candidate.key}
              stroke={SERIES_COLORS[index % SERIES_COLORS.length]}
              strokeWidth={2}
              connectNulls={false}
              dot={{ r: 3 }}
            />
          ))}
        </LineChart>
      </ChartContainer>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-700">
        {trend.candidates.map((candidate, index) => (
          <li key={candidate.key} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: SERIES_COLORS[index % SERIES_COLORS.length] }}
            />
            {candidate.name}
          </li>
        ))}
      </ul>
    </section>
  );
}

function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

function formatLongDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}
