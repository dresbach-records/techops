"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

// This is now for illustrative purposes, based on the new plan structure.
const plans = [
  {
    name: "START - Validação",
    price: "R$ 1.497",
    frequency: "pagamento único",
    description: "Para quem está no estágio de ideia e precisa de clareza e direção técnica.",
    features: [
      "Diagnóstico técnico estruturado",
      "Direcionamento de stack",
      "Roadmap inicial",
      "Painel básico personalizado",
      "1 sessão de consultoria estratégica",
    ],
    cta: "Começar diagnóstico",
    popular: false,
  },
  {
    name: "BUILD - Estruturação",
    price: "Setup + Mensal",
    frequency: "",
    description: "Para transformar um protótipo ou MVP em um produto robusto e viável.",
    features: [
      "Tudo do plano START",
      "Arquitetura de software",
      "Roadmap técnico detalhado",
      "Painel completo",
      "Consultoria recorrente",
    ],
    cta: "Começar diagnóstico",
    popular: true,
  },
  {
    name: "SCALE - Crescimento",
    price: "Setup + Mensal",
    frequency: "",
    description: "Para empresas em produção que enfrentam dores de escala, custo ou performance.",
    features: [
      "Tudo do plano BUILD",
      "Auditoria e Análise de código",
      "Plano de Escalabilidade",
      "Tech Ops e Monitoramento",
      "Painel avançado",
    ],
    cta: "Começar diagnóstico",
    popular: false,
  },
];

export default function PlansPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">Nossos Modelos de Consultoria</h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
          Não vendemos planos, oferecemos uma parceria estratégica. Após um diagnóstico gratuito, nossa plataforma recomenda o modelo de trabalho ideal para o seu momento, garantindo que você receba exatamente o que precisa.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-start">
        {plans.map((plan) => (
          <Card key={plan.name} className={`flex flex-col h-full ${plan.popular ? "border-primary shadow-lg" : ""}`}>
             {plan.popular && (
                <div className="text-center py-1 bg-primary text-primary-foreground text-sm font-semibold rounded-t-lg">
                    Mais Comum
                </div>
            )}
            <CardHeader>
              <CardTitle className="font-headline">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div>
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">{plan.frequency}</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant={plan.popular ? "default" : "outline"} asChild>
                <Link href="/diagnostico">{plan.cta}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
       <div className="mt-16 text-center p-8 bg-muted/50 rounded-lg">
        <h2 className="text-2xl font-bold font-headline">Como funciona a recomendação?</h2>
        <p className="mt-3 max-w-2xl mx-auto text-muted-foreground">
            Nosso questionário inicial avalia o estágio do seu projeto, suas dores técnicas e seus objetivos. Com base nisso, a plataforma calcula o plano mais adequado, seja para validar uma ideia (START), construir um MVP (BUILD), escalar um produto (SCALE) ou recuperar um sistema em crise (RECOVERY).
        </p>
      </div>
    </div>
  );
}
