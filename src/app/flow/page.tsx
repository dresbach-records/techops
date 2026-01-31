"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

function LoadingScreen() {
    return (
        <div className="flex items-center justify-center h-screen w-full bg-background">
           <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground">Redirecionando...</p>
           </div>
        </div>
    );
}


export default function FlowPage() {
    const { user, isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (loading) {
            return; // Aguarda a conclusão da verificação de autenticação.
        }

        if (!isAuthenticated || !user) {
            router.replace("/login");
            return;
        }

        // O backend define o próximo passo através do campo 'flow'.
        if (user.flow) {
            switch (user.flow) {
                case 'diagnostico':
                    router.replace('/diagnostico');
                    break;
                case 'pagamento':
                    router.replace('/diagnostico/10-pagamento');
                    break;
                case 'painel':
                    if (user.role === 'admin' || user.role === 'consultor') {
                        router.replace('/admin');
                    } else {
                        router.replace('/dashboard');
                    }
                    break;
                default:
                    // Fallback para uma rota segura caso o valor de 'flow' seja inesperado.
                    router.replace('/login');
            }
            return;
        }

        // Fallback caso o campo 'flow' não seja fornecido.
        if (user.role === 'admin' || user.role === 'consultor') {
            router.replace("/admin");
        } else {
            router.replace("/dashboard");
        }

    }, [user, isAuthenticated, loading, router]);

    return <LoadingScreen />;
}
