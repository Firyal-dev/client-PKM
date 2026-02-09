import Hero from "@/components/user/sections/hero";
import Layanan from "@/components/user/sections/layanan";
import Agenda from "@/components/user/sections/agenda";
import Berita from "@/components/user/sections/berita";
import Gallery from "@/components/user/sections/galeri";
import Sambutan from "@/components/user/sections/sambutan";
import AlurLayanan from "@/components/user/sections/alur-layanan";
import CtaConsultation from "@/components/user/partials/cta-consultation";

// services
import { getGallery } from "@/services/gallery/gallery-service";
import { getAgendas } from "@/services/agenda/agenda-service";
import { getBannersPublic } from "@/services/banner/banner-service";

export default async function HomePage() {
    const galleryData = await getGallery(1, 5);
    const agendaData = await getAgendas(1, 100);
    const bannerData = await getBannersPublic();

    return (
        <main className="flex flex-col">
            <Hero data={bannerData} />
            <Layanan />
            <AlurLayanan />
            <CtaConsultation />
            <Agenda data={agendaData.data} />
            <Berita />
            <Gallery data={galleryData.data} />
            <Sambutan />
        </main>

    )
}