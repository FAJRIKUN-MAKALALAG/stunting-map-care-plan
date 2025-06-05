
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, AlertTriangle, TrendingUp, MapPin, Calendar, Phone, Baby } from 'lucide-react';

interface VillageDetailProps {
  village: any;
  onBack: () => void;
}

const VillageDetail = ({ village, onBack }: VillageDetailProps) => {
  const stuntingData = [
    { name: 'Anak Normal', value: village.totalAnak - village.stuntingCases, color: 'bg-green-500' },
    { name: 'Stunting Ringan', value: Math.floor(village.stuntingCases * 0.6), color: 'bg-yellow-500' },
    { name: 'Stunting Sedang', value: Math.floor(village.stuntingCases * 0.3), color: 'bg-orange-500' },
    { name: 'Stunting Berat', value: Math.floor(village.stuntingCases * 0.1), color: 'bg-red-500' }
  ];

  const childrenByAge = [
    { ageGroup: '0-6 bulan', total: Math.floor(village.totalAnak * 0.15), stunting: Math.floor(village.stuntingCases * 0.1) },
    { ageGroup: '7-12 bulan', total: Math.floor(village.totalAnak * 0.18), stunting: Math.floor(village.stuntingCases * 0.15) },
    { ageGroup: '13-24 bulan', total: Math.floor(village.totalAnak * 0.25), stunting: Math.floor(village.stuntingCases * 0.35) },
    { ageGroup: '25-36 bulan', total: Math.floor(village.totalAnak * 0.22), stunting: Math.floor(village.stuntingCases * 0.25) },
    { ageGroup: '37-60 bulan', total: Math.floor(village.totalAnak * 0.20), stunting: Math.floor(village.stuntingCases * 0.15) }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali</span>
        </Button>
        <h2 className="text-2xl font-bold text-gray-800">Detail {village.name}</h2>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Anak</CardTitle>
            <Users className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{village.totalAnak}</div>
            <p className="text-xs text-blue-600 mt-1">Terdaftar</p>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Kasus Stunting</CardTitle>
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{village.stuntingCases}</div>
            <p className="text-xs text-red-500 mt-1">{((village.stuntingCases / village.totalAnak) * 100).toFixed(1)}% dari total</p>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Status</CardTitle>
            <TrendingUp className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <Badge className={`${village.status === 'Prioritas Tinggi' ? 'bg-red-100 text-red-800' : 
                              village.status === 'Prioritas Sedang' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-green-100 text-green-800'}`}>
              {village.status}
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Posyandu</CardTitle>
            <MapPin className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{village.posyandu}</div>
            <p className="text-xs text-purple-600 mt-1">Aktif</p>
          </CardContent>
        </Card>
      </div>

      {/* Distribusi Kasus Stunting */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-800">Distribusi Kasus Stunting</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stuntingData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-gray-900">{item.value}</span>
                  <span className="text-sm text-gray-500">anak</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Anak Berdasarkan Kelompok Usia */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-800">Data Anak Berdasarkan Kelompok Usia</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {childrenByAge.map((group, index) => (
              <div key={index} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Baby className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-gray-800">{group.ageGroup}</span>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">
                    {group.total} anak
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Normal: </span>
                    <span className="font-medium text-green-600">{group.total - group.stunting} anak</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Stunting: </span>
                    <span className="font-medium text-red-600">{group.stunting} anak</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Informasi Kontak */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-800">Informasi Kontak</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-emerald-600" />
              <div>
                <p className="text-sm text-gray-600">Kader Posyandu</p>
                <p className="font-medium text-gray-800">+62 812-3456-7890</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Jadwal Posyandu</p>
                <p className="font-medium text-gray-800">Setiap Selasa, 08:00-12:00</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VillageDetail;
