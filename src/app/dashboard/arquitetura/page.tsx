import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Database, Server, AppWindow, GitBranch, ArrowRight } from "lucide-react";
import Image from "next/image";

const techStack = [
  { name: "Frontend", value: "Next.js, React, Tailwind CSS" },
  { name: "Backend", value: "Go (Gin), PostgreSQL" },
  { name: "Infraestrutura", value: "Docker, Vercel" },
  { name: "Autenticação", value: "JWT (Backend-managed)" },
  { name: "Pagamentos", value: "Asaas API" },
];

const components = [
  { name: "Web App (Next.js)", icon: <AppWindow />, description: "Interface do cliente e admin." },
  { name: "API Gateway (Go)", icon: <Server />, description: "Ponto de entrada único para o backend." },
  { name: "Banco de Dados (Postgres)", icon: <Database />, description: "Armazenamento principal de dados." },
  { name: "Serviço de Autenticação", icon: <Server />, description: "Serviço isolado para gerenciar usuários e JWT." },
  { name: "Serviço de Pagamentos", icon: <Server />, description: "Integração com gateway de pagamento." },
];

export default function ArchitecturePage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Arquitetura de Software</CardTitle>
          <CardDescription>
            Diagramas, componentes e fluxos de dados da sua arquitetura recomendada.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Diagrama da Arquitetura</h3>
            <div className="border rounded-lg p-4 bg-muted/50 flex justify-center items-center min-h-[400px]">
              {/* Placeholder for architecture diagram */}
              <Image 
                src="https://images.unsplash.com/photo-1693829956906-cfad6690fee6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8c29sdXRpb24lMjBhcmNoaXRlY3R1cmV8ZW58MHx8fHwxNzY5ODE0Njc3fDA&ixlib=rb-4.1.0&q=80&w=1080" 
                alt="Diagrama da Arquitetura"
                data-ai-hint="solution architecture"
                width={800}
                height={450}
                className="rounded-md shadow-sm"
              />
            </div>
             <p className="text-xs text-muted-foreground mt-2 text-center">Diagrama de referência para o plano BUILD. Clique para ampliar.</p>
          </div>

          <Separator />
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Componentes Principais</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {components.map(comp => (
                <div key={comp.name} className="p-4 border rounded-lg flex items-start gap-4">
                  <div className="text-primary mt-1">{comp.icon}</div>
                  <div>
                    <p className="font-semibold">{comp.name}</p>
                    <p className="text-sm text-muted-foreground">{comp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />

          <div>
             <h3 className="text-xl font-semibold mb-4">Fluxo de Dados: Autenticação</h3>
             <div className="flex items-center justify-center space-x-4 p-4 border rounded-lg bg-muted/50">
                <div className="text-center">
                    <AppWindow className="h-8 w-8 mx-auto mb-2" />
                    <p className="font-semibold">Frontend</p>
                </div>
                 <ArrowRight className="h-6 w-6 text-muted-foreground" />
                 <div className="text-center">
                    <Server className="h-8 w-8 mx-auto mb-2" />
                    <p className="font-semibold">Backend (Go)</p>
                     <Badge variant="secondary">Gera JWT</Badge>
                </div>
                <ArrowRight className="h-6 w-6 text-muted-foreground" />
                <div className="text-center">
                    <Database className="h-8 w-8 mx-auto mb-2" />
                    <p className="font-semibold">Database</p>
                </div>
             </div>
          </div>

           <Separator />

          <div>
            <h3 className="text-xl font-semibold mb-4">Tech Stack Recomendada</h3>
            <Card>
              <CardContent className="p-6 space-y-4">
                {techStack.map(tech => (
                  <div key={tech.name} className="flex justify-between items-center">
                    <p className="font-medium text-muted-foreground">{tech.name}</p>
                    <p>{tech.value}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
