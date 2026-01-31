"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, AlertTriangle, GitFork, CheckCircle, ArrowRight, FileText, Send, User, Loader2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import { getDashboardData } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import type { DashboardData, DashboardOverviewCard } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

const communicationData = [
  { name: 'Seg', value: 200 },
  { name: 'Qua', value: 300 },
  { name: 'Sex', value: 150 },
  { name: 'Dom', value: 400 },
  { name: 'Ter', value: 250 },
];

const ICONS: { [key: string]: React.ElementType } = {
    Briefcase,
    AlertTriangle,
    GitFork,
    FileText,
};

const NextStepStatusBadge = ({ status }: { status: string }) => {
    if (status === 'completed') {
        return <Badge variant="default" className="bg-green-600">Concluído</Badge>;
    }
    return <Badge variant="secondary">Pendente</Badge>;
};

function DashboardSkeleton() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-5 w-full max-w-lg" />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                           <Skeleton className="h-5 w-24" />
                           <Skeleton className="h-6 w-6 rounded-sm" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-6 w-32 mb-1" />
                            <Skeleton className="h-4 w-20" />
                        </CardContent>
                    </Card>
                ))}
            </div>
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
                 <div className="lg:col-span-1 space-y-6">
                     <Skeleton className="h-64 w-full" />
                     <Skeleton className="h-80 w-full" />
                </div>
            </div>
        </div>
    )
}

export default function DashboardPage() {
    const { user } = useAuth();
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await getDashboardData();
                setDashboardData(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Ocorreu um erro desconhecido.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <DashboardSkeleton />;
    }

    if (error || !dashboardData) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-destructive">Falha ao carregar o painel</h2>
                    <p className="text-muted-foreground mt-2">{error || "Não foi possível buscar os dados do seu painel."}</p>
                    <Button onClick={() => window.location.reload()} className="mt-4">Tentar Novamente</Button>
                </div>
            </div>
        );
    }
  
    const { welcomeMessage, welcomeSubtext, overviewCards, nextSteps, projectDocuments } = dashboardData;

    return (
        <div className="flex flex-col gap-6">
        <div>
            <h1 className="text-2xl font-bold font-headline">{welcomeMessage}</h1>
            <p className="text-muted-foreground">{welcomeSubtext}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {overviewCards.map((card, index) => {
                 const IconComponent = ICONS[card.icon];
                 return(
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                        {IconComponent && <IconComponent className="h-6 w-6 text-muted-foreground" />}
                        </CardHeader>
                        <CardContent>
                        <div className="text-xl font-bold">{card.value}</div>
                        {card.description && <p className="text-xs text-muted-foreground">{card.description}</p>}
                        </CardContent>
                    </Card>
                 )
            })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            Diagnóstico Técnico
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                            <p className="text-muted-foreground">Seu diagnóstico inicial foi analisado e o diagnóstico técnico completo foi gerado. Vamos irar juntos?</p>
                        </div>
                        <div className="border-t pt-4 space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Classificação</span>
                                <span className="font-medium">Estágio: Protótipo</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Complexidade</span>
                                <span className="font-medium">Média</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Risco Técnico</span>
                                <span className="font-medium">Médio</span>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-2">
                            <Badge variant="secondary">Arquitetura Inicial</Badge>
                            <Badge variant="secondary">Escalabilidade</Badge>
                            <Badge variant="secondary">Segurança</Badge>
                        </div>
                    </CardContent>
                    <div className="p-4 border-t flex justify-end">
                        <Button asChild>
                            <Link href="/dashboard/diagnostico">Ver Diagnóstico</Link>
                        </Button>
                    </div>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Documentos do Projeto</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                         {projectDocuments.map((doc, index) => {
                             const IconComponent = ICONS[doc.icon];
                             return (
                                <Link href={doc.link} key={index} className="flex items-center justify-between p-3 rounded-md border hover:bg-muted/50">
                                    <div className="flex items-center gap-3">
                                        {IconComponent && <IconComponent className="h-5 w-5 text-primary" />}
                                        <span className="font-medium">{doc.title}</span>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                </Link>
                             )
                         })}
                    </CardContent>
                    <div className="p-4 border-t flex justify-end">
                        <Button asChild><Link href="/dashboard/documentos">Ver Todos</Link></Button>
                    </div>
                </Card>

            </div>

            <div className="lg:col-span-1 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Próximos Passos</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {nextSteps.map((step, index) => (
                             <div key={index} className="space-y-2">
                                <div className="flex items-start gap-3">
                                    {step.status === 'completed' ? <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0"/> : <CheckCircle className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0"/>}
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-semibold">{step.title}</h4>
                                            <NextStepStatusBadge status={step.status} />
                                        </div>
                                        <p className="text-sm text-muted-foreground">{step.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                    <div className="p-4 border-t flex justify-end">
                        <Button asChild>
                            <Link href="/dashboard/roadmap">Ver Roadmap</Link>
                        </Button>
                    </div>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Comunicação com Tech Lab</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-24">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={communicationData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ fontSize: '12px', borderRadius: '0.5rem' }} />
                                    <Bar dataKey="value" fill="#16a34a" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 space-y-3">
                            <div className="flex items-start gap-3">
                                <Avatar className="h-8 w-8 border">
                                    <AvatarImage src="https://avatar.vercel.sh/lucas.png" alt="Lucas" />
                                    <AvatarFallback>LC</AvatarFallback>
                                </Avatar>
                                <div className="bg-muted p-3 rounded-lg rounded-tl-none w-full">
                                    <p className="text-sm font-semibold">Lucas (Consultor)</p>
                                    <p className="text-sm text-muted-foreground">Olá! Podemos agendar 30 minutos na terça para detalhar a escalabilidade?</p>
                                </div>
                            </div>
                            <div className="relative">
                                <Input placeholder="Digite uma mensagem..." className="pr-10"/>
                                <Button size="icon" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
        </div>
    );
}
