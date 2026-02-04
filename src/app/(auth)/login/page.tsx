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
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
  password: z.string().min(1, { message: "A senha é obrigatória." }),
});

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const loginBgImage = PlaceHolderImages.find((p) => p.id === 'login-background');

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    try {
      await login(values.email, values.password);
      router.push('/flow');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro no Login",
        description: error instanceof Error ? "E-mail ou senha inválidos." : "E-mail ou senha inválidos.",
      });
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <Card className="mx-auto w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Login</CardTitle>
            <CardDescription>
              Insira seu e-mail para acessar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
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
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            </Form>
            <div className="mt-4 text-center text-sm">
              Não tem uma conta?{" "}
              <Link href="/diagnostico" className="underline">
                Inicie o diagnóstico
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
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
            <h2 className="text-3xl font-bold font-headline text-primary">Bem-vindo de volta!</h2>
            <p className="text-muted-foreground mt-2 max-w-sm">Acesse sua plataforma e continue a jornada de inovação da sua empresa.</p>
        </div>
      </div>
    </div>
  );
}
