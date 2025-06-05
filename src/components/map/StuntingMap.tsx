
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Filter, Search, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';

const StuntingMap = () => {
  const [selectedWilayah, setSelectedWilayah] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const wilayahData = [
    { 
      id: 'sukamaju',
      nama: 'Desa Sukamaju', 
      koordinat: { lat: -6.2088, lng: 106.8456 },
      stunting: 12, 
      total: 156, 
      persentase: 7.7, 
      status: 'sedang',
      petugas: 'Bidan Sari'
    },
    { 
      id: 'sejahtera',
      nama: 'Desa Sejahtera', 
      koordinat: { lat: -6.2188, lng: 106.8556 },
      stunting: 8, 
      total: 134, 
      persentase: 6.0, 
      status: 'rendah',
      petugas: 'Bidan Dewi'
    },
    { 
      id: 'mawar',
      nama: 'Kelurahan Mawar', 
      koordinat: { lat: -6.1988, lng: 106.8656 },
      stunting: 15, 
      total: 178, 
      persentase: 8.4, 
      status: 'tinggi',
      petugas: 'Bidan Rina'
    },
    { 
      id: 'harapan',
      nama: 'Desa Harapan', 
      koordinat: { lat: -6.2288, lng: 106.8356 },
      stunting: 6, 
      total: 142, 
      persentase: 4.2, 
      status: 'rendah',
      petugas: 'Bidan Maya'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'tinggi': return 'bg-red-500';
      case 'sedang': return 'bg-yellow-500';
      case 'rendah': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'tinggi': return 'bg-red-100 text-red-800 border-red-200';
      case 'sedang': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rendah': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredWilayah = wilayahData.filter(wilayah =>
    wilayah.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari wilayah..."
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
              <Button variant="outline" size="sm">
                <Info className="h-4 w-4 mr-1" />
                Legenda
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Area */}
        <div className="lg:col-span-2">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
                🗺️ Peta Sebaran Stunting
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Placeholder for actual map */}
              <div className="relative w-full h-96 bg-gradient-to-br from-blue-100 to-emerald-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="w-full h-full bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                </div>
                
                {/* Simulated map pins */}
                <div className="relative w-full h-full">
                  {filteredWilayah.map((wilayah, index) => (
                    <div
                      key={wilayah.id}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-110 ${
                        selectedWilayah === wilayah.id ? 'scale-125 z-10' : ''
                      }`}
                      style={{
                        left: `${25 + (index * 20)}%`,
                        top: `${30 + (index * 15)}%`
                      }}
                      onClick={() => setSelectedWilayah(selectedWilayah === wilayah.id ? null : wilayah.id)}
                    >
                      <div className={`w-6 h-6 rounded-full ${getStatusColor(wilayah.status)} border-2 border-white shadow-lg`}></div>
                      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md text-xs font-medium whitespace-nowrap">
                        {wilayah.nama}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Center text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-lg font-medium">Peta Interaktif Stunting</p>
                    <p className="text-sm">Klik pin untuk detail wilayah</p>
                  </div>
                </div>
              </div>

              {/* Map Legend */}
              <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Rendah (&lt;6%)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>Sedang (6-8%)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Tinggi (&gt;8%)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar with details */}
        <div className="space-y-4">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-800">
                📍 Detail Wilayah
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedWilayah ? (
                (() => {
                  const wilayah = wilayahData.find(w => w.id === selectedWilayah);
                  return wilayah ? (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">{wilayah.nama}</h3>
                        <Badge className={getStatusBadge(wilayah.status)}>
                          Status: {wilayah.status.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Total Anak:</span>
                          <span className="font-medium">{wilayah.total}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Kasus Stunting:</span>
                          <span className="font-medium text-red-600">{wilayah.stunting}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Prevalensi:</span>
                          <span className="font-medium">{wilayah.persentase}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Petugas:</span>
                          <span className="font-medium">{wilayah.petugas}</span>
                        </div>
                      </div>

                      <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                        Lihat Detail Lengkap
                      </Button>
                    </div>
                  ) : null;
                })()
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Pilih wilayah pada peta untuk melihat detail</p>
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
                <span className="text-sm text-gray-600">Total Wilayah</span>
                <span className="font-bold text-gray-800">{filteredWilayah.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Wilayah Risiko Tinggi</span>
                <span className="font-bold text-red-600">
                  {filteredWilayah.filter(w => w.status === 'tinggi').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Rata-rata Prevalensi</span>
                <span className="font-bold text-gray-800">
                  {(filteredWilayah.reduce((acc, w) => acc + w.persentase, 0) / filteredWilayah.length).toFixed(1)}%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StuntingMap;
