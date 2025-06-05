
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Users, AlertTriangle, TrendingUp, MapPin, Phone, Calendar } from 'lucide-react';

interface VillageDetailProps {
  village: {
    id: string;
    nama: string;
    kecamatan: string;
    stunting: number;
    total: number;
    persentase: number;
    status: string;
    petugas: string;
  };
  onBack: () => void;
}

const VillageDetail = ({ village, onBack }: VillageDetailProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'tinggi': return 'bg-red-100 text-red-800 border-red-200';
      case 'sedang': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rendah': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Data tambahan untuk detail (dalam implementasi nyata, ini akan dari database)
  const detailData = {
    jumlahPosyandu: 3,
    kaderAktif: 12,
    targetCakupan: 95,
    cakupanSaatIni: 87,
    kontakPetugas: '081234567890',
    lastUpdate: '15 November 2024',
    programKhusus: ['PMT (Pemberian Makanan Tambahan)', 'Penyuluhan Gizi', 'Monitoring Bulanan'],
    demografiUsia: {
      '0-6bulan': 45,
      '6-12bulan': 38,
      '12-24bulan': 42,
      '24-59bulan': 52
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="p-4">
          <Button
            variant="outline"
            onClick={onBack}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Daftar Desa
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{village.nama}</h1>
              <p className="text-gray-600">Kecamatan {village.kecamatan}</p>
            </div>
            <Badge className={getStatusColor(village.status)} size="lg">
              Status: {village.status.toUpperCase()}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Statistik Utama */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800">
                📊 Statistik Stunting
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{village.total}</div>
                  <div className="text-sm text-gray-600">Total Anak</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{village.stunting}</div>
                  <div className="text-sm text-gray-600">Kasus Stunting</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{village.persentase}%</div>
                  <div className="text-sm text-gray-600">Prevalensi</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{village.total - village.stunting}</div>
                  <div className="text-sm text-gray-600">Anak Sehat</div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Distribusi Usia Anak</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="text-center p-2 bg-white rounded">
                    <div className="font-medium text-gray-800">{detailData.demografiUsia['0-6bulan']}</div>
                    <div className="text-gray-600">0-6 bulan</div>
                  </div>
                  <div className="text-center p-2 bg-white rounded">
                    <div className="font-medium text-gray-800">{detailData.demografiUsia['6-12bulan']}</div>
                    <div className="text-gray-600">6-12 bulan</div>
                  </div>
                  <div className="text-center p-2 bg-white rounded">
                    <div className="font-medium text-gray-800">{detailData.demografiUsia['12-24bulan']}</div>
                    <div className="text-gray-600">1-2 tahun</div>
                  </div>
                  <div className="text-center p-2 bg-white rounded">
                    <div className="font-medium text-gray-800">{detailData.demografiUsia['24-59bulan']}</div>
                    <div className="text-gray-600">2-5 tahun</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Program dan Intervensi */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800">
                🎯 Program Penanggulangan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Jumlah Posyandu:</span>
                    <span className="font-medium">{detailData.jumlahPosyandu}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kader Aktif:</span>
                    <span className="font-medium">{detailData.kaderAktif} orang</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Target Cakupan:</span>
                    <span className="font-medium">{detailData.targetCakupan}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cakupan Saat Ini:</span>
                    <span className="font-medium text-blue-600">{detailData.cakupanSaatIni}%</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h5 className="font-medium text-gray-800">Program Khusus:</h5>
                  {detailData.programKhusus.map((program, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">{program}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Info Petugas */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-800">
                👨‍⚕️ Info Petugas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="font-medium">{village.petugas}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">{detailData.kontakPetugas}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Update: {detailData.lastUpdate}</span>
              </div>
              
              <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 mt-4">
                <Phone className="h-4 w-4 mr-2" />
                Hubungi Petugas
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-800">
                ⚡ Aksi Cepat
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="h-4 w-4 mr-2" />
                Lihat Tren Bulanan
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Laporan Kasus Baru
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MapPin className="h-4 w-4 mr-2" />
                Lokasi Posyandu
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VillageDetail;
