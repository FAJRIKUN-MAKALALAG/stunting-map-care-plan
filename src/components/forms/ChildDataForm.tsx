
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, CheckCircle, Calculator, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
    nama: '',
    nik: '',
    tanggalLahir: '',
    jenisKelamin: '',
    namaIbu: '',
    alamat: '',
    dusun: '',
    beratBadan: '',
    tinggiBadan: '',
    lingkarKepala: '',
    catatan: ''
  });

  const [zScore, setZScore] = useState<{
    beratTinggi: number | null;
    tinggiUsia: number | null;
    beratUsia: number | null;
    status: string;
  }>({
    beratTinggi: null,
    tinggiUsia: null,
    beratUsia: null,
    status: ''
  });

  // Dusun/wilayah di Minahasa Utara berdasarkan kecamatan
  const dusunOptions = [
    // Kecamatan Airmadidi
    'Airmadidi Bawah',
    'Airmadidi Atas',
    'Sarongsong I',
    'Sarongsong II',
    'Rap-Rap',
    'Bitung',
    
    // Kecamatan Dimembe
    'Dimembe',
    'Tanggari',
    'Tanggari Baru',
    'Popontolen',
    'Tatelu',
    'Tatelu Rondor',
    
    // Kecamatan Kalawat
    'Kalawat',
    'Lolak',
    'Kamanga',
    'Kolongan',
    'Maumbi',
    
    // Kecamatan Wori
    'Wori',
    'Manado Tua Satu',
    'Manado Tua Dua',
    'Siladen',
    'Bunaken',
    
    // Kecamatan Likupang Timur
    'Likupang',
    'Wineru',
    'Pulisan',
    'Bahoi',
    'Bentenan',
    
    // Kecamatan Talawaan
    'Talawaan',
    'Paslaten',
    'Pineleng',
    'Sumalangwon',
    
    // Kecamatan Kauditan
    'Kauditan I',
    'Kauditan II',
    'Tiwoho',
    'Kima Bajo',
    'Kima Atas',
    
    // Kecamatan Kema
    'Kema I',
    'Kema II',
    'Kema III',
    'Tempok'
  ];

  const handleInputChange = (field: keyof ChildData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    const ageInMonths = (today.getFullYear() - birth.getFullYear()) * 12 + today.getMonth() - birth.getMonth();
    return ageInMonths;
  };

  const calculateZScore = () => {
    const age = calculateAge(formData.tanggalLahir);
    const weight = parseFloat(formData.beratBadan);
    const height = parseFloat(formData.tinggiBadan);

    if (!age || !weight || !height) {
      toast({
        title: "Data Tidak Lengkap",
        description: "Mohon lengkapi tanggal lahir, berat badan, dan tinggi badan",
        variant: "destructive"
      });
      return;
    }

    // Simplified Z-score calculation (in real implementation, use WHO standard tables)
    const heightForAge = (height - (45 + age * 2.5)) / 5; // Simplified formula
    const weightForHeight = (weight - (2.5 + height * 0.1)) / 2; // Simplified formula
    const weightForAge = (weight - (3 + age * 0.5)) / 2; // Simplified formula

    let status = 'Normal';
    if (heightForAge < -2) {
      status = 'Stunting';
    } else if (heightForAge < -1) {
      status = 'Risiko Stunting';
    } else if (weightForHeight < -2) {
      status = 'Kurus';
    } else if (weightForHeight > 2) {
      status = 'Gemuk';
    }

    setZScore({
      beratTinggi: Number(weightForHeight.toFixed(2)),
      tinggiUsia: Number(heightForAge.toFixed(2)),
      beratUsia: Number(weightForAge.toFixed(2)),
      status
    });

    toast({
      title: "Z-Score Berhasil Dihitung",
      description: `Status gizi: ${status}`,
      variant: status === 'Normal' ? "default" : "destructive"
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nama || !formData.tanggalLahir || !formData.beratBadan || !formData.tinggiBadan) {
      toast({
        title: "Form Tidak Lengkap",
        description: "Mohon lengkapi semua field yang wajib diisi",
        variant: "destructive"
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
      nama: '',
      nik: '',
      tanggalLahir: '',
      jenisKelamin: '',
      namaIbu: '',
      alamat: '',
      dusun: '',
      beratBadan: '',
      tinggiBadan: '',
      lingkarKepala: '',
      catatan: ''
    });
    setZScore({
      beratTinggi: null,
      tinggiUsia: null,
      beratUsia: null,
      status: ''
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Stunting': return 'bg-red-100 text-red-800 border-red-200';
      case 'Risiko Stunting': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Kurus': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Gemuk': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Normal': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
            👶 Input Data Anak
          </CardTitle>
          <p className="text-gray-600">Tambahkan data antropometri anak untuk monitoring stunting</p>
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
                    onChange={(e) => handleInputChange('nama', e.target.value)}
                    placeholder="Masukkan nama lengkap anak"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="nik">NIK Anak</Label>
                  <Input
                    id="nik"
                    value={formData.nik}
                    onChange={(e) => handleInputChange('nik', e.target.value)}
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
                    onChange={(e) => handleInputChange('tanggalLahir', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jenisKelamin">Jenis Kelamin</Label>
                  <Select value={formData.jenisKelamin} onValueChange={(value) => handleInputChange('jenisKelamin', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis kelamin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="laki-laki">Laki-laki</SelectItem>
                      <SelectItem value="perempuan">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="namaIbu">Nama Ibu</Label>
                  <Input
                    id="namaIbu"
                    value={formData.namaIbu}
                    onChange={(e) => handleInputChange('namaIbu', e.target.value)}
                    placeholder="Nama lengkap ibu"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dusun">Dusun/Wilayah</Label>
                  <Select value={formData.dusun} onValueChange={(value) => handleInputChange('dusun', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih dusun/wilayah" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      {dusunOptions.map((dusun) => (
                        <SelectItem key={dusun} value={dusun}>{dusun}</SelectItem>
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
                  onChange={(e) => handleInputChange('alamat', e.target.value)}
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
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="beratBadan">Berat Badan (kg) *</Label>
                  <Input
                    id="beratBadan"
                    type="number"
                    step="0.1"
                    value={formData.beratBadan}
                    onChange={(e) => handleInputChange('beratBadan', e.target.value)}
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
                    onChange={(e) => handleInputChange('tinggiBadan', e.target.value)}
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
                    onChange={(e) => handleInputChange('lingkarKepala', e.target.value)}
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
                  Hitung Z-Score
                </Button>
              </div>

              {/* Z-Score Results */}
              {zScore.status && (
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-800">Hasil Perhitungan Z-Score</h4>
                      <Badge className={getStatusColor(zScore.status)}>
                        {zScore.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="text-center p-2 bg-white rounded">
                        <div className="text-gray-600">Tinggi/Usia</div>
                        <div className="font-bold text-lg">{zScore.tinggiUsia}</div>
                      </div>
                      <div className="text-center p-2 bg-white rounded">
                        <div className="text-gray-600">Berat/Tinggi</div>
                        <div className="font-bold text-lg">{zScore.beratTinggi}</div>
                      </div>
                      <div className="text-center p-2 bg-white rounded">
                        <div className="text-gray-600">Berat/Usia</div>
                        <div className="font-bold text-lg">{zScore.beratUsia}</div>
                      </div>
                    </div>

                    {zScore.status === 'Stunting' && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                          <div>
                            <div className="font-medium text-red-800">Perhatian: Terindikasi Stunting</div>
                            <div className="text-sm text-red-700">
                              Segera lakukan konsultasi lebih lanjut dan rujukan ke fasilitas kesehatan.
                            </div>
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
                onChange={(e) => handleInputChange('catatan', e.target.value)}
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
