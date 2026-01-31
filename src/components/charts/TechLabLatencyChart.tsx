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


const latencyData = [
  { name: '12:00', ms: 55 },
  { name: '12:05', ms: 62 },
  { name: '12:10', ms: 78 },
  { name: '12:15', ms: 85 },
  { name: '12:20', ms: 92 },
  { name: '12:25', ms: 110 },
  { name: '12:30', ms: 80 },
];

export function TechLabLatencyChart() {
    return (
        <ResponsiveContainer width="100%" height={250}>
            <LineChart data={latencyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '0.5rem', background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }} />
                <Legend wrapperStyle={{fontSize: "12px"}}/>
                <Line type="monotone" dataKey="ms" name="Latência (ms)" stroke="hsl(var(--primary))" strokeWidth={2} dot={{r: 4}} activeDot={{r: 6}} />
            </LineChart>
        </ResponsiveContainer>
    )
}
