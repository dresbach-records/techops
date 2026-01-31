"use client";

import type { AppUser } from "@/types";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { DiagnosticData } from "./DiagnosticContext";
import type { Plan } from "@/types";
import { getContractText } from "@/lib/contract";

interface AuthContextType {
  user: AppUser | null;
  isAuthenticated: boolean;
  isPaid: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signUpFromDiagnostic: (diagnosticData: DiagnosticData, paymentMethod: 'card' | 'boleto', plan: Plan) => Promise<void>;
  recordDiagnosticAndPay: (diagnosticData: DiagnosticData, paymentMethod: 'card' | 'boleto', plan: Plan) => Promise<void>;
  logout: () => void;
  setPaymentSuccess: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = useMemo(createClient, []);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoading(true);
      if (session?.user) {
        const appUser: AppUser = {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name || "Usuário",
          isPaid: session.user.user_metadata?.isPaid || false,
          payment_pending_boleto: session.user.user_metadata?.payment_pending_boleto || false,
          plan: session.user.user_metadata?.plan,
        };
        setUser(appUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };
  
  const signUp = async (name: string, email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          isPaid: false,
          payment_pending_boleto: false,
        },
      },
    });
    if (error) throw error;
  };

  const _recordDiagnosticAndSendContract = async (userId: string, userEmail: string, userName: string, diagnosticData: DiagnosticData, paymentMethod: 'card' | 'boleto', plan: Plan) => {
      const { pessoa, contato, projeto } = diagnosticData;
      const diagnosticRecord = {
          user_id: userId,
          nome: pessoa.nome || userName,
          cpf: pessoa.cpf,
          data_nascimento: pessoa.data_nascimento,
          cnpj: pessoa.cnpj,
          email: contato.email || userEmail,
          whatsapp: contato.whatsapp,
          estagio: projeto.estagio,
          dores: projeto.dores,
          repositorio: projeto.repositorio,
          expectativa: projeto.expectativa,
          metodo_pagamento: paymentMethod,
          status_pagamento: paymentMethod === 'card' ? 'pago' : 'pendente',
          plano_recomendado: plan.key,
          plano_setup_fee: plan.setupFee,
          plano_monthly_fee: plan.monthlyFee,
      };

      const { error: insertError } = await supabase.from("diagnosticos").insert([diagnosticRecord]);

      if (insertError) {
          console.error("Erro ao salvar diagnóstico:", insertError);
          throw new Error("Houve um erro ao salvar seu diagnóstico. Por favor, contate o suporte.");
      }

      try {
          const contractHtml = getContractText(userName).replace(/\n/g, '<br />');
          await fetch('http://localhost:8080/v1/send-email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  to: userEmail,
                  subject: `Seu contrato com a Tech Lab`,
                  html: `<p>Olá ${userName},</p><p>Obrigado por se juntar à Tech Lab! Conforme nossos termos, seu cadastro confirma a aceitação do nosso contrato de serviços.</p><hr />${contractHtml}`
              }),
          });
      } catch (emailError) {
          console.error("Failed to send contract email:", emailError);
      }
  }

  const signUpFromDiagnostic = async (diagnosticData: DiagnosticData, paymentMethod: 'card' | 'boleto', plan: Plan) => {
    const email = diagnosticData.contato?.email;
    const password = diagnosticData.seguranca?.senha;
    const name = diagnosticData.pessoa?.nome;
    if (!email || !password || !name) throw new Error("Email, senha e nome são obrigatórios para o cadastro.");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
          isPaid: true,
          payment_pending_boleto: paymentMethod === 'boleto',
          plan: plan.key,
        },
      },
    });

    if (error) throw error;
    if (!data.user) throw new Error("Cadastro falhou, usuário não retornado.");

    await _recordDiagnosticAndSendContract(data.user.id, email, name, diagnosticData, paymentMethod, plan);
  };
  
  const recordDiagnosticAndPay = async (diagnosticData: DiagnosticData, paymentMethod: 'card' | 'boleto', plan: Plan) => {
      if (!user) throw new Error("Usuário não está autenticado para realizar esta ação.");

      const { data, error } = await supabase.auth.updateUser({
        data: {
          isPaid: true,
          payment_pending_boleto: paymentMethod === 'boleto',
          plan: plan.key,
        }
      });

      if (error) throw error;
      if (!data.user) throw new Error("Falha ao atualizar o usuário.");

      await _recordDiagnosticAndSendContract(user.id, user.email, user.name, diagnosticData, paymentMethod, plan);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
  };
  
  const setPaymentSuccess = async () => {
    if (user) {
        const { data, error } = await supabase.auth.updateUser({
            data: { isPaid: true, payment_pending_boleto: false }
        })
        if (data.user) {
             const appUser: AppUser = {
                id: data.user.id,
                email: data.user.email!,
                name: data.user.user_metadata?.name || "Usuário",
                isPaid: data.user.user_metadata?.isPaid || false,
                payment_pending_boleto: data.user.user_metadata?.payment_pending_boleto || false,
                plan: data.user.user_metadata?.plan,
            };
            setUser(appUser);
            router.push('/dashboard');
        }
        if (error) {
            console.error("Error updating user payment status", error);
        }
    }
  }
  
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
        signUpFromDiagnostic,
        recordDiagnosticAndPay,
        logout,
        setPaymentSuccess
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
