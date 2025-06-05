
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const DashboardStats = () => {
  const wilayahData = [
    { nama: 'Desa Sukamaju', stunting: 12, total: 156, persentase: 7.7, status: 'sedang' },
    { nama: 'Desa Sejahtera', stunting: 8, total: 134, persentase: 6.0, status: 'rendah' },
    { nama: 'Kelurahan Mawar', stunting: 15, total: 178, persentase: 8.4, status: 'tinggi' },
    { nama: 'Desa Harapan', stunting: 6, total: 142, persentase: 4.2, status: 'rendah' },
    { nama: 'Kelurahan Melati', stunting: 18, total: 189, persentase: 9.5, status: 'tinggi' }
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Statistik per Wilayah */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
            📊 Statistik per Wilayah
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {wilayahData.map((wilayah, index) => (
            <div key={index} className="p-4 bg-white/50 rounded-lg border border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-gray-800">{wilayah.nama}</h4>
                  <p className="text-sm text-gray-600">
                    {wilayah.stunting} dari {wilayah.total} anak
                  </p>
                </div>
                <Badge className={getStatusColor(wilayah.status)}>
                  {wilayah.status.toUpperCase()}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Prevalensi Stunting</span>
                  <span className="font-medium">{wilayah.persentase}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(wilayah.persentase)}`}
                    style={{ width: `${Math.min(wilayah.persentase * 2, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Grafik Tren */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
            📈 Tren 6 Bulan Terakhir
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { bulan: 'Jan 2024', kasus: 76, perubahan: '-3%' },
              { bulan: 'Feb 2024', kasus: 78, perubahan: '+2%' },
              { bulan: 'Mar 2024', kasus: 82, perubahan: '+5%' },
              { bulan: 'Apr 2024', kasus: 85, perubahan: '+4%' },
              { bulan: 'Mei 2024', kasus: 87, perubahan: '+2%' },
              { bulan: 'Jun 2024', kasus: 89, perubahan: '+2%' }
            ].map((data, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
                  <span className="font-medium text-gray-700">{data.bulan}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-800">{data.kasus} kasus</div>
                  <div className={`text-sm ${data.perubahan.startsWith('+') ? 'text-red-500' : 'text-green-500'}`}>
                    {data.perubahan}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
