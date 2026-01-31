import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, ShieldAlert, FileLock, Layers } from "lucide-react";

const vulnerabilities = [
  { id: "CVE-2023-45803", package: "next", severity: "Alta", status: "Corrigido" },
  { id: "GHSA-c8f2-v6x5-96p5", package: "react-dom", severity: "Média", status: "Corrigido" },
  { id: "CVE-2024-22241", package: "spring-boot", severity: "Crítica", status: "Pendente" },
];

const severityVariant: { [key: string]: "destructive" | "secondary" | "default" } = {
  "Crítica": "destructive",
  "Alta": "destructive",
  "Média": "secondary",
  "Baixa": "default",
};

const statusVariant: { [key: string]: "default" | "outline" } = {
  "Corrigido": "default",
  "Pendente": "outline",
};

export default function SecurityPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Segurança</CardTitle>
          <CardDescription>
            Auditorias de segurança, vulnerabilidades conhecidas e políticas de acesso do seu projeto.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            <div className="grid md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Pontuação de Segurança</CardTitle>
                        <ShieldCheck className="h-5 w-5 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">85/100</div>
                        <p className="text-xs text-muted-foreground">Última varredura: 2 horas atrás</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Vulnerabilidades Críticas</CardTitle>
                        <ShieldAlert className="h-5 w-5 text-destructive"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-destructive">1</div>
                        <p className="text-xs text-muted-foreground">Requer ação imediata</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Dependências</CardTitle>
                        <Layers className="h-5 w-5 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">128</div>
                        <p className="text-xs text-muted-foreground">Total de pacotes monitorados</p>
                    </CardContent>
                </Card>
            </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Varredura de Vulnerabilidades</h3>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID da Vulnerabilidade</TableHead>
                        <TableHead>Pacote Afetado</TableHead>
                        <TableHead>Severidade</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {vulnerabilities.map(vuln => (
                        <TableRow key={vuln.id}>
                            <TableCell className="font-mono text-xs">{vuln.id}</TableCell>
                            <TableCell className="font-medium">{vuln.package}</TableCell>
                            <TableCell>
                                <Badge variant={severityVariant[vuln.severity]}>{vuln.severity}</Badge>
                            </TableCell>
                            <TableCell>
                                <Badge variant={statusVariant[vuln.status]}>{vuln.status}</Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </div>
           <div>
            <h3 className="text-xl font-semibold mb-4">Políticas de Acesso</h3>
            <div className="p-4 border rounded-lg flex items-start gap-4">
                  <FileLock className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <p className="font-semibold">Política de Senhas Fortes</p>
                    <p className="text-sm text-muted-foreground">Mínimo de 12 caracteres, incluindo maiúsculas, minúsculas, números e símbolos, está ativa para todos os usuários.</p>
                  </div>
                </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
