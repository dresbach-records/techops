import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, UserCheck, Zap } from "lucide-react";

const overviewCards = [
    {
        title: "Novos diagnósticos hoje",
        value: "5",
        icon: <UserCheck className="h-6 w-6 text-muted-foreground" />,
    },
    {
        title: "Clientes aguardando consultoria",
        value: "3",
        icon: <UserCheck className="h-6 w-6 text-muted-foreground" />,
    },
    {
        title: "IA com alerta",
        value: "1",
        icon: <AlertCircle className="h-6 w-6 text-destructive" />,
        color: "text-destructive"
    },
    {
        title: "Infra",
        value: "OK",
        icon: <CheckCircle className="h-6 w-6 text-green-500" />,
        color: "text-green-500"
    },
]

export default function AdminDashboardPage() {
  return (
    <div className="grid gap-6">
       <CardHeader className="p-0">
            <CardTitle className="font-headline text-3xl">Visão Geral</CardTitle>
            <CardDescription>
                Resumo executivo da operação da Tech Lab.
            </CardDescription>
        </CardHeader>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {overviewCards.map(card => (
            <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                {card.icon}
            </CardHeader>
            <CardContent>
                <div className={`text-2xl font-bold ${card.color || ''}`}>{card.value}</div>
            </CardContent>
            </Card>
        ))}
      </div>

       {/* Here you could add more sections like charts or recent activity tables */}

    </div>
  );
}
