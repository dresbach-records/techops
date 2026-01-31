import type { AppUser } from "@/types";
import { DiagnosticData } from "@/contexts/DiagnosticContext";

// This file is being deprecated. The logic has been moved to AuthContext.
// The functions below are kept to avoid build errors from obsolete components.

export const submitQuestionnaire = (data: any): Promise<void> => {
  console.warn("submitQuestionnaire is deprecated.");
  return Promise.resolve();
};

// The old login/signup mocks are removed.
// The new flow will require a different API structure.

/**
 * Mocks the final submission of the diagnostic data,
 * user creation, and payment simulation.
 * In a real application, this would be multiple, secure API calls.
 * @deprecated Use functions from AuthContext instead.
 */
export const submitDiagnosticAndCreateUser = (data: DiagnosticData): Promise<AppUser> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("Submitting diagnostic and creating user:", data);
      
      if (!data.contato.email || !data.seguranca.senha || !data.pessoa.nome) {
        reject(new Error("Informações essenciais para o cadastro estão faltando."));
        return;
      }

      // Simulate user creation
      const newUser: AppUser = {
        id: Math.random().toString(36).substring(7),
        name: data.pessoa.nome,
        email: data.contato.email,
        isPaid: true, // Simulate successful payment
        payment_pending_boleto: false,
        plan: 'START',
      };
      
      console.log("User created and payment processed:", newUser);
      resolve(newUser);
    }, 1500);
  });
};
