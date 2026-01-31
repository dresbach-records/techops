import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function ConfiguracoesPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Configurações</CardTitle>
          <CardDescription>
            Gerencie as configurações gerais da plataforma Tech Lab.
          </CardDescription>
        </CardHeader>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>Chaves de API</CardTitle>
            <CardDescription>Gerencie as integrações com serviços de terceiros.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="resend-key">Resend API Key (E-mails)</Label>
                <Input id="resend-key" type="password" defaultValue="******************" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="asaas-key">Asaas API Key (Pagamentos)</Label>
                <Input id="asaas-key" type="password" defaultValue="******************" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="gemini-key">Google AI (Gemini) API Key</Label>
                <Input id="gemini-key" type="password" defaultValue="******************" />
            </div>
        </CardContent>
         <CardFooter className="border-t px-6 py-4">
             <Button><Save className="mr-2 h-4 w-4" /> Salvar Chaves</Button>
        </CardFooter>
      </Card>
      
       <Card>
        <CardHeader>
            <CardTitle>Notificações</CardTitle>
            <CardDescription>Configure como a equipe é notificada sobre eventos.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label className="text-base">Novo Diagnóstico Recebido</Label>
                    <p className="text-sm text-muted-foreground">Notificar no canal #diagnosticos do Slack.</p>
                </div>
                <Switch defaultChecked />
            </div>
             <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label className="text-base">Pagamento Confirmado</Label>
                    <p className="text-sm text-muted-foreground">Notificar no canal #financeiro do Slack.</p>
                </div>
                <Switch defaultChecked />
            </div>
             <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label className="text-base">Erro Crítico na API</Label>
                    <p className="text-sm text-muted-foreground">Notificar no canal #tech-ops do Slack e por e-mail.</p>
                </div>
                <Switch />
            </div>
        </CardContent>
         <CardFooter className="border-t px-6 py-4">
             <Button><Save className="mr-2 h-4 w-4" /> Salvar Configurações</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
