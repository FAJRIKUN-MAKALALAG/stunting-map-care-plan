
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import Navigation from '@/components/Navigation';
import DashboardStats from '@/components/dashboard/DashboardStats';
import VillageList from '@/components/village/VillageList';
import ChildDataForm from '@/components/forms/ChildDataForm';
import NotificationPanel from '@/components/notifications/NotificationPanel';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import ProfileEdit from '@/components/profile/ProfileEdit';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Users, TrendingUp, AlertTriangle, User, LogOut, Settings } from 'lucide-react';

const Index = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const handleLogin = (email: string, password: string) => {
    // Simulate successful login
    const userData = {
      nama: 'Dr. Sarah Mandagi',
      email: email,
      nip: '198505152010012001',
      puskesmas: 'Puskesmas Airmadidi',
      wilayahKerja: 'Kecamatan Airmadidi'
    };
    setCurrentUser(userData);
    setIsLoggedIn(true);
  };

  const handleRegister = (userData: any) => {
    setCurrentUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setActiveTab('dashboard');
  };

  const handleProfileSave = (profileData: any) => {
    setCurrentUser(profileData);
    setShowProfileEdit(false);
  };

  if (!isLoggedIn) {
    if (authMode === 'login') {
      return (
        <LoginForm 
          onLogin={handleLogin}
          onSwitchToRegister={() => setAuthMode('register')}
        />
      );
    } else {
      return (
        <RegisterForm 
          onRegister={handleRegister}
          onSwitchToLogin={() => setAuthMode('login')}
        />
      );
    }
  }

  if (showProfileEdit) {
    return (
      <ProfileEdit
        initialData={currentUser}
        onSave={handleProfileSave}
        onCancel={() => setShowProfileEdit(false)}
      />
    );
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

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
                Kabupaten Minahasa Utara - Platform Monitoring Kesehatan Anak
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-3 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={currentUser?.avatar} />
                  <AvatarFallback className="bg-white text-emerald-600 font-medium">
                    {getInitials(currentUser?.nama || 'U')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{currentUser?.nama}</p>
                  <p className="text-xs text-emerald-100">{currentUser?.puskesmas}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowProfileEdit(true)}
                  className="text-white hover:bg-white/20"
                >
                  <Settings className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-white hover:bg-white/20"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
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
                  <div className="text-3xl font-bold text-gray-900">1,375</div>
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
                  <div className="text-3xl font-bold text-red-600">93</div>
                  <p className="text-xs text-red-500 mt-1">
                    6.8% dari total anak
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Desa Terpantau
                  </CardTitle>
                  <MapPin className="h-5 w-5 text-emerald-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">8</div>
                  <p className="text-xs text-emerald-600 mt-1">
                    Minahasa Utara
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
                  <div className="text-3xl font-bold text-orange-600">+3</div>
                  <p className="text-xs text-orange-500 mt-1">
                    Kasus baru terdeteksi
                  </p>
                </CardContent>
              </Card>
            </div>

            <DashboardStats />
            <NotificationPanel />
          </TabsContent>

          <TabsContent value="desa" className="space-y-6">
            <VillageList />
          </TabsContent>

          <TabsContent value="input" className="space-y-6">
            <ChildDataForm />
          </TabsContent>

          <TabsContent value="laporan" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-800">
                  📊 Laporan & Analisis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Fitur laporan dan analisis untuk Kabupaten Minahasa Utara. 
                  Anda dapat mengunduh laporan bulanan, statistik per desa, 
                  dan analisis tren stunting.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 text-sm">
                    <strong>Catatan:</strong> Untuk menyimpan data anak yang baru didaftarkan 
                    secara permanen dan mengakses fitur laporan lengkap, sistem memerlukan 
                    koneksi database. Saat ini data hanya tersimpan sementara di browser.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
