"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

function PrivacyPolicyContent() {
    return (
        <div className="space-y-6 text-muted-foreground">
          <p>
            A TECH LAB – Consultoria Técnica respeita a privacidade e a proteção dos dados pessoais de seus usuários, clientes e parceiros. Esta Política de Privacidade descreve como coletamos, utilizamos, armazenamos e protegemos as informações.
          </p>

          <section className="space-y-2">
            <h2 className="text-lg font-headline font-semibold text-foreground">1. Coleta de dados</h2>
            <p>
              Coletamos apenas os dados necessários para a prestação de nossos serviços, incluindo:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-4">
              <li>Nome</li>
              <li>E-mail</li>
              <li>Telefone (WhatsApp)</li>
              <li>Informações fornecidas em formulários, questionários ou atendimentos</li>
              <li>Dados técnicos relacionados a projetos de consultoria (quando aplicável)</li>
            </ul>
            <p>
              Os dados são fornecidos voluntariamente pelo usuário.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-headline font-semibold text-foreground">2. Uso dos dados</h2>
            <p>
              Os dados coletados são utilizados para:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-4">
              <li>Prestação de consultoria técnica personalizada</li>
              <li>Comunicação com o cliente</li>
              <li>Análise técnica e diagnóstico de projetos</li>
              <li>Melhoria dos serviços oferecidos</li>
              <li>Cumprimento de obrigações legais</li>
            </ul>
            <p>
              A TECH LAB não comercializa dados pessoais.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-headline font-semibold text-foreground">3. Compartilhamento de dados</h2>
            <p>
              Os dados não são compartilhados com terceiros, exceto quando:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-4">
              <li>Necessário para execução do serviço contratado</li>
              <li>Exigido por obrigação legal ou ordem judicial</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-headline font-semibold text-foreground">4. Armazenamento e segurança</h2>
            <p>
              Adotamos medidas técnicas e organizacionais adequadas para proteger os dados contra acesso não autorizado, perda ou uso indevido.
            </p>
            <p>
              Os dados são armazenados apenas pelo tempo necessário para cumprir as finalidades descritas nesta política.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-headline font-semibold text-foreground">5. Direitos do titular (LGPD)</h2>
            <p>
              Nos termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018), o usuário pode, a qualquer momento:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-4">
              <li>Solicitar acesso aos seus dados</li>
              <li>Corrigir dados incompletos ou incorretos</li>
              <li>Solicitar a exclusão dos dados</li>
              <li>Revogar consentimentos</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-headline font-semibold text-foreground">6. Exclusão de dados</h2>
            <p>
              O usuário pode solicitar a exclusão total de seus dados pessoais a qualquer momento, entrando em contato por:
            </p>
            <ul className="list-none space-y-1 pl-4">
              <li>📧 E-mail: contato@techlab.com.br</li>
              <li>📲 WhatsApp: canal oficial da TECH LAB</li>
            </ul>
            <p>
              Após a solicitação, os dados serão removidos em até 30 dias, salvo obrigações legais.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-headline font-semibold text-foreground">7. Uso do WhatsApp</h2>
            <p>
              Ao entrar em contato via WhatsApp, o usuário concorda com o uso desse canal para comunicação relacionada aos serviços da TECH LAB. As mensagens não são utilizadas para fins diferentes do atendimento e da consultoria.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-headline font-semibold text-foreground">8. Alterações nesta política</h2>
            <p>
              Esta Política de Privacidade pode ser atualizada a qualquer momento para refletir melhorias ou mudanças legais. Recomendamos a revisão periódica.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-headline font-semibold text-foreground">9. Contato</h2>
            <p>
              Em caso de dúvidas sobre esta Política de Privacidade, entre em contato:
            </p>
            <p>
              <strong>TECH LAB – Consultoria Técnica</strong><br />
              📧 contato@techlab.com.br
            </p>
          </section>
        </div>
    );
}

function TermsOfServiceContent() {
    return (
        <div className="space-y-6 text-muted-foreground">
            <p>
                Bem-vindo à TECH LAB. Ao utilizar nossos serviços, você concorda com estes Termos de Serviço. Por favor, leia-os com atenção.
            </p>

            <section className="space-y-2">
                <h2 className="text-lg font-headline font-semibold text-foreground">1. Nossos Serviços</h2>
                <p>
                A TECH LAB oferece serviços de consultoria técnica personalizada, incluindo diagnósticos, roadmaps e suporte especializado. Nossos serviços são projetados para ajudar sua empresa a tomar as melhores decisões tecnológicas.
                </p>
            </section>

            <section className="space-y-2">
                <h2 className="text-lg font-headline font-semibold text-foreground">2. Uso dos Serviços</h2>
                <p>
                Você concorda em usar nossos serviços apenas para fins lícitos e de acordo com estes termos. Você é responsável por manter a confidencialidade de sua conta e senha.
                </p>
            </section>

            <section className="space-y-2">
                <h2 className="text-lg font-headline font-semibold text-foreground">3. Pagamentos</h2>
                <p>
                O acesso a certas funcionalidades e serviços requer pagamento. Todos os pagamentos são finais e não reembolsáveis, exceto conforme exigido por lei ou especificado em seu contrato de serviço.
                </p>
            </section>

            <section className="space-y-2">
                <h2 className="text-lg font-headline font-semibold text-foreground">4. Propriedade Intelectual</h2>
                <p>
                Todo o conteúdo e materiais fornecidos como parte dos serviços são de propriedade da TECH LAB ou de seus licenciadores. Você pode usar esses materiais para fins internos de negócios, mas não pode redistribuí-los ou revendê-los.
                </p>
            </section>

            <section className="space-y-2">
                <h2 className="text-lg font-headline font-semibold text-foreground">5. Limitação de Responsabilidade</h2>
                <p>
                Nossos serviços são fornecidos "como estão". A TECH LAB não oferece garantias de qualquer tipo e não será responsável por quaisquer danos diretos ou indiretos resultantes do uso de nossos serviços.
                </p>
            </section>

            <section className="space-y-2">
                <h2 className="text-lg font-headline font-semibold text-foreground">6. Alterações nos Termos</h2>
                <p>
                Podemos modificar estes termos a qualquer momento. Notificaremos você sobre quaisquer alterações, e seu uso continuado dos serviços após as alterações constitui sua aceitação dos novos termos.
                </p>
            </section>

            <section className="space-y-2">
                <h2 className="text-lg font-headline font-semibold text-foreground">7. Contato</h2>
                <p>
                Em caso de dúvidas sobre estes Termos de Serviço, entre em contato:
                </p>
                <p>
                <strong>TECH LAB – Consultoria Técnica</strong><br />
                📧 contato@techlab.com.br
                </p>
            </section>
        </div>
    );
}

function SupportProjectContent() {
    return (
        <div className="space-y-4 text-muted-foreground">
          <p>
            A Tech Lab está construindo um novo padrão de engenharia digital — um workspace técnico vivo com IA que guia projeto, diagnóstico, correção e evolução de produtos com método e rastreabilidade.
          </p>
          <p>
            Se você acredita nesta ideia e quer apoiar o desenvolvimento deste projeto open-source, sua contribuição é muito bem-vinda.
          </p>
           <Button asChild className="w-full">
            <a href="https://www.asaas.com/c/xln8596be4pwvq8e" target="_blank" rel="noopener noreferrer">
              <Heart className="mr-2 h-4 w-4" /> Contribuir Agora
            </a>
          </Button>
          <div className="pt-4 text-center">
            <h3 className="font-semibold text-foreground">Sua contribuição ajuda a:</h3>
            <ul className="list-none space-y-1 mt-2 text-sm">
              <li>Manter a infraestrutura do projeto</li>
              <li>Financiar desenvolvimento e testes</li>
              <li>Melhorar documentos e metodologias</li>
              <li>Apoiar colaboradores técnicos</li>
              <li>Manter o projeto aberto e independente</li>
            </ul>
          </div>
          <p className="pt-4 text-center font-medium">
            Obrigado pelo apoio à evolução da engenharia digital.
          </p>
        </div>
    );
}


export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container py-6">
        <div className="flex flex-col items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2026 Tech Lab
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-sm">
            <Dialog>
              <DialogTrigger asChild>
                <button className="text-muted-foreground hover:text-primary text-center underline-offset-4 hover:underline">Política de Privacidade</button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-headline">Política de Privacidade – TECH LAB</DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[70vh] p-4 border rounded-md">
                  <PrivacyPolicyContent />
                </ScrollArea>
              </DialogContent>
            </Dialog>
            <span className="text-muted-foreground hidden sm:inline">|</span>
            <Dialog>
              <DialogTrigger asChild>
                <button className="text-muted-foreground hover:text-primary text-center underline-offset-4 hover:underline">Termos de Serviço</button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-headline">Termos de Serviço – TECH LAB</DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[70vh] p-4 border rounded-md">
                  <TermsOfServiceContent />
                </ScrollArea>
              </DialogContent>
            </Dialog>
            <span className="text-muted-foreground hidden sm:inline">|</span>
            <Dialog>
              <DialogTrigger asChild>
                 <button className="text-muted-foreground hover:text-primary text-center underline-offset-4 hover:underline">Apoie o Projeto</button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-headline text-center">💜 Apoie a Tech Lab</DialogTitle>
                </DialogHeader>
                <SupportProjectContent />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </footer>
  );
}
