import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, Info } from "lucide-react";

const diagnosisData = {
  summary: "O diagnóstico revela uma base tecnológica sólida, mas com pontos de melhoria cruciais em escalabilidade e observabilidade. A dívida técnica acumulada no módulo de autenticação representa o maior risco atual.",
  sections: [
    {
      title: "Arquitetura e Design",
      score: 8.5,
      points: [
        { text: "Acoplamento baixo entre os principais serviços.", status: "positive" },
        { text: "Monólito de autenticação apresenta alta complexidade ciclomática.", status: "negative" },
        { text: "Filas de mensagens bem utilizadas para comunicação assíncrona.", status: "positive" },
        { text: "Ausência de um padrão claro de API Gateway.", status: "neutral" },
      ]
    },
    {
      title: "Performance e Escalabilidade",
      score: 6.0,
      points: [
        { text: "Banco de dados relacional sobrecarregado, consultas ineficientes detectadas.", status: "negative" },
        { text: "Estratégia de cache inconsistente entre os microsserviços.", status: "negative" },
        { text: "Auto-scaling configurado corretamente no provedor de nuvem.", status: "positive" },
      ]
    },
    {
      title: "Segurança",
      score: 7.0,
      points: [
        { text: "Gestão de segredos centralizada e segura.", status: "positive" },
        { text: "Dependências de software desatualizadas com vulnerabilidades conhecidas.", status: "negative" },
        { text: "Política de CORS permissiva demais em alguns endpoints.", status: "neutral" },
      ]
    },
    {
      title: "Processos e DevOps",
      score: 9.0,
      points: [
        { text: "Pipeline de CI/CD maduro e automatizado.", status: "positive" },
        { text: "Cobertura de testes unitários e de integração acima de 85%.", status: "positive" },
        { text: "Processo de code review bem estabelecido.", status: "positive" },
      ]
    }
  ]
};

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case 'positive':
      return <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />;
    case 'negative':
      return <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />;
    case 'neutral':
      return <Info className="h-5 w-5 text-blue-500 flex-shrink-0" />;
    default:
      return null;
  }
}

export default function DiagnosisPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Diagnóstico Técnico</CardTitle>
          <CardDescription>
            Uma análise detalhada dos pontos fortes e fracos da sua plataforma, gerada a partir do seu questionário.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-muted/50 rounded-lg mb-6">
            <h3 className="font-semibold mb-2">Resumo Executivo</h3>
            <p className="text-muted-foreground">{diagnosisData.summary}</p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {diagnosisData.sections.map((section, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>
                  <div className="flex items-center justify-between w-full pr-4">
                    <span className="text-lg font-semibold">{section.title}</span>
                    <Badge variant={section.score >= 8 ? "default" : section.score >= 6 ? "secondary" : "destructive"}>
                      Pontuação: {section.score.toFixed(1)}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-3 pl-2">
                    {section.points.map((point, pIndex) => (
                      <li key={pIndex} className="flex items-start gap-3">
                        <StatusIcon status={point.status} />
                        <span>{point.text}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
