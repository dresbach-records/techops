import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
        <CardContent>
          <p className="text-muted-foreground">
            Esta seção está em desenvolvimento.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
