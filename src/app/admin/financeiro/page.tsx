"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, CreditCard, Users } from "lucide-react";

const overviewCards = [
    { title: "Faturamento (MRR)", value: "R$ 15.872,00", description: "+5.2% vs. mês anterior", icon: <DollarSign /> },
    { title: "Clientes Ativos", value: "16", description: "+2 novos este mês", icon: <Users /> },
    { title: "Pagamentos Pendentes", value: "R$ 4.491,00", description: "3 boletos aguardando", icon: <CreditCard /> },
];

const recentTransactions = [
    { id: "PAY-001", client: "Empresa Inovadora", date: "2026-08-10", amount: "R$ 2.997,00", status: "Confirmado", method: "Boleto" },
    { id: "PAY-002", client: "Startup Ágil", date: "2026-08-09", amount: "R$ 1.997,00", status: "Confirmado", method: "Cartão" },
    { id: "PAY-003", client: "José da Silva", date: "2026-08-08", amount: "R$ 1.497,00", status: "Pendente", method: "Boleto" },
];

const statusVariant: { [key: string]: "default" | "secondary" | "destructive" } = {
  "Confirmado": "default",
  "Pendente": "secondary",
  "Falhou": "destructive",
};

export default function FinanceiroPage() {
  return (
    <div className="grid gap-6">
      <CardHeader className="p-0">
          <CardTitle className="font-headline text-3xl">Financeiro</CardTitle>
          <CardDescription>
            Controle pagamentos, faturas e relatórios financeiros.
          </CardDescription>
      </CardHeader>
       <div className="grid gap-6 md:grid-cols-3">
        {overviewCards.map(card => (
            <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <card.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
            </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Crescimento do Faturamento Mensal Recorrente (MRR)</CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="h-[300px] w-full flex items-center justify-center bg-muted rounded-lg">
                    <p className="text-muted-foreground">Gráfico temporariamente desativado para diagnóstico.</p>
                 </div>
              </CardContent>
          </Card>
          <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
                <Button>Gerar Relatório Mensal</Button>
                <Button variant="outline">Exportar Transações (CSV)</Button>
                <Button variant="secondary">Verificar Webhooks de Pagamento</Button>
            </CardContent>
          </Card>
      </div>

       <Card>
        <CardHeader>
            <CardTitle>Transações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Método</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {recentTransactions.map(tx => (
                        <TableRow key={tx.id}>
                            <TableCell className="font-medium">{tx.client}</TableCell>
                            <TableCell>{tx.date}</TableCell>
                            <TableCell>{tx.amount}</TableCell>
                            <TableCell>{tx.method}</TableCell>
                            <TableCell>
                                <Badge variant={statusVariant[tx.status]}>{tx.status}</Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
