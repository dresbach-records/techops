"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { useDiagnostic } from "@/contexts/DiagnosticContext";
import { submitDiagnosticAndCreateUser } from "@/lib/api";
import { StepNavigation } from "@/components/diagnostico/StepNavigation";
import { useAuth } from "@/contexts/AuthContext";


export default function PaymentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: diagnosticData, resetData } = useDiagnostic();
  const { setPaymentSuccess } = useAuth() // This will need to be adapted to log the user in
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);
    try {
        // In a real app, you would call the payment provider first.
        // Here, we simulate creating the user and payment together.
        const user = await submitDiagnosticAndCreateUser(diagnosticData);
        
        // This is a simplified login. In a real app, you would set a token.
        localStorage.setItem("techLabUser", JSON.stringify(user));

        toast({
            title: "Pagamento confirmado!",
            description: "Seu painel personalizado está sendo preparado.",
        });

        resetData(); // Clear diagnostic data from localStorage
        
        // A small delay to simulate dashboard setup
        setTimeout(() => {
             router.push("/dashboard");
        }, 1000);

    } catch (error) {
        toast({
            variant: "destructive",
            title: "Erro no Processamento",
            description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido.",
        });
        setIsLoading(false);
    }
  };

  return (
    <>
        <CardHeader className="text-center p-8">
          <div className="mx-auto bg-primary text-primary-foreground rounded-full h-12 w-12 flex items-center justify-center mb-4">
            <CreditCard className="h-6 w-6" />
          </div>
          <CardTitle className="font-headline text-2xl">Confirmar Pagamento</CardTitle>
          <CardDescription>Finalize a compra para montar seu painel técnico personalizado.</CardDescription>
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
            <div className="text-center text-sm text-muted-foreground">
                <CheckCircle className="inline-block h-4 w-4 mr-1 text-green-500"/>
                Esta é uma simulação. Nenhum valor será cobrado.
            </div>
        </CardContent>
        <div className="flex items-center justify-between border-t bg-slate-50 p-6">
            <Button variant="ghost" asChild>
                <Link href="/diagnostico/09-expectativa"><ChevronLeft className="mr-2 h-4 w-4" /> Voltar</Link>
            </Button>
            <Button onClick={handlePayment} disabled={isLoading} className="w-52">
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processando...
                    </>
                ) : (
                   "Finalizar e Pagar"
                )}
            </Button>
        </div>
    </>
  );
}
