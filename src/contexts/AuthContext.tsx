"use client";

import type { User } from "@/types";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { login as apiLogin, signup as apiSignup } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isPaid: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setPaymentSuccess: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("techLabUser");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem("techLabUser");
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const userData = await apiLogin(email, password);
    if (userData) {
      setUser(userData);
      localStorage.setItem("techLabUser", JSON.stringify(userData));
      if (userData.isPaid) {
        router.push("/dashboard");
      } else {
        router.push("/questionario");
      }
    } else {
      throw new Error("Credenciais inválidas. Por favor, tente novamente.");
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    const newUser = await apiSignup(name, email, password);
    if (newUser) {
      setUser(newUser);
      localStorage.setItem("techLabUser", JSON.stringify(newUser));
      router.push("/questionario");
    } else {
      throw new Error("Não foi possível criar a conta. Tente outro e-mail.");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("techLabUser");
    router.push("/login");
  };

  const setPaymentSuccess = () => {
    if (user) {
      const updatedUser = { ...user, isPaid: true };
      setUser(updatedUser);
      localStorage.setItem("techLabUser", JSON.stringify(updatedUser));
    }
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
        setPaymentSuccess,
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
