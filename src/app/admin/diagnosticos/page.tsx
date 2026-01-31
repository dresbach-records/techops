import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data, to be replaced by API call
const diagnostics = [
  {
    id: "DIAG-001",
    clientName: "Empresa Inovadora Ltda.",
    submittedAt: "2024-07-28",
    status: "Pendente",
    recommendedPlan: "BUILD",
    risk: "Médio",
  },
  {
    id: "DIAG-002",
    clientName: "Startup Ágil S/A",
    submittedAt: "2024-07-27",
    status: "Aprovado",
    recommendedPlan: "SCALE",
    risk: "Baixo",
  },
  {
    id: "DIAG-003",
    clientName: "José da Silva",
    submittedAt: "2024-07-26",
    status: "Requer Ajuste",
    recommendedPlan: "START",
    risk: "Alto",
  },
  {
    id: "DIAG-004",
    clientName: "Tech Solutions",
    submittedAt: "2024-07-25",
    status: "Aprovado",
    recommendedPlan: "RECOVERY",
    risk: "Alto",
  },
];

const statusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  "Pendente": "secondary",
  "Aprovado": "default",
  "Requer Ajuste": "destructive",
};

const riskVariant: { [key: string]: "default" | "secondary" | "destructive" } = {
  "Baixo": "default",
  "Médio": "secondary",
  "Alto": "destructive",
};

export default function DiagnosticosPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Diagnósticos Recebidos</CardTitle>
          <CardDescription>
            Analise, valide e aprove os diagnósticos gerados pela plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Data de Envio</TableHead>
                <TableHead>Plano Recomendado</TableHead>
                <TableHead>Risco (IA)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {diagnostics.map((diag) => (
                <TableRow key={diag.id}>
                  <TableCell className="font-medium">{diag.clientName}</TableCell>
                  <TableCell>{diag.submittedAt}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{diag.recommendedPlan}</Badge>
                  </TableCell>
                   <TableCell>
                    <Badge variant={riskVariant[diag.risk as keyof typeof riskVariant]}>{diag.risk}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[diag.status]}>{diag.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                        <DropdownMenuItem>Aprovar</DropdownMenuItem>
                        <DropdownMenuItem>Solicitar Ajuste</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
