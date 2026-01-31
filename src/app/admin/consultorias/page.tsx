import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const consultancies = [
  { id: "CON-001", client: "Empresa Inovadora Ltda.", consultant: "Lucas M.", date: "2026-08-25", time: "14:00", status: "Agendada" },
  { id: "CON-002", client: "Startup Ágil S/A", consultant: "Ana P.", date: "2026-08-22", time: "11:00", status: "Ativa" },
  { id: "CON-003", client: "José da Silva", consultant: "Lucas M.", date: "2026-08-18", time: "10:00", status: "Concluída" },
  { id: "CON-004", client: "Tech Solutions", consultant: "Carlos S.", date: "2026-08-15", time: "16:00", status: "Concluída" },
];

const statusVariant: { [key: string]: "default" | "secondary" | "outline" } = {
  "Agendada": "secondary",
  "Ativa": "default",
  "Concluída": "outline",
};

export default function ConsultoriasPage() {
  return (
    <div className="grid gap-6">
      <Card>
         <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-headline text-3xl">Consultorias</CardTitle>
              <CardDescription>
                Acompanhe consultorias ativas, agendadas e concluídas.
              </CardDescription>
            </div>
             <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Nova Consultoria
            </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="scheduled">Agendadas</TabsTrigger>
              <TabsTrigger value="active">Ativas</TabsTrigger>
              <TabsTrigger value="completed">Concluídas</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Consultor</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead><span className="sr-only">Ações</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {consultancies.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.client}</TableCell>
                      <TableCell>{item.consultant}</TableCell>
                      <TableCell>{item.date} às {item.time}</TableCell>
                      <TableCell><Badge variant={statusVariant[item.status]}>{item.status}</Badge></TableCell>
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
                            <DropdownMenuItem>Reagendar</DropdownMenuItem>
                            <DropdownMenuItem>Adicionar Notas</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
