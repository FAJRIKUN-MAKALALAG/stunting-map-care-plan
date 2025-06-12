import React, { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import DashboardStats from "@/components/dashboard/DashboardStats";
import VillageList from "@/components/village/VillageList";
import ChildDataForm from "@/components/forms/ChildDataForm";
import NotificationPanel from "@/components/notifications/NotificationPanel";
import ParentDashboard from "@/components/dashboard/ParentDashboard";
import ProfileEdit from "@/components/profile/ProfileEdit";
import ProfileView from "@/components/profile/ProfileView";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MapPin,
  Users,
  TrendingUp,
  AlertTriangle,
  LogOut,
  Settings,
  Download,
  FileText,
  BarChart,
  Eye,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ReportPanel from "@/components/reports/ReportPanel";

const Index = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { user, profile, signOut, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [showProfileView, setShowProfileView] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    totalChildren: 0,
    stuntingCases: 0,
    villages: 15,
    trend: -5,
  });

  useEffect(() => {
    if (user) {
      fetchDashboardStats();
    }
  }, [user]);

  const fetchDashboardStats = async () => {
    try {
      const { data: children, error } = await supabase
        .from("children")
        .select("id, status");

      if (children) {
        const totalChildren = children.length;
        const stuntingCases = children.filter(
          (child) =>
            child.status === "Stunting" || child.status === "Stunting Berat"
        ).length;

        setDashboardStats({
          totalChildren,
          stuntingCases,
          villages: 15,
          trend: -5,
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Logout Berhasil",
      description: "Anda telah keluar dari sistem",
    });
  };

  const handleProfileUpdate = (updatedProfile: any) => {
    toast({
      title: "Profil Diperbarui",
      description: "Data profil Anda telah berhasil disimpan",
    });
  };

  const handleDownloadReport = (type: string) => {
    toast({
      title: "Laporan Diunduh",
      description: `Laporan ${type} sedang dipersiapkan...`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  // Parent Dashboard
  if (profile?.role === "parent") {
    if (showProfileEdit) {
      return (
        <ProfileEdit
          initialData={profile}
          onSave={() => setShowProfileEdit(false)}
          onCancel={() => setShowProfileEdit(false)}
        />
      );
    }

    if (showProfileView) {
      return (
        <ProfileView
          user={profile}
          onUpdateProfile={handleProfileUpdate}
          onClose={() => setShowProfileView(false)}
        />
      );
    }

    return <ParentDashboard />;
  }

  // Doctor Dashboard
  if (showProfileEdit) {
    return (
      <ProfileEdit
        initialData={profile}
        onSave={() => setShowProfileEdit(false)}
        onCancel={() => setShowProfileEdit(false)}
      />
    );
  }

  if (showProfileView) {
    return (
      <ProfileView
        user={profile}
        onUpdateProfile={handleProfileUpdate}
        onClose={() => setShowProfileView(false)}
      />
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
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
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback className="bg-white text-emerald-600 font-medium">
                    {getInitials(profile?.nama || "U")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{profile?.nama}</p>
                  <p className="text-xs text-emerald-100">
                    {profile?.puskesmas}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowProfileEdit(true)}
                  className="text-white hover:bg-white/20"
                  title="Edit Profile"
                >
                  <Settings className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-white hover:bg-white/20"
                  title="Logout"
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
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
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
                  <div className="text-3xl font-bold text-gray-900">
                    {dashboardStats.totalChildren}
                  </div>
                  <p className="text-xs text-green-600 mt-1">Data real-time</p>
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
                  <div className="text-3xl font-bold text-red-600">
                    {dashboardStats.stuntingCases}
                  </div>
                  <p className="text-xs text-red-500 mt-1">
                    {dashboardStats.totalChildren > 0
                      ? (
                          (dashboardStats.stuntingCases /
                            dashboardStats.totalChildren) *
                          100
                        ).toFixed(1)
                      : 0}
                    % dari total anak
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
                  <div className="text-3xl font-bold text-gray-900">15</div>
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
                  <div className="text-3xl font-bold text-orange-600">-5</div>
                  <p className="text-xs text-green-500 mt-1">
                    Penurunan kasus baru
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
            <ReportPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
