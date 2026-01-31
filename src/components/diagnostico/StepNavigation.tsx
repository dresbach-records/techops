"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

interface StepNavigationProps {
  currentStep: number;
  totalSteps?: number;
  next?: {
    href?: string;
    label?: string;
    onClick?: () => void;
    disabled?: boolean;
  };
  back?: {
    href?: string;
  };
}

const stepUrlMap: { [key: number]: string } = {
    1: "01-bem-vindo",
    2: "02-identificacao",
    3: "03-empresa",
    4: "04-contato",
    5: "05-seguranca",
    6: "06-estagio",
    7: "07-dores",
    8: "08-repositorio",
    9: "09-expectativa",
    10: "10-pagamento",
};


export function StepNavigation({ currentStep, totalSteps = 10, next, back }: StepNavigationProps) {
  
  const nextHref = next?.href ?? (currentStep < totalSteps ? `/diagnostico/${stepUrlMap[currentStep + 1]}` : '/dashboard');
  const backHref = back?.href ?? (currentStep > 1 ? `/diagnostico/${stepUrlMap[currentStep - 1]}` : '/');

  const NextLink = () => {
    if (currentStep < totalSteps) {
        return (
            <Link href={nextHref}>
                {next?.label ?? 'Avançar'} <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
        )
    }
    return (
        <Link href={nextHref}>
            {next?.label ?? 'Finalizar e Pagar'} <Check className="ml-2 h-4 w-4" />
        </Link>
    )
  }

  return (
    <div className="flex items-center justify-between border-t bg-slate-50 p-6">
      {currentStep > 1 ? (
         <Button variant="ghost" asChild>
            <Link href={backHref}><ChevronLeft className="mr-2 h-4 w-4" /> Voltar</Link>
         </Button>
      ) : <div />}

      <Button onClick={next?.onClick} disabled={next?.disabled} asChild={!next?.onClick}>
        <NextLink />
      </Button>
    </div>
  );
}
