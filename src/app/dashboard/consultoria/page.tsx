import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Video, Clock, User, Download, PlusCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const upcomingSessions = [
  {
    id: "SESS001",
    title: "Sessão de Kick-off e Alinhamento do Roadmap",
    date: "25 de Agosto de 2026",
    time: "14:00 - 15:00",
    consultant: "Lucas M.",
    status: "Confirmada",
  }
];

const pastSessions = [
   {
    id: "SESS000",
    title: "Apresentação do Diagnóstico Técnico",
    date: "18 de Agosto de 2026",
    time: "10:00 - 10:45",
    consultant: "Ana P.",
    status: "Realizada",
    recordingUrl: "#",
  }
]

export default function ConsultingPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-headline text-3xl">Consultoria Estratégica</CardTitle>
            <CardDescription>
              Agende sessões, revise gravações e interaja com seus consultores.
            </CardDescription>
          </div>
           <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Agendar Nova Sessão
            </Button>
        </CardHeader>
        <CardContent className="space-y-8">
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Próximas Sessões</h3>
            {upcomingSessions.length > 0 ? (
              <div className="space-y-4">
                {upcomingSessions.map(session => (
                   <Card key={session.id}>
                     <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                       <div className="flex-1">
                          <p className="font-semibold text-lg">{session.title}</p>
                           <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mt-2">
                            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4"/> {session.date}</span>
                            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4"/> {session.time}</span>
                            <span className="flex items-center gap-1.5"><User className="h-4 w-4"/> {session.consultant}</span>
                           </div>
                       </div>
                       <div className="flex items-center gap-2">
                           <Badge variant="secondary">{session.status}</Badge>
                           <Button><Video className="mr-2 h-4 w-4" /> Entrar na Chamada</Button>
                       </div>
                     </CardContent>
                   </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">Nenhuma sessão agendada no momento.</p>
              </div>
            )}
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Sessões Anteriores</h3>
            {pastSessions.length > 0 ? (
                <div className="space-y-4">
                    {pastSessions.map(session => (
                    <Card key={session.id} className="bg-muted/50">
                        <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex-1">
                            <p className="font-semibold">{session.title}</p>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mt-2">
                                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4"/> {session.date}</span>
                                <span className="flex items-center gap-1.5"><User className="h-4 w-4"/> {session.consultant}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                             <Badge variant="outline">{session.status}</Badge>
                            <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Baixar Gravação</Button>
                        </div>
                        </CardContent>
                    </Card>
                    ))}
                </div>
            ) : (
                 <div className="text-center py-8 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">Nenhuma sessão anterior encontrada.</p>
                </div>
            )}
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
