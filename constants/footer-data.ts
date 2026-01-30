import { menu, social } from "@/types/menu-prop"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"

export const socialList: social[] = [
    {
        icon: Instagram,
        href: "#",
    },
    {
        icon: Facebook,
        href: "#",
    },
    {
        icon: Twitter,
        href: "#",
    },
    {
        icon: Linkedin,
        href: "#",
    }
]

export const layanan: menu[] = [
    {
        label: "Pelayanan Umum",
        href: "/pelayanan",
    },
    {
        label: "Jejaring PKM",
        href: "/jejaring-pkm",
    },
    {
        label: "Fasilitas Medis",
        href: "/fasilitas",
    }
]

export const informasi: menu[] = [
    {
        label: "Profil Puskesmas",
        href: "/profile",
    },
    {
        label: "Berita Terkini",
        href: "/berita",
    },
    {
        label: "Agenda Kegiatan",
        href: "/kegiatan",
    },
    {
        label: "Unduh Dokumen",
        href: "/dokumen",
    }
]

export const lokasi = {
    nama: 'Puskesmas Bogor Tengah',
    jam: '07.30 - 14.00',
    gambar: 'https://lh3.googleusercontent.com/gps-cs-s/AHVAweqXexZ5LWQXa4LJvJ9xfR_sLgRXAU8cQIrq2iFVTvc-twqsANtOlSY2Tmm0HGHjFkzJaMion7YXDiablhUmNuxwQqD2h5-FNcI1wOmF222Z7QyIG5RiY1wIC-XgNBe_E_w_PAKGJQ=w408-h544-k-no',
    lng: 106.794493,
    lat: -6.592787
}