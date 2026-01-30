"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Stepper } from "@/components/questionario/Stepper";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useToast } from "@/hooks/use-toast";
import { submitQuestionnaire } from "@/lib/api";

const steps = ["Empresa", "Tecnologia", "Desafios"];

const step1Schema = z.object({
  companyName: z.string().min(1, "Nome da empresa é obrigatório"),
  companySize: z.enum(["1-10", "11-50", "51-200", "201+"]),
});
const step2Schema = z.object({
  techStack: z.string().min(1, "Stack de tecnologia é obrigatória"),
  cloudProvider: z.string().min(1, "Provedor de nuvem é obrigatório"),
});
const step3Schema = z.oject({
  mainChallenge: z.string().min(10, "Descreva seu principal desafio em pelo menos 10 caracteres"),
});

const formSchema = step1Schema.merge(step2Schema).merge(step3Schema);

function QuestionnaireForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      companySize: "1-10",
      techStack: "",
      cloudProvider: "",
      mainChallenge: "",
    },
  });
  
  const handleNext = async () => {
    let isValid = false;
    if(currentStep === 0) {
      isValid = await form.trigger(["companyName", "companySize"]);
    } else if (currentStep === 1) {
      isValid = await form.trigger(["techStack", "cloudProvider"]);
    }
    
    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => prev - 1);
  };
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await submitQuestionnaire(values);
      toast({
        title: "Questionário enviado!",
        description: "Seu diagnóstico está sendo preparado. Redirecionando para pagamento.",
      });
      router.push("/pagamento");
    } catch(e) {
      toast({
        variant: "destructive",
        title: "Erro ao enviar",
        description: "Não foi possível enviar seu questionário. Tente novamente.",
      });
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Diagnóstico Técnico</CardTitle>
          <CardDescription>Responda as perguntas para gerarmos seu diagnóstico personalizado.</CardDescription>
           <div className="pt-8 pb-4">
            <Stepper steps={steps} currentStep={currentStep} />
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {currentStep === 0 && (
                <div className="space-y-4">
                  <FormField control={form.control} name="companyName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Empresa</FormLabel>
                      <FormControl><Input placeholder="Sua Empresa LTDA" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>
                  <FormField control={form.control} name="companySize" render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Tamanho da equipe de tecnologia</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="1-10" /></FormControl>
                            <FormLabel className="font-normal">1-10 pessoas</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="11-50" /></FormControl>
                            <FormLabel className="font-normal">11-50 pessoas</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="51-200" /></FormControl>
                            <FormLabel className="font-normal">51-200 pessoas</FormLabel>
                          </FormItem>
                           <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="201+" /></FormControl>
                            <FormLabel className="font-normal">Mais de 200 pessoas</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>
                </div>
              )}
              {currentStep === 1 && (
                 <div className="space-y-4">
                  <FormField control={form.control} name="techStack" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stack de Tecnologia Principal</FormLabel>
                      <FormControl><Textarea placeholder="Ex: React, Node.js, PostgreSQL, Docker..." {...field} /></FormControl>
                      <FormDescription>Liste as principais tecnologias que vocês utilizam.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}/>
                   <FormField control={form.control} name="cloudProvider" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provedor de Nuvem</FormLabel>
                      <FormControl><Input placeholder="Ex: AWS, Google Cloud, Azure" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>
                </div>
              )}
              {currentStep === 2 && (
                 <div className="space-y-4">
                  <FormField control={form.control} name="mainChallenge" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Principal Desafio Técnico</FormLabel>
                      <FormControl><Textarea placeholder="Descreva o maior problema ou objetivo técnico que sua empresa enfrenta hoje." {...field} rows={6} /></FormControl>
                       <FormDescription>Seja específico. Isso nos ajudará a criar um diagnóstico mais preciso.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}/>
                </div>
              )}

              <div className="flex justify-between pt-4">
                {currentStep > 0 ? (
                  <Button type="button" variant="outline" onClick={handlePrev}>
                    Anterior
                  </Button>
                ) : <div />}
                {currentStep < steps.length - 1 ? (
                  <Button type="button" onClick={handleNext}>
                    Próximo
                  </Button>
                ) : (
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Enviando..." : "Finalizar e Enviar"}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function QuestionnairePage() {
    return (
        <AuthGuard access="authenticated">
            <QuestionnaireForm />
        </AuthGuard>
    )
}
