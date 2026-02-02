
"use client"

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Briefcase, CreditCard, Server, AlertTriangle, Info, ChevronRight, AlertCircle, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// CHARTS ARE TEMPORARILY DISABLED TO FIX A BUILD ERROR

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
    { client: "João Pereira", status: "Em Análise", plan: "BUILD" },
    { client: "Empresa XYZ", status: "Aprovado", plan: "SCALE" },
    { client: "Ana Souza", status: "Pendente", plan: "START" },
    { client: "Tech Startup ABC", status: "Em Análise", plan: "RECOVERY" },
    { client: "Roberto Lima", status: "Pendente", plan: "BUILD" },
];

const statusColors: { [key: string]: string } = {
    "Em Análise": "bg-yellow-100 text-yellow-800",
    "Aprovado": "bg-green-100 text-green-800",
    "Pendente": "bg-blue-100 text-blue-800",
};

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
                            <TableHead>Plano Recomendado</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentDiagnostics.map(diag => (
                            <TableRow key={diag.client}>
                                <TableCell className="font-medium">{diag.client}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">{diag.plan}</Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge className={`${statusColors[diag.status]} hover:${statusColors[diag.status]}`}>{diag.status}</Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
             <div className="p-4 border-t flex justify-end">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/admin/diagnosticos">
                        Ver Todos <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                </Button>
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
                <Skeleton className="h-[300px] w-full" />
                <p className="text-center text-xs text-muted-foreground mt-2">Gráfico temporariamente desativado para corrigir erro de build.</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Resumo Financeiro</CardTitle>
            </CardHeader>
            <CardContent>
                 <Skeleton className="h-[300px] w-full" />
                 <p className="text-center text-xs text-muted-foreground mt-2">Gráfico temporariamente desativado para corrigir erro de build.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
