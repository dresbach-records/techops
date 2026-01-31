import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function IaAutomacaoPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">IA & Automação</CardTitle>
          <CardDescription>
            Audite a IA, ajuste prompts e monitore os logs de decisão.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Esta seção está em desenvolvimento.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
