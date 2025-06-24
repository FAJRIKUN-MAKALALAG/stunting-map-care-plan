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

interface RegisterFormProps {
  onRegister: (userData: any) => void;
  onSwitchToLogin: () => void;
}

const RegisterForm = ({ onRegister, onSwitchToLogin }: RegisterFormProps) => {
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    password: "",
    confirmPassword: "",
    nip: "",
    telefon: "",
    puskesmas: "",
    wilayahKerja: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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

    onRegister(formData);
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="nama"
                  className="text-sm font-medium text-gray-700"
                >
                  Nama Lengkap
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="nama"
                    type="text"
                    placeholder="Dr. Nama Lengkap"
                    value={formData.nama}
                    onChange={(e) => handleInputChange("nama", e.target.value)}
                    className="pl-10 h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="nip"
                  className="text-sm font-medium text-gray-700"
                >
                  NIP
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="nip"
                    type="text"
                    placeholder="1234567890"
                    value={formData.nip}
                    onChange={(e) => handleInputChange("nip", e.target.value)}
                    className="pl-10 h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="dokter@puskesmas.go.id"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="pl-10 h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 karakter"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className="pl-10 pr-10 h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                    required
                    minLength={8}
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
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-gray-700"
                >
                  Konfirmasi Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Ulangi password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    className="pl-10 pr-10 h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="telefon"
                  className="text-sm font-medium text-gray-700"
                >
                  Nomor Telepon
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="telefon"
                    type="tel"
                    placeholder="08123456789"
                    value={formData.telefon}
                    onChange={(e) =>
                      handleInputChange("telefon", e.target.value)
                    }
                    className="pl-10 h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="puskesmas"
                  className="text-sm font-medium text-gray-700"
                >
                  Puskesmas
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="puskesmas"
                    type="text"
                    placeholder="Puskesmas Airmadidi"
                    value={formData.puskesmas}
                    onChange={(e) =>
                      handleInputChange("puskesmas", e.target.value)
                    }
                    className="pl-10 h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="wilayahKerja"
                className="text-sm font-medium text-gray-700"
              >
                Wilayah Kerja
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="wilayahKerja"
                  type="text"
                  placeholder="Kecamatan Airmadidi"
                  value={formData.wilayahKerja}
                  onChange={(e) =>
                    handleInputChange("wilayahKerja", e.target.value)
                  }
                  className="pl-10 h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

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
