import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchLLMBackend } from "@/lib/llm";

interface ZScoreAnalyzerProps {
  zScoreBB: number;
  zScoreTB: number;
  age: number;
  gender: "male" | "female";
}

const ZScoreAnalyzer: React.FC<ZScoreAnalyzerProps> = ({
  zScoreBB,
  zScoreTB,
  age,
  gender,
}) => {
  const [analysis, setAnalysis] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const getAnalysis = async () => {
      setLoading(true);
      try {
        const prompt = `Analisis kondisi gizi anak dengan data berikut:\n- Usia: ${age} bulan\n- Jenis Kelamin: ${
          gender === "male" ? "Laki-laki" : "Perempuan"
        }\n- Berat Badan (Z-score): ${zScoreBB.toFixed(
          2
        )}\n- Tinggi Badan (Z-score): ${zScoreTB.toFixed(
          2
        )}\n\nBerikan analisis mendalam tentang:\n1. Kondisi gizi anak berdasarkan Z-score\n2. Faktor-faktor yang mungkin mempengaruhi\n3. Rekomendasi praktis untuk orang tua\n\nFormat jawaban:\n- Gunakan bahasa yang mudah dipahami\n- Berikan saran yang konkret dan bisa langsung diterapkan\n- Fokus pada aspek nutrisi dan pola asuh`;
        const response = await fetchLLMBackend(prompt);
        setAnalysis(response);
      } catch (error) {
        console.error("Error getting analysis:", error);
        setAnalysis("Maaf, terjadi kesalahan saat menganalisis data.");
      } finally {
        setLoading(false);
      }
    };

    getAnalysis();
  }, [zScoreBB, zScoreTB, age, gender]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analisis Kondisi Gizi</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap text-left">{analysis}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ZScoreAnalyzer;
