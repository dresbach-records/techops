import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function UsuariosInternosPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Usuários Internos</CardTitle>
          <CardDescription>
            Gerencie os usuários e as permissões da equipe Tech Lab.
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
