import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertTriangle,
  CheckCircle,
  Calculator,
  Save,
  Heart,
  Brain,
  UserPlus,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  calculateAge,
  calculateWHOZScore,
  getStuntingRecommendation,
} from "@/utils/whoZScore";
import ZScoreAnalyzer from "@/components/ai/ZScoreAnalyzer";
import { getSupabaseClient } from "@/integrations/supabase/client";
import { fetchLLMBackend } from "@/lib/llm";
import { useAuth } from "@/hooks/useAuth";

interface ChildData {
  nama: string;
  nik: string;
  tanggalLahir: string;
  jenisKelamin: string;
  namaIbu: string;
  alamat: string;
  dusun: string;
  beratBadan: string;
  tinggiBadan: string;
  lingkarKepala: string;
  catatan: string;
}

interface ZScoreResult {
  zScoreBB: number;
  zScoreTB: number;
  statusBB: string;
  statusTB: string;
  analysis: string;
}

interface ZScoreAnalyzerProps {
  zScoreBB: number;
  zScoreTB: number;
  age: number;
  gender: string;
}

const ChildDataForm = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [formData, setFormData] = useState<ChildData>({
    nama: "",
    nik: "",
    tanggalLahir: "",
    jenisKelamin: "",
    namaIbu: "",
    alamat: "",
    dusun: "",
    beratBadan: "",
    tinggiBadan: "",
    lingkarKepala: "",
    catatan: "",
  });

  const [zScoreResult, setZScoreResult] = useState<ZScoreResult | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);

  // Dusun/wilayah di Minahasa Utara berdasarkan kecamatan
  const dusunOptions = [
    // Kecamatan Airmadidi
    "Airmadidi Bawah",
    "Airmadidi Atas",
    "Sarongsong I",
    "Sarongsong II",
    "Rap-Rap",
    "Bitung",

    // Kecamatan Dimembe
    "Dimembe",
    "Tanggari",
    "Tanggari Baru",
    "Popontolen",
    "Tatelu",
    "Tatelu Rondor",

    // Kecamatan Kalawat
    "Kalawat",
    "Lolak",
    "Kamanga",
    "Kolongan",
    "Maumbi",

    // Kecamatan Wori
    "Wori",
    "Manado Tua Satu",
    "Manado Tua Dua",
    "Siladen",
    "Bunaken",

    // Kecamatan Likupang Timur
    "Likupang",
    "Wineru",
    "Pulisan",
    "Bahoi",
    "Bentenan",

    // Kecamatan Talawaan
    "Talawaan",
    "Paslaten",
    "Pineleng",
    "Sumalangwon",

    // Kecamatan Kauditan
    "Kauditan I",
    "Kauditan II",
    "Tiwoho",
    "Kima Bajo",
    "Kima Atas",

    // Kecamatan Kema
    "Kema I",
    "Kema II",
    "Kema III",
    "Tempok",
  ];

  const handleInputChange = (field: keyof ChildData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Fungsi untuk menghitung Z-score berat badan
  const calculateZScoreBB = (
    weight: number,
    age: number,
    gender: string
  ): number => {
    // Implementasi perhitungan Z-score berat badan sesuai WHO
    // Ini adalah contoh sederhana, sesuaikan dengan rumus WHO yang sebenarnya
    const median = gender === "Laki-laki" ? 10 : 9.5; // Contoh nilai median
    const sd = 1.2; // Contoh nilai standar deviasi
    return (weight - median) / sd;
  };

  // Fungsi untuk menghitung Z-score tinggi badan
  const calculateZScoreTB = (
    height: number,
    age: number,
    gender: string
  ): number => {
    // Implementasi perhitungan Z-score tinggi badan sesuai WHO
    // Ini adalah contoh sederhana, sesuaikan dengan rumus WHO yang sebenarnya
    const median = gender === "Laki-laki" ? 85 : 83; // Contoh nilai median
    const sd = 3.5; // Contoh nilai standar deviasi
    return (height - median) / sd;
  };

  // Fungsi untuk mendapatkan status berat badan
  const getStatusBB = (zScore: number): string => {
    if (zScore < -3) return "Gizi Buruk";
    if (zScore < -2) return "Gizi Kurang";
    if (zScore <= 2) return "Gizi Baik";
    if (zScore <= 3) return "Gizi Lebih";
    return "Obesitas";
  };

  // Fungsi untuk mendapatkan status tinggi badan
  const getStatusTB = (zScore: number): string => {
    if (zScore < -3) return "Stunting Berat";
    if (zScore < -2) return "Stunting";
    return "Normal";
  };

  const calculateZScore = async (data: ChildData) => {
    try {
      const { beratBadan, tinggiBadan, tanggalLahir, jenisKelamin } = data;
      const usiaBulan = calculateAge(tanggalLahir);

      // Hitung Z-score menggunakan rumus WHO
      const zScoreBB = calculateZScoreBB(
        parseFloat(beratBadan),
        usiaBulan,
        jenisKelamin
      );
      const zScoreTB = calculateZScoreTB(
        parseFloat(tinggiBadan),
        usiaBulan,
        jenisKelamin
      );

      // Dapatkan analisis dari Gemini
      const prompt = `Analisis kondisi gizi anak dengan data berikut:\n- Usia: ${usiaBulan} bulan\n- Jenis Kelamin: ${jenisKelamin}\n- Berat Badan: ${beratBadan} kg (Z-score: ${zScoreBB.toFixed(
        2
      )})\n- Tinggi Badan: ${tinggiBadan} cm (Z-score: ${zScoreTB.toFixed(
        2
      )})\n\nBerikan analisis singkat (2-3 kalimat) tentang kondisi gizi anak dan saran praktis untuk orang tua.`;
      const analysisResult = await fetchLLMBackend(prompt);

      setZScoreResult({
        zScoreBB,
        zScoreTB,
        statusBB: getStatusBB(zScoreBB),
        statusTB: getStatusTB(zScoreTB),
        analysis: analysisResult,
      });
    } catch (error) {
      console.error("Error calculating Z-score:", error);
      toast({
        title: "Error",
        description: "Gagal menghitung Z-score. Silakan coba lagi.",
        variant: "destructive",
      });
    }
  };

  const generateAIAnalysis = () => {
    if (!zScoreResult) {
      toast({
        title: "Hitung Z-Score Terlebih Dahulu",
        description: "Silakan hitung Z-Score sebelum menggunakan analisis AI",
        variant: "destructive",
      });
      return;
    }

    setShowAIAnalysis(true);
    toast({
      title: "Analisis AI Berhasil Dihasilkan",
      description:
        "Analisis komprehensif telah dibuat berdasarkan data Z-Score",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Calculate Z-score first
      const supabase = await getSupabaseClient();
      await calculateZScore(formData);

      if (!zScoreResult) {
        toast({
          title: "Error",
          description: "Gagal menghitung Z-score. Silakan coba lagi.",
          variant: "destructive",
        });
        return;
      }

      console.log("Current user:", user);
      console.log("User ID:", user?.id);
      console.log("Form data to be saved:", {
        ...formData,
        z_score_bb: zScoreResult.zScoreBB,
        z_score_tb: zScoreResult.zScoreTB,
        status: zScoreResult.statusTB,
        user_id: user?.id,
      });

      const { data: childData, error } = await supabase
        .from("children")
        .insert([
          {
            nama: formData.nama,
            nik: formData.nik,
            tanggal_lahir: formData.tanggalLahir,
            jenis_kelamin: formData.jenisKelamin,
            nama_ibu: formData.namaIbu,
            alamat: formData.alamat,
            dusun: formData.dusun,
            berat_badan: parseFloat(formData.beratBadan),
            tinggi_badan: parseFloat(formData.tinggiBadan),
            lingkar_kepala: parseFloat(formData.lingkarKepala),
            catatan: formData.catatan,
            z_score_bb: zScoreResult.zScoreBB,
            z_score_tb: zScoreResult.zScoreTB,
            status: zScoreResult.statusTB,
            created_at: new Date().toISOString(),
            user_id: user?.id,
          },
        ])
        .select(); // Tambahkan .select() untuk mendapatkan data yang baru disimpan

      console.log("Supabase insert response:", { childData, error });

      if (error) {
        console.error("Supabase error details:", error);
        throw error;
      }

      // --- NOTIFICATION LOGIC START ---
      // 1. Notifikasi jika status gizi anak berisiko stunting/gizi kurang
      const now = new Date().toISOString();
      if (
        zScoreResult.statusTB === "Stunting" ||
        zScoreResult.statusTB === "Stunting Berat" ||
        zScoreResult.statusBB === "Gizi Kurang" ||
        zScoreResult.statusBB === "Gizi Buruk"
      ) {
        const { error: notifError } = await supabase
          .from("notifications")
          .insert({
            type: "warning",
            title: "Perhatian: Anak Berpotensi Stunting",
            message: `Perhatian: Anak ${formData.nama} berpotensi stunting, harap tindak lanjut segera.`,
            is_read: false,
            created_at: now,
            user_id: user?.id || null,
          });
        if (notifError)
          console.error("Notif insert error (stunting):", notifError);
      }

      // 2. Notifikasi jika data anak berhasil ditambahkan
      const { error: notifSuccessError } = await supabase
        .from("notifications")
        .insert({
          type: "success",
          title: "Data Anak Ditambahkan",
          message: `Data anak ${formData.nama} berhasil ditambahkan.`,
          is_read: false,
          created_at: now,
          user_id: user?.id || null,
        });
      if (notifSuccessError)
        console.error("Notif insert error (success):", notifSuccessError);
      // --- NOTIFICATION LOGIC END ---

      toast({
        title: "Berhasil",
        description: "Data anak berhasil disimpan",
      });

      // Reset form
      setFormData({
        nama: "",
        nik: "",
        tanggalLahir: "",
        jenisKelamin: "",
        namaIbu: "",
        alamat: "",
        dusun: "",
        beratBadan: "",
        tinggiBadan: "",
        lingkarKepala: "",
        catatan: "",
      });
      setZScoreResult(null);
      setShowAIAnalysis(false);
    } catch (error) {
      console.error("Error saving data:", error);
      toast({
        title: "Error",
        description: "Gagal menyimpan data. Silakan coba lagi.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Stunting Berat":
        return "bg-red-200 text-red-900 border-red-300";
      case "Stunting":
        return "bg-red-100 text-red-800 border-red-200";
      case "Risiko Stunting":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Normal":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    if (status.includes("Stunting")) {
      return <AlertTriangle className="h-5 w-5" />;
    }
    return <CheckCircle className="h-5 w-5" />;
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
          <CardTitle className="text-xl font-bold flex items-center">
            <UserPlus className="h-5 w-5 mr-2" />
            Input Data Anak
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Data Pribadi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nama">Nama Anak</Label>
                  <Input
                    id="nama"
                    value={formData.nama}
                    onChange={(e) => handleInputChange("nama", e.target.value)}
                    placeholder="Masukkan nama lengkap"
                    className="mt-1 bg-white/80"
                  />
                </div>
                <div>
                  <Label htmlFor="nik">NIK</Label>
                  <Input
                    id="nik"
                    value={formData.nik}
                    onChange={(e) => handleInputChange("nik", e.target.value)}
                    placeholder="Masukkan NIK"
                    className="mt-1 bg-white/80"
                  />
                </div>
                <div>
                  <Label htmlFor="tanggalLahir">Tanggal Lahir</Label>
                  <Input
                    id="tanggalLahir"
                    type="date"
                    value={formData.tanggalLahir}
                    onChange={(e) =>
                      handleInputChange("tanggalLahir", e.target.value)
                    }
                    className="mt-1 bg-white/80"
                  />
                </div>
                <div>
                  <Label htmlFor="jenisKelamin">Jenis Kelamin</Label>
                  <Select
                    value={formData.jenisKelamin}
                    onValueChange={(value) =>
                      handleInputChange("jenisKelamin", value)
                    }
                  >
                    <SelectTrigger className="mt-1 bg-white/80">
                      <SelectValue placeholder="Pilih jenis kelamin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Laki-laki</SelectItem>
                      <SelectItem value="female">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="namaIbu">Nama Ibu</Label>
                  <Input
                    id="namaIbu"
                    value={formData.namaIbu}
                    onChange={(e) =>
                      handleInputChange("namaIbu", e.target.value)
                    }
                    placeholder="Masukkan nama ibu"
                    className="mt-1 bg-white/80"
                  />
                </div>
                <div>
                  <Label htmlFor="alamat">Alamat</Label>
                  <Textarea
                    id="alamat"
                    value={formData.alamat}
                    onChange={(e) =>
                      handleInputChange("alamat", e.target.value)
                    }
                    placeholder="Masukkan alamat lengkap"
                    className="mt-1 bg-white/80"
                  />
                </div>
                <div>
                  <Label htmlFor="dusun">Dusun/Wilayah</Label>
                  <Select
                    value={formData.dusun}
                    onValueChange={(value) => handleInputChange("dusun", value)}
                  >
                    <SelectTrigger className="mt-1 bg-white/80">
                      <SelectValue placeholder="Pilih dusun/wilayah" />
                    </SelectTrigger>
                    <SelectContent>
                      {dusunOptions.map((dusun) => (
                        <SelectItem key={dusun} value={dusun}>
                          {dusun}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Data Pengukuran */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="beratBadan">Berat Badan (kg)</Label>
                <Input
                  id="beratBadan"
                  type="number"
                  step="0.1"
                  value={formData.beratBadan}
                  onChange={(e) =>
                    handleInputChange("beratBadan", e.target.value)
                  }
                  placeholder="Masukkan berat badan"
                  className="mt-1 bg-white/80"
                />
              </div>
              <div>
                <Label htmlFor="tinggiBadan">Tinggi Badan (cm)</Label>
                <Input
                  id="tinggiBadan"
                  type="number"
                  step="0.1"
                  value={formData.tinggiBadan}
                  onChange={(e) =>
                    handleInputChange("tinggiBadan", e.target.value)
                  }
                  placeholder="Masukkan tinggi badan"
                  className="mt-1 bg-white/80"
                />
              </div>
              <div>
                <Label htmlFor="lingkarKepala">Lingkar Kepala (cm)</Label>
                <Input
                  id="lingkarKepala"
                  type="number"
                  step="0.1"
                  value={formData.lingkarKepala}
                  onChange={(e) =>
                    handleInputChange("lingkarKepala", e.target.value)
                  }
                  placeholder="Masukkan lingkar kepala"
                  className="mt-1 bg-white/80"
                />
              </div>
            </div>

            {/* Catatan */}
            <div>
              <Label htmlFor="catatan">Catatan Tambahan</Label>
              <Textarea
                id="catatan"
                value={formData.catatan}
                onChange={(e) => handleInputChange("catatan", e.target.value)}
                placeholder="Masukkan catatan tambahan jika ada"
                className="mt-1 bg-white/80"
              />
            </div>

            {/* Tombol Aksi */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                type="button"
                onClick={() => calculateZScore(formData)}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Calculator className="h-4 w-4 mr-2" />
                Hitung Z-Score
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                Simpan Data
              </Button>
            </div>
          </form>

          {/* Tampilkan hasil Z-score */}
          {zScoreResult && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold">
                Hasil Perhitungan Z-Score
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">
                      Status Berat Badan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {zScoreResult.statusBB}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Z-score: {zScoreResult.zScoreBB.toFixed(2)}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">
                      Status Tinggi Badan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {zScoreResult.statusTB}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Z-score: {zScoreResult.zScoreTB.toFixed(2)}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Analisis LLM */}
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Analisis Kondisi Gizi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">
                    {zScoreResult.analysis}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Tombol Analisis AI */}
          <Button
            onClick={generateAIAnalysis}
            className="mt-4 w-full bg-purple-500 hover:bg-purple-600 text-white"
          >
            <Brain className="h-4 w-4 mr-2" />
            Analisis dengan AI
          </Button>

          {/* Analisis AI */}
          {showAIAnalysis && zScoreResult && (
            <div className="mt-6">
              <ZScoreAnalyzer
                zScoreBB={zScoreResult.zScoreBB}
                zScoreTB={zScoreResult.zScoreTB}
                age={calculateAge(formData.tanggalLahir)}
                gender={formData.jenisKelamin as "male" | "female"}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ChildDataForm;
