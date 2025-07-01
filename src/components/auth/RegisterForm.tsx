import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Heart,
  Phone,
  MapPin,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// Tambahkan tipe data untuk form register
export interface RegisterFormData {
  nama: string;
  email: string;
  password: string;
  confirmPassword: string;
  nip?: string;
  telefon?: string;
  puskesmas?: string;
  wilayahKerja?: string;
  role: string;
}

interface RegisterFormProps {
  onRegister: (
    userData: RegisterFormData
  ) => Promise<{ user?: { id: string } } | undefined>;
  onSwitchToLogin: () => void;
}

// Tambahkan fungsi mapping role UI ke DB
function mapRoleToDb(roleUi: string): "parent" | "doctor" {
  if (roleUi === "Orang Tua") return "parent";
  if (roleUi === "Tenaga Kesehatan") return "doctor";
  return roleUi as "parent" | "doctor";
}

const RegisterForm = ({ onRegister, onSwitchToLogin }: RegisterFormProps) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    nama: "",
    email: "",
    password: "",
    confirmPassword: "",
    nip: "",
    telefon: "",
    puskesmas: "",
    wilayahKerja: "",
    role: "Tenaga Kesehatan",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [childNiks, setChildNiks] = useState([""]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, role: e.target.value }));
    if (e.target.value !== "Orang Tua") setChildNiks([""]);
  };

  const handleChildNikChange = (idx: number, value: string) => {
    setChildNiks((prev) => prev.map((nik, i) => (i === idx ? value : nik)));
  };

  const addChildNik = () => setChildNiks((prev) => [...prev, ""]);
  const removeChildNik = (idx: number) =>
    setChildNiks((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password tidak cocok!",
        description: "Pastikan password dan konfirmasi password sama.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Gunakan fungsi mapping agar role yang dikirim ke DB konsisten
    const result = await onRegister({
      ...formData,
      role: mapRoleToDb(formData.role),
    });

    // Jika terjadi error pada pembuatan profile, tampilkan error dan jangan lanjut claim anak
    if (result?.error) {
      toast({
        title: "Gagal membuat profil!",
        description:
          result.error.message || "Terjadi kesalahan saat membuat profil.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (mapRoleToDb(formData.role) === "parent" && result?.user?.id) {
      const { claimChildren } = await import("@/lib/supabase");
      await claimChildren(
        result.user.id,
        childNiks.filter((nik) => nik.trim() !== "")
      );
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Daftar Akun Dokter
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Bergabunglah dalam program penanggulangan stunting
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="nama"
                className="text-sm font-medium text-gray-700"
              >
                Nama Lengkap
              </Label>
              <Input
                id="nama"
                type="text"
                placeholder="Nama lengkap"
                value={formData.nama}
                onChange={(e) => handleInputChange("nama", e.target.value)}
                className="h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="role"
                className="text-sm font-medium text-gray-700"
              >
                Role
              </Label>
              <select
                id="role"
                value={formData.role}
                onChange={handleRoleChange}
                className="w-full h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg px-3"
                required
              >
                <option value="Tenaga Kesehatan">Tenaga Kesehatan</option>
                <option value="Orang Tua">Orang Tua</option>
              </select>
            </div>
            {formData.role === "Orang Tua" && (
              <>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    NIK Anak
                  </Label>
                  {childNiks.map((nik, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <Input
                        type="text"
                        placeholder="Masukkan NIK anak"
                        value={nik}
                        onChange={(e) =>
                          handleChildNikChange(idx, e.target.value)
                        }
                        className="flex-1"
                        required={idx === 0}
                      />
                      {childNiks.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => removeChildNik(idx)}
                        >
                          -
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addChildNik}>
                    Tambah NIK Anak
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                  >
                    Password
                  </Label>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimal 6 karakter"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className="h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </>
            )}
            {formData.role === "Tenaga Kesehatan" && (
              <>
                <div className="space-y-2">
                  <Label
                    htmlFor="nip"
                    className="text-sm font-medium text-gray-700"
                  >
                    NIP
                  </Label>
                  <Input
                    id="nip"
                    type="text"
                    placeholder="1234567890"
                    value={formData.nip}
                    onChange={(e) => handleInputChange("nip", e.target.value)}
                    className="h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="telefon"
                    className="text-sm font-medium text-gray-700"
                  >
                    Nomor Telepon
                  </Label>
                  <Input
                    id="telefon"
                    type="tel"
                    placeholder="08123456789"
                    value={formData.telefon}
                    onChange={(e) =>
                      handleInputChange("telefon", e.target.value)
                    }
                    className="h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="puskesmas"
                    className="text-sm font-medium text-gray-700"
                  >
                    Puskesmas
                  </Label>
                  <Input
                    id="puskesmas"
                    type="text"
                    placeholder="Puskesmas Airmadidi"
                    value={formData.puskesmas}
                    onChange={(e) =>
                      handleInputChange("puskesmas", e.target.value)
                    }
                    className="h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="wilayahKerja"
                    className="text-sm font-medium text-gray-700"
                  >
                    Wilayah Kerja
                  </Label>
                  <Input
                    id="wilayahKerja"
                    type="text"
                    placeholder="Kecamatan Airmadidi"
                    value={formData.wilayahKerja}
                    onChange={(e) =>
                      handleInputChange("wilayahKerja", e.target.value)
                    }
                    className="h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                    required
                  />
                </div>
              </>
            )}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium rounded-lg transition-all duration-300 mt-6"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Mendaftar...</span>
                </div>
              ) : (
                "Daftar Akun"
              )}
            </Button>
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Sudah punya akun?{" "}
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Masuk di sini
                </button>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterForm;
