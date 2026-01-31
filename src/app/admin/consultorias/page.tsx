import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ConsultoriasPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Consultorias</CardTitle>
          <CardDescription>
            Acompanhe consultorias ativas, agendadas e concluídas.
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
