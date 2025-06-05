
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import Navigation from '@/components/Navigation';
import DashboardStats from '@/components/dashboard/DashboardStats';
import StuntingMap from '@/components/map/StuntingMap';
import ChildDataForm from '@/components/forms/ChildDataForm';
import NotificationPanel from '@/components/notifications/NotificationPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Users, TrendingUp, AlertTriangle } from 'lucide-react';

const Index = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Sistem Pemetaan & Penanggulangan Stunting
              </h1>
              <p className="text-emerald-100">
                Platform Monitoring Kesehatan Anak Terintegrasi
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="text-sm">Petugas: Dr. Sarah</p>
                <p className="text-xs text-emerald-100">Puskesmas Kota</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsContent value="dashboard" className="space-y-6">
            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Total Anak Terdaftar
                  </CardTitle>
                  <Users className="h-5 w-5 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">1,247</div>
                  <p className="text-xs text-green-600 mt-1">
                    +12% dari bulan lalu
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Kasus Stunting
                  </CardTitle>
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">89</div>
                  <p className="text-xs text-red-500 mt-1">
                    7.1% dari total anak
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Wilayah Terpantau
                  </CardTitle>
                  <MapPin className="h-5 w-5 text-emerald-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">24</div>
                  <p className="text-xs text-emerald-600 mt-1">
                    Desa/Kelurahan
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Tren Bulan Ini
                  </CardTitle>
                  <TrendingUp className="h-5 w-5 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">+5</div>
                  <p className="text-xs text-orange-500 mt-1">
                    Kasus baru terdeteksi
                  </p>
                </CardContent>
              </Card>
            </div>

            <DashboardStats />
            <NotificationPanel />
          </TabsContent>

          <TabsContent value="peta" className="space-y-6">
            <StuntingMap />
          </TabsContent>

          <TabsContent value="input" className="space-y-6">
            <ChildDataForm />
          </TabsContent>

          <TabsContent value="laporan" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-800">
                  Laporan & Analisis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Fitur laporan dan analisis akan segera tersedia. 
                  Anda akan dapat mengunduh laporan bulanan, statistik wilayah, 
                  dan analisis tren stunting.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
