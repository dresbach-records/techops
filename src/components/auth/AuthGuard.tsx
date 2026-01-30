"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";

type AccessLevel = "authenticated" | "paid";

interface AuthGuardProps {
  children: ReactNode;
  access: AccessLevel;
}

function LoadingScreen() {
    return (
        <div className="flex items-center justify-center h-screen w-full">
           <div className="flex flex-col items-center space-y-4">
            <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-muted-foreground">Verificando acesso...</p>
           </div>
        </div>
    );
}

export function AuthGuard({ children, access }: AuthGuardProps) {
  const { isAuthenticated, isPaid, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) {
      return; // Wait until loading is complete
    }

    if (!isAuthenticated) {
      router.replace(`/login?redirect=${pathname}`);
      return;
    }

    if (access === "paid" && !isPaid) {
      router.replace("/pagamento");
      return;
    }
  }, [isAuthenticated, isPaid, loading, router, access, pathname]);

  if (loading || !isAuthenticated || (access === "paid" && !isPaid)) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
