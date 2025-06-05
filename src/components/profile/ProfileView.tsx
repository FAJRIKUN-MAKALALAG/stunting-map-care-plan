
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Phone, MapPin, Camera, Edit, Save, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ProfileViewProps {
  user: any;
  onUpdateProfile: (updatedUser: any) => void;
  onClose: () => void;
}

const ProfileView = ({ user, onUpdateProfile, onClose }: ProfileViewProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(user);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setAvatarPreview(result);
        setProfileData(prev => ({ ...prev, avatar: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onUpdateProfile(profileData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setProfileData(user);
    setAvatarPreview(user?.avatar || '');
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
              <User className="h-6 w-6" />
              <span>Profile Dokter</span>
            </CardTitle>
            <Button
              variant="outline"
              onClick={onClose}
              className="flex items-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Tutup</span>
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Avatar Section */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <Avatar className="w-32 h-32">
                <AvatarImage src={avatarPreview} />
                <AvatarFallback className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-2xl">
                  {getInitials(profileData.nama)}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-3 shadow-lg transition-colors cursor-pointer">
                  <Camera className="h-5 w-5" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {isEditing ? (
            /* Edit Mode */
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nama" className="text-sm font-medium text-gray-700">
                    Nama Lengkap
                  </Label>
                  <Input
                    id="nama"
                    type="text"
                    value={profileData.nama}
                    onChange={(e) => handleInputChange('nama', e.target.value)}
                    className="h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nip" className="text-sm font-medium text-gray-700">
                    NIP
                  </Label>
                  <Input
                    id="nip"
                    type="text"
                    value={profileData.nip}
                    onChange={(e) => handleInputChange('nip', e.target.value)}
                    className="h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefon" className="text-sm font-medium text-gray-700">
                    Nomor Telepon
                  </Label>
                  <Input
                    id="telefon"
                    type="tel"
                    value={profileData.telefon}
                    onChange={(e) => handleInputChange('telefon', e.target.value)}
                    className="h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="puskesmas" className="text-sm font-medium text-gray-700">
                    Puskesmas
                  </Label>
                  <Input
                    id="puskesmas"
                    type="text"
                    value={profileData.puskesmas}
                    onChange={(e) => handleInputChange('puskesmas', e.target.value)}
                    className="h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="spesialisasi" className="text-sm font-medium text-gray-700">
                    Spesialisasi
                  </Label>
                  <Input
                    id="spesialisasi"
                    type="text"
                    value={profileData.spesialisasi}
                    onChange={(e) => handleInputChange('spesialisasi', e.target.value)}
                    className="h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="wilayahKerja" className="text-sm font-medium text-gray-700">
                  Wilayah Kerja
                </Label>
                <Input
                  id="wilayahKerja"
                  type="text"
                  value={profileData.wilayahKerja}
                  onChange={(e) => handleInputChange('wilayahKerja', e.target.value)}
                  className="h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <Button
                  onClick={handleSave}
                  className="flex-1 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium rounded-lg"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Simpan Perubahan
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1 h-12 border-gray-300 hover:bg-gray-50 font-medium rounded-lg"
                >
                  <X className="h-4 w-4 mr-2" />
                  Batal
                </Button>
              </div>
            </div>
          ) : (
            /* View Mode */
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <User className="h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="text-sm text-gray-600">Nama Lengkap</p>
                      <p className="font-medium text-gray-800">{profileData.nama}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Mail className="h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-800">{profileData.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Phone className="h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="text-sm text-gray-600">Nomor Telepon</p>
                      <p className="font-medium text-gray-800">{profileData.telefon}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <User className="h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="text-sm text-gray-600">NIP</p>
                      <p className="font-medium text-gray-800">{profileData.nip}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <MapPin className="h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="text-sm text-gray-600">Puskesmas</p>
                      <p className="font-medium text-gray-800">{profileData.puskesmas}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <User className="h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="text-sm text-gray-600">Spesialisasi</p>
                      <p className="font-medium text-gray-800">{profileData.spesialisasi}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <MapPin className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="text-sm text-gray-600">Wilayah Kerja</p>
                  <p className="font-medium text-gray-800">{profileData.wilayahKerja}</p>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  onClick={() => setIsEditing(true)}
                  className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium rounded-lg"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileView;
