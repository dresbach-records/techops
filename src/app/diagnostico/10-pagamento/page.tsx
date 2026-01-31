"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Loader2, ChevronLeft, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useDiagnostic } from "@/contexts/DiagnosticContext";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


export default function PaymentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: diagnosticData, resetData } = useDiagnostic();
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState<'card' | 'boleto' | null>(null);

  const handlePayment = async (method: 'card' | 'boleto') => {
    setIsLoading(method);
    try {
        // Cria o usuário no Supabase Auth e salva os dados do diagnóstico
        await signUp(diagnosticData, method);
        
        toast({
            title: "Conta criada com sucesso!",
            description: method === 'card' 
              ? "Seu painel personalizado está sendo preparado." 
              : "Um boleto foi gerado. Você será notificado no seu painel.",
        });

        resetData(); // Limpa os dados do diagnóstico do localStorage
        
        // O AuthContext irá redirecionar para o dashboard automaticamente após o login

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

            <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Ambiente de Testes</AlertTitle>
                <AlertDescription>
                    Esta é uma simulação. Nenhum valor será cobrado.
                </AlertDescription>
            </Alert>
            
        </CardContent>
        <CardFooter className="flex items-center justify-center border-t bg-slate-50/50 p-4">
            <Button variant="ghost" asChild>
                <Link href="/diagnostico/09-expectativa"><ChevronLeft className="mr-2 h-4 w-4" /> Voltar</Link>
            </Button>
        </CardFooter>
    </>
  );
}
