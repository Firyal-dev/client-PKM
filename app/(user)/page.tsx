import { Metadata } from "next";

import Hero from "@/components/user/sections/hero";
import Sambutan from "@/components/user/sections/sambutan";
import Pelayanan from "@/components/user/sections/pelayanan";
import Agenda from "@/components/user/sections/agenda";
import Galeri from "@/components/user/sections/galeri";
import Berita from "@/components/user/sections/berita";

// services
import { getPublicBanners } from "@/services/banner/banner-service";
import { getPublicAgenda } from "@/services/agenda/agenda-service";
import { getPublicGallery } from "@/services/gallery/gallery-service";
import { getPublicBerita, getPublicPelayanan } from "@/services/page/page-service";

export const metadata: Metadata = {
    title: "Puskesmas Kecamatan Sehat",
    description: "Sistem Informasi Manajemen Puskesmas Kecamatan Sehat - Melayani dengan Hati",
};

export default async function Home() {
    // Ambil data banner, agenda, galeri, dan pelayanan secara paralel
    const [banners, agendas, galeri, pelayanan, berita] = await Promise.all([
        getPublicBanners(),
        getPublicAgenda(1, 3),
        getPublicGallery(1, 10),
        getPublicPelayanan(),
        getPublicBerita(1, 6)
    ]);

    return (
        <main className="min-h-screen">
            {/* Bagian Hero dengan Banner */}
            <Hero data={banners} />

            {/* Bagian Sambutan Kepala Puskesmas */}
            <Sambutan />


            {/* Bagian Agenda Kegiatan */}
            <Agenda data={agendas.data} />

            {/* Bagian Galeri Foto */}
            <Galeri data={galeri.data} />

            {/* Bagian Pelayanan Dinamis (Hanya kategori Pelayanan) */}
            <Pelayanan data={pelayanan} />
            
            {/* Bagian Berita */}
            <Berita data={berita} />
        </main>
    );
}
