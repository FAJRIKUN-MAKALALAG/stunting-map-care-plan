import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MapPin,
  AlertTriangle,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import { getSupabaseClient } from "@/integrations/supabase/client";
import VillageDetail from "./VillageDetail";

interface Village {
  id: string;
  name: string;
  total: number;
  stunting: number;
  persentase: number;
  status: string;
  petugas: string;
}

const VillageList = () => {
  const [villages, setVillages] = useState<Village[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVillage, setSelectedVillage] = useState<string | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVillages();
  }, []);

  const fetchVillages = async () => {
    try {
      setLoading(true);
      const supabase = await getSupabaseClient();
      // Fetch children data to calculate village statistics
      const { data: children, error: childrenError } = await supabase
        .from("children")
        .select("dusun, status");

      if (childrenError) throw childrenError;

      // Group children by village and calculate statistics
      const villageStats = new Map<string, Village>();

      children.forEach((child) => {
        if (!child.dusun) return;

        const village = villageStats.get(child.dusun) || {
          id: child.dusun,
          name: child.dusun,
          total: 0,
          stunting: 0,
          persentase: 0,
          status: "rendah",
          petugas: "Petugas Kesehatan",
        };

        village.total++;
        if (child.status === "Stunting" || child.status === "Stunting Berat") {
          village.stunting++;
        }

        village.persentase = (village.stunting / village.total) * 100;

        // Determine status based on stunting percentage
        if (village.persentase >= 30) {
          village.status = "tinggi";
        } else if (village.persentase >= 20) {
          village.status = "sedang";
        } else {
          village.status = "rendah";
        }

        villageStats.set(child.dusun, village);
      });

      setVillages(Array.from(villageStats.values()));
    } catch (error) {
      console.error("Error fetching villages:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVillages = villages.filter((village) =>
    village.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "tinggi":
        return "bg-red-100 text-red-800 border-red-200";
      case "sedang":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rendah":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 30) return "bg-red-500";
    if (percentage >= 20) return "bg-yellow-500";
    return "bg-green-500";
  };

  const selectedVillageData = villages.find((v) => v.id === selectedVillage);

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
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Daftar Desa</span>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari desa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
              <p className="text-gray-500">Memuat data desa...</p>
            </div>
          ) : filteredVillages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MapPin className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Tidak ada desa yang ditemukan</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredVillages.map((village) => (
                <Card
                  key={village.id}
                  className={`bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer ${
                    selectedVillage === village.id ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => setSelectedVillage(village.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                          {village.name}
                        </h3>
                        <Badge className={getStatusBadge(village.status)}>
                          {village.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-4">
                      <div>
                        <span className="text-gray-500">Total Anak:</span>
                        <p className="font-medium">{village.total}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Stunting:</span>
                        <p className="font-medium text-red-600">
                          {village.stunting}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Prevalensi:</span>
                        <p className="font-medium">
                          {village.persentase.toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Petugas:</span>
                        <p className="font-medium">{village.petugas}</p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress Prevalensi</span>
                        <span>{village.persentase.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(
                            village.persentase
                          )}`}
                          style={{
                            width: `${Math.min(village.persentase * 2, 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VillageList;
