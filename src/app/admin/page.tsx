"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Briefcase, CreditCard, Server, AlertTriangle, Info, ChevronRight, AlertCircle, CheckCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";

const overviewCards = [
    {
        title: "Novos Diagnósticos",
        value: "8",
        description: "Hoje",
        icon: <Briefcase className="h-6 w-6 text-muted-foreground" />,
    },
    {
        title: "Consultorias Ativas",
        value: "12",
        description: "Em andamento",
        icon: <Briefcase className="h-6 w-6 text-muted-foreground" />,
    },
    {
        title: "Pagamentos Pendentes",
        value: "3",
        description: "Aguardando",
        icon: <CreditCard className="h-6 w-6 text-muted-foreground" />,
    },
    {
        title: "Status da Infraestrutura",
        value: "Normal",
        description: "Operação Estável",
        icon: <CheckCircle className="h-6 w-6 text-green-500" />,
        valueColor: "text-green-500"
    },
];

const recentDiagnostics = [
    { client: "João Pereira", stage: "Protótipo", complexity: "Média", status: "Em Análise", consultant: "Lucas" },
    { client: "Empresa XYZ", stage: "Produção", complexity: "Alta", status: "Concluído", consultant: "Mariana" },
    { client: "Ana Souza", stage: "Ideia", complexity: "Baixa", status: "Novo", consultant: "Pedro" },
    { client: "Tech Startup ABC", stage: "Reestruturação", complexity: "Média", status: "Em Análise", consultant: "Carla" },
    { client: "Roberto Lima", stage: "Protótipo", complexity: "Baixa", status: "Novo", consultant: "Lucas" },
];

const statusColors: { [key: string]: string } = {
    "Em Análise": "bg-yellow-100 text-yellow-800",
    "Concluído": "bg-green-100 text-green-800",
    "Novo": "bg-blue-100 text-blue-800",
};

const consultoriaData = [
  { name: 'Seg', 'Em Análise': 23, 'Concluídos': 0 },
  { name: 'Ter', 'Em Análise': 15, 'Concluídos': 8 },
  { name: 'Qua', 'Em Análise': 28, 'Concluídos': 12 },
  { name: 'Qui', 'Em Análise': 32, 'Concluídos': 5 },
  { name: 'Sex', 'Em Análise': 22, 'Concluídos': 0 },
  { name: 'Sáb', 'Em Análise': 15, 'Concluídos': 0 },
  { name: 'Dom', 'Em Análise': 10, 'Concluídos': 0 },
];

const financeiroData = [
    { name: 'Seg', 'Semana Passada': 28, 'Faturas Pendentes': 25 },
    { name: 'Ter', 'Semana Passada': 32, 'Faturas Pendentes': 22 },
    { name: 'Qua', 'Semana Passada': 25, 'Faturas Pendentes': 30 },
    { name: 'Qui', 'Semana Passada': 40, 'Faturas Pendentes': 35 },
    { name: 'Sex', 'Semana Passada': 42, 'Faturas Pendentes': 45 },
    { name: 'Sáb', 'Semana Passada': 38, 'Faturas Pendentes': 35 },
    { name: 'Dom', 'Semana Passada': 35, 'Faturas Pendentes': 38 },
];

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
       <CardHeader className="p-0">
            <CardTitle className="font-headline text-2xl">Painel Admin - Tech Lab</CardTitle>
        </CardHeader>
        
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {overviewCards.map(card => (
            <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                {card.icon}
            </CardHeader>
            <CardContent>
                <div className={`text-2xl font-bold ${card.valueColor || ''}`}>{card.value}</div>
                <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
            </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Diagnósticos Recentes</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Estágio</TableHead>
                            <TableHead>Complexidade</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Consultor</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentDiagnostics.map(diag => (
                            <TableRow key={diag.client}>
                                <TableCell className="font-medium">{diag.client}</TableCell>
                                <TableCell>{diag.stage}</TableCell>
                                <TableCell>{diag.complexity}</TableCell>
                                <TableCell>
                                    <Badge className={`${statusColors[diag.status]} hover:${statusColors[diag.status]}`}>{diag.status}</Badge>
                                </TableCell>
                                <TableCell>{diag.consultant}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
             <div className="p-4 border-t flex justify-end">
                <Button variant="ghost" size="sm">Ver Todos <ChevronRight className="h-4 w-4 ml-1" /></Button>
            </div>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Alertas de Sistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                        <h4 className="font-semibold flex items-center gap-2"><AlertTriangle className="text-red-500 h-5 w-5" /> Uso de IA Elevado</h4>
                        <Badge variant="destructive" className="text-xs">Risco Crítico</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Consumo de API acima do esperado.</p>
                    <Button variant="destructive" size="sm" className="w-full">Verificar</Button>
                </div>
                 <div className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                        <h4 className="font-semibold flex items-center gap-2"><AlertCircle className="text-yellow-500 h-5 w-5" /> Erro no Backup</h4>
                         <Badge variant="secondary" className="text-xs">Falha Detectada</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Backup diário falhou às 03:00.</p>
                    <Button variant="secondary" size="sm" className="w-full">Investigar</Button>
                </div>
            </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
            <CardHeader>
                <CardTitle>Próximas Consultorias</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={consultoriaData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" fontSize={12} />
                        <YAxis fontSize={12} />
                        <Tooltip cursor={{fill: 'rgba(230,230,230,0.5)'}} />
                        <Legend wrapperStyle={{fontSize: "12px"}} />
                        <Bar dataKey="Em Análise" stackId="a" fill="#16a34a" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Concluídos" stackId="a" fill="#a7f3d0" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Resumo Financeiro</CardTitle>
            </CardHeader>
            <CardContent>
                 <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={financeiroData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" fontSize={12} />
                        <YAxis fontSize={12} />
                        <Tooltip />
                        <Legend wrapperStyle={{fontSize: "12px"}} />
                        <Line type="monotone" dataKey="Semana Passada" stroke="#16a34a" strokeWidth={2} dot={{r: 4}} activeDot={{r: 6}} />
                        <Line type="monotone" dataKey="Faturas Pendentes" stroke="#8884d8" strokeWidth={2} dot={{r: 4}} activeDot={{r: 6}}/>
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
