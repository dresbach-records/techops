"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle, List, Shield, Ban } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboard } from "@/contexts/DashboardContext";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";

function DashboardSkeleton() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-5 w-full max-w-lg" />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                           <Skeleton className="h-6 w-32" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-5 w-24" />
                        </CardContent>
                    </Card>
                ))}
            </div>
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-48" />
                </CardHeader>
                 <CardContent>
                   <div className="flex flex-wrap gap-2">
                     {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-8 w-28" />
                    ))}
                   </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default function DashboardPage() {
    const { dashboardData, loading, error, refetch } = useDashboard();
    const { user } = useAuth();

    if (loading) {
        return <DashboardSkeleton />;
    }

    if (error || !dashboardData) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-destructive">Falha ao carregar o painel</h2>
                    <p className="text-muted-foreground mt-2">{error || "Não foi possível buscar os dados do seu painel."}</p>
                    <Button onClick={() => refetch()} className="mt-4">Tentar Novamente</Button>
                </div>
            </div>
        );
    }
  
    const { plano, status, modulos } = dashboardData;
    const isBlocked = status === 'bloqueado';

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold font-headline">Painel do Cliente</h1>
                <p className="text-muted-foreground">Bem-vindo, {user?.nome}. Seu painel é controlado pelo seu plano e status.</p>
            </div>

            {isBlocked && (
                 <Card className="border-destructive">
                    <CardHeader className="flex flex-row items-center gap-4">
                        <Ban className="h-8 w-8 text-destructive" />
                        <div>
                            <CardTitle className="text-destructive">Acesso Bloqueado</CardTitle>
                            <CardDescription>
                                Seu acesso ao painel foi temporariamente bloqueado. Entre em contato com o suporte.
                            </CardDescription>
                        </div>
                    </CardHeader>
                </Card>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Plano Contratado</CardTitle>
                        <Shield className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{plano}</div>
                        <p className="text-xs text-muted-foreground">Seu plano de consultoria atual.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Status da Conta</CardTitle>
                        {status === 'ativo' ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold capitalize">{status}</div>
                         <p className="text-xs text-muted-foreground">Status atual do seu acesso.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Módulos Ativos</CardTitle>
                        <List className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{modulos.length}</div>
                        <p className="text-xs text-muted-foreground">Módulos liberados para você.</p>
                    </CardContent>
                </Card>
            </div>

             <Card>
                <CardHeader>
                    <CardTitle>Seus Módulos</CardTitle>
                    <CardDescription>Estes são os módulos disponíveis para você no menu lateral, definidos pelo seu plano.</CardDescription>
                </CardHeader>
                <CardContent>
                   <div className="flex flex-wrap gap-2">
                     {modulos.map((modulo) => (
                        <Badge key={modulo} variant="secondary" className="text-base py-1 px-3 capitalize">
                            {modulo.replace(/-/g, ' ')}
                        </Badge>
                     ))}
                   </div>
                </CardContent>
            </Card>
        </div>
    );
}
