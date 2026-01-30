import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const supportTickets = [
  {
    id: "TKT-001",
    subject: "Dúvida sobre implementação do API Gateway",
    status: "Fechado",
    lastUpdate: "2024-08-05",
  },
  {
    id: "TKT-002",
    subject: "Problema com pipeline de CI no novo serviço",
    status: "Aberto",
    lastUpdate: "2024-08-10",
  },
   {
    id: "TKT-003",
    subject: "Sugestão de melhoria no log centralizado",
    status: "Em Análise",
    lastUpdate: "2024-08-12",
  },
];

const statusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  Aberto: "destructive",
  Fechado: "default",
  "Em Análise": "secondary"
}

export default function SupportPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle className="font-headline text-3xl">Suporte Técnico</CardTitle>
                <CardDescription>
                    Gerencie seus tickets de suporte e abra novas solicitações.
                </CardDescription>
            </div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Novo Ticket
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Abrir Novo Ticket de Suporte</DialogTitle>
                        <DialogDescription>
                            Descreva seu problema ou dúvida em detalhes para que possamos ajudar.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="subject" className="text-right">Assunto</Label>
                            <Input id="subject" placeholder="Ex: Dúvida sobre Docker" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">Descrição</Label>
                            <Textarea id="description" placeholder="Descreva o problema em detalhes..." className="col-span-3" />
                        </div>
                    </div>
                     <DialogFooter>
                        <Button type="submit">Enviar Ticket</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket ID</TableHead>
                <TableHead>Assunto</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Última Atualização</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {supportTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">{ticket.id}</TableCell>
                  <TableCell>{ticket.subject}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[ticket.status]}>{ticket.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{ticket.lastUpdate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
