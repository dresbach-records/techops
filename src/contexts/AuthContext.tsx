"use client";

import type { AppUser } from "@/types";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import type { DiagnosticData } from "./DiagnosticContext";

interface AuthContextType {
  user: AppUser | null;
  isAuthenticated: boolean;
  isPaid: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (diagnosticData: DiagnosticData, paymentMethod: 'card' | 'boleto') => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const appUser: AppUser = {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name || "Usuário",
          isPaid: session.user.user_metadata?.isPaid || false,
          payment_pending_boleto: session.user.user_metadata?.payment_pending_boleto || false,
        };
        setUser(appUser);
        if (appUser.isPaid) {
          router.push("/dashboard");
        } else {
          router.push("/pagamento");
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    // O onAuthStateChange cuidará do redirecionamento
  };

  const signUp = async (diagnosticData: DiagnosticData, paymentMethod: 'card' | 'boleto') => {
    const email = diagnosticData.contato?.email;
    const password = diagnosticData.seguranca?.senha;
    const name = diagnosticData.pessoa?.nome;

    if (!email || !password || !name) {
      throw new Error("Email, senha e nome são obrigatórios para o cadastro.");
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
          isPaid: true, // Libera acesso ao dashboard em ambos os casos
          payment_pending_boleto: paymentMethod === 'boleto',
        },
      },
    });

    if (error) throw error;
    if (!data.user) throw new Error("Cadastro falhou, usuário não retornado.");

    // Salva os dados do diagnóstico na tabela 'diagnosticos'
    const { error: insertError } = await supabase.from("diagnosticos").insert({
      user_id: data.user.id,
      ...diagnosticData,
    });

    if (insertError) {
      // Em um app real, seria importante ter uma estratégia de rollback aqui.
      // Por agora, apenas notificamos o erro.
      console.error("Erro ao salvar diagnóstico:", insertError);
      throw new Error(
        "Sua conta foi criada, mas houve um erro ao salvar seu diagnóstico. Por favor, contate o suporte."
      );
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
  };
  
  const isAuthenticated = !!user;
  const isPaid = user?.isPaid || false;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isPaid,
        loading,
        login,
        signUp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
