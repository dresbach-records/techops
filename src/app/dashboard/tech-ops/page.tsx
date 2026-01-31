import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle, Clock, RefreshCw, Server, Database, Activity } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


const serviceStatus = [
    { name: "API (Go)", status: "ok", description: "Operando normalmente." },
    { name: "Banco de Dados (Postgres)", status: "ok", description: "Conexão estável." },
    { name: "Frontend (Vercel)", status: "ok", description: "Deploy ativo." },
];

const latencyData = [
  { name: '12:00', ms: 55 },
  { name: '12:05', ms: 62 },
  { name: '12:10', ms: 78 },
  { name: '12:15', ms: 85 },
  { name: '12:20', ms: 92 },
  { name: '12:25', ms: 110 },
  { name: '12:30', ms: 80 },
];

const errorLogs = [
    {
        id: "abc-123",
        level: "warning",
        endpoint: "/v1/dashboard",
        status: 401,
        error: "token expired",
        timestamp: "2026-02-01T12:05:10Z"
    },
    {
        id: "def-456",
        level: "error",
        endpoint: "/v1/payments/boleto",
        status: 502,
        error: "payment provider timeout",
        timestamp: "2026-02-01T12:01:25Z"
    },
];

const levelVariant: { [key: string]: "destructive" | "secondary" | "default" } = {
  error: "destructive",
  warning: "secondary",
  info: "default"
};


export default function TechOpsPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Tech Ops</CardTitle>
          <CardDescription>
            Monitore a saúde, performance e custos da infraestrutura do seu projeto.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            <div>
                <h3 className="text-xl font-semibold mb-4">Status dos Serviços</h3>
                <div className="grid md:grid-cols-3 gap-6">
                    {serviceStatus.map(service => (
                        <div key={service.name} className="p-4 border rounded-lg flex items-start gap-4">
                           {service.status === 'ok' ? <CheckCircle className="h-6 w-6 text-green-500 mt-1" /> : <AlertTriangle className="h-6 w-6 text-yellow-500 mt-1" />}
                            <div>
                                <p className="font-semibold">{service.name}</p>
                                <p className="text-sm text-muted-foreground">{service.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
                 <div className="border-t pt-4 mt-4 flex justify-between items-center">
                    <p className="text-xs text-muted-foreground flex items-center gap-2"><Clock className="h-3 w-3" /> Verificação em tempo real</p>
                    <Button variant="ghost" size="sm"><RefreshCw className="mr-2 h-4 w-4" /> Atualizar Status</Button>
                </div>
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-4">Performance da API</h3>
                <div className="grid md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Tempo de Resposta</CardTitle>
                            <Activity className="h-5 w-5 text-muted-foreground"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">82ms</div>
                            <p className="text-xs text-muted-foreground">Média das últimas 24h</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Taxa de Erros</CardTitle>
                            <AlertTriangle className="h-5 w-5 text-muted-foreground"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">0.8%</div>
                            <p className="text-xs text-muted-foreground">Média das últimas 24h</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
                            <Server className="h-5 w-5 text-muted-foreground"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">99.98%</div>
                            <p className="text-xs text-muted-foreground">Últimos 30 dias</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
      
            <div>
                <h3 className="text-xl font-semibold mb-4">Logs Recentes</h3>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nível</TableHead>
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
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
