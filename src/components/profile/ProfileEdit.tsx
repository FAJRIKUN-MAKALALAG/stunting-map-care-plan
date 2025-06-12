import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Phone, MapPin, Camera, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProfileEditProps {
  onSave: (profileData: any) => void;
  onCancel: () => void;
  initialData?: any;
}

const ProfileEdit = ({ onSave, onCancel, initialData }: ProfileEditProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileData, setProfileData] = useState({
    nama: initialData?.nama || "Dr. Sarah Mandagi",
    email: initialData?.email || "sarah.mandagi@puskesmas.go.id",
    nip: initialData?.nip || "198505152010012001",
    telefon: initialData?.telefon || "081234567890",
    puskesmas: initialData?.puskesmas || "Puskesmas Airmadidi",
    wilayahKerja: initialData?.wilayahKerja || "Kecamatan Airmadidi",
    spesialisasi: initialData?.spesialisasi || "Dokter Umum",
    avatar: initialData?.avatar || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(initialData?.avatar || "");

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validasi tipe file
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Error",
          description: "File harus berupa gambar",
          variant: "destructive",
        });
        return;
      }

      // Validasi ukuran file (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Ukuran file maksimal 2MB",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setAvatarPreview(result);
        setProfileData((prev) => ({ ...prev, avatar: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    onSave(profileData);
    setIsLoading(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold text-gray-800 flex items-center justify-center space-x-2">
            <User className="h-6 w-6" />
            <span>Edit Profile Dokter</span>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex justify-center mb-6">
              <div className="relative group">
                <Avatar className="w-24 h-24 ring-4 ring-white shadow-lg">
                  <AvatarImage src={avatarPreview} />
                  <AvatarFallback className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xl">
                    {getInitials(profileData.nama)}
                  </AvatarFallback>
                </Avatar>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-2 shadow-lg transition-colors group-hover:scale-110"
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    value={profileData.nama}
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
                    value={profileData.nip}
                    onChange={(e) => handleInputChange("nip", e.target.value)}
                    className="pl-10 h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                    required
                  />
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
                    value={profileData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-10 h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

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
                    value={profileData.telefon}
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
                    value={profileData.puskesmas}
                    onChange={(e) =>
                      handleInputChange("puskesmas", e.target.value)
                    }
                    className="pl-10 h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="spesialisasi"
                  className="text-sm font-medium text-gray-700"
                >
                  Spesialisasi
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="spesialisasi"
                    type="text"
                    value={profileData.spesialisasi}
                    onChange={(e) =>
                      handleInputChange("spesialisasi", e.target.value)
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
                  value={profileData.wilayahKerja}
                  onChange={(e) =>
                    handleInputChange("wilayahKerja", e.target.value)
                  }
                  className="pl-10 h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div className="flex space-x-4 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium rounded-lg transition-all duration-300"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Menyimpan...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Save className="h-4 w-4" />
                    <span>Simpan Perubahan</span>
                  </div>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1 h-12 border-gray-300 hover:bg-gray-50 font-medium rounded-lg transition-all duration-300"
              >
                <div className="flex items-center space-x-2">
                  <X className="h-4 w-4" />
                  <span>Batal</span>
                </div>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileEdit;
