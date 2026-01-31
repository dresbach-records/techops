import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function IaPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">IA e Automação</CardTitle>
          <CardDescription>
            Acompanhe o uso de IA, monitore performance e explore novas automações.
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
