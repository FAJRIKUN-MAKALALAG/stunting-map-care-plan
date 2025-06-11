
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Baby, TrendingUp, Heart, MessageCircle, Calendar, MapPin } from 'lucide-react';
import ChatbotGizi from './ChatbotGizi';

interface Child {
  id: string;
  nama: string;
  tanggalLahir: string;
  jenisKelamin: string;
  beratBadan: number;
  tinggiBadan: number;
  statusGizi: string;
  usia: string;
  lastUpdate: string;
}

const ParentDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showChatbot, setShowChatbot] = useState(false);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);

  // Sample data anak (biasanya dari database berdasarkan parent login)
  const childrenData: Child[] = [
    {
      id: '1',
      nama: 'Andi Putra Mandagi',
      tanggalLahir: '2022-03-15',
      jenisKelamin: 'Laki-laki',
      beratBadan: 12.5,
      tinggiBadan: 85.0,
      statusGizi: 'Normal',
      usia: '2 tahun 3 bulan',
      lastUpdate: '2024-12-10'
    },
    {
      id: '2',
      nama: 'Sari Putri Mandagi',
      tanggalLahir: '2023-08-20',
      jenisKelamin: 'Perempuan',
      beratBadan: 8.2,
      tinggiBadan: 70.5,
      statusGizi: 'Risiko Stunting',
      usia: '1 tahun 4 bulan',
      lastUpdate: '2024-12-08'
    }
  ];

  const filteredChildren = childrenData.filter(child =>
    child.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Normal':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Risiko Stunting':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Stunting':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            👨‍👩‍👧‍👦 Dashboard Orang Tua
          </h1>
          <p className="text-blue-100">
            Pantau tumbuh kembang anak Anda dengan mudah
          </p>
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 text-base border-2 border-gray-200 focus:border-blue-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Children List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredChildren.map((child) => (
            <Card key={child.id} className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
                    <Baby className="h-5 w-5 mr-2 text-blue-600" />
                    {child.nama}
                  </CardTitle>
                  <Badge className={getStatusColor(child.statusGizi)}>
                    {child.statusGizi}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Usia: {child.usia}</span>
                    </div>
                    <div className="text-gray-600">
                      Jenis Kelamin: {child.jenisKelamin}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-gray-600">
                      Berat: {child.beratBadan} kg
                    </div>
                    <div className="text-gray-600">
                      Tinggi: {child.tinggiBadan} cm
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center text-xs text-gray-500">
                  <MapPin className="h-3 w-3 mr-1" />
                  Update terakhir: {child.lastUpdate}
                </div>

                <Button
                  onClick={() => setSelectedChild(child)}
                  variant="outline"
                  className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Lihat Detail Pertumbuhan
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6 text-center">
              <Baby className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">Total Anak</h3>
              <p className="text-3xl font-bold text-blue-600">{childrenData.length}</p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6 text-center">
              <Heart className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-800">Status Normal</h3>
              <p className="text-3xl font-bold text-green-600">
                {childrenData.filter(c => c.statusGizi === 'Normal').length}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-800">Perlu Perhatian</h3>
              <p className="text-3xl font-bold text-orange-600">
                {childrenData.filter(c => c.statusGizi !== 'Normal').length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Chatbot Button */}
        <div className="fixed bottom-6 right-6">
          <Button
            onClick={() => setShowChatbot(true)}
            className="h-16 w-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110"
          >
            <MessageCircle className="h-8 w-8" />
          </Button>
        </div>

        {/* Chatbot Modal */}
        {showChatbot && (
          <ChatbotGizi onClose={() => setShowChatbot(false)} />
        )}

        {/* Child Detail Modal */}
        {selectedChild && (
          <Card className="fixed inset-4 z-50 bg-white shadow-2xl rounded-xl overflow-auto">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <CardTitle className="flex items-center justify-between">
                <span>Detail Pertumbuhan - {selectedChild.nama}</span>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedChild(null)}
                  className="text-white hover:bg-white/20"
                >
                  ✕
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Informasi Dasar</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Nama:</strong> {selectedChild.nama}</p>
                    <p><strong>Tanggal Lahir:</strong> {selectedChild.tanggalLahir}</p>
                    <p><strong>Usia:</strong> {selectedChild.usia}</p>
                    <p><strong>Jenis Kelamin:</strong> {selectedChild.jenisKelamin}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Data Antropometri</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Berat Badan:</strong> {selectedChild.beratBadan} kg</p>
                    <p><strong>Tinggi Badan:</strong> {selectedChild.tinggiBadan} cm</p>
                    <p><strong>Status Gizi:</strong> 
                      <Badge className={getStatusColor(selectedChild.statusGizi) + " ml-2"}>
                        {selectedChild.statusGizi}
                      </Badge>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">📊 Rekomendasi Gizi</h4>
                <p className="text-sm text-blue-700">
                  Berdasarkan status gizi saat ini, pastikan anak mendapat asupan gizi seimbang 
                  dengan protein hewani, sayuran, dan buah-buahan. Konsultasikan dengan dokter 
                  untuk panduan lebih detail.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ParentDashboard;
