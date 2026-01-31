"use client";

import type { AppUser } from "@/types";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { login as apiLogin, register as apiRegister, getMe } from "@/lib/api";

interface AuthContextType {
  user: AppUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<AppUser | null>;
  logout: () => void;
  // Deprecated/stubbed functions to avoid breaking old components immediately
  isPaid: boolean; 
  setPaymentSuccess: () => void;
  signUpFromDiagnostic: (diagnosticData: any, paymentMethod: 'card' | 'boleto', plan: any) => Promise<void>;
  recordDiagnosticAndPay: (diagnosticData: any, paymentMethod: 'card' | 'boleto', plan: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    setUser(null);
    router.push("/");
  }, [router]);

  // This effect runs once on mount to check for an existing session.
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          // Verify token with backend and get user data
          const fetchedUser = await getMe();
          // The backend response for user is partial for AppUser, so we patch it.
          // This should be fixed later by having the backend be the source of truth for all user fields.
           const fullUser: AppUser = {
              ...fetchedUser,
              isPaid: false, // Stub
              plan: 'START', // Stub
          };
          setUser(fullUser);
        } catch (error) {
          console.error("Auth initialization failed, token might be invalid:", error);
          logout();
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, [logout]);

  const login = async (email: string, password: string) => {
    const { access_token } = await apiLogin(email, password);
    localStorage.setItem("authToken", access_token);
    const fetchedUser = await getMe();
     const fullUser: AppUser = {
        ...fetchedUser,
        isPaid: false, // Stub
        plan: 'START', // Stub
    };
    setUser(fullUser);
  };
  
  const signUp = async (name: string, email: string, password: string): Promise<AppUser | null> => {
    const { access_token } = await apiRegister(name, email, password);
    localStorage.setItem("authToken", access_token);
    const fetchedUser = await getMe();
     const fullUser: AppUser = {
        ...fetchedUser,
        isPaid: false, // Stub
        plan: 'START', // Stub
    };
    setUser(fullUser);
    return fullUser;
  };
  
  // Stubs for deprecated functions to prevent crashes in other components.
  // This logic needs to be fully migrated to the backend.
  const setPaymentSuccess = () => {
      console.log("setPaymentSuccess called, but is deprecated. Payment status should be handled by backend.");
      if (user) {
        setUser({ ...user, isPaid: true });
      }
  }
  const signUpFromDiagnostic = async () => {
    throw new Error("signUpFromDiagnostic is deprecated and should not be called.");
  }
  const recordDiagnosticAndPay = async () => {
    throw new Error("recordDiagnosticAndPay is deprecated and should not be called.");
  }

  const isAuthenticated = !!user;
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        signUp,
        logout,
        // Stubs:
        isPaid: user?.isPaid || false,
        setPaymentSuccess,
        signUpFromDiagnostic,
        recordDiagnosticAndPay,
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
