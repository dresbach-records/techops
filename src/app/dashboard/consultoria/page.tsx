import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ConsultingPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Consultoria</CardTitle>
          <CardDescription>
            Agende sessões, revise gravações e interaja com seu consultor.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Esta seção está em desenvolvimento. Em breve, você poderá gerenciar suas sessões de consultoria por aqui.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
