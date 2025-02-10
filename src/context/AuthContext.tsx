import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  error: Error | null;
  isLoading: boolean;
};

const initialState: AuthContextType = {
  session: null,
  user: null,
  error: null,
  isLoading: true,
};

const AuthContext = createContext<AuthContextType>(initialState);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthContextType>(initialState);

  useEffect(() => {
    async function initializeAuth() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        setState({
          session,
          user: session?.user ?? null,
          error: null,
          isLoading: false,
        });
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error as Error,
          isLoading: false,
        }));
      }
    }

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setState(prev => ({
        ...prev,
        session,
        user: session?.user ?? null,
        error: null,
      }));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={state}>
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
