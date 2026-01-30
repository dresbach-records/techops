import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const documents = [
  {
    id: "DOC001",
    name: "Diagnóstico Técnico Completo.pdf",
    type: "Relatório",
    date: "2024-07-28",
    size: "2.5 MB",
  },
  {
    id: "DOC002",
    name: "Roadmap Estratégico Q3-Q4 2024.pdf",
    type: "Roadmap",
    date: "2024-07-28",
    size: "800 KB",
  },
  {
    id: "DOC003",
    name: "Proposta de Arquitetura - Módulo de Autenticação.png",
    type: "Diagrama",
    date: "2024-08-01",
    size: "1.2 MB",
  },
   {
    id: "DOC004",
    name: "Gravação - Sessão de Kick-off.mp4",
    type: "Gravação",
    date: "2024-08-02",
    size: "150 MB",
  },
];


export default function DocumentsPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Documentos</CardTitle>
          <CardDescription>
            Acesse todos os relatórios, diagramas e outros artefatos gerados durante sua consultoria.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">
                    <FileText className="h-5 w-5" />
                </TableHead>
                <TableHead>Nome do Arquivo</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Tamanho</TableHead>
                <TableHead className="text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <FileText className="h-5 w-5 text-muted-foreground"/>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{doc.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{doc.type}</Badge>
                  </TableCell>
                  <TableCell>{doc.date}</TableCell>
                  <TableCell>{doc.size}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
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
