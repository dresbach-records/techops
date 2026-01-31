"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit, Bot, FileText } from "lucide-react";
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

const aiLogs = [
    { id: "LOG001", context: "Análise de Diagnóstico", model: "gemini-pro", tokens: 1250, timestamp: "2026-08-01 10:15" },
    { id: "LOG002", context: "Sugestão de Roadmap", model: "gemini-pro", tokens: 850, timestamp: "2026-08-01 10:18" },
    { id: "LOG003", context: "Análise de Repositório", model: "gemini-pro-vision", tokens: 4500, timestamp: "2026-08-03 15:30" },
]

export default function IaPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">IA e Automação</CardTitle>
          <CardDescription>
            Monitore o uso, performance e custos relacionados à Inteligência Artificial no seu projeto.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            <div className="grid md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Chamadas de IA (Últimos 7 dias)</CardTitle>
                        <BrainCircuit className="h-5 w-5 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">41</div>
                        <p className="text-xs text-muted-foreground">+15% em relação à semana anterior</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Custo Estimado (Mês)</CardTitle>
                        <BrainCircuit className="h-5 w-5 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$2.75</div>
                        <p className="text-xs text-muted-foreground">Baseado no uso atual</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Automações Ativas</CardTitle>
                        <Bot className="h-5 w-5 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2</div>
                        <p className="text-xs text-muted-foreground">Análise de Diagnóstico, Sugestão de Roadmap</p>
                    </CardContent>
                </Card>
            </div>
             <div>
                <h3 className="text-xl font-semibold mb-4">Uso de IA (Últimos 7 dias)</h3>
                <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={aiUsageData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                            <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                            <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '0.5rem' }} />
                            <Legend wrapperStyle={{fontSize: "12px"}}/>
                            <Line type="monotone" dataKey="calls" name="Chamadas à API" stroke="hsl(var(--primary))" strokeWidth={2} dot={{r: 4}} activeDot={{r: 6}} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
             <div>
                <h3 className="text-xl font-semibold mb-4">Logs de Atividade da IA</h3>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Contexto</TableHead>
                            <TableHead>Modelo Utilizado</TableHead>
                            <TableHead>Tokens</TableHead>
                            <TableHead className="text-right">Timestamp</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {aiLogs.map(log => (
                            <TableRow key={log.id}>
                                <TableCell className="font-medium flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-muted-foreground" />
                                  {log.context}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">{log.model}</Badge>
                                </TableCell>
                                <TableCell>{log.tokens.toLocaleString("pt-BR")}</TableCell>
                                <TableCell className="text-right font-mono text-xs">{log.timestamp}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
