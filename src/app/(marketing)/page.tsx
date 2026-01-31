import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, DraftingCompass, Network, ArrowRight } from "lucide-react";

const features = [
  {
    icon: <FileText className="h-8 w-8 text-primary" />,
    title: "Consultoria Técnica",
    description: "Decisões técnicas reais para produtos digitais.",
  },
  {
    icon: <DraftingCompass className="h-8 w-8 text-primary" />,
    title: "Arquitetura de Software",
    description: "Planejamento estratégico e escalável.",
  },
  {
    icon: <Network className="h-8 w-8 text-primary" />,
    title: "Tech Ops e Escala",
    description: "Sistemas seguros, eficientes e confiáveis.",
  },
];

const howItWorksSteps = [
  {
    step: 1,
    title: "Diagnóstico técnico",
    description: "Você responde um questionário rápido.",
  },
  {
    step: 2,
    title: "Análise especializada",
    description: "Avaliamos negócio, tecnologia e operação.",
  },
  {
    step: 3,
    title: "Painel personalizado",
    description: "Você recebe um ambiente sob medida.",
  },
];


export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight">
                Soluções técnicas inovadoras para sua empresa.
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                Consultoria técnica personalizada em software, sistemas, IA e Tech Ops.
            </p>
            <div className="mt-8 flex justify-center gap-4">
                <Button size="lg" asChild>
                    <Link href="/cadastro">Iniciar diagnóstico técnico</Link>
                </Button>
            </div>
            <div className="mt-4">
                <Link href="#" className="text-sm underline hover:text-primary">
                    Falar com especialista
                </Link>
            </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-24 bg-card">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="flex flex-col items-start text-left p-6 border-none shadow-none bg-transparent">
                <div className="mb-4">{feature.icon}</div>
                <CardTitle className="mb-2 font-headline text-xl">{feature.title}</CardTitle>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-left mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">Como funciona</h2>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute top-8 left-0 w-full h-px -z-10">
                <svg width="100%" height="2">
                    <line x1="0" y1="1" x2="100%" y2="1" strokeWidth="1" strokeDasharray="5,5" className="stroke-border" />
                </svg>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
                {howItWorksSteps.map((step) => (
                <div key={step.step} className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-2xl font-headline border-4 border-background flex-shrink-0">
                    {step.step}
                    </div>
                    <div>
                    <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                    </div>
                </div>
                ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Tech Lab Info Section */}
      <section className="py-20 md:py-24 bg-card">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-headline">Tech Lab</h2>
              <p className="mt-4 text-muted-foreground text-lg">
                O Tech Lab é nosso ambiente de engenharia, onde analisamos protótipos, sistemas e negócios digitais com foco em viabilidade, escala e operação.
              </p>
              <Link href="/como-funciona" className="mt-6 inline-flex items-center text-primary font-semibold hover:underline">
                  Conhecer o Tech Lab <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            <div className="bg-background rounded-lg p-8">
              <p className="text-xl font-medium">Sem Tech Ops, sistemas viram risco.</p>
              <p className="text-xl font-medium mt-2">Com Tech Ops, viram produtos confiáveis.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-headline tracking-tight">
                Pronto para evoluir com segurança?
            </h2>
            <div className="mt-8 flex justify-center">
                <Button size="lg" asChild>
                    <Link href="/cadastro">Iniciar diagnóstico técnico</Link>
                </Button>
            </div>
        </div>
      </section>
    </>
  );
}
