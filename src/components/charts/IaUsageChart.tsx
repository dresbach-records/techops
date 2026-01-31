"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const aiUsageData = [
  { date: '01/08', calls: 5 },
  { date: '02/08', calls: 8 },
  { date: '03/08', calls: 3 },
  { date: '04/08', calls: 12 },
  { date: '05/08', calls: 7 },
  { date: '06/08', calls: 10 },
  { date: '07/08', calls: 6 },
];

export function IaUsageChart() {
    return (
        <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={aiUsageData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                    <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '0.5rem', background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }} />
                    <Legend wrapperStyle={{fontSize: "12px"}}/>
                    <Line type="monotone" dataKey="calls" name="Chamadas à API" stroke="hsl(var(--primary))" strokeWidth={2} dot={{r: 4}} activeDot={{r: 6}} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}
