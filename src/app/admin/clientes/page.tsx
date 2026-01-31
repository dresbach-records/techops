import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ClientesPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Clientes</CardTitle>
          <CardDescription>
            Gerencie todos os clientes da plataforma, seus perfis e históricos.
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
