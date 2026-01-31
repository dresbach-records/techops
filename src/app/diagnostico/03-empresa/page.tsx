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
    cnpj: z.string().optional(),
});

export default function EmpresaPage() {
    const { data, updateData } = useDiagnostic();
    const router = useRouter();
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            cnpj: data.pessoa.cnpj || "",
        }
    });

    const onSubmit = (formData: z.infer<typeof schema>) => {
        updateData({ pessoa: { ...data.pessoa, cnpj: formData.cnpj || null } });
        router.push("/diagnostico/04-contato");
    }

    return (
        <>
            <CardHeader className="p-8">
                <CardDescription className="font-semibold text-primary">Empresa</CardDescription>
                <CardTitle className="text-2xl font-headline">Você já tem uma empresa?</CardTitle>
            </CardHeader>
            <CardContent className="min-h-[250px] px-8">
                <p className="mb-6 text-muted-foreground">Se você já possui empresa, isso nos ajuda a orientar melhor as decisões técnicas.</p>
                <Form {...form}>
                    <form className="space-y-4">
                        <FormField control={form.control} name="cnpj" render={({ field }) => (
                            <FormItem>
                                <FormLabel>CNPJ (Opcional)</FormLabel>
                                <FormControl><Input placeholder="00.000.000/0000-00" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                    </form>
                </Form>
            </CardContent>
            <StepNavigation currentStep={3} next={{ onClick: form.handleSubmit(onSubmit) }} />
        </>
    );
}
