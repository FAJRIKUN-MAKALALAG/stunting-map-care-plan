import { Child } from "@/integrations/supabase/types";

/**
 * Fungsi untuk memanggil endpoint chatbot backend (FastAPI)
 * @param message string - pesan user
 * @param childrenData Child[] - data anak yang relevan dari dashboard
 * @returns string - respons dari LLM (Gemini via backend)
 */
export async function fetchChatbotResponse(
  message: string,
  childrenData: Child[]
): Promise<string> {
  try {
    const childrenInfo = childrenData.map((child) => ({
      id: child.id,
      nama: child.nama,
      nik: child.nik,
      tanggal_lahir: child.tanggal_lahir,
      jenis_kelamin: child.jenis_kelamin,
      status_gizi: child.status,
      berat_badan: child.berat_badan,
      tinggi_badan: child.tinggi_badan,
      // Tambahkan properti lain yang relevan jika diperlukan oleh AI
    }));

    const fullMessage = `Pesan pengguna: ${message}\n\nData anak terkait (jika relevan): ${JSON.stringify(
      childrenInfo
    )}\n\n(Mohon berikan jawaban singkat dan relevan seputar gizi anak, dengan mempertimbangkan data anak di atas jika ada pertanyaan spesifik tentang anak.)`;

    const res = await fetch("https://api.stuntingcaresulut.cyou/api/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: fullMessage }),
    });
    const data = await res.json();
    if (res.ok && data.reply) {
      return data.reply;
    } else if (data.error) {
      return `Error: ${data.error}`;
    } else {
      return "[No response from server]";
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return `Error: ${errorMsg || "Unknown error"}`;
  }
}

/**
 * Fungsi generik untuk memanggil LLM backend (default: /api/llm-analyze)
 * @param prompt string - prompt yang dikirim ke LLM
 * @param endpoint string - endpoint backend (default: /api/llm-analyze)
 * @returns string - respons dari LLM
 */
export async function fetchLLMBackend(
  prompt: string,
  endpoint = "https://api.stuntingcaresulut.cyou/api/llm-analyze"
): Promise<string> {
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    if (res.ok && data.reply) {
      return data.reply;
    } else if (data.error) {
      return `Error: ${data.error}`;
    } else {
      return "[No response from server]";
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return `Error: ${errorMsg || "Unknown error"}`;
  }
}
