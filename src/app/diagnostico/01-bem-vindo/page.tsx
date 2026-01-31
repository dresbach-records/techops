import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StepNavigation } from "@/components/diagnostico/StepNavigation";
import { Rocket } from "lucide-react";

export default function BemVindoPage() {
  return (
    <>
      <CardHeader className="text-center p-8">
        <div className="flex justify-center items-center mb-4">
            <Rocket className="h-12 w-12 text-primary" />
        </div>
        <CardTitle className="text-2xl font-headline">Vamos começar seu diagnóstico</CardTitle>
      </CardHeader>
      <CardContent className="min-h-[150px] flex items-center justify-center p-8">
         <p className="max-w-md text-center text-lg text-muted-foreground">
            Vamos entender seu cenário para criar uma solução técnica sob medida para você.
        </p>
      </CardContent>
      <StepNavigation currentStep={1} />
    </>
  );
}
