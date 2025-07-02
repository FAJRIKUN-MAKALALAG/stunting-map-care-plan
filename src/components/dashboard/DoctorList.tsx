import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Stethoscope,
  Building,
  Loader2,
  AlertTriangle,
  MessageCircle,
} from "lucide-react";
import { getSupabaseClient } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ChatRoom from "./ChatRoom";
import { useAuth } from "@/hooks/useAuth";

interface Doctor {
  id: string;
  nama: string;
  email: string;
  telefon: string | null;
  puskesmas: string | null;
  wilayah_kerja: string | null;
  spesialisasi: string | null;
  avatar_url: string | null;
  is_online?: boolean;
}

const DoctorList = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [openChat, setOpenChat] = useState(false);
  const [chatDoctor, setChatDoctor] = useState<Doctor | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchDoctors();
    let channel: any;
    let msgChannel: any;
    (async () => {
      const supabase = await getSupabaseClient();
      // Realtime update status online
      channel = supabase
        .channel("doctorlist-profiles")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "profiles",
          },
          (payload: any) => {
            const updated = payload.new;
            setDoctors((prev) =>
              prev.map((doc) =>
                doc.id === updated.id
                  ? { ...doc, is_online: updated.is_online }
                  : doc
              )
            );
          }
        )
        .subscribe();
      // Realtime notifikasi pesan baru
      msgChannel = supabase
        .channel("doctorlist-messages")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
          },
          (payload: any) => {
            const msg = payload.new;
            // Jika pesan untuk user login, dan chatroom dengan pengirim tidak sedang dibuka
            if (
              user?.id &&
              msg.receiver_id === user.id &&
              (!openChat || (chatDoctor && chatDoctor.id !== msg.sender_id))
            ) {
              // Cari nama pengirim
              const pengirim = doctors.find((d) => d.id === msg.sender_id);
              toast({
                title: `Pesan baru dari ${pengirim ? pengirim.nama : "Dokter"}`,
                description: msg.message,
                variant: "default",
              });
            }
          }
        )
        .subscribe();
    })();
    return () => {
      if (channel) channel.unsubscribe();
      if (msgChannel) msgChannel.unsubscribe();
    };
  }, [user?.id]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError(null);

      const supabase = await getSupabaseClient();
      const { data, error } = await supabase
        .from("profiles")
        .select(
          "id, nama, email, telefon, puskesmas, wilayah_kerja, spesialisasi, avatar_url, is_online"
        )
        .eq("role", "doctor")
        .order("nama", { ascending: true });

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        setDoctors([]);
        return;
      }

      setDoctors(data);
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setError("Gagal memuat data dokter");
      toast({
        title: "Error",
        description: "Gagal memuat data dokter. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          <p className="text-gray-600">Memuat data dokter...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center space-y-4">
          <AlertTriangle className="h-8 w-8 text-red-600" />
          <p className="text-gray-600">{error}</p>
          <Button variant="outline" onClick={fetchDoctors} className="mt-2">
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-gray-600">Belum ada data dokter yang tersedia</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <Card
            key={doctor.id}
            className="hover:shadow-lg transition-shadow duration-200"
          >
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100">
                  {doctor.avatar_url ? (
                    <img
                      src={doctor.avatar_url}
                      alt={doctor.nama}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-emerald-100 text-emerald-600">
                      <User className="h-8 w-8" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {doctor.nama}
                  </h3>
                  <div className="mt-2 flex items-center space-x-2">
                    <Badge
                      variant="secondary"
                      className="bg-emerald-100 text-emerald-800"
                    >
                      {doctor.puskesmas || "Puskesmas"}
                    </Badge>
                    <span className="text-sm text-gray-500 ml-2">
                      {doctor.spesialisasi || "Dokter Umum"}
                    </span>
                    <button
                      onClick={() => {
                        setChatDoctor(doctor);
                        setOpenChat(true);
                      }}
                      className="ml-2 p-1 rounded hover:bg-emerald-100 border border-emerald-200"
                      title="Chat dengan dokter"
                    >
                      <MessageCircle className="h-5 w-5 text-emerald-600" />
                    </button>
                  </div>
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full mt-4 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                    onClick={() => setSelectedDoctor(doctor)}
                  >
                    Lihat Detail
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-emerald-600" />
                      <span>Detail Dokter</span>
                    </DialogTitle>
                    <DialogDescription>
                      Informasi lengkap tentang dokter yang dapat dihubungi
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <span className="text-sm">{doctor.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <span className="text-sm">{doctor.telefon || "-"}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Building className="h-5 w-5 text-gray-400" />
                      <span className="text-sm">{doctor.puskesmas || "-"}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <span className="text-sm">
                        {doctor.wilayah_kerja || "-"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Stethoscope className="h-5 w-5 text-gray-400" />
                      <span className="text-sm">
                        {doctor.spesialisasi || "Dokter Umum"}
                      </span>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>
      {openChat && chatDoctor && (
        <ChatRoom doctor={chatDoctor} onClose={() => setOpenChat(false)} />
      )}
    </div>
  );
};

export default DoctorList;
