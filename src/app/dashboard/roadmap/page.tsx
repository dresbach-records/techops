import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, Zap } from "lucide-react";

const roadmapData = [
  {
    phase: 1,
    title: "Fundação e Estabilização (0-3 Meses)",
    tasks: [
      { id: "T1", description: "Refatorar Módulo de Autenticação para um serviço separado", status: "completed", priority: "alta" },
      { id: "T2", description: "Implementar logging centralizado com ELK Stack", status: "in_progress", priority: "alta" },
      { id: "T3", description: "Otimizar consultas críticas do banco de dados", status: "todo", priority: "media" },
      { id: "T4", description: "Atualizar dependências com vulnerabilidades críticas", status: "todo", priority: "alta" },
    ]
  },
  {
    phase: 2,
    title: "Escalabilidade e Otimização (3-6 Meses)",
    tasks: [
      { id: "T5", description: "Introduzir uma camada de cache com Redis para endpoints de leitura intensiva", status: "todo", priority: "media" },
      { id: "T6", description: "Implementar um API Gateway (ex: Kong, Tyk)", status: "todo", priority: "media" },
      { id: "T7", description: "Migrar armazenamento de arquivos para um Object Storage (S3/GCS)", status: "todo", priority: "baixa" },
    ]
  },
  {
    phase: 3,
    title: "Inovação e Expansão (6-12 Meses)",
    tasks: [
      { id: "T8", description: "Explorar arquitetura orientada a eventos com Kafka/RabbitMQ", status: "todo", priority: "media" },
      { id:g: "T9", description: "Desenvolver painel de feature flags para lançamentos graduais", status: "todo", priority: "baixa" },
    ]
  }
];

const statusConfig = {
    completed: { icon: <Check className="h-4 w-4 text-green-500" />, label: "Concluído", color: "bg-green-100 text-green-800" },
    in_progress: { icon: <Clock className="h-4 w-4 text-blue-500" />, label: "Em Progresso", color: "bg-blue-100 text-blue-800" },
    todo: { icon: <Zap className="h-4 w-4 text-gray-500" />, label: "A Fazer", color: "bg-gray-100 text-gray-800" },
};

const priorityConfig = {
    alta: { label: "Alta", color: "bg-red-100 text-red-800" },
    media: { label: "Média", color: "bg-yellow-100 text-yellow-800" },
    baixa: { label: "Baixa", color: "bg-gray-100 text-gray-800" },
}

export default function RoadmapPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Roadmap Técnico</CardTitle>
          <CardDescription>
            Seu plano de ação estratégico para os próximos 12 meses, dividido em fases claras e com tarefas priorizadas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative pl-6">
            {/* Timeline line */}
            <div className="absolute left-[34px] top-0 h-full w-0.5 bg-border -translate-x-1/2"></div>
            
            {roadmapData.map((phase, phaseIndex) => (
              <div key={phase.phase} className="relative pb-12">
                <div className="absolute left-[34px] top-4 h-4 w-4 rounded-full bg-primary ring-8 ring-background -translate-x-1/2"></div>
                <div className="pl-12">
                  <h2 className="font-headline text-2xl font-bold mb-4">Fase {phase.phase}: {phase.title}</h2>
                  <div className="grid gap-4">
                    {phase.tasks.map(task => {
                        const sConf = statusConfig[task.status as keyof typeof statusConfig];
                        const pConf = priorityConfig[task.priority as keyof typeof priorityConfig];
                        return (
                            <div key={task.id} className="p-4 border rounded-lg bg-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <p className="flex-1">{task.description}</p>
                                <div className="flex items-center gap-4">
                                    <Badge className={`${sConf.color} hover:${sConf.color}`}>
                                        {sConf.icon}
                                        <span className="ml-1.5">{sConf.label}</span>
                                    </Badge>
                                    <Badge className={`${pConf.color} hover:${pConf.color}`}>
                                        Prioridade {pConf.label}
                                    </Badge>
                                </div>
                            </div>
                        )
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
