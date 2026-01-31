"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Loader2, ChevronLeft, FileDown } from "lucide-react";
import { useState } from "react";
import { useDiagnostic } from "@/contexts/DiagnosticContext";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const invoiceItems = [
  {
    service: "Diagnóstico Técnico e Plataforma",
    details: "Acesso completo e análise inicial",
    price: 999.0,
  },
  {
    service: "Desconto de Lançamento",
    details: "Cupom: STARTUP2026",
    price: -100.0,
  },
];
const total = invoiceItems.reduce((acc, item) => acc + item.price, 0);

function ExtratoDialogContent() {
    const { toast } = useToast();

    const handleDownloadPdf = () => {
        toast({
          title: "Download Iniciado",
          description: "O seu extrato em PDF está sendo gerado e o download começará em breve.",
        });
    };

    return (
        <DialogContent className="max-w-lg p-0">
            <DialogHeader className="p-6 pb-0">
                <DialogTitle className="text-2xl font-headline">Extrato de Serviço</DialogTitle>
                <DialogDescription>Detalhes da sua contratação com a Tech Lab.</DialogDescription>
            </DialogHeader>
            <div className="p-6">
              <div className="grid gap-4">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div>
                          <p className="font-semibold text-muted-foreground">FATURADO PARA</p>
                          <p>João Pereira (Exemplo)</p>
                          <p>joao.exemplo@email.com</p>
                      </div>
                      <div className="text-left sm:text-right">
                          <p className="font-semibold text-muted-foreground">Nº DO EXTRATO</p>
                          <p>TL-2026-001</p>
                          <p className="font-semibold text-muted-foreground mt-2">DATA</p>
                          <p>{new Date().toLocaleDateString("pt-BR")}</p>
                      </div>
                  </div>
                  <Separator />
                  <Table>
                      <TableHeader>
                          <TableRow>
                              <TableHead>Serviço</TableHead>
                              <TableHead className="text-right">Valor (BRL)</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {invoiceItems.map((item, index) => (
                              <TableRow key={index}>
                                  <TableCell>
                                      <p className="font-medium">{item.service}</p>
                                      <p className="text-sm text-muted-foreground">{item.details}</p>
                                  </TableCell>
                                  <TableCell className="text-right">
                                      {item.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                  </TableCell>
                              </TableRow>
                          ))}
                      </TableBody>
                  </Table>
              </div>
            </div>
            <DialogFooter className="bg-muted/50 p-6 rounded-b-lg flex-col sm:flex-row sm:justify-between items-center w-full">
                <Button onClick={handleDownloadPdf} variant="outline">
                    <FileDown className="mr-2 h-4 w-4" />
                    Baixar PDF
                </Button>
                <div className="grid gap-2 text-right w-full max-w-xs">
                    <div className="flex justify-between items-center gap-4">
                        <p className="font-semibold">Subtotal</p>
                        <p>{(total - invoiceItems.find(item => item.price < 0)!.price).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
                    </div>
                    <div className="flex justify-between items-center gap-4">
                        <p className="font-semibold text-destructive">Descontos</p>
                        <p className="text-destructive">{invoiceItems.find(item => item.price < 0)!.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between items-center gap-4">
                        <p className="text-lg font-bold">Total a Pagar</p>
                        <p className="text-lg font-bold">
                            {total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </p>
                    </div>
                </div>
            </DialogFooter>
        </DialogContent>
    );
}


export default function PaymentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: diagnosticData, resetData } = useDiagnostic();
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState<'card' | 'boleto' | null>(null);

  const handlePayment = async (method: 'card' | 'boleto') => {
    setIsLoading(method);
    try {
        await signUp(diagnosticData, method);
        
        toast({
            title: "Conta criada com sucesso!",
            description: method === 'card' 
              ? "Seu painel personalizado está sendo preparado." 
              : "Um boleto foi gerado. Você será notificado no seu painel.",
        });

        resetData(); 
        
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Erro no Processamento",
            description: error instanceof Error ? error.message : "Não foi possível criar sua conta. Verifique os dados e tente novamente.",
        });
        setIsLoading(null);
    }
  };

  return (
    <>
        <CardHeader className="text-center p-8">
          <div className="mx-auto bg-primary text-primary-foreground rounded-full h-12 w-12 flex items-center justify-center mb-4">
            <CreditCard className="h-6 w-6" />
          </div>
          <CardTitle className="font-headline text-2xl">Último Passo!</CardTitle>
          <CardDescription>Escolha como finalizar a contratação do seu diagnóstico.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 min-h-[250px] px-8">
            <div className="rounded-lg border bg-card p-4">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="font-semibold">Plano Profissional</p>
                        <p className="text-sm text-muted-foreground">Diagnóstico e Acesso à Plataforma</p>
                    </div>
                    <p className="font-bold text-lg">R$ 999,00</p>
                </div>
            </div>
            
            <div className="space-y-4">
                <Button onClick={() => handlePayment('card')} disabled={!!isLoading} className="w-full h-12">
                    {isLoading === 'card' ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processando...
                        </>
                    ) : (
                        "Pagar com Cartão de Crédito"
                    )}
                </Button>
                <Button onClick={() => handlePayment('boleto')} disabled={!!isLoading} variant="secondary" className="w-full h-12">
                    {isLoading === 'boleto' ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processando...
                        </>
                    ) : (
                       "Gerar Boleto e Pagar Depois"
                    )}
                </Button>
            </div>

            <div className="text-center text-xs text-muted-foreground px-4">
                Ao clicar em uma das opções de pagamento, você cria sua conta, concorda com
                nossos <Link href="/termos-de-servico" className="underline hover:text-primary" target="_blank">Termos de Serviço</Link> e
                assina o contrato de prestação de serviços que será enviado para seu e-mail.
            </div>

            <div className="text-center text-sm">
              <Dialog>
                <DialogTrigger asChild>
                  <button className="underline text-muted-foreground hover:text-primary">
                      Ver extrato detalhado da cobrança
                  </button>
                </DialogTrigger>
                <ExtratoDialogContent />
              </Dialog>
            </div>
            
        </CardContent>
        <CardFooter className="flex items-center justify-center border-t bg-slate-50/50 p-4">
            <Button variant="ghost" asChild>
                <Link href="/diagnostico/09-expectativa"><ChevronLeft className="mr-2 h-4 w-4" /> Voltar</Link>
            </Button>
        </CardFooter>
    </>
  );
}
