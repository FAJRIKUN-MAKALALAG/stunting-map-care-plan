# Stunting Map Care Plan Frontend

## 🚀 Fitur Utama

- **Autentikasi**: Login, register, dan manajemen profil dengan validasi lengkap.
- **Dashboard**: Statistik stunting, notifikasi, dan visualisasi data.
- **Manajemen Desa**: Daftar dan detail desa, status stunting, filter & search.
- **Form Data Anak**: Input data anak, perhitungan Z-Score WHO, rekomendasi LLM.
- **Chat Real-Time Tenaga Kesehatan**: Fitur chat antar tenaga kesehatan untuk konsultasi dan kolaborasi (hanya untuk user tenaga kesehatan).
- **Chatbot Gemini AI (Parent Only)**: Orang tua dapat tanya jawab seputar stunting & gizi anak melalui chatbot di parent dashboard.
- **Analisis LLM**: Penjelasan kesehatan anak otomatis setelah hitung Z-Score.
- **UI Modern**: Komponen Shadcn/UI, responsive, mobile-first.
- **Integrasi Supabase**: Data real-time, state management dengan React hooks.

## 📋 Functional Requirements

- Pengguna dapat melakukan registrasi dan login sebagai tenaga kesehatan atau orang tua.
- Pengguna dapat mengelola profil (lihat, edit, upload foto).
- Tenaga kesehatan dapat menambah, mengedit, dan melihat data anak.
- Sistem menghitung Z-Score dan status gizi anak secara otomatis saat input data anak.
- Pengguna dapat melihat dashboard statistik stunting dan notifikasi.
- Pengguna dapat mengakses daftar desa, detail desa, dan status stunting per wilayah.
- **Tenaga kesehatan dapat melakukan chat/berkirim pesan dengan tenaga kesehatan lain secara real-time (fitur chat hanya untuk user tenaga kesehatan).**
- **Orang tua (parent) dapat menggunakan chatbot AI untuk konsultasi gizi dan stunting di parent dashboard.**
- Sistem memberikan rekomendasi berbasis LLM setelah input data anak.
- Notifikasi otomatis muncul jika ada anak dengan status gizi/stunting berisiko.
- Semua data disimpan dan diambil secara real-time dari Supabase melalui backend.
- Pengguna dapat melakukan logout dengan aman.

## 📋 Non-Functional Requirements

- Sistem harus responsif dan dapat diakses di perangkat mobile, tablet, dan desktop.
- UI harus konsisten, modern, dan mudah digunakan (menggunakan Shadcn/UI).
- Semua data sensitif (Supabase key, dsb) tidak boleh di-hardcode di frontend.
- Sistem harus memiliki validasi data yang ketat dan error handling yang jelas.
- Sistem harus mendukung testing unit (Jest + RTL) dan E2E (Cypress).
- Aplikasi harus memiliki performa baik (lazy loading, optimized rendering).
- Sistem harus mendukung accessibility (ARIA, keyboard navigation).
- Semua komunikasi API harus melalui backend (tidak langsung ke Supabase/LLM dari frontend).
- Kode harus menggunakan TypeScript dengan strict type checking.
- Dokumentasi pengembangan dan setup harus jelas di README.

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

## 🛠️ Cara Menjalankan Project (Local Development)

### 1. **Jalankan Backend**

Pastikan backend FastAPI berjalan di `localhost:8000` (atau sesuaikan endpoint di frontend jika perlu).

### 2. **Jalankan Frontend**

```sh
npm install
npm run dev
```

Frontend akan berjalan di `http://localhost:8080` (default Vite).  
Frontend akan otomatis mengambil Supabase URL & anon key dari backend.

---

## 🧪 Testing (Unit & E2E)

### **Unit Test (React Testing Library + Jest)**

```sh
npm test
# atau
npx jest
```

- Test akan berjalan untuk komponen penting seperti LoginForm, ChildDataForm, dsb.
- Pastikan sudah install dev dependencies: `npm install --save-dev ts-jest @types/jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom`

### **E2E Test (Cypress)**

1. **Pastikan frontend (`npm run dev`) dan backend sudah berjalan.**
2. Jalankan Cypress:
   ```sh
   npx cypress open
   # atau headless
   npx cypress run
   ```
3. Pilih dan jalankan file E2E di `cypress/e2e/` (misal: `nakes_integration.cy.js`).
4. Pastikan baseUrl di `cypress.config.cjs` sesuai dengan port frontend (`http://localhost:8080`).

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
- `src/components/dashboard/ChatRoom.tsx`  
  Komponen chat real-time antar tenaga kesehatan.
- `src/components/dashboard/ChatbotGizi.tsx`  
  Komponen chatbot AI untuk parent di parent dashboard.
- `cypress/e2e/`  
  Semua file E2E test Cypress.
- `src/components/auth/__tests__/` dan `src/components/forms/__tests__/`  
  Unit test komponen penting (Jest + RTL).

---

## 👩‍💻 Kontribusi

- Pastikan perubahan pada integrasi Supabase/LLM/Chatbot selalu via backend.
- Jangan hardcode credential di frontend.
- Tambahkan unit test untuk komponen baru jika perlu.
- Tambahkan E2E test untuk alur utama aplikasi.

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
