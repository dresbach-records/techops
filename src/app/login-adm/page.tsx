"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you'd have authentication logic here.
        // For now, we'll just redirect to the admin dashboard.
        router.push("/admin");
    }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="mx-auto w-full max-w-sm">
          <CardHeader className="text-center">
            <div className="flex justify-center items-center mb-4">
                <Shield className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl font-headline">Painel Tech Lab</CardTitle>
            <CardDescription>
              Acesso restrito para a equipe.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Senha</Label>
                </div>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                Entrar
              </Button>
            </form>
          </CardContent>
        </Card>
    </div>
  );
}
