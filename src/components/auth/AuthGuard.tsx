"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: ReactNode;
}

function LoadingScreen() {
    return (
        <div className="flex items-center justify-center h-screen w-full">
           <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground">Verificando acesso...</p>
           </div>
        </div>
    );
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      return; // Wait until loading is complete
    }

    if (!isAuthenticated) {
      router.replace(`/flow`);
      return;
    }

  }, [isAuthenticated, loading, router]);

  if (loading || !isAuthenticated) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
