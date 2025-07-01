import { getSupabaseClient } from "@/integrations/supabase/client";

// Helper functions
export const getCurrentUser = async () => {
  const supabase = await getSupabaseClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

export const signOut = async () => {
  const supabase = await getSupabaseClient();
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
  parent_id?: string;
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

export async function claimChildren(parentId: string, childNiks: string[]) {
  const supabase = await getSupabaseClient();
  for (const nik of childNiks) {
    console.log("Mengupdate anak dengan NIK:", nik, "-> parent_id:", parentId);
    const { data, error } = await supabase
      .from("children")
      .update({ parent_id: parentId })
      .eq("nik", nik)
      .is("parent_id", null); // hanya update jika parent_id masih null
    if (error) {
      console.error("Gagal update parent_id untuk NIK", nik, error);
    } else {
      console.log("Update berhasil untuk NIK", nik, data);
    }
  }
}

export async function fetchChildrenByParent(parentId: string) {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from("children")
    .select("*")
    .eq("parent_id", parentId);
  if (error) throw error;
  return data;
}
