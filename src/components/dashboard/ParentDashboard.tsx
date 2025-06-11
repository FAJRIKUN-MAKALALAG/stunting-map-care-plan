import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Baby,
  TrendingUp,
  Heart,
  MessageCircle,
  Calendar,
  MapPin,
  LogOut,
  User,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import ChatbotGizi from "./ChatbotGizi";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ChildData {
  id: string;
  nama: string;
  nik: string | null;
  tanggal_lahir: string | null;
  jenis_kelamin: string | null;
  nama_ibu: string | null;
  alamat: string | null;
  dusun: string | null;
  berat_badan: number | null;
  tinggi_badan: number | null;
  lingkar_kepala: number | null;
  catatan: string | null;
  z_score_bb: number | null;
  z_score_tb: number | null;
  status: string | null;
  created_at: string | null;
  user_id: string | null;
}

const ParentDashboard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [showChatbot, setShowChatbot] = useState(false);
  const [childrenData, setChildrenData] = useState<ChildData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      console.log("Fetching data for user:", user.id);
      fetchChildren();
    }
  }, [user?.id]);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching all children data");

      // Query untuk mengambil semua data anak tanpa filter user_id
      const { data, error } = await supabase
        .from("children")
        .select("*")
        .order("created_at", { ascending: false });

      console.log("Supabase response:", { data, error });

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      if (!data || data.length === 0) {
        console.log("No data found");
        setChildrenData([]);
        return;
      }

      console.log("Setting children data:", data);
      setChildrenData(data);
    } catch (err) {
      console.error("Error fetching children:", err);
      setError("Gagal memuat data anak");
    } finally {
      setLoading(false);
    }
  };

  // Fungsi hitung usia dari tanggal lahir
  function hitungUsia(tanggalLahir: string | null) {
    if (!tanggalLahir) return "-";
    const birth = new Date(tanggalLahir);
    const now = new Date();
    let months =
      (now.getFullYear() - birth.getFullYear()) * 12 +
      (now.getMonth() - birth.getMonth());
    if (now.getDate() < birth.getDate()) months--;
    const years = Math.floor(months / 12);
    const sisaBulan = months % 12;
    return `${years > 0 ? years + " tahun " : ""}${sisaBulan} bulan`;
  }

  const filteredChildren = childrenData.filter((child) =>
    child.nama.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string | null) => {
    if (!status) return "bg-gray-100 text-gray-800 border-gray-200";

    switch (status) {
      case "Normal":
        return "bg-green-100 text-green-800 border-green-200";
      case "Stunting":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Stunting Berat":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Berhasil",
        description: "Anda telah keluar dari sistem",
      });
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "Gagal keluar dari sistem",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Dashboard Orang Tua
              </h1>
              <p className="text-blue-100">
                Pantau tumbuh kembang anak Anda dengan mudah
              </p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2 text-white hover:bg-white/20 border-white/30"
            >
              <LogOut className="h-4 w-4" />
              Keluar
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Search Bar */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-bold text-gray-800">
              <Search className="h-6 w-6 mr-2 text-blue-600" />
              Cari Data Anak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Masukkan nama anak untuk mencari data..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-base border-2 border-gray-200 focus:border-blue-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Children List */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Memuat data anak...</span>
          </div>
        ) : error ? (
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center text-red-600">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <p>{error}</p>
              </div>
            </CardContent>
          </Card>
        ) : filteredChildren.length === 0 ? (
          <Card className="bg-gray-50">
            <CardContent className="p-6 text-center">
              <p className="text-gray-500">
                {searchQuery
                  ? "Tidak ada data anak yang sesuai dengan pencarian"
                  : "Belum ada data anak yang tersimpan"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredChildren.map((child) => (
              <Card
                key={child.id}
                className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-shadow duration-300"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-800">
                        {child.nama}
                      </CardTitle>
                      <p className="text-sm text-gray-500">
                        {child.jenis_kelamin === "male"
                          ? "Laki-laki"
                          : "Perempuan"}{" "}
                        • {hitungUsia(child.tanggal_lahir)}
                      </p>
                    </div>
                    <Badge
                      className={`${getStatusColor(child.status)} px-3 py-1`}
                    >
                      {child.status || "Belum diukur"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Berat Badan</p>
                      <p className="font-semibold">
                        {child.berat_badan || "-"} kg
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tinggi Badan</p>
                      <p className="font-semibold">
                        {child.tinggi_badan || "-"} cm
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tanggal Lahir</p>
                      <p className="font-semibold">
                        {child.tanggal_lahir
                          ? new Date(child.tanggal_lahir).toLocaleDateString(
                              "id-ID"
                            )
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Update Terakhir</p>
                      <p className="font-semibold">
                        {child.created_at
                          ? new Date(child.created_at).toLocaleDateString(
                              "id-ID"
                            )
                          : "-"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Chatbot Toggle Button */}
        <div className="fixed bottom-6 right-6">
          <Button
            onClick={() => setShowChatbot(!showChatbot)}
            className="rounded-full h-14 w-14 bg-blue-600 hover:bg-blue-700 shadow-lg"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </div>

        {/* Chatbot */}
        {showChatbot && (
          <div className="fixed bottom-4 right-4 z-50">
            <ChatbotGizi onClose={() => setShowChatbot(false)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentDashboard;
