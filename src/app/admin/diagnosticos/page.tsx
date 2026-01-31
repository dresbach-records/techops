import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DiagnosticosPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Diagnósticos</CardTitle>
          <CardDescription>
            Analise, valide e aprove os diagnósticos gerados pela IA.
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
