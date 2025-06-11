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
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  calculateAge,
  calculateWHOZScore,
  getStuntingRecommendation,
  ZScoreResult,
} from "@/utils/whoZScore";

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

const ChildDataForm = () => {
  const { toast } = useToast();
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

  const calculateZScore = () => {
    const age = calculateAge(formData.tanggalLahir);
    const weight = parseFloat(formData.beratBadan);
    const height = parseFloat(formData.tinggiBadan);
    const gender = formData.jenisKelamin as "male" | "female";

    console.log("Debug values:", {
      age,
      weight,
      height,
      gender,
      birthDate: formData.tanggalLahir,
    });

    if (!age || !weight || !height || !gender) {
      toast({
        title: "Data Tidak Lengkap",
        description:
          "Mohon lengkapi tanggal lahir, jenis kelamin, berat badan, dan tinggi badan",
        variant: "destructive",
      });
      return;
    }

    if (age < 0 || age > 60) {
      toast({
        title: "Usia Tidak Valid",
        description: "Sistem ini untuk anak usia 0-60 bulan (0-5 tahun)",
        variant: "destructive",
      });
      return;
    }

    const result = calculateWHOZScore(height, weight, age, gender);
    const recs = getStuntingRecommendation(result, age);

    setZScoreResult(result);
    setRecommendations(recs);

    toast({
      title: "Z-Score Berhasil Dihitung",
      description: `Status: ${result.stuntingStatus}`,
      variant: result.isStunted ? "destructive" : "default",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.nama ||
      !formData.tanggalLahir ||
      !formData.beratBadan ||
      !formData.tinggiBadan
    ) {
      toast({
        title: "Form Tidak Lengkap",
        description: "Mohon lengkapi semua field yang wajib diisi",
        variant: "destructive",
      });
      return;
    }

    // Simulate save
    toast({
      title: "Data Berhasil Disimpan",
      description: "Data anak telah berhasil ditambahkan ke sistem",
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
    setRecommendations([]);
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
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
            👶 Input Data Anak
          </CardTitle>
          <p className="text-gray-600">
            Tambahkan data antropometri anak untuk monitoring stunting
            menggunakan standar WHO
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Data Identitas */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                📋 Data Identitas
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nama">Nama Lengkap *</Label>
                  <Input
                    id="nama"
                    value={formData.nama}
                    onChange={(e) => handleInputChange("nama", e.target.value)}
                    placeholder="Masukkan nama lengkap anak"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nik">NIK Anak</Label>
                  <Input
                    id="nik"
                    value={formData.nik}
                    onChange={(e) => handleInputChange("nik", e.target.value)}
                    placeholder="Nomor Induk Kependudukan"
                    maxLength={16}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tanggalLahir">Tanggal Lahir *</Label>
                  <Input
                    id="tanggalLahir"
                    type="date"
                    value={formData.tanggalLahir}
                    onChange={(e) =>
                      handleInputChange("tanggalLahir", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jenisKelamin">Jenis Kelamin</Label>
                  <Select
                    value={formData.jenisKelamin}
                    onValueChange={(value) =>
                      handleInputChange("jenisKelamin", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis kelamin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Laki-laki</SelectItem>
                      <SelectItem value="female">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="namaIbu">Nama Ibu</Label>
                  <Input
                    id="namaIbu"
                    value={formData.namaIbu}
                    onChange={(e) =>
                      handleInputChange("namaIbu", e.target.value)
                    }
                    placeholder="Nama lengkap ibu"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dusun">Dusun/Wilayah</Label>
                  <Select
                    value={formData.dusun}
                    onValueChange={(value) => handleInputChange("dusun", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih dusun/wilayah" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      {dusunOptions.map((dusun) => (
                        <SelectItem key={dusun} value={dusun}>
                          {dusun}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="alamat">Alamat Lengkap</Label>
                <Textarea
                  id="alamat"
                  value={formData.alamat}
                  onChange={(e) => handleInputChange("alamat", e.target.value)}
                  placeholder="Masukkan alamat lengkap"
                  rows={2}
                />
              </div>
            </div>

            <Separator />

            {/* Data Antropometri */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                📏 Data Antropometri
              </h3>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-blue-800 text-sm">
                  <strong>📊 Perhitungan berdasarkan Standar WHO:</strong>{" "}
                  Sistem ini menggunakan standar WHO Child Growth Standards 2006
                  untuk menentukan status gizi dan stunting anak dengan akurat.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="beratBadan">Berat Badan (kg) *</Label>
                  <Input
                    id="beratBadan"
                    type="number"
                    step="0.1"
                    value={formData.beratBadan}
                    onChange={(e) =>
                      handleInputChange("beratBadan", e.target.value)
                    }
                    placeholder="0.0"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tinggiBadan">Tinggi Badan (cm) *</Label>
                  <Input
                    id="tinggiBadan"
                    type="number"
                    step="0.1"
                    value={formData.tinggiBadan}
                    onChange={(e) =>
                      handleInputChange("tinggiBadan", e.target.value)
                    }
                    placeholder="0.0"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lingkarKepala">Lingkar Kepala (cm)</Label>
                  <Input
                    id="lingkarKepala"
                    type="number"
                    step="0.1"
                    value={formData.lingkarKepala}
                    onChange={(e) =>
                      handleInputChange("lingkarKepala", e.target.value)
                    }
                    placeholder="0.0"
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  type="button"
                  onClick={calculateZScore}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  Hitung Z-Score WHO
                </Button>
              </div>

              {/* Enhanced Z-Score Results */}
              {zScoreResult && (
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-800 flex items-center">
                        {getStatusIcon(zScoreResult.stuntingStatus)}
                        <span className="ml-2">
                          Hasil Perhitungan Z-Score WHO
                        </span>
                      </h4>
                      <Badge
                        className={getStatusColor(zScoreResult.stuntingStatus)}
                      >
                        {zScoreResult.stuntingStatus}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                      <div className="text-center p-3 bg-white rounded border">
                        <div className="text-gray-600 text-xs">
                          Tinggi/Usia (HAZ)
                        </div>
                        <div className="font-bold text-lg">
                          {zScoreResult.heightForAge}
                        </div>
                        <div className="text-xs text-gray-500">
                          Indikator Stunting
                        </div>
                      </div>
                      <div className="text-center p-3 bg-white rounded border">
                        <div className="text-gray-600 text-xs">
                          Berat/Usia (WAZ)
                        </div>
                        <div className="font-bold text-lg">
                          {zScoreResult.weightForAge}
                        </div>
                        <div className="text-xs text-gray-500">
                          Indikator Underweight
                        </div>
                      </div>
                      <div className="text-center p-3 bg-white rounded border">
                        <div className="text-gray-600 text-xs">
                          Berat/Tinggi (WHZ)
                        </div>
                        <div className="font-bold text-lg">
                          {zScoreResult.weightForHeight}
                        </div>
                        <div className="text-xs text-gray-500">
                          Indikator Wasting
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                      <div className="text-center p-2 bg-white/80 rounded">
                        <div className="text-xs text-gray-600">
                          Status Stunting
                        </div>
                        <div className="font-medium text-sm">
                          {zScoreResult.stuntingStatus}
                        </div>
                      </div>
                      <div className="text-center p-2 bg-white/80 rounded">
                        <div className="text-xs text-gray-600">Status Gizi</div>
                        <div className="font-medium text-sm">
                          {zScoreResult.underweightStatus}
                        </div>
                      </div>
                      <div className="text-center p-2 bg-white/80 rounded">
                        <div className="text-xs text-gray-600">
                          Status Wasting
                        </div>
                        <div className="font-medium text-sm">
                          {zScoreResult.wastingStatus}
                        </div>
                      </div>
                    </div>

                    {zScoreResult.isStunted && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                          <div>
                            <div className="font-medium text-red-800">
                              ⚠️ TERINDIKASI STUNTING
                            </div>
                            <div className="text-sm text-red-700">
                              Anak terindikasi mengalami stunting berdasarkan
                              standar WHO. Segera lakukan rujukan dan
                              intervensi.
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {recommendations.length > 0 && (
                      <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <Heart className="h-5 w-5 text-emerald-600 mt-0.5" />
                          <div>
                            <div className="font-medium text-emerald-800 mb-2">
                              💡 Rekomendasi Tindakan:
                            </div>
                            <ul className="text-sm text-emerald-700 space-y-1">
                              {recommendations.map((rec, index) => (
                                <li
                                  key={index}
                                  className="flex items-start space-x-1"
                                >
                                  <span className="text-emerald-500">•</span>
                                  <span>{rec}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            <Separator />

            {/* Catatan */}
            <div className="space-y-2">
              <Label htmlFor="catatan">Catatan Tambahan</Label>
              <Textarea
                id="catatan"
                value={formData.catatan}
                onChange={(e) => handleInputChange("catatan", e.target.value)}
                placeholder="Catatan kondisi anak, riwayat kesehatan, atau informasi lain yang relevan"
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <Button
                type="submit"
                size="lg"
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 px-8"
              >
                <Save className="h-5 w-5 mr-2" />
                Simpan Data Anak
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChildDataForm;
