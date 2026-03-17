# PKM Client - Frontend 🚀

Selamat datang di repositori frontend **PKM**. Proyek ini dibangun menggunakan **Next.js** dengan fokus pada performa, aksesibilitas, dan desain modern menggunakan **Tailwind CSS**.

## ✨ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **State Management:** React Hooks & Context API
- **Data Fetching:** Fetch API with custom services
- **Forms:** standard React forms with validation

## 🛠️ Persiapan Awal (Setup)

Ikuti langkah-langkah di bawah ini untuk menjalankan proyek di lokal:

### 1. Prasyarat (Prerequisites)
Pastikan Anda sudah menginstal:
- [Node.js](https://nodejs.org/) (Versi LTS direkomendasikan)
- npm atau yarn

### 2. Instalasi Dependensi
Masuk ke direktori `client` dan jalankan:
```bash
npm install
```

### 3. Konfigurasi Environment (Lingkungan)
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Lalu lengkapi variabel berikut:
- `NEXT_PUBLIC_API_URL`: URL API Server (contoh: `http://localhost:3000`)
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`: Site key dari [Google ReCAPTCHA Admin Console](https://www.google.com/recaptcha/admin/). Digunakan untuk validasi keamanan pada halaman **Login Admin**.

> [!IMPORTANT]
> Tanpa ReCAPTCHA Site Key, fitur login admin mungkin tidak akan berfungsi sebagaimana mestinya.

### 4. Menjalankan Server Pengembangan
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## 📜 Skrip yang Tersedia

- `npm run dev`: Menjalankan aplikasi dalam mode pengembangan.
- `npm run build`: Membangun aplikasi untuk produksi.
- `npm run start`: Menjalankan aplikasi hasil build produksi.
- `npm run lint`: Menjalankan pengecekan ESLint.

## 📁 Struktur Folder Utama

- `/app`: Rute aplikasi (App Router), halaman, dan layout.
- `/components`: Komponen UI yang dapat digunakan kembali.
- `/hooks`: Custom React hooks.
- `/lib`: Utilitas dan konfigurasi library pihak ketiga.
- `/public`: Aset statis (gambar, font, dll).
- `/services`: Logika pemanggilan data ke API.
- `/types`: Definisi tipe TypeScript.

---

Dibuat dengan ❤️ untuk PKM.
