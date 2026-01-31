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

// Mock API calls
// The previous apiLogin and apiSignup are removed as the flow has changed.
// A new function will be needed to register the user after the diagnostic.

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isPaid: boolean;
  loading: boolean;
  logout: () => void;
  setPaymentSuccess: () => void;
  // A new method to create user from diagnostic will be added here
  // e.g., completeDiagnosticAndLogin: (userData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // This part remains to keep the user logged in across sessions
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

  const logout = () => {
    setUser(null);
    localStorage.removeItem("techLabUser");
    localStorage.removeItem("diagnosticData"); // Clear diagnostic data on logout
    router.push("/");
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
