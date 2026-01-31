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
    senha: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
});

export default function SegurancaPage() {
    const { data, updateData } = useDiagnostic();
    const router = useRouter();
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            senha: data.seguranca.senha || "",
        }
    });

    const onSubmit = (formData: z.infer<typeof schema>) => {
        updateData({ seguranca: formData });
        router.push("/diagnostico/06-estagio");
    }

    return (
        <>
            <CardHeader className="p-8">
                <CardDescription className="font-semibold text-primary">Segurança</CardDescription>
                <CardTitle className="text-2xl font-headline">Proteja sua conta</CardTitle>
            </CardHeader>
            <CardContent className="min-h-[250px] px-8">
                 <p className="mb-6 text-muted-foreground">Crie uma senha para proteger seu painel e seus dados técnicos.</p>
                <Form {...form}>
                    <form className="space-y-4">
                        <FormField control={form.control} name="senha" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Crie uma senha</FormLabel>
                                <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                    </form>
                </Form>
            </CardContent>
            <StepNavigation currentStep={5} next={{ onClick: form.handleSubmit(onSubmit) }} />
        </>
    );
}
