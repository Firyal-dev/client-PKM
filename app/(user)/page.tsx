import { Metadata } from "next";

import Hero from "@/components/user/sections/hero";
import Sambutan from "@/components/user/sections/sambutan";
import Layanan from "@/components/user/sections/layanan";
import Agenda from "@/components/user/sections/agenda";
import Galeri from "@/components/user/sections/galeri";
import Berita from "@/components/user/sections/berita";

// services
import { getPublicBanners } from "@/services/banner/banner-service";
import { getPublicAgenda } from "@/services/agenda/agenda-service";
import { getPublicGallery } from "@/services/gallery/gallery-service";
import { getPublicNews } from "@/services/news/news-service";

export const metadata: Metadata = {
    title: "Puskesmas",
    description: "Sistem Informasi Manajemen Puskesmas",
};

export default async function Home() {
    const banners = await getPublicBanners();
    const agendas = await getPublicAgenda(1, 3);
    const galeri = await getPublicGallery(1, 10);
    const berita = await getPublicNews(1, 3);

    return (
        <main className="min-h-screen">
            <Hero data={banners} />
            <Sambutan />
            <Layanan />
            <Agenda data={agendas.data} />
            <Galeri data={galeri.data} />
            <Berita data={berita.data} />
        </main>
    );
}
