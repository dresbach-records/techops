"use client";
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StepNavigation } from "@/components/diagnostico/StepNavigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDiagnostic } from "@/contexts/DiagnosticContext";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

const schema = z.object({
    expectativa: z.string().min(10, "Descreva sua expectativa com pelo menos 10 caracteres."),
});

export default function ExpectativaPage() {
    const { data, updateData } = useDiagnostic();
    const router = useRouter();
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            expectativa: data.projeto.expectativa || "",
        }
    });

    const onSubmit = (formData: z.infer<typeof schema>) => {
        updateData({ projeto: { ...data.projeto, ...formData } });
        router.push("/diagnostico/10-pagamento");
    }

    return (
        <>
            <CardHeader className="p-8">
                <CardDescription className="font-semibold text-primary">Sua Expectativa</CardDescription>
                <CardTitle className="text-2xl font-headline">O que você espera da Tech Lab?</CardTitle>
            </CardHeader>
            <CardContent className="min-h-[250px] px-8">
                <p className="mb-6 text-muted-foreground">Conte com suas palavras qual é o problema e o que você espera que a Tech Lab resolva.</p>
                <Form {...form}>
                    <form className="space-y-4">
                        <FormField control={form.control} name="expectativa" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Descreva seu problema e sua expectativa</FormLabel>
                                <FormControl><Textarea placeholder="Ex: Meu aplicativo está lento e quero saber como otimizá-lo..." {...field} rows={5}/></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                    </form>
                </Form>
            </CardContent>
            <StepNavigation currentStep={9} next={{ onClick: form.handleSubmit(onSubmit) }} />
        </>
    );
}
