import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TechLabPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Tech Lab</CardTitle>
          <CardDescription>
            Monitore a infraestrutura, custos, logs e alertas da plataforma.
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
