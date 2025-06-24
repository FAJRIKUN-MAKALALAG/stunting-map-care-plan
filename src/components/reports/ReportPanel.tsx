import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  FileText,
  BarChart,
  Calendar,
  MapPin,
  TrendingUp,
  Printer,
} from "lucide-react";
import { getSupabaseClient } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Database } from "@/integrations/supabase/types";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

type Child = Database["public"]["Tables"]["children"]["Row"];

interface ReportData {
  totalChildren: number;
  stuntingCases: number;
  villages: number;
  trend: number;
  monthlyData: {
    month: string;
    total: number;
    stunting: number;
  }[];
  villageData: {
    name: string;
    total: number;
    stunting: number;
    persentase: number;
  }[];
}

const ReportPanel = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [showReport, setShowReport] = useState(false);
  const [currentReport, setCurrentReport] = useState<{
    title: string;
    content: string;
  } | null>(null);
  const [reportData, setReportData] = useState<ReportData>({
    totalChildren: 0,
    stuntingCases: 0,
    villages: 0,
    trend: 0,
    monthlyData: [],
    villageData: [],
  });

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const supabase = await getSupabaseClient();
      const { data: children, error } = await supabase
        .from("children")
        .select("*");

      if (error) throw error;

      // Calculate total statistics
      const totalChildren = children.length;
      const stuntingCases = children.filter(
        (child) =>
          child.status === "Stunting" || child.status === "Stunting Berat"
      ).length;

      // Group by village
      const villageMap = new Map();
      children.forEach((child) => {
        if (!child.dusun) return;

        const village = villageMap.get(child.dusun) || {
          name: child.dusun,
          total: 0,
          stunting: 0,
          persentase: 0,
        };

        village.total++;
        if (child.status === "Stunting" || child.status === "Stunting Berat") {
          village.stunting++;
        }

        village.persentase =
          village.total > 0 ? (village.stunting / village.total) * 100 : 0;
        villageMap.set(child.dusun, village);
      });

      // Group by month
      const monthlyMap = new Map();
      children.forEach((child) => {
        if (!child.created_at) return;

        const date = new Date(child.created_at);
        const monthKey = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;

        const monthData = monthlyMap.get(monthKey) || {
          month: monthKey,
          total: 0,
          stunting: 0,
        };

        monthData.total++;
        if (child.status === "Stunting" || child.status === "Stunting Berat") {
          monthData.stunting++;
        }

        monthlyMap.set(monthKey, monthData);
      });

      // Calculate trend (comparing last 2 months)
      const monthlyData = Array.from(monthlyMap.values()).sort((a, b) =>
        a.month.localeCompare(b.month)
      );

      let trend = 0;
      if (monthlyData.length >= 2) {
        const lastMonth = monthlyData[monthlyData.length - 1];
        const prevMonth = monthlyData[monthlyData.length - 2];
        const lastMonthRate =
          lastMonth.total > 0
            ? (lastMonth.stunting / lastMonth.total) * 100
            : 0;
        const prevMonthRate =
          prevMonth.total > 0
            ? (prevMonth.stunting / prevMonth.total) * 100
            : 0;
        trend = lastMonthRate - prevMonthRate;
      }

      setReportData({
        totalChildren,
        stuntingCases,
        villages: villageMap.size,
        trend,
        monthlyData,
        villageData: Array.from(villageMap.values()),
      });
    } catch (error) {
      console.error("Error fetching report data:", error);
      toast({
        title: "Error",
        description: "Gagal mengambil data laporan",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShowReport = (type: string) => {
    let reportContent = "";
    let reportTitle = "";

    switch (type) {
      case "Bulanan":
        reportTitle = "LAPORAN BULANAN KASUS STUNTING";
        reportContent = generateMonthlyReport();
        break;
      case "Per Desa":
        reportTitle = "LAPORAN KASUS STUNTING PER DESA";
        reportContent = generateVillageReport();
        break;
      case "Analisis Tren":
        reportTitle = "ANALISIS TREN KASUS STUNTING";
        reportContent = generateTrendAnalysis();
        break;
    }

    setCurrentReport({
      title: reportTitle,
      content: reportContent,
    });
    setShowReport(true);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${currentReport?.title}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 20px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
              }
              th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
              }
              th {
                background-color: #f5f5f5;
              }
              .header {
                text-align: center;
                margin-bottom: 20px;
              }
              .footer {
                margin-top: 20px;
                text-align: right;
              }
              @media print {
                .no-print {
                  display: none;
                }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${currentReport?.title}</h1>
              <p>Tanggal: ${new Date().toLocaleDateString("id-ID")}</p>
            </div>
            ${currentReport?.content}
            <div class="footer">
              <p>Dicetak pada: ${new Date().toLocaleString("id-ID")}</p>
            </div>
            <div class="no-print" style="text-align: center; margin-top: 20px;">
              <button onclick="window.print()">Print</button>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const generateMonthlyReport = () => {
    return `
      <table>
        <thead>
          <tr>
            <th>Bulan</th>
            <th>Total Anak</th>
            <th>Kasus Stunting</th>
            <th>Prevalensi</th>
          </tr>
        </thead>
        <tbody>
          ${reportData.monthlyData
            .map(
              (month) => `
            <tr>
              <td>${month.month}</td>
              <td>${month.total}</td>
              <td>${month.stunting}</td>
              <td>${
                month.total > 0
                  ? ((month.stunting / month.total) * 100).toFixed(1)
                  : "0.0"
              }%</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;
  };

  const generateVillageReport = () => {
    return `
      <table>
        <thead>
          <tr>
            <th>Desa</th>
            <th>Total Anak</th>
            <th>Kasus Stunting</th>
            <th>Prevalensi</th>
          </tr>
        </thead>
        <tbody>
          ${reportData.villageData
            .map(
              (village) => `
            <tr>
              <td>${village.name}</td>
              <td>${village.total}</td>
              <td>${village.stunting}</td>
              <td>${village.persentase.toFixed(1)}%</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;
  };

  const generateTrendAnalysis = () => {
    const totalPrevalence =
      reportData.totalChildren > 0
        ? ((reportData.stuntingCases / reportData.totalChildren) * 100).toFixed(
            1
          )
        : "0.0";

    return `
      <table>
        <thead>
          <tr>
            <th>Metrik</th>
            <th>Nilai</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Total Anak</td>
            <td>${reportData.totalChildren}</td>
          </tr>
          <tr>
            <td>Total Kasus Stunting</td>
            <td>${reportData.stuntingCases}</td>
          </tr>
          <tr>
            <td>Prevalensi Keseluruhan</td>
            <td>${totalPrevalence}%</td>
          </tr>
          <tr>
            <td>Tren Bulan Ini</td>
            <td>${reportData.trend > 0 ? "+" : ""}${reportData.trend.toFixed(
      1
    )}%</td>
          </tr>
        </tbody>
      </table>
      <div style="margin-top: 20px;">
        <h3>Analisis:</h3>
        <p>
          ${
            reportData.trend > 0
              ? "Terdapat peningkatan kasus stunting dibandingkan bulan sebelumnya."
              : reportData.trend < 0
              ? "Terdapat penurunan kasus stunting dibandingkan bulan sebelumnya."
              : "Kasus stunting stabil dibandingkan bulan sebelumnya."
          }
        </p>
      </div>
    `;
  };

  // Export Laporan Bulanan ke Excel
  const exportMonthlyToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      reportData.monthlyData.map((m) => ({
        Bulan: m.month,
        "Total Anak": m.total,
        "Kasus Stunting": m.stunting,
        Prevalensi:
          m.total > 0
            ? ((m.stunting / m.total) * 100).toFixed(1) + "%"
            : "0.0%",
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan Bulanan");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([wbout], { type: "application/octet-stream" }),
      "laporan-bulanan.xlsx"
    );
  };

  // Export Laporan Per Desa ke Excel
  const exportVillageToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      reportData.villageData.map((v) => ({
        Desa: v.name,
        "Total Anak": v.total,
        "Kasus Stunting": v.stunting,
        Prevalensi: v.persentase.toFixed(1) + "%",
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan Desa");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([wbout], { type: "application/octet-stream" }),
      "laporan-desa.xlsx"
    );
  };

  // Export Analisis Tren ke Excel
  const exportTrendToExcel = () => {
    const lastMonth = reportData.monthlyData[reportData.monthlyData.length - 1];
    const prevMonth = reportData.monthlyData[reportData.monthlyData.length - 2];
    const data = [
      { Metrik: "Total Anak", Nilai: reportData.totalChildren },
      { Metrik: "Kasus Stunting", Nilai: reportData.stuntingCases },
      { Metrik: "Jumlah Desa", Nilai: reportData.villages },
      {
        Metrik: "Tren Bulan Terakhir (%)",
        Nilai: reportData.trend.toFixed(1) + "%",
      },
      ...(lastMonth && prevMonth
        ? [
            { Metrik: "Bulan Terakhir", Nilai: lastMonth.month },
            {
              Metrik: "Kasus Stunting Bulan Terakhir",
              Nilai: lastMonth.stunting,
            },
            {
              Metrik: "Kasus Stunting Bulan Sebelumnya",
              Nilai: prevMonth.stunting,
            },
          ]
        : []),
    ];
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Analisis Tren");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([wbout], { type: "application/octet-stream" }),
      "analisis-tren.xlsx"
    );
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800">
            📊 Laporan & Analisis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
              <p className="text-gray-500">Memuat data laporan...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button
                  onClick={() => handleShowReport("Bulanan")}
                  className="h-24 flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <Calendar className="h-6 w-6" />
                  <span>Laporan Bulanan</span>
                </Button>

                <Button
                  onClick={() => handleShowReport("Per Desa")}
                  className="h-24 flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                >
                  <MapPin className="h-6 w-6" />
                  <span>Laporan Per Desa</span>
                </Button>

                <Button
                  onClick={() => handleShowReport("Analisis Tren")}
                  className="h-24 flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <TrendingUp className="h-6 w-6" />
                  <span>Analisis Tren</span>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Anak
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {reportData.totalChildren}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Kasus Stunting
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {reportData.stuntingCases}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {(
                        (reportData.stuntingCases / reportData.totalChildren) *
                        100
                      ).toFixed(1)}
                      % dari total
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Desa
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {reportData.villages}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Tren Bulan Ini
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {reportData.trend > 0 ? "+" : ""}
                      {reportData.trend.toFixed(1)}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Dibandingkan bulan lalu
                    </p>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={showReport} onOpenChange={setShowReport}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{currentReport?.title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <div
              dangerouslySetInnerHTML={{ __html: currentReport?.content || "" }}
            />
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            {currentReport?.title === "LAPORAN BULANAN KASUS STUNTING" && (
              <Button
                onClick={exportMonthlyToExcel}
                variant="outline"
                className="ml-2"
              >
                <Download className="w-4 h-4 mr-2" /> Download Excel Bulanan
              </Button>
            )}
            {currentReport?.title === "LAPORAN KASUS STUNTING PER DESA" && (
              <Button
                onClick={exportVillageToExcel}
                variant="outline"
                className="ml-2"
              >
                <Download className="w-4 h-4 mr-2" /> Download Excel Per Desa
              </Button>
            )}
            {currentReport?.title === "ANALISIS TREN KASUS STUNTING" && (
              <Button
                onClick={exportTrendToExcel}
                variant="outline"
                className="ml-2"
              >
                <Download className="w-4 h-4 mr-2" /> Download Excel Analisis
                Tren
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportPanel;
