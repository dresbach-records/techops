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
import { jwtDecode } from "jwt-decode";
import { login as apiLogin, register as apiRegister } from "@/lib/api";

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

const decodeToken = (token: string): AppUser | null => {
  try {
    const decoded: { sub: string; name: string; email: string; role: string; exp: number } = jwtDecode(token);
    // Check if token is expired
    if (decoded.exp * 1000 < Date.now()) {
      return null;
    }
    return {
      id: decoded.sub,
      name: decoded.name,
      email: decoded.email, 
      isPaid: false, // This logic needs to be moved to the backend
      plan: 'START', // This logic needs to be moved to the backend
    };
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
};


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleAuthSuccess = useCallback((token: string): AppUser | null => {
    localStorage.setItem("authToken", token);
    const decodedUser = decodeToken(token);
    setUser(decodedUser);
    return decodedUser;
  }, []);
  
  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    setUser(null);
    router.push("/");
  }, [router]);

  useEffect(() => {
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        const decodedUser = decodeToken(token);
        if(decodedUser) {
          setUser(decodedUser);
        } else {
          // Token is expired or invalid
          logout();
        }
      }
    } catch (e) {
        console.error("Auth init error:", e);
    } finally {
      setLoading(false);
    }
  }, [logout]);

  const login = async (email: string, password: string) => {
    const { token } = await apiLogin(email, password);
    handleAuthSuccess(token);
  };
  
  const signUp = async (name: string, email: string, password: string) => {
    const { token } = await apiRegister(name, email, password);
    return handleAuthSuccess(token);
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
