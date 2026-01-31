"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const consultoriaData = [
  { name: 'Seg', 'Em Análise': 23, 'Concluídos': 0 },
  { name: 'Ter', 'Em Análise': 15, 'Concluídos': 8 },
  { name: 'Qua', 'Em Análise': 28, 'Concluídos': 12 },
  { name: 'Qui', 'Em Análise': 32, 'Concluídos': 5 },
  { name: 'Sex', 'Em Análise': 22, 'Concluídos': 0 },
  { name: 'Sáb', 'Em Análise': 15, 'Concluídos': 0 },
  { name: 'Dom', 'Em Análise': 10, 'Concluídos': 0 },
];

export function AdminConsultoriaChart() {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={consultoriaData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip cursor={{fill: 'rgba(230,230,230,0.5)'}} contentStyle={{background: "hsl(var(--background))", border: "1px solid hsl(var(--border))"}}/>
                <Legend wrapperStyle={{fontSize: "12px"}} />
                <Bar dataKey="Em Análise" stackId="a" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Concluídos" stackId="a" fill="hsl(var(--primary) / 0.3)" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    )
}
