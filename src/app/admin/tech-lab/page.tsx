"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle, Clock, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const statusCards = [
    {
        title: "API Status",
        status: "ok",
        description: "Todos os serviços da API estão respondendo.",
        icon: <CheckCircle className="h-6 w-6 text-green-500" />
    },
    {
        title: "Database Connection",
        status: "ok",
        description: "Conexão com o banco de dados está estável.",
        icon: <CheckCircle className="h-6 w-6 text-green-500" />
    },
    {
        title: "AI Service",
        status: "ok",
        description: "Serviço de IA está acessível.",
        icon: <CheckCircle className="h-6 w-6 text-green-500" />
    },
    {
        title: "Payment Gateway",
        status: "degraded",
        description: "Latência elevada no webhook de pagamentos.",
        icon: <AlertTriangle className="h-6 w-6 text-yellow-500" />
    },
];

const errorLogs = [
    {
        id: "abc-123",
        level: "error",
        endpoint: "/webhooks/whatsapp",
        status: 500,
        error: "invalid signature",
        timestamp: "2026-02-01T12:05:10Z"
    },
    {
        id: "def-456",
        level: "error",
        endpoint: "/payments/boleto",
        status: 502,
        error: "payment provider timeout",
        timestamp: "2026-02-01T12:01:25Z"
    },
     {
        id: "ghi-789",
        level: "warning",
        endpoint: "/auth/login",
        status: 429,
        error: "rate limit exceeded",
        timestamp: "2026-02-01T11:59:40Z"
    }
];

const levelVariant: { [key: string]: "destructive" | "secondary" | "default" } = {
  error: "destructive",
  warning: "secondary",
  info: "default"
};


export default function TechLabPage() {
  return (
    <div className="grid gap-6">
      <CardHeader className="p-0">
          <CardTitle className="font-headline text-3xl">Tech Ops Dashboard</CardTitle>
          <CardDescription>
            Monitore a saúde, performance e custos da infraestrutura.
          </CardDescription>
      </CardHeader>
      
      <Card>
        <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Verificação em tempo real dos serviços críticos.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {statusCards.map(card => (
                <div key={card.title} className="p-4 border rounded-lg flex items-start gap-4">
                    {card.icon}
                    <div>
                        <p className="font-semibold">{card.title}</p>
                        <p className="text-sm text-muted-foreground">{card.description}</p>
                    </div>
                </div>
            ))}
        </CardContent>
        <CardFooter className="border-t pt-4 flex justify-between items-center">
            <p className="text-xs text-muted-foreground flex items-center gap-2"><Clock className="h-3 w-3" /> Última verificação: Agora</p>
            <Button variant="ghost" size="sm"><RefreshCw className="mr-2 h-4 w-4" /> Verificar Novamente</Button>
        </CardFooter>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
            <CardHeader>
                <CardTitle>Latência da API (ms)</CardTitle>
                <CardDescription>Tempo médio de resposta dos últimos 30 minutos.</CardDescription>
            </CardHeader>
            <CardContent>
                <Skeleton className="h-[250px] w-full" />
                <p className="text-center text-xs text-muted-foreground mt-2">Gráfico temporariamente desativado para corrigir erro de build.</p>
            </CardContent>
        </Card>
        
        <Card>
             <CardHeader>
                <CardTitle>Métricas Gerais</CardTitle>
                 <CardDescription>Visão geral do tráfego e uso.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold">5.3k</p>
                    <p className="text-sm text-muted-foreground">Requests/hora</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold">78ms</p>
                    <p className="text-sm text-muted-foreground">Avg. Response</p>
                </div>
                 <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-red-500">1.2%</p>
                    <p className="text-sm text-muted-foreground">Error Rate</p>
                </div>
                 <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold">212</p>
                    <p className="text-sm text-muted-foreground">AI Calls/dia</p>
                </div>
            </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
            <CardTitle>Logs Críticos Recentes</CardTitle>
            <CardDescription>Últimos erros e alertas registrados pelo sistema.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Level</TableHead>
                        <TableHead>Endpoint</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Mensagem</TableHead>
                        <TableHead className="text-right">Timestamp</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {errorLogs.map(log => (
                        <TableRow key={log.id}>
                            <TableCell><Badge variant={levelVariant[log.level]}>{log.level}</Badge></TableCell>
                            <TableCell className="font-mono text-xs">{log.endpoint}</TableCell>
                            <TableCell>{log.status}</TableCell>
                            <TableCell>{log.error}</TableCell>
                            <TableCell className="text-right font-mono text-xs">{log.timestamp}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>

    </div>
  );
}
