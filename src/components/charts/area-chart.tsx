"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"
import { Data, SummaryData } from "@/features/summary/api/get-summary"


const chartConfig = {
  income: {
    label: "Income",
    color: "hsl(var(--primary))",
  },
  expense: {
    label: "Expense",
    color: "hsl(var(--destructive))",
  },
} satisfies ChartConfig

type Props = {
    className?: string
    data: SummaryData
}

function formatAndCombineSummaryData(summaryData: SummaryData): { afterDays: number, income: number, expense: number }[] {
    function processDataList(dataList: { data: Data[] }[]): { [key: number]: number } {
      const combinedData: { [key: number]: number } = {};
  
      dataList.forEach(item => {
        item.data.forEach(data => {
          if (combinedData[data.afterDays]) {
            combinedData[data.afterDays] += data.amount;
          } else {
            combinedData[data.afterDays] = data.amount;
          }
        });
      });
  
      return combinedData;
    }
  
    const incomeData = processDataList(summaryData.incomeList);
    const expenseData = processDataList(summaryData.expenseList);
  
    const allDays = new Set([...Object.keys(incomeData), ...Object.keys(expenseData)].map(Number));
  
    return Array.from(allDays).map(afterDays => ({
      afterDays,
      income: incomeData[afterDays] || 0,
      expense: expenseData[afterDays] || 0
    })).sort((a, b) => a.afterDays - b.afterDays);
  }

export function AreaChartComponent({className, data}: Props) {

    const chartData = formatAndCombineSummaryData(data)

  return (
    <Card className={cn(className, "text-left")}>
      <CardHeader>
        <CardTitle className="text-xl line-clamp-1">Financial Situation</CardTitle>
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
              dataKey="afterDays"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="income"
              type="basis"
              fill="var(--color-income)"
              fillOpacity={0.4}
              stroke="var(--color-income)"
            />
            <Area
              dataKey="expense"
              type="basis"
              fill="var(--color-expense)"
              fillOpacity={0.4}
              stroke="var(--color-expense)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
