import { Metadata } from "next";
import { redirect } from "next/navigation";

import Hero from "@/components/user/sections/hero";
import Sambutan from "@/components/user/sections/sambutan";
import Pelayanan from "@/components/user/sections/pelayanan";
import Agenda from "@/components/user/sections/agenda";
import Galeri from "@/components/user/sections/galeri";
import Berita from "@/components/user/sections/berita";
import Faq from "@/components/user/sections/faq";

// services
import { getPublicBanners } from "@/services/banner/banner-service";
import { getPublicAgenda } from "@/services/agenda/agenda-service";
import { getPublicGallery } from "@/services/gallery/gallery-service";
import { getPublicBerita } from "@/services/page/page-service";
import { getPublicMenus, Menu } from "@/services/menu/menu-service";
import { getPublicConsultationList } from "@/services/consultation/consultation-service";
import { getTenantHeader } from "@/services/server-helpers";

export const metadata: Metadata = {
    title: "Puskesmas Kecamatan Sehat",
    description: "Sistem Informasi Manajemen Puskesmas Kecamatan Sehat - Melayani dengan Hati",
};

// Helper function to get pelayanan submenus
function getPelayananMenus(menus: Menu[]): Menu[] {
    // Find menu with slug "/pelayanan"
    const pelayananMenu = menus.find(m => m.slug === 'pelayanan' && m.status === 1);

    if (!pelayananMenu) return [];

    // Get children from the menu
    const children = pelayananMenu.children || [];

    // Filter active and sort by order, max 6
    return children
        .filter(m => m.status === 1)
        .sort((a, b) => a.order - b.order)
        .slice(0, 6);
}

export default async function Home() {
    // Get tenant slug from headers
    const headers = await getTenantHeader();

    // Ambil data banner, agenda, galeri, menu, dan faq secara paralel
    const [banners, agendas, galeri, berita, menus, faq] = await Promise.all([
        getPublicBanners(),
        getPublicAgenda(1, 3),
        getPublicGallery(1, 10),
        getPublicBerita(1, 6),
        getPublicMenus(),
        getPublicConsultationList(1, 20) // Fetch up to 20 for scrolling demo if needed
    ]);

    // Get pelayanan submenus (max 6)
    const pelayanan = getPelayananMenus(menus);

    return (
        <main className="min-h-screen">
            {/* Bagian Hero dengan Banner */}
            <Hero data={banners} />

            {/* Bagian Pelayanan dari Menu System */}
            <Pelayanan data={pelayanan} />

            {/* Bagian Sambutan Kepala Puskesmas */}
            <Sambutan />

            {/* Bagian Agenda Kegiatan */}
            <Agenda data={agendas.data} />

            {/* Bagian Galeri Foto */}
            <Galeri data={galeri.data} />

            {/* Bagian Berita */}
            <Berita data={berita} />

            {/* Bagian FAQ */}
            <Faq data={faq.data} />
        </main>
    );
}
