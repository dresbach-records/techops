import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Essencial",
    price: "R$ 499",
    frequency: "/mês",
    description: "Para startups e times pequenos que precisam de direcionamento estratégico.",
    features: [
      "Diagnóstico Técnico Completo",
      "Roadmap Estratégico",
      "Acesso ao Dashboard",
      "Suporte via Chat (Horário Comercial)",
    ],
    cta: "Escolher Essencial",
    popular: false,
  },
  {
    name: "Profissional",
    price: "R$ 999",
    frequency: "/mês",
    description: "Para empresas em crescimento que buscam otimização e suporte contínuo.",
    features: [
      "Tudo do plano Essencial",
      "2h de Consultoria por Vídeo/mês",
      "Análise de Documentação",
      "Revisão de Arquitetura",
      "Suporte Prioritário",
    ],
    cta: "Escolher Profissional",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Customizado",
    frequency: "",
    description: "Para grandes corporações com necessidades complexas e personalizadas.",
    features: [
      "Tudo do plano Profissional",
      "Horas de consultoria flexíveis",
      "Workshops para o time",
      "Onboarding e treinamento",
      "Gerente de conta dedicado",
    ],
    cta: "Fale com Vendas",
    popular: false,
  },
];

export default function PlansPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">Planos flexíveis para cada estágio do seu negócio</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Escolha o plano que melhor se adapta às suas necessidades e comece a transformar sua tecnologia hoje mesmo.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-start">
        {plans.map((plan) => (
          <Card key={plan.name} className={`flex flex-col h-full ${plan.popular ? "border-primary shadow-lg" : ""}`}>
             {plan.popular && (
                <div className="text-center py-1 bg-primary text-primary-foreground text-sm font-semibold rounded-t-lg">
                    Mais Popular
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
                <Link href="/cadastro">{plan.cta}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
