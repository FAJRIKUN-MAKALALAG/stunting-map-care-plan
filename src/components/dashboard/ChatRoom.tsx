import React, { useEffect, useRef, useState } from "react";
import { getSupabaseClient } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface ChatRoomProps {
  doctor: {
    nama: string;
    email: string;
    id: string;
    avatar_url?: string | null;
    is_online: boolean;
  };
  onClose: () => void;
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ doctor, onClose }) => {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isOnline = !!doctor.is_online;

  // Fetch messages once
  const fetchMessages = async () => {
    if (!user || !doctor.id) return;
    setLoading(true);
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from("messages")
      .select("id, sender_id, receiver_id, message, created_at")
      .or(
        `and(sender_id.eq.${user.id},receiver_id.eq.${doctor.id}),and(sender_id.eq.${doctor.id},receiver_id.eq.${user.id})`
      )
      .order("created_at", { ascending: true });
    if (!error && data) setMessages(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
    // Realtime subscription
    let channel: any;
    (async () => {
      const supabase = await getSupabaseClient();
      channel = supabase
        .channel("chatroom")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
          },
          (payload: any) => {
            const msg = payload.new;
            // Hanya tambahkan pesan yang relevan untuk chat ini
            if (
              (msg.sender_id === user?.id && msg.receiver_id === doctor.id) ||
              (msg.sender_id === doctor.id && msg.receiver_id === user?.id)
            ) {
              setMessages((prev) => [...prev, msg]);
            }
          }
        )
        .subscribe();
    })();
    return () => {
      if (channel) channel.unsubscribe();
    };
    // eslint-disable-next-line
  }, [doctor.id, user?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const sendMessage = async () => {
    if (!input.trim() || !user || !doctor.id) return;
    setInput("");
    const supabase = await getSupabaseClient();
    await supabase.from("messages").insert({
      sender_id: user.id,
      receiver_id: doctor.id,
      message: input.trim(),
    });
    // Tidak perlu fetchMessages lagi, pesan akan masuk via realtime
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-2xl w-[90vw] max-w-5xl h-[80vh] p-0 flex flex-col border border-emerald-100 relative overflow-hidden">
        {/* Header Chat */}
        <div className="flex items-center gap-4 px-8 py-4 border-b bg-emerald-50 relative">
          {/* Foto profil */}
          {doctor.avatar_url ? (
            <img
              src={doctor.avatar_url}
              alt={doctor.nama}
              className="w-14 h-14 rounded-full object-cover border-2 border-emerald-200 shadow"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-emerald-200 flex items-center justify-center text-2xl font-bold text-white border-2 border-emerald-300 shadow">
              {getInitials(doctor.nama)}
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-semibold text-lg text-emerald-900">
              {doctor.nama}
            </span>
            <span className="text-sm text-gray-500">{doctor.email}</span>
            <span
              className={`text-xs font-medium mt-1 ${
                isOnline ? "text-emerald-600" : "text-gray-400"
              }`}
            >
              <span
                className={`inline-block w-2 h-2 rounded-full mr-1 align-middle ${
                  isOnline ? "bg-emerald-500" : "bg-gray-400"
                }`}
              ></span>
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-6 text-gray-400 hover:text-gray-700 text-2xl"
            title="Tutup Chat"
          >
            ✕
          </button>
        </div>
        {/* Area chat dengan bubble */}
        <div className="flex-1 overflow-y-auto px-8 py-6 bg-gray-50 flex flex-col gap-3">
          {loading && (
            <div className="text-center text-gray-400">Memuat pesan...</div>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`max-w-[60%] px-4 py-2 rounded-2xl text-sm shadow
                ${
                  msg.sender_id === user?.id
                    ? "self-end bg-emerald-500 text-white rounded-br-md"
                    : "self-start bg-white border border-emerald-100 text-gray-800 rounded-bl-md"
                }
              `}
            >
              {msg.message}
              <div className="text-[10px] text-right mt-1 opacity-60">
                {new Date(msg.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        {/* Input chat sticky di bawah */}
        <form
          className="px-8 py-4 border-t bg-white flex gap-2 sticky bottom-0"
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <input
            type="text"
            className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            placeholder="Ketik pesan..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
          />
          <button
            className="bg-emerald-600 text-white rounded px-6 py-2 disabled:opacity-50"
            type="submit"
            disabled={!input.trim()}
          >
            Kirim
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;
