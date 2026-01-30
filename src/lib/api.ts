import type { User } from "@/types";

// Mock API calls

export const login = (email: string, password: string): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === "pago@test.com" && password === "password") {
        resolve({
          id: "1",
          name: "Usuário Pago",
          email: "pago@test.com",
          isPaid: true,
        });
      } else if (email === "naopago@test.com" && password === "password") {
        resolve({
          id: "2",
          name: "Usuário Não Pago",
          email: "naopago@test.com",
          isPaid: false,
        });
      } else {
        reject(new Error("Invalid credentials"));
      }
    }, 1000);
  });
};

export const signup = (name: string, email: string, password: string): Promise<User | null> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if(email.includes('test.com')) {
                 resolve({
                    id: Math.random().toString(36).substring(7),
                    name: name,
                    email: email,
                    isPaid: false,
                });
            } else {
                reject(new Error("This email is already taken"));
            }
        }, 1000);
    });
}

export const submitQuestionnaire = (data: any): Promise<{ success: boolean }> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("Questionnaire data submitted:", data);
            resolve({ success: true });
        }, 1500);
    });
}
