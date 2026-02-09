import { ClipboardList, UserCheck, Stethoscope, Pill } from "lucide-react"

export const steps = [
    {
        icon: ClipboardList,
        title: "Ambil Antrean",
        desc: "Datang ke loket pendaftaran dan ambil nomor antrean sesuai layanan yang dituju."
    },
    {
        icon: UserCheck,
        title: "Pendaftaran",
        desc: "Serahkan berkas (KTP/BPJS) ke petugas loket saat nomor antrean dipanggil."
    },
    {
        icon: Stethoscope,
        title: "Pemeriksaan",
        desc: "Tunggu di depan poli tujuan untuk pemeriksaan oleh dokter atau perawat."
    },
    {
        icon: Pill,
        title: "Farmasi/Selesai",
        desc: "Ambil obat di bagian farmasi jika ada resep, lalu diperbolehkan pulang."
    }
]