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

  const _recordDiagnosticAndPay = async (user: AppUser, diagnosticData: DiagnosticData, paymentMethod: 'card' | 'boleto', plan: Plan) => {
      const { pessoa, contato, projeto } = diagnosticData;
      const totalValue = plan.setupFee + (plan.monthlyFee > 0 ? plan.monthlyFee : 0);

      // 1. Insert diagnostic record and get its ID
      const diagnosticRecord = {
          user_id: user.id,
          nome: pessoa.nome || user.name,
          cpf: pessoa.cpf,
          data_nascimento: pessoa.data_nascimento,
          cnpj: pessoa.cnpj,
          email: contato.email || user.email,
          whatsapp: contato.whatsapp,
          estagio: projeto.estagio,
          dores: projeto.dores,
          repositorio: projeto.repositorio,
          expectativa: projeto.expectativa,
          metodo_pagamento: paymentMethod,
          status_pagamento: 'pendente',
          plano_recomendado: plan.key,
          plano_setup_fee: plan.setupFee,
          plano_monthly_fee: plan.monthlyFee,
      };

      const { data: insertedDiagnostic, error: insertError } = await supabase
          .from("diagnosticos")
          .insert([diagnosticRecord])
          .select()
          .single();

      if (insertError) {
          console.error("Erro ao salvar diagnóstico:", insertError);
          throw new Error("Houve um erro ao salvar seu diagnóstico. Por favor, contate o suporte.");
      }

      if (paymentMethod === 'boleto') {
          const boletoRequest = {
              user_id: user.id,
              user_name: user.name,
              user_email: user.email,
              user_cpf: pessoa.cpf || '',
              diagnostic_id: insertedDiagnostic.id,
              amount: totalValue,
              description: `Pagamento para ${plan.name} - Tech Lab`,
          };

          const response = await fetch('http://localhost:8080/v1/payments/boleto', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(boletoRequest),
          });

          if (!response.ok) {
              const errorData = await response.json();
              console.error("Backend error generating boleto:", errorData);
              throw new Error(errorData.error || "Falha ao gerar boleto via backend.");
          }

          const paymentData = await response.json();

          const { error: updateError } = await supabase
              .from('diagnosticos')
              .update({
                  asaas_customer_id: paymentData.asaas_customer_id,
                  asaas_payment_id: paymentData.asaas_payment_id,
                  boleto_url: paymentData.boleto_url,
                  status_pagamento: paymentData.status.toLowerCase(), // e.g., PENDING
              })
              .eq('id', insertedDiagnostic.id);
          
          if (updateError) {
              console.error("Erro ao atualizar diagnóstico com dados do boleto:", updateError);
              // Non-fatal, but should be logged
          }
      } else { // Credit Card
           const { error: updateError } = await supabase
              .from('diagnosticos')
              .update({ status_pagamento: 'pago' })
              .eq('id', insertedDiagnostic.id);

            if (updateError) {
              console.error("Erro ao atualizar status do pagamento para 'pago':", updateError);
            }
      }
  };

  const signUpFromDiagnostic = async (diagnosticData: DiagnosticData, paymentMethod: 'card' | 'boleto', plan: Plan) => {
    const email = diagnosticData.contato?.email;
    const password = diagnosticData.seguranca?.senha;
    const name = diagnosticData.pessoa?.nome;
    if (!email || !password || !name) throw new Error("Email, senha e nome são obrigatórios para o cadastro.");

    const isPaid = paymentMethod === 'card';
    const paymentPendingBoleto = paymentMethod === 'boleto';

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
          isPaid: isPaid,
          payment_pending_boleto: paymentPendingBoleto,
          plan: plan.key,
        },
      },
    });

    if (error) throw error;
    if (!data.user) throw new Error("Cadastro falhou, usuário não retornado.");

    const tempUser: AppUser = {
      id: data.user.id,
      email: data.user.email!,
      name: data.user.user_metadata.name,
      isPaid: data.user.user_metadata.isPaid,
      payment_pending_boleto: data.user.user_metadata.payment_pending_boleto,
      plan: data.user.user_metadata.plan,
    };
    
    await _recordDiagnosticAndPay(tempUser, diagnosticData, paymentMethod, plan);
  };
  
  const recordDiagnosticAndPay = async (diagnosticData: DiagnosticData, paymentMethod: 'card' | 'boleto', plan: Plan) => {
      if (!user) throw new Error("Usuário não está autenticado para realizar esta ação.");

      const isPaid = paymentMethod === 'card';
      const paymentPendingBoleto = paymentMethod === 'boleto';

      const { data, error } = await supabase.auth.updateUser({
        data: {
          isPaid: user.isPaid || isPaid, // Don't override if already paid
          payment_pending_boleto: paymentPendingBoleto,
          plan: plan.key,
        }
      });

      if (error) throw error;
      if (!data.user) throw new Error("Falha ao atualizar o usuário.");

       const updatedUser: AppUser = {
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata?.name || "Usuário",
          isPaid: data.user.user_metadata?.isPaid || false,
          payment_pending_boleto: data.user.user_metadata?.payment_pending_boleto || false,
          plan: data.user.user_metadata?.plan,
      };

      await _recordDiagnosticAndPay(updatedUser, diagnosticData, paymentMethod, plan);
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
