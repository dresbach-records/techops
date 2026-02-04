import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, Edit, ShieldOff } from "lucide-react";

const clientPanels = [
  { id: "USR-001", name: "Empresa Inovadora Ltda.", plan: "BUILD", status: "Ativo", modules: 5 },
  { id: "USR-002", name: "Startup Ágil S/A", plan: "SCALE", status: "Ativo", modules: 7 },
  { id: "USR-003", name: "José da Silva", plan: "START", status: "Pagamento Pendente", modules: 3 },
  { id: "USR-004", name: "Tech Solutions", plan: "RECOVERY", status: "Bloqueado", modules: 8 },
];

const statusVariant: { [key: string]: "default" | "secondary" | "destructive" } = {
  "Ativo": "default",
  "Pagamento Pendente": "secondary",
  "Bloqueado": "destructive",
};

const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
};

export default function PaineisClientesPage() {
  return (
    <div className="grid gap-6">
       <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Painéis dos Clientes</CardTitle>
          <CardDescription>
            Visualize e gerencie o painel de cada cliente individualmente.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clientPanels.map((client) => (
            <Card key={client.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                     <AvatarImage src={`/avatars/${client.id}.png`} alt={client.name} />
                     <AvatarFallback>{getInitials(client.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-xl">{client.name}</CardTitle>
                    <Badge variant={statusVariant[client.status]}>{client.status}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-3">
                 <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Plano</span>
                    <span className="font-medium">{client.plan}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Módulos Ativos</span>
                    <span className="font-medium">{client.modules}</span>
                 </div>
              </CardContent>
              <CardFooter className="border-t p-2">
                 <div className="flex w-full gap-2">
                    <Button variant="outline" className="w-full">
                        <Eye className="mr-2 h-4 w-4" /> Ver Painel
                    </Button>
                     <Button className="w-full">
                        <Edit className="mr-2 h-4 w-4" /> Gerenciar
                    </Button>
                 </div>
              </CardFooter>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
