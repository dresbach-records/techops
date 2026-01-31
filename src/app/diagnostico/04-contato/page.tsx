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
    email: z.string().email("Por favor, insira um e-mail válido."),
    whatsapp: z.string().optional(),
});

export default function ContatoPage() {
    const { data, updateData } = useDiagnostic();
    const router = useRouter();
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            email: data.contato.email || "",
            whatsapp: data.contato.whatsapp || "",
        }
    });

    const onSubmit = (formData: z.infer<typeof schema>) => {
        updateData({ contato: formData });
        router.push("/diagnostico/05-seguranca");
    }

    return (
        <>
            <CardHeader className="p-8">
                <CardDescription className="font-semibold text-primary">Contato</CardDescription>
                <CardTitle className="text-2xl font-headline">Como podemos falar com você?</CardTitle>
            </CardHeader>
            <CardContent className="min-h-[250px] px-8">
                <p className="mb-6 text-muted-foreground">Usaremos esses dados apenas para acompanhar sua consultoria.</p>
                <Form {...form}>
                    <form className="space-y-4">
                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem>
                                <FormLabel>E-mail</FormLabel>
                                <FormControl><Input type="email" placeholder="seu@email.com" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="whatsapp" render={({ field }) => (
                            <FormItem>
                                <FormLabel>WhatsApp (Opcional)</FormLabel>
                                <FormControl><Input placeholder="(00) 90000-0000" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                    </form>
                </Form>
            </CardContent>
            <StepNavigation currentStep={4} next={{ onClick: form.handleSubmit(onSubmit) }} />
        </>
    );
}
