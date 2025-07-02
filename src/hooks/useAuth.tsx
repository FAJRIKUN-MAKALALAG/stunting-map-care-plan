import { useState, useEffect, createContext, useContext } from "react";
import { User, Session, AuthError } from "@supabase/supabase-js";
import { getSupabaseClient } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";

interface Profile {
  id: string;
  nama: string;
  email: string;
  nip?: string;
  telefon?: string;
  puskesmas?: string;
  wilayah_kerja?: string;
  spesialisasi?: string;
  avatar_url?: string;
  role: "doctor" | "parent";
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    userData: Partial<Profile>
  ) => Promise<{ error: AuthError | null }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  updateProfile: (
    updates: Partial<Profile>
  ) => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let subscription: any;
    (async () => {
      const supabase = await getSupabaseClient();
      subscription = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log("Auth state changed:", event, session);
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Fetch user profile
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (error) {
            console.error("Error fetching profile:", error);
          } else {
            setProfile(data);
          }
        } else {
          setProfile(null);
        }
        setLoading(false);
      });

      // Check for existing session
      const {
        data: { session: initialSession },
      } = await supabase.auth.getSession();
      console.log("Initial session:", initialSession);
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      if (!initialSession) {
        setLoading(false);
      }
    })();
    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const signUp = async (
    email: string,
    password: string,
    userData: Partial<Profile>
  ) => {
    try {
      const supabase = await getSupabaseClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      // Create profile after successful signup
      if (data.user) {
        const { error: profileError } = await supabase.from("profiles").upsert([
          {
            id: data.user.id,
            ...userData,
            email: data.user.email,
          },
        ]);

        if (profileError) throw profileError;
      }

      return { error: null };
    } catch (error: any) {
      console.error("Signup error:", error);
      return { error: error as AuthError };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Attempting sign in with:", { email });
      const supabase = await getSupabaseClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Sign in error:", error);
        throw error;
      }

      // Setelah login berhasil, update status online
      if (data.user) {
        await supabase
          .from("profiles")
          .update({ is_online: true })
          .eq("id", data.user.id);
      }

      console.log("Sign in successful:", data);
      return { error: null };
    } catch (error: any) {
      console.error("Sign in error:", error);
      return { error: error as AuthError };
    }
  };

  const signOut = async () => {
    try {
      const supabase = await getSupabaseClient();
      // Update status offline sebelum logout
      if (user) {
        await supabase
          .from("profiles")
          .update({ is_online: false })
          .eq("id", user.id);
      }
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Signout error:", error);
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new AuthError("No user logged in") };

    try {
      const supabase = await getSupabaseClient();
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);

      if (error) throw error;

      if (profile) {
        setProfile({ ...profile, ...updates });
      }

      return { error: null };
    } catch (error: any) {
      console.error("Update profile error:", error);
      return { error: error as AuthError };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
        updateProfile,
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

export async function claimChildren(parentId: string, childNiks: string[]) {
  const supabase = await getSupabaseClient();
  for (const nik of childNiks) {
    console.log("Sebelum update anak dengan NIK:", nik);
    const { data, error } = await supabase
      .from("children")
      .update({ parent_id: parentId })
      .eq("nik", nik)
      .is("parent_id", null);
    console.log("Sesudah update", { data, error });
    if (error) {
      console.error("Gagal update parent_id untuk NIK", nik, error);
      throw error;
    } else {
      console.log("Update berhasil untuk NIK", nik, data);
    }
  }
}
