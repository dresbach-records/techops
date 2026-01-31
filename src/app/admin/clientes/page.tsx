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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock data, to be replaced by API call
const clients = [
  {
    id: "USR-001",
    name: "Empresa Inovadora Ltda.",
    email: "contato@inovadora.com",
    plan: "BUILD",
    status: "Ativo",
    lastActivity: "2024-08-12",
    risk: "Baixo",
  },
  {
    id: "USR-002",
    name: "Startup Ágil S/A",
    email: "dev@agil.io",
    plan: "SCALE",
    status: "Ativo",
    lastActivity: "2024-08-11",
    risk: "Médio",
  },
    {
    id: "USR-003",
    name: "José da Silva",
    email: "jose.silva@example.com",
    plan: "START",
    status: "Pendente",
    lastActivity: "2024-08-10",
    risk: "Baixo",
  },
   {
    id: "USR-004",
    name: "Tech Solutions",
    email: "suporte@techsolutions.com.br",
    plan: "RECOVERY",
    status: "Inativo",
    lastActivity: "2024-07-25",
    risk: "Alto",
  },
];

const statusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  "Ativo": "default",
  "Pendente": "secondary",
  "Inativo": "destructive",
};

const riskVariant: { [key: string]: "default" | "secondary" | "destructive" } = {
  "Baixo": "default",
  "Médio": "secondary",
  "Alto": "destructive",
};

const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };


export default function ClientesPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Clientes</CardTitle>
          <CardDescription>
            Gerencie todos os clientes da plataforma, seus perfis e históricos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Última Atividade</TableHead>
                <TableHead>Risco Técnico</TableHead>
                <TableHead>
                  <span className="sr-only">Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                        <Avatar className="hidden h-9 w-9 sm:flex">
                           <AvatarImage src={`/avatars/${client.id}.png`} alt={client.name} />
                           <AvatarFallback>{getInitials(client.name)}</AvatarFallback>
                        </Avatar>
                        <div className="grid gap-0.5">
                            <p className="font-medium">{client.name}</p>
                            <p className="text-sm text-muted-foreground">{client.email}</p>
                        </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{client.plan}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[client.status]}>{client.status}</Badge>
                  </TableCell>
                  <TableCell>{client.lastActivity}</TableCell>
                  <TableCell>
                    <Badge variant={riskVariant[client.risk]}>{client.risk}</Badge>
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
                        <DropdownMenuItem>Ver Painel</DropdownMenuItem>
                        <DropdownMenuItem>Editar Cadastro</DropdownMenuItem>
                        <DropdownMenuItem>Ajustar Plano</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Desativar Cliente</DropdownMenuItem>
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
