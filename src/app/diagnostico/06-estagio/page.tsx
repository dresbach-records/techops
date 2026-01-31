"use client";
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StepNavigation } from "@/components/diagnostico/StepNavigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDiagnostic } from "@/contexts/DiagnosticContext";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter } from "next/navigation";

const schema = z.object({
    estagio: z.string({ required_error: "Por favor, selecione um estágio." }),
});

const stages = [
    { value: "ideia", label: "Apenas uma ideia" },
    { value: "prototipo", label: "Protótipo ou MVP" },
    { value: "producao", label: "Produto em produção" },
    { value: "reestruturacao", label: "Reestruturação ou grande mudança" },
]

export default function EstagioPage() {
    const { data, updateData } = useDiagnostic();
    const router = useRouter();
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            estagio: data.projeto.estagio || "",
        }
    });

    const onSubmit = (formData: z.infer<typeof schema>) => {
        updateData({ projeto: { ...data.projeto, estagio: formData.estagio } });
        router.push("/diagnostico/07-dores");
    }

     const handleRadioChange = (value: string) => {
        form.setValue("estagio", value);
        updateData({ projeto: { ...data.projeto, estagio: value } });
        // Optional: auto-navigate on selection
        // setTimeout(() => router.push("/diagnostico/07-dores"), 300);
    };

    return (
        <>
            <CardHeader className="p-8">
                <CardDescription className="font-semibold text-primary">Estágio do Projeto</CardDescription>
                <CardTitle className="text-2xl font-headline">Em que momento você está hoje?</CardTitle>
            </CardHeader>
            <CardContent className="min-h-[250px] px-8">
                <Form {...form}>
                    <form>
                        <FormField control={form.control} name="estagio" render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormControl>
                                    <RadioGroup onValueChange={handleRadioChange} defaultValue={field.value} className="flex flex-col space-y-2">
                                        {stages.map(stage => (
                                            <FormItem key={stage.value} className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <div className="flex items-center p-4 border rounded-md hover:bg-accent hover:text-accent-foreground cursor-pointer w-full">
                                                        <RadioGroupItem value={stage.value} id={stage.value} />
                                                        <Label htmlFor={stage.value} className="font-normal pl-4 cursor-pointer w-full">{stage.label}</Label>
                                                    </div>
                                                </FormControl>
                                            </FormItem>
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                            </FormItem>
                        )}/>
                    </form>
                </Form>
            </CardContent>
            <StepNavigation currentStep={6} next={{ onClick: form.handleSubmit(onSubmit) }} />
        </>
    );
}
