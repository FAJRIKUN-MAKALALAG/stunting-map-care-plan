import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Baby, TrendingUp, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalChildren: 0,
    stuntingCases: 0,
    nutritionStatus: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data: children, error } = await supabase
        .from("children")
        .select("status");

      if (error) throw error;

      const totalChildren = children.length;
      const stuntingCases = children.filter(
        (child) =>
          child.status === "Stunting" || child.status === "Stunting Berat"
      ).length;
      const nutritionStatus =
        totalChildren > 0
          ? ((totalChildren - stuntingCases) / totalChildren) * 100
          : 0;

      setStats({
        totalChildren,
        stuntingCases,
        nutritionStatus,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Anak</CardTitle>
            <Baby className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalChildren}</div>
            <p className="text-xs text-muted-foreground">Data real-time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Kasus Stunting
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.stuntingCases}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalChildren > 0
                ? ((stats.stuntingCases / stats.totalChildren) * 100).toFixed(1)
                : 0}
              % dari total anak
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status Gizi</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.nutritionStatus.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Anak dengan gizi baik
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardStats;
