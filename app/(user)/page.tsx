import Banner from "@/components/user/sections/hero";
import Layanan from "@/components/user/sections/layanan";
import Agenda from "@/components/user/sections/agenda";
import Berita from "@/components/user/sections/berita";
import Gallery from "@/components/user/sections/galeri";
import CtaConsultation from "@/components/user/partials/cta-consultation";
import Sambutan from "@/components/user/sections/sambutan";

// services
import { getGallery } from "@/services/gallery/gallery-service";
import { getAgendas } from "@/services/agenda/agenda-service";
import { getBanners } from "@/services/banner/banner-service";

export default async function HomePage() {
    const galleryData = await getGallery(1, 5);
    const agendaData = await getAgendas(1, 100);
    const bannerData = await getBanners();

    return (
        <main>
            <Banner data={bannerData} />
            <Sambutan />
            <Layanan />
            <CtaConsultation />
            <Agenda data={agendaData.data} />
            <Gallery data={galleryData.data} />
            <Berita />
        </main>
    )
}