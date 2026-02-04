"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";

const FinanceiroMrrChart = dynamic(
    () => import('@/components/charts/FinanceiroMrrChart').then(mod => mod.FinanceiroMrrChart),
    { 
        ssr: false,
        loading: () => <Skeleton className="h-[300px] w-full" />
    }
);

export default function FinanceiroPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Financeiro</CardTitle>
          <CardDescription>
            Acompanhe o faturamento, MRR e métricas financeiras.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            <div className="grid md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Faturamento Total</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">R$ 45.231,89</div>
                        <p className="text-xs text-muted-foreground">+20.1% do mês passado</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">MRR (Receita Recorrente)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">R$ 15.872,00</div>
                        <p className="text-xs text-muted-foreground">+5.2% do mês passado</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">+2 este mês</p>
                    </CardContent>
                </Card>
            </div>
             <div>
                <h3 className="text-xl font-semibold mb-4">Evolução do MRR</h3>
                 <FinanceiroMrrChart />
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
