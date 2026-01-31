import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle, UserCog } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const internalUsers = [
    { id: "ADM-001", name: "Admin Tech Lab", email: "admin@techlab.com.br", role: "Admin", status: "Ativo" },
    { id: "CONS-001", name: "Lucas M.", email: "lucas.m@techlab.com.br", role: "Consultor", status: "Ativo" },
    { id: "CONS-002", name: "Ana P.", email: "ana.p@techlab.com.br", role: "Consultor", status: "Ativo" },
    { id: "TECH-001", name: "Carlos S.", email: "carlos.s@techlab.com.br", role: "Tech Ops", status: "Inativo" },
];

const roleVariant: { [key: string]: "default" | "secondary" | "outline" } = {
  "Admin": "default",
  "Consultor": "secondary",
  "Tech Ops": "outline",
};

const statusVariant: { [key: string]: "default" | "destructive" } = {
  "Ativo": "default",
  "Inativo": "destructive",
};

const getInitials = (name: string) => {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase();
};

export default function UsuariosInternosPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-headline text-3xl">Usuários Internos</CardTitle>
              <CardDescription>
                Gerencie os usuários e as permissões da equipe Tech Lab.
              </CardDescription>
            </div>
             <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Convidar Usuário
            </Button>
        </CardHeader>
        <CardContent>
           <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Usuário</TableHead>
                        <TableHead>Permissão</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead><span className="sr-only">Ações</span></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {internalUsers.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-9 w-9">
                                       <AvatarImage src={`/avatars/${user.id}.png`} alt={user.name} />
                                       <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                    </Avatar>
                                    <div className="grid gap-0.5">
                                        <p className="font-medium">{user.name}</p>
                                        <p className="text-sm text-muted-foreground">{user.email}</p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell><Badge variant={roleVariant[user.role]}>{user.role}</Badge></TableCell>
                            <TableCell><Badge variant={statusVariant[user.status]}>{user.status}</Badge></TableCell>
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
                                    <DropdownMenuItem><UserCog className="mr-2 h-4 w-4" /> Editar Permissões</DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive">Desativar Usuário</DropdownMenuItem>
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
