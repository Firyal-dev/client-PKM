import { menu, social } from "@/types/menu-prop"
import { Facebook, Instagram, Youtube, Phone, Mail, MapPin } from "lucide-react"

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
        icon: Youtube,
        href: "#",
    },
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
    lat: -6.592787,
    lokasi: 'https://maps.app.goo.gl/6WzFoy45XsxEqRrp9'
}

export const kontak = [
    { label: "021-12345678", href: "tel:02112345678", icon: Phone },
    { label: "puskesmas@email.com", href: "mailto:puskesmas@email.com", icon: Mail },
    { label: "Jl. Kesehatan No. 123", href: "#", icon: MapPin },
]