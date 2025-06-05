import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import VillageDetail from './VillageDetail';

const VillageList = () => {
  const [selectedVillage, setSelectedVillage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetail, setShowDetail] = useState(false);

  // Data desa asli di Kabupaten Minahasa Utara
  const villageData = [
    { 
      id: 'airmadidi',
      nama: 'Airmadidi', 
      kecamatan: 'Airmadidi',
      stunting: 8, 
      total: 145, 
      persentase: 5.5, 
      status: 'rendah',
      petugas: 'Dr. Sarah Mandagi'
    },
    { 
      id: 'dimembe',
      nama: 'Dimembe', 
      kecamatan: 'Dimembe',
      stunting: 12, 
      total: 189, 
      persentase: 6.3, 
      status: 'sedang',
      petugas: 'Dr. Maria Lumowa'
    },
    { 
      id: 'kalawat',
      nama: 'Kalawat', 
      kecamatan: 'Kalawat',
      stunting: 15, 
      total: 178, 
      persentase: 8.4, 
      status: 'tinggi',
      petugas: 'Dr. John Runtuwene'
    },
    { 
      id: 'wori',
      nama: 'Wori', 
      kecamatan: 'Wori',
      stunting: 6, 
      total: 142, 
      persentase: 4.2, 
      status: 'rendah',
      petugas: 'Dr. Grace Kalangi'
    },
    { 
      id: 'likupang',
      nama: 'Likupang Timur', 
      kecamatan: 'Likupang Timur',
      stunting: 18, 
      total: 203, 
      persentase: 8.9, 
      status: 'tinggi',
      petugas: 'Dr. Robert Kalesaran'
    },
    { 
      id: 'talawaan',
      nama: 'Talawaan', 
      kecamatan: 'Talawaan',
      stunting: 9, 
      total: 167, 
      persentase: 5.4, 
      status: 'rendah',
      petugas: 'Dr. Linda Wowor'
    },
    { 
      id: 'kauditan',
      nama: 'Kauditan', 
      kecamatan: 'Kauditan',
      stunting: 14, 
      total: 195, 
      persentase: 7.2, 
      status: 'sedang',
      petugas: 'Dr. David Sendow'
    },
    { 
      id: 'kema',
      nama: 'Kema', 
      kecamatan: 'Kema',
      stunting: 11, 
      total: 156, 
      persentase: 7.1, 
      status: 'sedang',
      petugas: 'Dr. Ruth Pangerapan'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'tinggi': return 'bg-red-100 text-red-800 border-red-200';
      case 'sedang': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rendah': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProgressColor = (persentase: number) => {
    if (persentase >= 8) return 'bg-red-500';
    if (persentase >= 6) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const filteredVillages = villageData.filter(village =>
    village.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    village.kecamatan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedVillageData = villageData.find(v => v.id === selectedVillage);

  if (showDetail && selectedVillageData) {
    return (
      <VillageDetail 
        village={selectedVillageData} 
        onBack={() => {
          setShowDetail(false);
          setSelectedVillage(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari desa atau kecamatan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" />
                Filter Status
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Village List */}
        <div className="lg:col-span-2">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
                🏘️ Daftar Desa Kabupaten Minahasa Utara
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredVillages.map((village) => (
                  <div
                    key={village.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 hover:shadow-md ${
                      selectedVillage === village.id 
                        ? 'bg-emerald-50 border-emerald-300 shadow-md' 
                        : 'bg-white/50 border-gray-200'
                    }`}
                    onClick={() => setSelectedVillage(selectedVillage === village.id ? null : village.id)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">{village.nama}</h3>
                        <p className="text-sm text-gray-600">Kecamatan {village.kecamatan}</p>
                      </div>
                      <Badge className={getStatusColor(village.status)}>
                        {village.status.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Total Anak:</span>
                        <p className="font-medium">{village.total}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Stunting:</span>
                        <p className="font-medium text-red-600">{village.stunting}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Prevalensi:</span>
                        <p className="font-medium">{village.persentase}%</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Petugas:</span>
                        <p className="font-medium">{village.petugas}</p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress Prevalensi</span>
                        <span>{village.persentase}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(village.persentase)}`}
                          style={{ width: `${Math.min(village.persentase * 2, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar with details */}
        <div className="space-y-4">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-800">
                📍 Detail Desa
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedVillage ? (
                (() => {
                  const village = villageData.find(v => v.id === selectedVillage);
                  return village ? (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">{village.nama}</h3>
                        <p className="text-sm text-gray-600">Kecamatan {village.kecamatan}</p>
                        <Badge className={getStatusColor(village.status)}>
                          Status: {village.status.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Total Anak:</span>
                          <span className="font-medium">{village.total}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Kasus Stunting:</span>
                          <span className="font-medium text-red-600">{village.stunting}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Prevalensi:</span>
                          <span className="font-medium">{village.persentase}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Petugas Kesehatan:</span>
                          <span className="font-medium">{village.petugas}</span>
                        </div>
                      </div>

                      <Button 
                        onClick={() => setShowDetail(true)}
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                      >
                        Lihat Detail Lengkap
                      </Button>
                    </div>
                  ) : null;
                })()
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Pilih desa untuk melihat detail</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-800">
                📊 Ringkasan Cepat
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Desa</span>
                <span className="font-bold text-gray-800">{filteredVillages.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Desa Risiko Tinggi</span>
                <span className="font-bold text-red-600">
                  {filteredVillages.filter(v => v.status === 'tinggi').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Kasus</span>
                <span className="font-bold text-red-600">
                  {filteredVillages.reduce((acc, v) => acc + v.stunting, 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Rata-rata Prevalensi</span>
                <span className="font-bold text-gray-800">
                  {(filteredVillages.reduce((acc, v) => acc + v.persentase, 0) / filteredVillages.length).toFixed(1)}%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VillageList;
