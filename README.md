# Stunting Map Care Plan Frontend

## 🚀 Fitur Utama

- **Autentikasi**: Login, register, dan manajemen profil dengan validasi lengkap.
- **Dashboard**: Statistik stunting, notifikasi, dan visualisasi data.
- **Manajemen Desa**: Daftar dan detail desa, status stunting, filter & search.
- **Form Data Anak**: Input data anak, perhitungan Z-Score WHO, rekomendasi LLM.
- **Chatbot Gemini AI**: Tanya jawab seputar stunting & gizi anak.
- **Analisis LLM**: Penjelasan kesehatan anak otomatis setelah hitung Z-Score.
- **UI Modern**: Komponen Shadcn/UI, responsive, mobile-first.
- **Integrasi Supabase**: Data real-time, state management dengan React hooks.

---

## ⚡️ Cara Kerja Integrasi Backend

- **Supabase**:  
  Frontend **tidak menggunakan .env** untuk Supabase.  
  **URL dan anon key Supabase diambil dari backend** melalui endpoint:

  ```
  GET /api/supabase-keys
  ```

  > Pastikan backend berjalan dan endpoint ini tersedia.

- **Chatbot & LLM**:  
  Semua permintaan Chatbot dan LLM (analisis gizi) **dikirim ke backend**:
  - `/api/chatbot`
  - `/api/llm-analyze`

---

## 🛠️ Cara Menjalankan Project

### 1. **Jalankan Backend**

Pastikan backend FastAPI berjalan di `localhost:8000` (atau sesuaikan endpoint di frontend).

### 2. **Jalankan Frontend**

```sh
npm install
npm run dev
```

Frontend akan otomatis mengambil Supabase URL & anon key dari backend.

---

## 📝 Catatan Pengembangan

- **Jangan tambahkan .env untuk Supabase di frontend!**
- Jika ingin ganti Supabase project, cukup update endpoint backend `/api/supabase-keys`.
- Semua query ke Supabase, Chatbot, dan LLM dilakukan via backend.

---

## 📦 Struktur Folder Penting

- `src/integrations/supabase/client.ts`  
  Inisialisasi Supabase client **dengan key dari backend**.
- `src/lib/llm.ts`  
  Fungsi fetch ke endpoint LLM backend.
- `src/components/dashboard/ChatbotGizi.tsx`  
  Komponen Chatbot yang fetch ke backend.

---

## 👩‍💻 Kontribusi

- Pastikan perubahan pada integrasi Supabase/LLM/Chatbot selalu via backend.
- Jangan hardcode credential di frontend.

---

## 📄 PRD & Fitur Lain

- [x] Validasi data ketat, error handling, ARIA, TypeScript strict, dsb.
- [x] Real-time update, local storage, state management React hooks.

(Product Requirements Document) dalam sistem ini:

🔐 Authentication Components
LoginForm - Form login dengan validasi email/password, loading state, dan UI yang elegant
RegisterForm - Form registrasi pengguna baru dengan validasi lengkap

👤 Profile Management
ProfileView - Tampilan profil pengguna dengan kemampuan upload foto
ProfileEdit - Form edit profil dengan validasi data
📊 Dashboard Components

DashboardStats - Statistik utama dengan chart dan visualisasi data stunting
NotificationPanel - Panel notifikasi untuk alert dan pengumuman penting

🗺️ Village/Location Management
VillageList - Daftar desa dengan search, filter, dan status stunting
VillageDetail - Detail lengkap desa termasuk data demografi dan statistik

📝 Data Input Forms
ChildDataForm - Form input data anak dengan:
Validasi Z-Score WHO standar
Perhitungan status stunting otomatis
Pilihan dusun/wilayah Sulawesi Utara
Rekomendasi tindakan berdasarkan status menggunakan LLM

🧮 Utility Functions
whoZScore - Perhitungan Z-Score berdasarkan standar WHO untuk:
Height-for-Age (HAZ)
Weight-for-Age (WAZ)
Weight-for-Height (WHZ)
Klasifikasi status gizi dan stunting

🎨 UI Components (Shadcn/UI)
Semua komponen UI menggunakan standar Shadcn/UI yang konsisten:

Button, Card, Input, Select, Checkbox
Dialog, Sheet, Tabs, Calendar
Toast notifications, Avatar, Badge
Navigation, Sidebar, Command palette

🗂️ Navigation & Layout
Navigation - Menu navigasi utama dengan tab untuk setiap fitur
App Layout - Layout utama dengan header, navigation, dan content area

📱 Responsive Design
Mobile-first approach
Tablet dan desktop optimization
Touch-friendly interface

🔧 Features & Standards
Data Validation - Semua form menggunakan validasi yang ketat
Error Handling - Proper error states dan loading indicators
Accessibility - ARIA labels dan keyboard navigation
Performance - Lazy loading dan optimized rendering
Type Safety - Full TypeScript coverage dengan strict types

📊 Data Management
Local Storage - Penyimpanan data sementara di browser
State Management - React hooks untuk state management
Real-time Updates - UI yang responsive terhadap perubahan data
Semua komponen ini dibuat dengan standar PRD yang mencakup:
