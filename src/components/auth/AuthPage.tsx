
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Heart, Stethoscope, Baby, Shield } from 'lucide-react';

const AuthPage = () => {
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    nama: '',
    role: 'doctor' as 'doctor' | 'parent',
    nip: '',
    telefon: '',
    puskesmas: '',
    wilayah_kerja: '',
    spesialisasi: 'Dokter Umum'
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn(loginData.email, loginData.password);
    
    if (error) {
      toast({
        title: "Error Login",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Login Berhasil",
        description: "Selamat datang di sistem!"
      });
    }
    
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signUp(registerData.email, registerData.password, {
      nama: registerData.nama,
      role: registerData.role,
      nip: registerData.nip || undefined,
      telefon: registerData.telefon || undefined,
      puskesmas: registerData.puskesmas || undefined,
      wilayah_kerja: registerData.wilayah_kerja || undefined,
      spesialisasi: registerData.spesialisasi
    });

    if (error) {
      toast({
        title: "Error Registrasi",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Registrasi Berhasil",
        description: "Silakan check email untuk verifikasi akun"
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-teal-100">
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-lg bg-white/95 backdrop-blur-xl border-0 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-emerald-700">
              Sistem Stunting Care
            </CardTitle>
            <p className="text-gray-600">Kabupaten Minahasa Utara</p>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="login" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Daftar</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="email@example.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Masukkan password"
                        value={loginData.password}
                        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    disabled={loading}
                  >
                    {loading ? "Memproses..." : "Login"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nama">Nama Lengkap</Label>
                    <Input
                      id="nama"
                      placeholder="Nama lengkap"
                      value={registerData.nama}
                      onChange={(e) => setRegisterData({...registerData, nama: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={registerData.role} onValueChange={(value: 'doctor' | 'parent') => setRegisterData({...registerData, role: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="doctor">Tenaga Kesehatan</SelectItem>
                        <SelectItem value="parent">Orang Tua</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="email@example.com"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="Minimal 6 karakter"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                      required
                      minLength={6}
                    />
                  </div>

                  {registerData.role === 'doctor' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="nip">NIP (Opsional)</Label>
                        <Input
                          id="nip"
                          placeholder="Nomor Induk Pegawai"
                          value={registerData.nip}
                          onChange={(e) => setRegisterData({...registerData, nip: e.target.value})}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="puskesmas">Puskesmas</Label>
                        <Input
                          id="puskesmas"
                          placeholder="Nama Puskesmas"
                          value={registerData.puskesmas}
                          onChange={(e) => setRegisterData({...registerData, puskesmas: e.target.value})}
                        />
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="telefon">No. Telepon</Label>
                    <Input
                      id="telefon"
                      placeholder="Nomor telepon"
                      value={registerData.telefon}
                      onChange={(e) => setRegisterData({...registerData, telefon: e.target.value})}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    disabled={loading}
                  >
                    {loading ? "Memproses..." : "Daftar"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
