"use client";

import type { UserMeResponse } from "@/types/user";
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
  user: UserMeResponse | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<UserMeResponse | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserMeResponse | null>(null);
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
          setUser(fetchedUser);
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
    setUser(fetchedUser);
  };
  
  const signUp = async (name: string, email: string, password: string): Promise<UserMeResponse | null> => {
    const { access_token } = await apiRegister(name, email, password);
    localStorage.setItem("authToken", access_token);
    const fetchedUser = await getMe();
    setUser(fetchedUser);
    return fetchedUser;
  };
  
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
