"use client";

import { Data, SummaryData } from "@/features/summary/api/get-summary";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { cn } from "@/lib/utils";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";
import { compareAsc, format, getMonth, getYear } from "date-fns";

type Props = {
  className?: string;
  data: SummaryData;
};

const chartConfig = {
  financialSituation: {
    label: "Financial Situation",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

function formatAndCombineSummaryData(
  summaryData: SummaryData
): { date: string; financialSituation: number }[] {
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

  const allDays = Array.from(
    new Set(
      [...Object.keys(incomeData), ...Object.keys(expenseData)].map(String)
    )
  ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  let cumulativeIncome = 0;
  let cumulativeExpense = 0;

  return allDays.map((date) => {
    cumulativeIncome += incomeData[date] || 0;
    cumulativeExpense += expenseData[date] || 0;
    return {
      date: format(new Date(date), "MMM yy"),
      financialSituation: cumulativeIncome - cumulativeExpense,
    };
  });
}

const FinancialSituationChart = ({ className, data }: Props) => {
  const chartData = formatAndCombineSummaryData(data);
  return (
    <Card className={cn(className, "text-left")}>
      <CardHeader>
        <CardTitle className="text-xl line-clamp-1">
          Financial Situation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Line
              dataKey="financialSituation"
              type="linear"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default FinancialSituationChart;
