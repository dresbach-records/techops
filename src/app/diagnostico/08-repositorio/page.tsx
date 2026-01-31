"use client";
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StepNavigation } from "@/components/diagnostico/StepNavigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDiagnostic } from "@/contexts/DiagnosticContext";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const schema = z.object({
    repositorio: z.string().url("Por favor, insira uma URL válida.").optional().or(z.literal('')),
});

export default function RepositorioPage() {
    const { data, updateData } = useDiagnostic();
    const router = useRouter();
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            repositorio: data.projeto.repositorio || "",
        }
    });

    const onSubmit = (formData: z.infer<typeof schema>) => {
        updateData({ projeto: { ...data.projeto, ...formData } });
        router.push("/diagnostico/09-expectativa");
    }

    return (
        <>
            <CardHeader className="p-8">
                <CardDescription className="font-semibold text-primary">Repositório de Código</CardDescription>
                <CardTitle className="text-2xl font-headline">Onde está seu código?</CardTitle>
            </CardHeader>
            <CardContent className="min-h-[250px] px-8">
                <p className="mb-6 text-muted-foreground">Se já existir código, podemos analisá-lo tecnicamente. Cole a URL do seu repositório (ex: GitHub, GitLab).</p>
                <Form {...form}>
                    <form className="space-y-4">
                        <FormField control={form.control} name="repositorio" render={({ field }) => (
                            <FormItem>
                                <FormLabel>URL do Repositório (Opcional)</FormLabel>
                                <FormControl><Input placeholder="https://github.com/..." {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                    </form>
                </Form>
            </CardContent>
            <StepNavigation currentStep={8} next={{ onClick: form.handleSubmit(onSubmit) }} />
        </>
    );
}
