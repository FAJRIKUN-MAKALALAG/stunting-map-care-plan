import { GoogleGenerativeAI } from "@google/generative-ai";

// Define error type for Gemini API
interface GeminiError extends Error {
  details?: string;
}

// Debug: Log API key (only first few characters for security)
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
console.log("API Key available:", apiKey ? "Yes" : "No");
console.log("API Key length:", apiKey?.length);
console.log("API Key starts with:", apiKey?.substring(0, 4));

if (!apiKey) {
  throw new Error(
    "Gemini API key is not configured. Please check your .env file."
  );
}

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(apiKey);

// Get the generative model (using the latest model)
export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 1024,
  },
});

// System prompt untuk konteks gizi dan stunting
export const SYSTEM_PROMPT = `Kamu adalah asisten gizi virtual yang ahli dalam bidang gizi anak dan pencegahan stunting. 
Berikan jawaban yang:
1. Singkat dan jelas (maksimal 3-4 kalimat)
2. Berdasarkan fakta medis
3. Praktis dan bisa diterapkan
4. Menggunakan bahasa yang ramah dan mudah dipahami

Format jawaban:
- Hindari penggunaan simbol seperti *, -, atau emoji
- Gunakan paragraf yang rapi
- Fokus pada informasi penting saja
- Jika perlu list, gunakan format paragraf biasa

Topik yang bisa dibahas:
- Gizi anak
- Pencegahan stunting
- ASI dan MPASI
- Pola makan sehat
- Pertumbuhan dan perkembangan anak

Jika pertanyaan di luar topik gizi anak dan stunting, arahkan kembali ke topik tersebut.`;

// Fungsi untuk mendapatkan respons dari Gemini
export async function getGeminiResponse(userMessage: string): Promise<string> {
  try {
    console.log("Attempting to send message to Gemini...");

    // Create a new chat session
    const chat = geminiModel.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: SYSTEM_PROMPT }],
        },
      ],
    });

    console.log("Chat session created, sending message...");

    // Send the message
    const result = await chat.sendMessage(userMessage);
    console.log("Message sent, waiting for response...");

    // Get the response
    const response = await result.response;
    console.log("Response received successfully");

    return response.text();
  } catch (error) {
    // Type assertion untuk error
    const geminiError = error as GeminiError;

    // Log detailed error information
    console.error("Gemini API Error:", {
      name: geminiError.name,
      message: geminiError.message,
      stack: geminiError.stack,
      details: geminiError.details || "No additional details",
    });

    // Return a more specific error message based on the error type
    if (geminiError.message?.includes("API key")) {
      return "Error: API key tidak valid atau tidak dikonfigurasi dengan benar. Mohon periksa konfigurasi API key.";
    } else if (geminiError.message?.includes("quota")) {
      return "Error: Kuota API telah habis. Mohon coba lagi nanti.";
    } else if (geminiError.message?.includes("network")) {
      return "Error: Masalah koneksi jaringan. Mohon periksa koneksi internet Anda.";
    } else {
      return `Error: ${
        geminiError.message || "Terjadi kesalahan yang tidak diketahui"
      }`;
    }
  }
}
