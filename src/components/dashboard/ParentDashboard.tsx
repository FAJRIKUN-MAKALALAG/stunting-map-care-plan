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
  X,
  Users,
  CheckCircle,
  ClipboardList,
  Download,
} from "lucide-react";
import ChatbotGizi from "./ChatbotGizi";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { getSupabaseClient } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

type Child = Database["public"]["Tables"]["children"]["Row"];

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
  z_score_haz: number | null;
  z_score_waz: number | null;
  z_score_whz: number | null;
  status_gizi: string | null;
  is_stunted: boolean | null;
  created_at: string | null;
  user_id: string | null;
}

const ParentDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showChatbot, setShowChatbot] = useState(false);
  const navigate = useNavigate();

  // Calculate statistics
  const totalChildren = children.length;
  const normalChildren = children.filter(
    (child) => child.status === "Normal"
  ).length;
  const stuntingChildren = children.filter(
    (child) => child.status === "Stunting"
  ).length;
  const notMeasuredChildren = children.filter((child) => !child.status).length;

  useEffect(() => {
    if (user?.id) {
      console.log("Fetching data for user:", user.id);
      fetchChildren();
    }
  }, [user?.id]);

  // Cek peningkatan kasus stunting setiap kali children berubah
  useEffect(() => {
    if (children.length > 0) {
      checkStuntingIncrease();
    }
  }, [children]);

  // Fungsi untuk cek peningkatan kasus stunting
  const checkStuntingIncrease = async () => {
    // Ambil data anak bulan ini dan bulan lalu
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

    // Filter anak stunting bulan ini
    const stuntingThisMonth = children.filter((child) => {
      if (!child.created_at) return false;
      const d = new Date(child.created_at);
      return (
        d.getMonth() === thisMonth &&
        d.getFullYear() === thisYear &&
        (child.status === "Stunting" || child.status === "Stunting Berat")
      );
    });

    // Filter anak stunting bulan lalu
    const stuntingLastMonth = children.filter((child) => {
      if (!child.created_at) return false;
      const d = new Date(child.created_at);
      return (
        d.getMonth() === lastMonth &&
        d.getFullYear() === lastMonthYear &&
        (child.status === "Stunting" || child.status === "Stunting Berat")
      );
    });

    if (stuntingThisMonth.length > stuntingLastMonth.length) {
      // Cek apakah notifikasi sudah ada untuk bulan ini
      const supabase = await getSupabaseClient();
      const { data: notif, error } = await supabase
        .from("notifications")
        .select("id")
        .eq("type", "warning")
        .eq("title", "Peningkatan Kasus Stunting")
        .gte("created_at", new Date(thisYear, thisMonth, 1).toISOString());

      if (!notif || notif.length === 0) {
        await supabase.from("notifications").insert({
          type: "warning",
          title: "Peningkatan Kasus Stunting",
          message: `Peningkatan kasus stunting terdeteksi, total kasus saat ini: ${stuntingThisMonth.length} anak.`,
          is_read: false,
          created_at: new Date().toISOString(),
          user_id: user?.id || null,
        });
      }
    }
  };

  const fetchChildren = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching all children data");

      // Query untuk mengambil semua data anak tanpa filter user_id
      const supabase = await getSupabaseClient();
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
        setChildren([]);
        return;
      }

      console.log("Setting children data:", data);
      setChildren(data);
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

  const filteredChildren = children.filter((child) =>
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
      navigate("/auth");
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-md border-b border-emerald-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Baby className="h-8 w-8 text-emerald-600" />
              <h1 className="text-2xl font-bold text-gray-800">
                Dashboard Orang Tua
              </h1>
            </div>
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md transition-all duration-200"
            >
              <LogOut className="h-5 w-5" />
              <span>Keluar</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Anak
                  </p>
                  <h3 className="text-2xl font-bold text-emerald-600 mt-1">
                    {totalChildren}
                  </h3>
                </div>
                <div className="bg-emerald-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Status Normal
                  </p>
                  <h3 className="text-2xl font-bold text-teal-600 mt-1">
                    {normalChildren}
                  </h3>
                </div>
                <div className="bg-teal-100 p-3 rounded-full">
                  <CheckCircle className="h-6 w-6 text-teal-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Terkena Stunting
                  </p>
                  <h3 className="text-2xl font-bold text-amber-600 mt-1">
                    {stuntingChildren}
                  </h3>
                </div>
                <div className="bg-amber-100 p-3 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Belum Diukur
                  </p>
                  <h3 className="text-2xl font-bold text-cyan-600 mt-1">
                    {notMeasuredChildren}
                  </h3>
                </div>
                <div className="bg-cyan-100 p-3 rounded-full">
                  <ClipboardList className="h-6 w-6 text-cyan-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content and Chatbot Sidebar */}
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Search Bar */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-200">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-bold text-gray-800">
                  <Search className="h-6 w-6 mr-2 text-emerald-600" />
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
                    className="pl-12 h-12 text-base border-2 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Children List */}
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredChildren.map((child) => (
                  <Card
                    key={child.id}
                    className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-200"
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-1">
                            {child.nama}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {child.jenis_kelamin === "Laki-laki" ? "👦" : "👧"}{" "}
                            {child.jenis_kelamin}
                          </p>
                        </div>
                        <Badge
                          className={`${getStatusColor(
                            child.status
                          )} px-3 py-1 text-sm font-medium`}
                        >
                          {child.status || "Perlu Pengukuran"}
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>Usia: {hitungUsia(child.tanggal_lahir)}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>Dusun: {child.dusun || "-"}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <User className="h-4 w-4 mr-2" />
                          <span>Ibu: {child.nama_ibu || "-"}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-emerald-100">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <p className="text-sm text-gray-500">Berat Badan</p>
                            <p className="text-lg font-semibold text-emerald-600">
                              {child.berat_badan
                                ? `${child.berat_badan} kg`
                                : "-"}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-500">
                              Tinggi Badan
                            </p>
                            <p className="text-lg font-semibold text-emerald-600">
                              {child.tinggi_badan
                                ? `${child.tinggi_badan} cm`
                                : "-"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Chatbot Sidebar */}
          <div className="w-96 flex-shrink-0">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl sticky top-6 hover:shadow-2xl transition-all duration-200">
              <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                <CardTitle className="flex items-center text-xl font-bold">
                  <MessageCircle className="h-6 w-6 mr-2" />
                  Konsultasi Gizi
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[600px] flex flex-col">
                  <ChatbotGizi onClose={() => {}} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
