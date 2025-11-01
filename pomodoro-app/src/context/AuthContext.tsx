import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "../services/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signUp: async () => ({ error: null }),
  signIn: async () => ({ error: null }),
  signOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      console.log("🔵 [AUTH] signUp called with email:", email);
      const trimmedEmail = email.trim().toLowerCase();
      
      // Validate email format
      if (!trimmedEmail || !/\S+@\S+\.\S+/.test(trimmedEmail)) {
        return { 
          error: { 
            message: "Please enter a valid email address",
            status: 422 
          } 
        };
      }

      // Validate password length
      if (!password || password.length < 6) {
        return { 
          error: { 
            message: "Password must be at least 6 characters",
            status: 422 
          } 
        };
      }
      
      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          emailRedirectTo: undefined, // For mobile apps, no redirect needed
          data: {
            email: trimmedEmail,
          },
        },
      });

      if (error) {
        console.error("🔵 [AUTH] signUp error:", error);
        console.error("🔵 [AUTH] Error code:", error.status);
        console.error("🔵 [AUTH] Error message:", error.message);
        console.error("🔵 [AUTH] Full error:", JSON.stringify(error, null, 2));
        return { error };
      }

      console.log("🔵 [AUTH] signUp successful, user:", data.user?.email);
      console.log("🔵 [AUTH] User ID:", data.user?.id);
      console.log("🔵 [AUTH] Requires confirmation:", data.user?.email_confirmed_at === null);
      
      return { error: null };
    } catch (error: any) {
      console.error("🔵 [AUTH] signUp exception:", error);
      return { error: error || { message: "An unexpected error occurred" } };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log("🔴 [AUTH] signIn called with email:", email);
      console.log("🔴 [AUTH] Password length:", password.length);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("🔴 [AUTH] signIn error details:", error);
        return { error };
      }

      console.log("🔴 [AUTH] signIn successful, user:", data.user?.email);
      return { error: null };
    } catch (error) {
      console.error("🔴 [AUTH] signIn exception:", error);
      return { error };
    }
  };

  const signOut = async () => {
    console.log("🔴 [AUTH] signOut called");
    try {
      console.log("🔴 [AUTH] Calling supabase.auth.signOut()");
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("🔴 [AUTH] Supabase error:", error);
        throw error;
      }

      console.log("🔴 [AUTH] Supabase signOut successful");

      // Clear ALL auth-related storage keys
      try {
        const allKeys = await AsyncStorage.getAllKeys();
        const keysToRemove = allKeys.filter(
          (key) =>
            key.includes("supabase") ||
            key.includes("auth") ||
            key.includes("sb-") ||
            key.includes("session")
        );

        if (keysToRemove.length > 0) {
          await AsyncStorage.multiRemove(keysToRemove);
          console.log("🔴 [AUTH] Cleared storage keys:", keysToRemove);
        }
      } catch (storageError) {
        console.warn("🔴 [AUTH] Could not clear storage:", storageError);
      }

      // Force clear the state immediately
      setUser(null);
      setSession(null);
      console.log("🔴 [AUTH] User state cleared, should redirect to login");
    } catch (error) {
      console.error("🔴 [AUTH] Exception in signOut:", error);
      // Even on error, try to clear state
      setUser(null);
      setSession(null);
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
