
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, AlertTriangle, CheckCircle, TrendingUp, Heart } from 'lucide-react';
import { ZScoreResult } from '@/utils/whoZScore';

interface ZScoreAnalyzerProps {
  zScoreResult: ZScoreResult;
  childName: string;
  ageInMonths: number;
  gender: 'male' | 'female';
  weight: number;
  height: number;
}

const ZScoreAnalyzer = ({ 
  zScoreResult, 
  childName, 
  ageInMonths, 
  gender, 
  weight, 
  height 
}: ZScoreAnalyzerProps) => {
  
  const getDetailedAnalysis = (): string => {
    const ageYears = Math.floor(ageInMonths / 12);
    const ageMonthsRemainder = ageInMonths % 12;
    const ageText = ageYears > 0 ? `${ageYears} tahun ${ageMonthsRemainder} bulan` : `${ageInMonths} bulan`;
    
    let analysis = `ANALISIS MENDALAM STATUS GIZI ${childName.toUpperCase()}\n\n`;
    
    analysis += `👶 PROFIL ANAK:\n`;
    analysis += `• Nama: ${childName}\n`;
    analysis += `• Usia: ${ageText}\n`;
    analysis += `• Jenis Kelamin: ${gender === 'male' ? 'Laki-laki' : 'Perempuan'}\n`;
    analysis += `• Berat Badan: ${weight} kg\n`;
    analysis += `• Tinggi Badan: ${height} cm\n\n`;
    
    analysis += `📊 HASIL Z-SCORE WHO 2006:\n`;
    analysis += `• Height-for-Age (HAZ): ${zScoreResult.heightForAge} - ${zScoreResult.stuntingStatus}\n`;
    analysis += `• Weight-for-Age (WAZ): ${zScoreResult.weightForAge} - ${zScoreResult.underweightStatus}\n`;
    analysis += `• Weight-for-Height (WHZ): ${zScoreResult.weightForHeight} - ${zScoreResult.wastingStatus}\n\n`;
    
    // Detailed status analysis
    if (zScoreResult.isStunted) {
      analysis += `🚨 DIAGNOSA UTAMA: STUNTING TERDETEKSI\n\n`;
      
      if (zScoreResult.heightForAge < -3) {
        analysis += `TINGKAT KEPARAHAN: STUNTING BERAT (HAZ < -3 SD)\n`;
        analysis += `Anak mengalami stunting berat dengan tinggi badan sangat di bawah standar WHO. Kondisi ini menunjukkan kekurangan gizi kronis yang berkepanjangan dan memerlukan intervensi medis segera.\n\n`;
      } else {
        analysis += `TINGKAT KEPARAHAN: STUNTING SEDANG (HAZ -3 hingga -2 SD)\n`;
        analysis += `Anak mengalami stunting dengan tinggi badan di bawah standar WHO. Diperlukan perhatian khusus dan intervensi gizi yang tepat.\n\n`;
      }
      
      analysis += `🎯 IMPLIKASI KLINIS:\n`;
      analysis += `• Pertumbuhan linear terhambat akibat kekurangan gizi kronis\n`;
      analysis += `• Risiko gangguan perkembangan kognitif dan motorik\n`;
      analysis += `• Sistem imun dapat terganggu, mudah sakit\n`;
      analysis += `• Potensi dampak jangka panjang pada produktivitas dewasa\n\n`;
      
    } else if (zScoreResult.stuntingStatus === 'Risiko Stunting') {
      analysis += `⚠️ STATUS: RISIKO STUNTING (HAZ -2 hingga -1 SD)\n`;
      analysis += `Anak berada dalam zona risiko stunting. Meskipun belum tergolong stunting, perlu perhatian khusus untuk mencegah penurunan lebih lanjut.\n\n`;
      
    } else {
      analysis += `✅ STATUS PERTUMBUHAN: NORMAL\n`;
      analysis += `Tinggi badan anak sesuai dengan standar WHO untuk usianya. Pertahankan pola asuh dan gizi yang baik.\n\n`;
    }
    
    // Weight analysis
    if (zScoreResult.weightForAge < -2) {
      analysis += `⚠️ STATUS BERAT BADAN: ${zScoreResult.underweightStatus.toUpperCase()}\n`;
      analysis += `Berat badan anak di bawah standar WHO, menunjukkan kemungkinan kekurangan gizi akut atau kronis.\n\n`;
    }
    
    // Wasting analysis
    if (zScoreResult.weightForHeight < -2) {
      analysis += `🔍 INDIKATOR WASTING: ${zScoreResult.wastingStatus.toUpperCase()}\n`;
      analysis += `Rasio berat terhadap tinggi badan menunjukkan kekurangan gizi akut (wasting).\n\n`;
    }
    
    analysis += `💊 REKOMENDASI INTERVENSI SPESIFIK:\n\n`;
    
    if (zScoreResult.isStunted) {
      analysis += `🏥 TINDAKAN SEGERA:\n`;
      analysis += `• Rujuk ke dokter spesialis anak untuk evaluasi komprehensif\n`;
      analysis += `• Skrining penyakit penyerta (anemia, infeksi kronis)\n`;
      analysis += `• Konsultasi ahli gizi klinik untuk rencana diet khusus\n\n`;
      
      analysis += `🍽️ INTERVENSI GIZI INTENSIF:\n`;
      analysis += `• Tingkatkan asupan protein hewani minimal 2-3 porsi/hari\n`;
      analysis += `• Berikan telur ayam 1-2 butir setiap hari\n`;
      analysis += `• Ikan/daging/ayam minimal 50-75g/hari\n`;
      analysis += `• Susu atau produk olahan susu 2-3 gelas/hari\n`;
      analysis += `• Sayuran hijau dan buah kaya vitamin A\n`;
      analysis += `• Fortifikasi makanan dengan zinc dan zat besi\n\n`;
      
    } else {
      analysis += `🥗 PEMELIHARAAN GIZI OPTIMAL:\n`;
      analysis += `• Lanjutkan pola makan gizi seimbang\n`;
      analysis += `• Protein hewani 1-2 porsi/hari\n`;
      analysis += `• Variasi menu untuk mencegah defisiensi mikronutrien\n`;
      analysis += `• ASI hingga 2 tahun (jika masih menyusui)\n\n`;
    }
    
    if (ageInMonths < 6) {
      analysis += `🤱 REKOMENDASI USIA 0-6 BULAN:\n`;
      analysis += `• ASI eksklusif tanpa makanan/minuman tambahan\n`;
      analysis += `• Pantau kenaikan berat badan mingguan\n`;
      analysis += `• Konsultasi laktasi jika ada masalah menyusui\n\n`;
      
    } else if (ageInMonths < 24) {
      analysis += `🍼 REKOMENDASI USIA 6-24 BULAN:\n`;
      analysis += `• MPASI responsif dengan tekstur sesuai usia\n`;
      analysis += `• Frekuensi makan 3x utama + 2x selingan\n`;
      analysis += `• Lanjutkan ASI sebagai pendamping MPASI\n`;
      analysis += `• Stimulasi tumbuh kembang sesuai milestone\n\n`;
      
    } else {
      analysis += `🎯 REKOMENDASI USIA >2 TAHUN:\n`;
      analysis += `• Menu keluarga dengan porsi sesuai usia\n`;
      analysis += `• Aktivitas fisik untuk pertumbuhan optimal\n`;
      analysis += `• Edukasi gizi untuk kemandirian makan\n\n`;
    }
    
    analysis += `📅 JADWAL PEMANTAUAN:\n`;
    if (zScoreResult.isStunted) {
      analysis += `• Kontrol dokter: Setiap 2 minggu dalam 2 bulan pertama\n`;
      analysis += `• Penimbangan berat/tinggi: Mingguan di posyandu\n`;
      analysis += `• Evaluasi progress: Bulanan dengan ahli gizi\n`;
    } else {
      analysis += `• Pemantauan rutin: Bulanan di posyandu\n`;
      analysis += `• Kontrol dokter: Setiap 3-6 bulan\n`;
    }
    
    analysis += `\n🎓 EDUKASI KELUARGA:\n`;
    analysis += `• Pentingnya 1000 hari pertama kehidupan\n`;
    analysis += `• Hygiene dan sanitasi untuk mencegah infeksi\n`;
    analysis += `• Tanda bahaya yang perlu diwaspadai\n`;
    analysis += `• Stimulasi dini untuk perkembangan optimal\n\n`;
    
    analysis += `⚠️ CATATAN PENTING:\n`;
    analysis += `Analisis ini berdasarkan data antropometri saat ini. Evaluasi berkelanjutan diperlukan untuk memantau progress dan menyesuaikan intervensi. Konsultasikan dengan tenaga kesehatan profesional untuk penanganan yang tepat.`;
    
    return analysis;
  };

  const getStatusColor = (status: string) => {
    if (status.includes('Stunting') || status.includes('Buruk') || status.includes('Berat')) {
      return 'bg-red-100 text-red-900 border-red-300';
    } else if (status.includes('Risiko') || status.includes('Kurang') || status.includes('Kurus')) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    } else {
      return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getPriorityLevel = () => {
    if (zScoreResult.heightForAge < -3) return { level: 'PRIORITAS TINGGI', color: 'text-red-600', icon: AlertTriangle };
    if (zScoreResult.isStunted) return { level: 'PRIORITAS SEDANG', color: 'text-orange-600', icon: AlertTriangle };
    return { level: 'PEMANTAUAN RUTIN', color: 'text-green-600', icon: CheckCircle };
  };

  const priority = getPriorityLevel();
  const PriorityIcon = priority.icon;

  return (
    <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="font-bold text-xl text-gray-800 flex items-center">
            <Brain className="h-6 w-6 mr-2 text-indigo-600" />
            🤖 Analisis AI - Assesmen Gizi Komprehensif
          </h4>
          <div className="flex items-center space-x-2">
            <PriorityIcon className={`h-5 w-5 ${priority.color}`} />
            <Badge className={getStatusColor(priority.level)}>
              {priority.level}
            </Badge>
          </div>
        </div>

        {/* Quick Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-white/80 border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Status Stunting</p>
                  <p className="font-bold text-lg">{zScoreResult.stuntingStatus}</p>
                  <p className="text-xs text-gray-500">HAZ: {zScoreResult.heightForAge}</p>
                </div>
                <TrendingUp className={`h-8 w-8 ${zScoreResult.isStunted ? 'text-red-500' : 'text-green-500'}`} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Status Gizi</p>
                  <p className="font-bold text-lg">{zScoreResult.underweightStatus}</p>
                  <p className="text-xs text-gray-500">WAZ: {zScoreResult.weightForAge}</p>
                </div>
                <Heart className={`h-8 w-8 ${zScoreResult.weightForAge < -2 ? 'text-red-500' : 'text-green-500'}`} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Status Wasting</p>
                  <p className="font-bold text-lg">{zScoreResult.wastingStatus}</p>
                  <p className="text-xs text-gray-500">WHZ: {zScoreResult.weightForHeight}</p>
                </div>
                <CheckCircle className={`h-8 w-8 ${zScoreResult.weightForHeight < -2 ? 'text-red-500' : 'text-green-500'}`} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analysis */}
        <div className="bg-white/90 rounded-lg p-6 border border-indigo-100">
          <h5 className="font-semibold text-indigo-800 mb-4 flex items-center">
            <Brain className="h-5 w-5 mr-2" />
            Analisis Komprehensif Berbasis AI
          </h5>
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed">
              {getDetailedAnalysis()}
            </pre>
          </div>
        </div>

        {/* Action Summary */}
        {zScoreResult.isStunted && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-6 w-6 text-red-500 mt-1" />
              <div>
                <h6 className="font-bold text-red-800 mb-2">🚨 TINDAKAN SEGERA DIPERLUKAN</h6>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Rujuk ke dokter spesialis anak dalam 1-2 hari</li>
                  <li>• Mulai intervensi gizi intensif segera</li>
                  <li>• Pantau perkembangan mingguan</li>
                  <li>• Edukasi keluarga tentang penanganan stunting</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 text-xs text-gray-500 border-t pt-4">
          <p>
            ⚡ Analisis ini dihasilkan menggunakan AI dengan standar WHO Child Growth Standards 2006. 
            Konsultasikan dengan tenaga kesehatan profesional untuk penanganan yang tepat.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ZScoreAnalyzer;
