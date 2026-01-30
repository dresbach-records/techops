"use client";

import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Rocket } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useState } from "react";

const signupSchema = z.object({
  name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres." }),
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
  password: z.string().min(8, { message: "A senha deve ter pelo menos 8 caracteres." }),
});

export default function SignupPage() {
  const { signUp } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const loginBgImage = PlaceHolderImages.find((p) => p.id === 'login-background');

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signupSchema>) {
    setIsLoading(true);
    try {
      await signUp(values.name, values.email, values.password);
      toast({
        title: "Conta criada com sucesso!",
        description: "Você será redirecionado para o questionário.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro no Cadastro",
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido.",
      });
       setIsLoading(false);
    }
  }

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="hidden bg-muted lg:block relative">
        {loginBgImage && (
             <Image
                src={loginBgImage.imageUrl}
                alt={loginBgImage.description}
                data-ai-hint={loginBgImage.imageHint}
                fill
                style={{objectFit: 'cover'}}
                className="opacity-20"
            />
        )}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-12">
            <Rocket className="h-16 w-16 text-primary mb-4" />
            <h2 className="text-3xl font-bold font-headline text-primary">Inicie sua Jornada</h2>
            <p className="text-muted-foreground mt-2 max-w-sm">Crie sua conta e dê o primeiro passo para o futuro tecnológico da sua empresa.</p>
        </div>
      </div>
      <div className="flex items-center justify-center py-12">
        <Card className="mx-auto w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Cadastro</CardTitle>
            <CardDescription>
              Crie sua conta para iniciar o diagnóstico técnico.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu nome" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input placeholder="seu@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Criando conta...' : 'Criar Conta'}
                </Button>
              </form>
            </Form>
            <div className="mt-4 text-center text-sm">
              Já tem uma conta?{" "}
              <Link href="/login" className="underline">
                Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
