import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ArchitecturePage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Arquitetura</CardTitle>
          <CardDescription>
            Visualize os diagramas, componentes e fluxos da sua arquitetura de software.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Esta seção está em desenvolvimento. Em breve, você terá acesso a diagramas interativos e documentação da sua arquitetura.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
