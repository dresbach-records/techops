"use client";

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const financeiroData = [
    { name: 'Seg', 'Semana Passada': 28, 'Faturas Pendentes': 25 },
    { name: 'Ter', 'Semana Passada': 32, 'Faturas Pendentes': 22 },
    { name: 'Qua', 'Semana Passada': 25, 'Faturas Pendentes': 30 },
    { name: 'Qui', 'Semana Passada': 40, 'Faturas Pendentes': 35 },
    { name: 'Sex', 'Semana Passada': 42, 'Faturas Pendentes': 45 },
    { name: 'Sáb', 'Semana Passada': 38, 'Faturas Pendentes': 35 },
    { name: 'Dom', 'Semana Passada': 35, 'Faturas Pendentes': 38 },
];

export function AdminFinanceiroChart() {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={financeiroData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip contentStyle={{background: "hsl(var(--background))", border: "1px solid hsl(var(--border))"}}/>
                <Legend wrapperStyle={{fontSize: "12px"}} />
                <Line type="monotone" dataKey="Semana Passada" stroke="hsl(var(--primary))" strokeWidth={2} dot={{r: 4}} activeDot={{r: 6}} />
                <Line type="monotone" dataKey="Faturas Pendentes" stroke="hsl(var(--destructive))" strokeWidth={2} dot={{r: 4}} activeDot={{r: 6}}/>
            </LineChart>
        </ResponsiveContainer>
    )
}
