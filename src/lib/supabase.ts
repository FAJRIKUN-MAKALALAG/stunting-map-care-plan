import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
});

// Helper functions
export const getCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Type definitions
export type Profile = {
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
  created_at: string;
  updated_at: string;
};

export type Child = {
  id: string;
  user_id: string;
  nama: string;
  nik?: string;
  tanggal_lahir: string;
  jenis_kelamin: "male" | "female";
  nama_ibu?: string;
  alamat?: string;
  dusun?: string;
  berat_badan: number;
  tinggi_badan: number;
  lingkar_kepala?: number;
  catatan?: string;
  z_score_haz?: number;
  z_score_waz?: number;
  z_score_whz?: number;
  status_gizi?: string;
  is_stunted: boolean;
  created_at: string;
  updated_at: string;
};

export type Notification = {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  is_read: boolean;
  created_at: string;
};
