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

        // O backend define o próximo passo.
        if (user.next_step) {
            router.replace(user.next_step);
            return;
        }

        // Fallback: se o backend não fornecer um 'next_step', usamos o 'role'.
        if (user.role === 'admin' || user.role === 'consultor') {
            router.replace("/admin");
        } else {
            router.replace("/dashboard");
        }

    }, [user, isAuthenticated, loading, router]);

    return <LoadingScreen />;
}
