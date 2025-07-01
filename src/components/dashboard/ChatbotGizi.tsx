import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2, Bot, User, ChevronDown } from "lucide-react";
import { fetchChatbotResponse } from "@/lib/llm";
import { useToast } from "@/hooks/use-toast";
import { Child } from "@/integrations/supabase/types";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatbotGiziProps {
  onClose: () => void;
  childrenData: Child[];
}

const ChatbotGizi: React.FC<ChatbotGiziProps> = ({ onClose, childrenData }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Halo! Saya asisten gizi yang siap membantu Anda. Apa yang ingin Anda tanyakan seputar gizi anak?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isQuickQuestionsExpanded, setIsQuickQuestionsExpanded] =
    useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const quickQuestions = [
    "Apa itu stunting?",
    "Makanan pencegah stunting",
    "ASI eksklusif sampai kapan?",
    "Tanda-tanda stunting pada anak",
    "Menu MPASI yang baik",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement> | Event) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      role: "user" as const,
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetchChatbotResponse(input, childrenData);
      const botMessage = {
        role: "assistant" as const,
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error getting response:", error);
      toast({
        title: "Error",
        description: "Maaf, terjadi kesalahan. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex items-start space-x-2 max-w-[80%] ${
                  message.role === "user"
                    ? "flex-row-reverse space-x-reverse"
                    : "flex-row"
                }`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === "user"
                      ? "bg-emerald-600 text-white"
                      : "bg-teal-600 text-white"
                  }`}
                >
                  {message.role === "user" ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>
                <div
                  className={`rounded-2xl px-4 py-2 ${
                    message.role === "user"
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <p
                    className={`text-sm whitespace-pre-wrap text-left ${
                      message.role === "user" ? "text-right" : ""
                    }`}
                  >
                    {message.content}
                  </p>
                  <span
                    className={`text-xs mt-1 block ${
                      message.role === "user"
                        ? "text-emerald-100"
                        : "text-gray-500"
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2 max-w-[80%]">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="rounded-2xl px-4 py-2 bg-gray-100">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Quick Questions */}
      <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium text-gray-500">
            Pertanyaan yang sering diajukan:
          </p>
          <Button
            variant="ghost"
            size="sm"
            className={`text-xs text-gray-500 hover:text-gray-700 transition-transform duration-200 ${
              isQuickQuestionsExpanded ? "rotate-180" : ""
            }`}
            onClick={() =>
              setIsQuickQuestionsExpanded(!isQuickQuestionsExpanded)
            }
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isQuickQuestionsExpanded ? "max-h-40" : "max-h-0"
          }`}
        >
          <div className="flex flex-wrap gap-2 pb-2">
            {quickQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => {
                  setInput(question);
                  const event = new Event("submit");
                  handleSubmit(event);
                }}
                className="text-xs h-7 bg-white hover:bg-emerald-50 border-emerald-200 text-emerald-700 transition-colors"
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-4 border-t border-gray-200 bg-white"
      >
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ketik pertanyaan Anda..."
            className="flex-1 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatbotGizi;
