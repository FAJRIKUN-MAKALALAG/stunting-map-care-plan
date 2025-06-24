/**
 * Fungsi untuk memanggil endpoint chatbot backend (FastAPI)
 * @param message string - pesan user
 * @returns string - respons dari LLM (Gemini via backend)
 */
export async function fetchChatbotResponse(message: string): Promise<string> {
  try {
    const res = await fetch("http://157.10.161.80:8000/api/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
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
  endpoint = "http://157.10.161.80:8000/api/llm-analyze"
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
