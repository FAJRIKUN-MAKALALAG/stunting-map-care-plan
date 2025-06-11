
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Eye,
  EyeOff,
  User,
  Lock,
  Heart,
  Baby,
  Shield,
} from "lucide-react";

interface ParentLoginFormProps {
  onLogin: (email: string, password: string, role: 'parent') => void;
  onSwitchToDoctor: () => void;
}

const ParentLoginForm = ({ onLogin, onSwitchToDoctor }: ParentLoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    onLogin(email, password, 'parent');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-indigo-200/40 rounded-full blur-2xl"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-blue-300/25 rounded-full blur-2xl"></div>
      </div>

      <div className="relative flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md bg-white/95 backdrop-blur-xl border-0 shadow-2xl shadow-blue-500/10">
          <CardHeader className="text-center pb-8 pt-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
              <div className="relative">
                <Baby className="h-10 w-10 text-white" />
                <Heart className="h-6 w-6 text-white/80 absolute -bottom-1 -right-1" />
              </div>
            </div>

            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Portal Orang Tua
            </CardTitle>
            <p className="text-gray-600 mt-3 text-lg">
              Pantau Tumbuh Kembang Anak Anda
            </p>
            <div className="flex items-center justify-center space-x-2 mt-2">
              <Shield className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-700 font-medium">
                Kabupaten Minahasa Utara
              </span>
            </div>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                  Email Address
                </Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="orangtua@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-14 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl text-base transition-all duration-300 bg-white/70 backdrop-blur-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 pr-12 h-14 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl text-base transition-all duration-300 bg-white/70 backdrop-blur-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-500 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transform hover:scale-[1.02]"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-lg">Memproses...</span>
                    </div>
                  ) : (
                    <span className="text-lg">Masuk Portal Orang Tua</span>
                  )}
                </Button>
              </div>

              <div className="text-center pt-4">
                <p className="text-gray-600">
                  Tenaga kesehatan?{" "}
                  <button
                    type="button"
                    onClick={onSwitchToDoctor}
                    className="text-blue-600 hover:text-blue-700 font-semibold transition-colors hover:underline"
                  >
                    Login sebagai dokter
                  </button>
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mt-6">
                <p className="text-blue-800 text-sm text-center">
                  <strong>Portal Khusus:</strong> Untuk memantau pertumbuhan dan mendapatkan konsultasi gizi anak
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ParentLoginForm;
