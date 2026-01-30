"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, CreditCard } from "lucide-react";
import { useState } from "react";

function PaymentForm() {
  const router = useRouter();
  const { setPaymentSuccess } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);
    // Simula uma chamada de API de pagamento
    await new Promise(resolve => setTimeout(resolve, 1500));
    setPaymentSuccess();
    toast({
      title: "Pagamento confirmado!",
      description: "Seu acesso ao dashboard foi liberado.",
    });
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary text-primary-foreground rounded-full h-12 w-12 flex items-center justify-center mb-4">
            <CreditCard className="h-6 w-6" />
          </div>
          <CardTitle className="font-headline text-2xl">Confirmar Pagamento</CardTitle>
          <CardDescription>Finalize a compra para liberar seu dashboard completo.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="rounded-lg border bg-card p-4">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="font-semibold">Plano Profissional</p>
                        <p className="text-sm text-muted-foreground">Acesso completo à plataforma</p>
                    </div>
                    <p className="font-bold text-lg">R$ 999,00</p>
                </div>
            </div>
            <div className="text-center text-sm text-muted-foreground">
                <CheckCircle className="inline-block h-4 w-4 mr-1 text-green-500"/>
                Esta é uma simulação. Nenhum valor será cobrado.
            </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handlePayment} disabled={isLoading}>
            {isLoading ? "Processando..." : "Confirmar Pagamento e Acessar"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}


export default function PaymentPage() {
    return (
        <AuthGuard access="authenticated">
            <PaymentForm />
        </AuthGuard>
    )
}
