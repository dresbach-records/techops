"use client";
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StepNavigation } from "@/components/diagnostico/StepNavigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDiagnostic } from "@/contexts/DiagnosticContext";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";

const schema = z.object({
    dores: z.array(z.string()).optional(),
});

const techPains = [
    { id: "escalabilidade", label: "Escalabilidade e Performance" },
    { id: "custos", label: "Custos com infraestrutura" },
    { id: "ia", label: "Uso de Inteligência Artificial" },
    { id: "seguranca", label: "Segurança da aplicação" },
    { id: "divida_tecnica", label: "Dívida técnica e código legado" },
    { id: "processos", label: "Processos de desenvolvimento (DevOps)" },
];


export default function DoresPage() {
    const { data, updateData } = useDiagnostic();
    const router = useRouter();
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            dores: data.projeto.dores || [],
        }
    });

    const onSubmit = (formData: z.infer<typeof schema>) => {
        updateData({ projeto: { ...data.projeto, dores: formData.dores } });
        router.push("/diagnostico/08-repositorio");
    }

    return (
        <>
            <CardHeader className="p-8">
                <CardDescription className="font-semibold text-primary">Desafios Técnicos</CardDescription>
                <CardTitle className="text-2xl font-headline">Quais são seus principais desafios?</CardTitle>
            </CardHeader>
            <CardContent className="min-h-[250px] px-8">
                <p className="mb-6 text-muted-foreground">Selecione as opções que mais se aplicam ao seu cenário atual.</p>
                <Form {...form}>
                    <form className="space-y-3">
                         <FormField
                            control={form.control}
                            name="dores"
                            render={() => (
                                <FormItem>
                                {techPains.map((item) => (
                                    <FormField
                                    key={item.id}
                                    control={form.control}
                                    name="dores"
                                    render={({ field }) => {
                                        return (
                                        <FormItem
                                            key={item.id}
                                            className="flex flex-row items-start space-x-3 space-y-0"
                                        >
                                            <FormControl>
                                            <Checkbox
                                                checked={field.value?.includes(item.id)}
                                                onCheckedChange={(checked) => {
                                                return checked
                                                    ? field.onChange([...(field.value || []), item.id])
                                                    : field.onChange(
                                                        field.value?.filter(
                                                        (value) => value !== item.id
                                                        )
                                                    )
                                                }}
                                            />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                            {item.label}
                                            </FormLabel>
                                        </FormItem>
                                        )
                                    }}
                                    />
                                ))}
                                </FormItem>
                            )}
                            />
                    </form>
                </Form>
            </CardContent>
            <StepNavigation currentStep={7} next={{ onClick: form.handleSubmit(onSubmit) }} />
        </>
    );
}
