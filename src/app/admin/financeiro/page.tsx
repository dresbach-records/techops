import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function FinanceiroPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Financeiro</CardTitle>
          <CardDescription>
            Controle pagamentos, faturas e relatórios financeiros.
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
