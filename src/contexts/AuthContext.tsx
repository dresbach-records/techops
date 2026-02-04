"use client";

import type { UserMeResponse } from "@/types/user";
import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, type User as FirebaseUser } from "firebase/auth";
import { registerUserProfile, getMe } from "@/lib/api";
import { auth as firebaseAuth, isFirebaseConfigured } from "@/lib/firebase";

interface AuthContextType {
  user: UserMeResponse | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  isFirebaseConfigured: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<UserMeResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserMeResponse | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleAuthChange = useCallback(async (fbUser: FirebaseUser | null) => {
    if (fbUser) {
      setFirebaseUser(fbUser);
      try {
        // After firebase auth is confirmed, get our own backend user profile
        const backendUser = await getMe();
        setUser(backendUser);
      } catch (error) {
        // This might happen if the user exists in Firebase but not in our DB yet.
        // The signUp flow will handle creating the user profile.
        console.warn("Could not fetch backend user profile:", error);
        setUser(null); // Ensure local state is clean
      }
    } else {
      setFirebaseUser(null);
      setUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured || !firebaseAuth) {
      setLoading(false);
      return; // Do nothing if Firebase is not configured
    }
    const unsubscribe = onAuthStateChanged(firebaseAuth, handleAuthChange);
    return () => unsubscribe();
  }, [handleAuthChange]);

  const login = async (email: string, password: string) => {
    if (!isFirebaseConfigured || !firebaseAuth) {
      throw new Error("Firebase não está configurado. O login está desativado.");
    }
    await signInWithEmailAndPassword(firebaseAuth, email, password);
    // onAuthStateChanged will handle the rest
  };

  const signUp = async (name: string, email: string, password: string) => {
    if (!isFirebaseConfigured || !firebaseAuth) {
        throw new Error("Firebase não está configurado. O cadastro está desativado.");
    }
    const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    if (userCredential.user) {
        // After creating the user in Firebase, create the profile in our backend.
        const backendUser = await registerUserProfile(name);
        setUser(backendUser);
        return backendUser;
    }
    // onAuthStateChanged will also fire and handle setting the user state.
    throw new Error("Failed to create Firebase user.");
  };

  const logout = useCallback(async () => {
    if (isFirebaseConfigured && firebaseAuth) {
      await signOut(firebaseAuth);
    }
    setUser(null);
    setFirebaseUser(null);
    router.push("/");
  }, [router]);
  
  const isAuthenticated = !!firebaseUser && !!user && isFirebaseConfigured;
  
  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isAuthenticated,
        loading,
        isFirebaseConfigured,
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
