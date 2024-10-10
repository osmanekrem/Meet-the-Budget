"use client";

import { Label, Pie, PieChart, ResponsiveContainer } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { SummaryData } from "@/features/summary/api/get-summary";
import { FC, useMemo } from "react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

interface IncomeChartProps {
  data: SummaryData;
}

const getRandomColor = (length: number, step: number) => {
  return `hsl(${100 - (step / length) * 360}, 70%, 50%)`;
};

const IncomeChart: FC<IncomeChartProps> = ({ data }) => {
  
  const chartData = useMemo(
    () =>
      data.incomeList.map((income, i) => {
        const length = data.incomeList.length;

        const order = Array.from(Array(length).keys())
          .map((i) => i + 1)
          .sort((a, b) => (a % 2) - (b % 2) || a - b);

        return {
          name: income.name,
          totalAmount: income.totalAmount,
          fill: getRandomColor(length, order[i]),
        };
      }),
    [data]
  );

  const totalAmount = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.totalAmount, 0);
  }, [chartData]);

  const chartConfig = useMemo(() => {
    return chartData.reduce(
      (config: ChartConfig, item) => {
        config[item.name] = {
          label: item.name,
          color: item.fill,
        };
        return config;
      },
      {
        totalAmount: { label: "Total Amount" },
      }
    ) as ChartConfig;
  }, [chartData]);

  if (data.incomeList.every((income) => !income.data.length)) {
    return (
      <div className="flex items-center justify-center p-2 py-8">
        <p className="flex flex-col gap-1.5 items-center">
          You don&apos;t have any income yet.
          <Link href="/save/incomes" className={buttonVariants({ size: "sm" })}>
            Add income
          </Link>
        </p>
      </div>
    );
  }

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[250px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="totalAmount"
          nameKey="name"
          innerRadius={70}
          strokeWidth={4}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-3xl font-bold"
                    >
                      {totalAmount.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      Total Income
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
};
export default IncomeChart;
