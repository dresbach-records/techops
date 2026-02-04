"use client";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Rocket } from "lucide-react";
import { DiagnosticProvider } from "@/contexts/DiagnosticContext";

const totalSteps = 10;
const stepUrlMap: { [key: string]: number } = {
    "01-bem-vindo": 1,
    "02-identificacao": 2,
    "03-empresa": 3,
    "04-contato": 4,
    "05-seguranca": 5,
    "06-estagio": 6,
    "07-dores": 7,
    "08-repositorio": 8,
    "09-expectativa": 9,
    "10-pagamento": 10,
};

function DiagnosticLayoutContent({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const pathParts = pathname.split('/');
    const currentStepKey = pathParts.length > 2 ? pathParts[2] : "";
    const currentStep = stepUrlMap[currentStepKey] || 0;
    const progress = (currentStep / totalSteps) * 100;

    return (
        <div className="flex min-h-screen w-full flex-col items-center bg-gray-50 font-body text-foreground">
            <header className="w-full max-w-5xl px-4 py-4 flex justify-center md:justify-start">
                <Link href="/" className="flex items-center gap-2">
                   <Rocket className="h-8 w-8 text-primary" />
                   <span className="font-headline text-2xl font-bold">Tech Lab</span>
                </Link>
            </header>
            <main className="flex w-full flex-1 items-center justify-center p-4">
                <div className="w-full max-w-xl">
                    {currentStep > 0 && currentStep <= totalSteps && (
                        <div className="mb-8">
                            <p className="text-center text-sm text-muted-foreground mb-2">
                                Passo {currentStep} de {totalSteps}
                            </p>
                            <Progress value={progress} className="w-full" />
                        </div>
                    )}
                    <Card className="overflow-hidden border-t-4 border-primary shadow-lg">
                        {children}
                    </Card>
                </div>
            </main>
             <footer className="w-full py-6 text-center">
                <p className="text-sm text-muted-foreground">© 2026 Tech Lab</p>
            </footer>
        </div>
    );
}

export default function DiagnosticLayout({ children }: { children: ReactNode }) {
    return (
        <DiagnosticProvider>
            <DiagnosticLayoutContent>{children}</DiagnosticLayoutContent>
        </DiagnosticProvider>
    )
}
