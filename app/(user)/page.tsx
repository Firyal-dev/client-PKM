import Banner from "@/components/user/sections/hero";
import Layanan from "@/components/user/sections/layanan";
import Agenda from "@/components/user/sections/agenda";
import Berita from "@/components/user/sections/berita";
import Gallery from "@/components/user/sections/gallery";

// services
import { getGallery } from "@/services/gallery/gallery-service";
import { getAgendas } from "@/services/agenda/agenda-service";

export default async function HomePage() {
    const galleryData = await getGallery(1, 5);
    const agendaData = await getAgendas(1, 100);

    return (
        <main>
            <Banner />
            <Layanan />
            <Agenda data={agendaData.data} />
            <Gallery data={galleryData.data} />
            <Berita />
        </main>
    )
}