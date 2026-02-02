import Banner from "@/components/user/sections/hero";
import Layanan from "@/components/user/sections/layanan";
import Agenda from "@/components/user/sections/agenda";
import Berita from "@/components/user/sections/berita";
import Gallery from "@/components/user/sections/gallery";
import { Suspense } from "react";

export default function HomePage() {
    return (
        <main>
            <Banner />
            <Layanan />
            <Suspense fallback={null}>
                <Gallery />
            </Suspense>
            <Agenda />
            <Berita />
        </main>
    )
}