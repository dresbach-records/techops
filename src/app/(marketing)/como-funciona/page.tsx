import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowRight } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Passo 1: Diagnóstico Inicial",
    description: "Tudo começa com nosso questionário inteligente. Você nos fornecerá informações cruciais sobre sua arquitetura, processos, time e desafios de negócio. Este processo é 100% online e leva menos de 30 minutos.",
    image: PlaceHolderImages.find(p => p.id === 'how-it-works-step-1')!,
  },
  {
    id: 2,
    title: "Passo 2: Análise e Geração do Roadmap",
    description: "Nossa plataforma, alimentada por IA e validada por especialistas, processa seus dados. Identificamos pontos fortes, fracos e oportunidades de melhoria, gerando um diagnóstico técnico detalhado e um roadmap estratégico.",
    image: PlaceHolderImages.find(p => p.id === 'how-it-works-step-2')!,
  },
  {
    id: 3,
    title: "Passo 3: Acesso ao Dashboard e Consultoria",
    description: "Com o pagamento confirmado, você ganha acesso ao seu dashboard exclusivo. Explore seu roadmap, baixe documentos, e o mais importante: inicie conversas com nossos consultores para acelerar sua jornada de evolução.",
    image: PlaceHolderImages.find(p => p.id === 'how-it-works-step-3')!,
  },
];

export default function HowItWorksPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">Nossa Metodologia</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Um processo claro e eficiente para transformar sua tecnologia com inteligência e estratégia.
        </p>
      </div>

      <div className="relative">
        {/* Dotted line for desktop */}
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-border -translate-y-1/2 -z-10 border-t-2 border-dashed"></div>

        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground font-bold text-2xl font-headline mb-6 border-4 border-background">
                {step.id}
              </div>
              <h2 className="text-2xl font-bold font-headline mb-3">{step.title}</h2>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-24">
        {steps.map((step, index) => (
          <div key={`detail-${step.id}`} className={`grid md:grid-cols-2 gap-12 items-center ${index < steps.length - 1 ? 'mb-24' : ''}`}>
            <div className={`relative h-96 w-full rounded-lg overflow-hidden shadow-lg ${index % 2 !== 0 ? 'md:order-2' : ''}`}>
              <Image 
                src={step.image.imageUrl} 
                alt={step.image.description} 
                data-ai-hint={step.image.imageHint}
                fill 
                style={{objectFit: 'cover'}}
              />
            </div>
            <div className={`${index % 2 !== 0 ? 'md:order-1' : ''}`}>
              <span className="text-primary font-semibold">PASSO {step.id}</span>
              <h3 className="text-3xl font-bold font-headline mt-2 mb-4">{step.title}</h3>
              <p className="text-muted-foreground text-lg">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-24 text-center p-8 bg-card rounded-lg shadow-sm">
        <h2 className="text-3xl font-bold font-headline">Pronto para começar sua transformação?</h2>
        <p className="mt-4 max-w-xl mx-auto text-muted-foreground">
          Dê o primeiro passo para uma arquitetura mais robusta, escalável e alinhada ao seu negócio.
        </p>
        <div className="mt-6">
          <Button size="lg" asChild>
            <Link href="/diagnostico">
              Iniciar Diagnóstico Gratuito <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
