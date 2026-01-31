import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const templates = [
    { id: "TPL-001", name: "Diagnóstico v2.1", type: "Questionário", lastUpdated: "2026-08-10", author: "Ana P." },
    { id: "TPL-002", name: "Roadmap - Plano BUILD", type: "Roadmap", lastUpdated: "2026-08-05", author: "Lucas M." },
    { id: "TPL-003", name: "Roadmap - Plano SCALE", type: "Roadmap", lastUpdated: "2026-08-05", author: "Lucas M." },
    { id: "TPL-004", name: "Email - Boas-vindas", type: "E-mail", lastUpdated: "2026-07-20", author: "Marketing" },
];

export default function ConteudoTemplatesPage() {
  return (
    <div className="grid gap-6">
      <Card>
         <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-headline text-3xl">Conteúdo & Templates</CardTitle>
              <CardDescription>
                Gerencie templates de diagnóstico, roadmaps e outros documentos.
              </CardDescription>
            </div>
             <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Template
            </Button>
        </CardHeader>
        <CardContent>
           <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nome do Template</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Última Atualização</TableHead>
                        <TableHead>Autor</TableHead>
                        <TableHead><span className="sr-only">Ações</span></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {templates.map((template) => (
                        <TableRow key={template.id}>
                            <TableCell className="font-medium">{template.name}</TableCell>
                            <TableCell>{template.type}</TableCell>
                            <TableCell>{template.lastUpdated}</TableCell>
                            <TableCell>{template.author}</TableCell>
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
                                    <DropdownMenuItem>Editar</DropdownMenuItem>
                                    <DropdownMenuItem>Duplicar</DropdownMenuItem>
                                    <DropdownMenuItem>Ver Histórico</DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive">Arquivar</DropdownMenuItem>
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
