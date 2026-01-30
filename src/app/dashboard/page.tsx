import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, ArrowRight, ClipboardCheck, GitFork, FileText } from "lucide-react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const quickLinks = [
  { href: "/dashboard/diagnostico", label: "Ver Diagnóstico", icon: <ClipboardCheck className="h-4 w-4" /> },
  { href: "/dashboard/roadmap", label: "Explorar Roadmap", icon: <GitFork className="h-4 w-4" /> },
  { href: "/dashboard/documentos", label: "Acessar Documentos", icon: <FileText className="h-4 w-4" /> },
];

const recentActivity = [
    {id: 1, description: "Seu Diagnóstico Técnico foi gerado.", date: "Há 2 horas", status: "Concluído"},
    {id: 2, description: "Questionário de Desafios enviado.", date: "Há 1 dia", status: "Concluído"},
    {id: 3, description: "Bem-vindo à TechAdvisory!", date: "Há 1 dia", status: "Info"},
]

export default function DashboardPage() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status do Diagnóstico</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Completo</div>
            <p className="text-xs text-muted-foreground">
              Seu diagnóstico e roadmap estão prontos.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próxima Etapa do Roadmap</CardTitle>
            <GitFork className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Refatoração do Módulo de Pagamentos</div>
            <p className="text-xs text-muted-foreground">
              Fase 1 - Prioridade Alta
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consultor Atribuído</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Dr. Alan Turing</div>
            <p className="text-xs text-muted-foreground">
              Especialista em Arquitetura de Software
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Acesso Rápido</CardTitle>
            <CardDescription>Navegue para as seções mais importantes.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {quickLinks.map((link) => (
              <Link href={link.href} key={link.href} className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent hover:text-accent-foreground">
                <div className="flex items-center gap-3">
                    {link.icon}
                    <span className="font-medium">{link.label}</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>Acompanhe as últimas atualizações na sua conta.</CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Data</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {recentActivity.map(activity => (
                        <TableRow key={activity.id}>
                            <TableCell className="font-medium">{activity.description}</TableCell>
                            <TableCell className="text-muted-foreground">{activity.date}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
