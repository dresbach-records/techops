"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const mrrData = [
    { month: 'Mar', value: 9500 },
    { month: 'Abr', value: 11200 },
    { month: 'Mai', value: 12500 },
    { month: 'Jun', value: 14100 },
    { month: 'Jul', value: 15872 },
];


export function FinanceiroMrrChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
        <BarChart data={mrrData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="month"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `R$${value / 1000}k`}
          />
          <Tooltip
             contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
            }}
             formatter={(value: number) =>
                new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                }).format(value)
            }
           />
          <Legend wrapperStyle={{fontSize: "12px"}}/>
          <Bar dataKey="value" name="MRR" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
    </ResponsiveContainer>
  );
}
