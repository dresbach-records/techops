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
    nome: z.string().min(3, "Nome completo é obrigatório."),
    cpf: z.string().optional(),
    data_nascimento: z.string().optional(),
});

export default function IdentificacaoPage() {
    const { data, updateData } = useDiagnostic();
    const router = useRouter();
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            nome: data.pessoa.nome || "",
            cpf: data.pessoa.cpf || "",
            data_nascimento: data.pessoa.data_nascimento || "",
        }
    });

    const onSubmit = (formData: z.infer<typeof schema>) => {
        updateData({ pessoa: { ...data.pessoa, ...formData } });
        router.push("/diagnostico/03-empresa");
    }

    return (
        <>
            <CardHeader className="p-8">
                <CardDescription className="font-semibold text-primary">Identificação</CardDescription>
                <CardTitle className="text-2xl font-headline">Para começar, quem é você?</CardTitle>
            </CardHeader>
            <CardContent className="min-h-[250px] px-8">
                <p className="mb-6 text-muted-foreground">Precisamos de algumas informações básicas para garantir segurança e personalização.</p>
                <Form {...form}>
                    <form className="space-y-4">
                        <FormField control={form.control} name="nome" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nome Completo</FormLabel>
                                <FormControl><Input placeholder="Seu nome" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                         <FormField control={form.control} name="cpf" render={({ field }) => (
                            <FormItem>
                                <FormLabel>CPF (Opcional)</FormLabel>
                                <FormControl><Input placeholder="000.000.000-00" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="data_nascimento" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Data de Nascimento (Opcional)</FormLabel>
                                <FormControl><Input type="date" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                    </form>
                </Form>
            </CardContent>
            <StepNavigation currentStep={2} next={{ onClick: form.handleSubmit(onSubmit) }} />
        </>
    );
}
