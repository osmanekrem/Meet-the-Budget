"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Label,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { Data, SummaryData } from "@/features/summary/api/get-summary";
import { compareAsc, compareDesc, format, getMonth, getYear } from "date-fns";

const chartConfig = {
  income: {
    label: "Income",
    color: "hsl(var(--primary))",
  },
  expense: {
    label: "Expense",
    color: "hsl(var(--destructive))",
  },
} satisfies ChartConfig;

type Props = {
  className?: string;
  data: SummaryData;
};

function formatAndCombineSummaryData(
  summaryData: SummaryData
): { date: string; income: number; expense: number }[] {
  function processDataList(dataList: { data: Data[] }[]): {
    [key: string]: number;
  } {
    const combinedData: { [key: string]: number } = {};

    dataList.forEach((item) => {
      item.data.forEach((data) => {
        const key = new Date(
          getYear(data.date),
          getMonth(data.date) + 1,
          0
        ).toString();
        if (combinedData[key]) {
          combinedData[key] += data.amount;
        } else {
          combinedData[key] = data.amount;
        }
      });
    });

    return combinedData;
  }

  const incomeData = processDataList(summaryData.incomeList);
  const expenseData = processDataList(summaryData.expenseList);

  const allDays = new Set(
    [...Object.keys(incomeData), ...Object.keys(expenseData)].map(String)
  );

  return Array.from(allDays)
    .map((date) => ({
      date: format(new Date(date), "MMM yy"),
      dateObj: new Date(date),
      income: incomeData[date] || 0,
      expense: expenseData[date] || 0,
    }))
    .sort((a, b) => compareAsc(a.dateObj, b.dateObj));
}

export function AreaChartComponent({ className, data }: Props) {
  const chartData = formatAndCombineSummaryData(data);

  return (
    <Card className={cn(className, "text-left")}>
      <CardHeader>
        <CardTitle className="text-xl line-clamp-1">
          Income - Expense Chart
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.toLocaleString()}
            />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="income"
              type="linear"
              fill="var(--color-income)"
              fillOpacity={0.4}
              stroke="var(--color-income)"
            />
            <Area
              dataKey="expense"
              type="linear"
              fill="var(--color-expense)"
              fillOpacity={0.4}
              stroke="var(--color-expense)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
