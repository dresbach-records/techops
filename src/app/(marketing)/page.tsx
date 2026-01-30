import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Zap, DraftingCompass, BarChart } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const features = [
  {
    icon: <BarChart className="h-8 w-8 text-primary" />,
    title: "Diagnóstico Profundo",
    description:
      "Nossa IA analisa seu ecossistema tecnológico para identificar gargalos e oportunidades de otimização.",
  },
  {
    icon: <DraftingCompass className="h-8 w-8 text-primary" />,
    title: "Roadmap Personalizado",
    description:
      "Receba um plano de ação estratégico e faseado, alinhado com seus objetivos de negócio e capacidade técnica.",
  },
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: "Consultoria Contínua",
    description:
      "Acesso a especialistas para tirar dúvidas, validar arquiteturas e acelerar a implementação do seu roadmap.",
  },
];

const testimonials = [
    {
      name: "Juliana Almeida",
      title: "CTO, InovaTech",
      image: PlaceHolderImages.find(p => p.id === 'testimonial-1')?.imageUrl || '',
      imageHint: PlaceHolderImages.find(p => p.id === 'testimonial-1')?.imageHint,
      quote:
        "A Tech Lab transformou nossa forma de encarar a evolução tecnológica. O diagnóstico foi preciso e o roadmap nos deu a clareza que precisávamos para escalar.",
    },
    {
      name: "Ricardo Mendes",
      title: "CEO, Startup Vision",
      image: PlaceHolderImages.find(p => p.id === 'testimonial-2')?.imageUrl || '',
      imageHint: PlaceHolderImages.find(p => p.id === 'testimonial-2')?.imageHint,
      quote:
        "Como uma startup, cada decisão técnica é crucial. A plataforma nos deu segurança para construir uma base sólida e escalável sem desperdiçar recursos.",
    },
     {
      name: "Fernanda Costa",
      title: "Head de Engenharia, SolutionCo",
      image: PlaceHolderImages.find(p => p.id === 'testimonial-3')?.imageUrl || '',
      imageHint: PlaceHolderImages.find(p => p.id === 'testimonial-3')?.imageHint,
      quote:
        "O suporte sob demanda é um diferencial incrível. Nossa equipe agora consegue resolver bloqueios complexos em horas, não em dias.",
    },
];

export default function HomePage() {
  const heroImage = PlaceHolderImages.find((p) => p.id === "hero");

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full py-20 md:py-32 bg-card">
        <div className="container mx-auto px-4 md:px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight text-primary">
                Transforme sua Tecnologia, Acelere seu Negócio
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                Receba um diagnóstico técnico completo e um roadmap estratégico para guiar a evolução da sua arquitetura de software e infraestrutura.
            </p>
            <div className="mt-8 flex justify-center gap-4">
                <Button size="lg" asChild>
                    <Link href="/cadastro">Iniciar Diagnóstico Técnico</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                    <Link href="/como-funciona">Saber Mais</Link>
                </Button>
            </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">Uma plataforma, soluções completas</h2>
            <p className="mt-3 max-w-2xl mx-auto text-muted-foreground">
              Da análise à execução, nossa plataforma oferece tudo que sua equipe precisa para inovar com confiança.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="flex flex-col items-center text-center p-6">
                <div className="mb-4">{feature.icon}</div>
                <CardTitle className="mb-2 font-headline">{feature.title}</CardTitle>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 md:py-24 bg-card">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-headline">Seu guia para a excelência técnica</h2>
              <p className="mt-4 text-muted-foreground">
                Nosso processo é desenhado para ser rápido, eficiente e profundamente impactante, fornecendo insights valiosos desde o primeiro dia.
              </p>
              <ul className="mt-6 space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-primary mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Questionário Inteligente</h3>
                    <p className="text-muted-foreground">Responda perguntas direcionadas sobre seu negócio, time e tecnologia.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-primary mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Análise por IA</h3>
                    <p className="text-muted-foreground">Nossos algoritmos processam suas respostas para gerar um diagnóstico completo.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-primary mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Dashboard Interativo</h3>
                    <p className="text-muted-foreground">Explore seu roadmap, acesse documentos e conecte-se com consultores.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="relative h-80 w-full rounded-lg overflow-hidden shadow-lg">
                {heroImage && 
                    <Image
                    src={heroImage.imageUrl}
                    alt={heroImage.description}
                    data-ai-hint={heroImage.imageHint}
                    fill
                    style={{ objectFit: 'cover' }}
                    />
                }
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">Confiado por líderes de tecnologia</h2>
            <p className="mt-3 max-w-xl mx-auto text-muted-foreground">
              Veja o que nossos clientes estão dizendo sobre a Tech Lab.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <p className="italic">"{testimonial.quote}"</p>
                </CardContent>
                <CardHeader className="flex-row items-center gap-4">
                   <Avatar>
                        <AvatarImage src={testimonial.image} alt={testimonial.name} data-ai-hint={testimonial.imageHint} />
                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  <div>
                    <CardTitle className="text-base">{testimonial.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
