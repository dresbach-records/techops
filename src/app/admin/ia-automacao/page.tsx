import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Save, Bot } from "lucide-react";

const aiLogs = [
    { id: "LOG001", context: "Análise de Diagnóstico", client: "Empresa Inovadora", risk: "Médio", plan: "BUILD", timestamp: "2026-08-01 10:15" },
    { id: "LOG002", context: "Sugestão de Roadmap", client: "Empresa Inovadora", risk: "-", plan: "-", timestamp: "2026-08-01 10:18" },
    { id: "LOG003", context: "Análise de Diagnóstico", client: "Startup Ágil", risk: "Baixo", plan: "SCALE", timestamp: "2026-08-03 15:30" },
];

const riskVariant: { [key: string]: "default" | "secondary" | "destructive" } = {
  "Baixo": "default",
  "Médio": "secondary",
  "Alto": "destructive",
};

export default function IaAutomacaoPage() {
  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-headline text-3xl">IA & Automação</CardTitle>
              <CardDescription>
                Audite a IA, ajuste prompts e monitore os logs de decisão.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="prompt-diagnostico" className="text-lg font-semibold">Prompt de Análise de Diagnóstico</Label>
                  <Textarea 
                    id="prompt-diagnostico"
                    rows={12}
                    className="mt-2 font-mono text-xs"
                    defaultValue={`Você é um CTO experiente e sua tarefa é analisar os dados de um diagnóstico técnico.
Com base no 'estagio' e nas 'dores' do cliente, retorne um JSON com a seguinte estrutura:
{
  "risco_tecnico": "baixo" | "medio" | "alto",
  "plano_recomendado": "START" | "BUILD" | "SCALE" | "RECOVERY",
  "modulos_sugeridos": string[],
  "observacoes": "Uma análise concisa sobre a situação do cliente."
}
Regras:
- Se 'estagio' for 'reestruturacao', o risco é sempre 'alto' e o plano é 'RECOVERY'.
- Se 'estagio' for 'producao' e houver 4 ou mais 'dores', o risco é 'alto' e o plano é 'RECOVERY'.
- Para 'ideia', o plano é 'START'. Para 'prototipo', o plano é 'BUILD'.
Seja preciso e direto.`}
                  />
                </div>
                 <div className="flex justify-end">
                    <Button>
                        <Save className="mr-2 h-4 w-4" />
                        Salvar Prompt
                    </Button>
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Bot /> Modelos em Uso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="p-3 border rounded-lg">
                    <p className="font-semibold">gemini-1.5-pro</p>
                    <p className="text-sm text-muted-foreground">Análise de Diagnóstico e Geração de Roadmap</p>
                </div>
                <div className="p-3 border rounded-lg">
                    <p className="font-semibold">gemini-1.5-flash</p>
                    <p className="text-sm text-muted-foreground">Análise de Código (quando repositório é fornecido)</p>
                </div>
                 <div className="p-3 border rounded-lg">
                    <p className="font-semibold">text-embedding-004</p>
                    <p className="text-sm text-muted-foreground">Classificação de tickets de suporte</p>
                </div>
            </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
            <CardTitle>Logs de Decisão da IA</CardTitle>
        </CardHeader>
        <CardContent>
           <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Contexto</TableHead>
                        <TableHead>Risco (Output)</TableHead>
                        <TableHead>Plano (Output)</TableHead>
                        <TableHead>Timestamp</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {aiLogs.map(log => (
                        <TableRow key={log.id}>
                            <TableCell className="font-medium">{log.client}</TableCell>
                            <TableCell>{log.context}</TableCell>
                            <TableCell>
                                {log.risk !== "-" ? <Badge variant={riskVariant[log.risk]}>{log.risk}</Badge> : "-"}
                            </TableCell>
                            <TableCell>
                                {log.plan !== "-" ? <Badge variant="outline">{log.plan}</Badge> : "-"}
                            </TableCell>
                            <TableCell>{log.timestamp}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
