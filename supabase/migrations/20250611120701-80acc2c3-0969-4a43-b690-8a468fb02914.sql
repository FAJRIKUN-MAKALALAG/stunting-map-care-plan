
-- Create profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nama TEXT NOT NULL,
  email TEXT NOT NULL,
  nip TEXT,
  telefon TEXT,
  puskesmas TEXT,
  wilayah_kerja TEXT,
  spesialisasi TEXT DEFAULT 'Dokter Umum',
  avatar_url TEXT,
  role TEXT DEFAULT 'doctor' CHECK (role IN ('doctor', 'parent')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create children table for storing child data
CREATE TABLE public.children (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nama TEXT NOT NULL,
  nik TEXT,
  tanggal_lahir DATE NOT NULL,
  jenis_kelamin TEXT NOT NULL CHECK (jenis_kelamin IN ('male', 'female')),
  nama_ibu TEXT,
  alamat TEXT,
  dusun TEXT,
  berat_badan DECIMAL(5,2) NOT NULL,
  tinggi_badan DECIMAL(5,2) NOT NULL,
  lingkar_kepala DECIMAL(5,2),
  catatan TEXT,
  z_score_haz DECIMAL(5,2),
  z_score_waz DECIMAL(5,2),
  z_score_whz DECIMAL(5,2),
  status_gizi TEXT,
  is_stunted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success', 'error')),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles RLS policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Children RLS policies
CREATE POLICY "Users can view own children data" ON public.children
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create children data" ON public.children
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own children data" ON public.children
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own children data" ON public.children
  FOR DELETE USING (auth.uid() = user_id);

-- Notifications RLS policies
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nama, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nama', NEW.email),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'doctor')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_children_updated_at
  BEFORE UPDATE ON public.children
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
