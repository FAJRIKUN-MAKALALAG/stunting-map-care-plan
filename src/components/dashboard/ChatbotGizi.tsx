import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, X, Bot, User, Lightbulb } from "lucide-react";
import { getGeminiResponse } from "@/lib/gemini";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface ChatbotGiziProps {
  onClose: () => void;
}

const ChatbotGizi = ({ onClose }: ChatbotGiziProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Halo! Saya adalah asisten gizi virtual. Saya siap membantu Anda dengan pertanyaan seputar gizi anak dan pencegahan stunting. Apa yang ingin Anda tanyakan?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    "Apa itu stunting?",
    "Makanan pencegah stunting",
    "ASI eksklusif sampai kapan?",
    "Tanda-tanda stunting pada anak",
    "Menu MPASI yang baik",
  ];

  const nutritionDatabase = {
    stunting: {
      keywords: ["stunting", "pendek", "tumbuh kembang"],
      response:
        "Stunting adalah kondisi gagal tumbuh pada anak karena kekurangan gizi kronis. Anak stunting memiliki tinggi badan lebih pendek dari standar usianya. Pencegahan terbaik adalah dengan:\n\n• ASI eksklusif 6 bulan pertama\n• MPASI bergizi seimbang mulai 6 bulan\n• Protein hewani seperti telur, ikan, daging\n• Sayuran hijau dan buah-buahan\n• Pemantauan rutin ke posyandu",
    },
    asi: {
      keywords: ["asi", "menyusui", "eksklusif"],
      response:
        "ASI eksklusif sangat penting untuk 6 bulan pertama kehidupan anak:\n\n• Berikan hanya ASI tanpa makanan/minuman lain\n• ASI mengandung semua nutrisi yang dibutuhkan bayi\n• Lanjutkan ASI hingga anak usia 2 tahun\n• Setelah 6 bulan, tambahkan MPASI bergizi\n• Konsultasi dengan bidan jika ada masalah menyusui",
    },
    mpasi: {
      keywords: ["mpasi", "makanan tambahan", "6 bulan", "menu"],
      response:
        "MPASI (Makanan Pendamping ASI) yang baik:\n\n🥄 Mulai usia 6 bulan\n🍳 Protein hewani: telur, ikan, ayam, daging\n🥕 Sayuran: wortel, brokoli, bayam\n🍌 Buah: pisang, alpukat, pepaya\n🍚 Karbohidrat: nasi, kentang, ubi\n\nTips:\n• Tekstur disesuaikan usia anak\n• Beri makan 3x sehari + 2x camilan\n• Variasi menu agar tidak bosan",
    },
    protein: {
      keywords: ["protein", "telur", "ikan", "daging", "ayam"],
      response:
        "Protein hewani sangat penting untuk mencegah stunting:\n\n🥚 TELUR: Berikan 1 butir/hari, mudah dicerna\n🐟 IKAN: 2-3x seminggu, kaya omega-3\n🍗 AYAM: Pilih bagian dada, rendah lemak\n🥩 DAGING SAPI: 1-2x seminggu, tinggi zat besi\n\nProtein membantu:\n• Pertumbuhan otot dan tulang\n• Perkembangan otak\n• Sistem kekebalan tubuh\n• Penyembuhan luka",
    },
    "gizi seimbang": {
      keywords: ["gizi seimbang", "nutrisi", "makanan sehat"],
      response:
        "Prinsip gizi seimbang untuk anak:\n\n🍽️ ISI PIRINGKU:\n• 1/3 makanan pokok (nasi, kentang)\n• 1/3 sayuran dan buah\n• 1/3 lauk pauk (protein hewani/nabati)\n\n💧 Minum air putih 6-8 gelas/hari\n🥛 Susu atau produk olahan susu\n🧂 Batasi gula, garam, minyak\n🏃 Aktivitas fisik teratur\n\nPantau berat dan tinggi badan rutin!",
    },
  };

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();

    for (const [key, data] of Object.entries(nutritionDatabase)) {
      if (data.keywords.some((keyword) => message.includes(keyword))) {
        return data.response;
      }
    }

    // Default response
    return "Terima kasih atas pertanyaannya! Untuk informasi gizi yang lebih spesifik, saya sarankan berkonsultasi langsung dengan dokter atau ahli gizi di puskesmas terdekat. Apakah ada pertanyaan lain tentang gizi anak yang bisa saya bantu?";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      // Get response from Gemini
      const response = await getGeminiResponse(inputMessage);

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Error getting Gemini response:", error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Maaf, terjadi kesalahan saat memproses pertanyaan Anda. Silakan coba lagi nanti.",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl h-[85vh] md:h-[80vh] bg-white/95 shadow-2xl rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 border-b">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <span className="text-lg font-semibold">
                Konsultan Gizi Virtual
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col h-[calc(100%-4rem)]">
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-gray-50/50 to-white">
            <div className="space-y-4 max-w-3xl mx-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-lg ${
                      message.sender === "user"
                        ? "bg-blue-500 text-white rounded-br-none shadow-sm"
                        : "bg-white text-gray-800 rounded-bl-none border border-gray-100 shadow-sm"
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.sender === "bot" && (
                        <Bot className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
                      )}
                      {message.sender === "user" && (
                        <User className="h-4 w-4 mt-0.5 text-blue-100 flex-shrink-0" />
                      )}
                      <div className="flex-1 text-left">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {message.text}
                        </p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-lg rounded-bl-none border border-gray-100 shadow-sm">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-4 w-4 text-green-600" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          {/* Quick Questions */}
          <div className="p-4 border-t bg-white/90 backdrop-blur-sm">
            <div className="flex items-center mb-2">
              <Lightbulb className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="text-xs font-medium text-gray-600">
                Pertanyaan Cepat:
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickQuestion(question)}
                  className="text-xs h-7 bg-white hover:bg-green-50 border-green-200 transition-colors"
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-3 border-t bg-white/90 backdrop-blur-sm">
            <div className="flex space-x-2 max-w-3xl mx-auto">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ketik pertanyaan Anda di sini..."
                className="flex-1 bg-white/80 border-gray-200 focus:border-green-500 focus:ring-green-500"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="bg-green-500 hover:bg-green-600 transition-colors"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatbotGizi;
