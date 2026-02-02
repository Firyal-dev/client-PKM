"use client"

import * as React from "react"
import Image from "next/image"
import Autoplay from "embla-carousel-autoplay"
import { Search } from "lucide-react"

// Import Shadcn Components
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/ui/carousel"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const slides = [
    {
        title: "Pelayanan Kesehatan Terpercaya",
        desc: "Kami hadir dengan fasilitas modern dan tenaga medis profesional.",
        image: "/authBg.jpg",
    },
    {
        title: "Layanan BPJS dan Umum",
        desc: "Kemudahan akses kesehatan bagi seluruh lapisan masyarakat.",
        image: "/authBg.jpg",
    },
    {
        title: "Siaga Kesehatan Masyarakat",
        desc: "Pelayanan darurat 24 jam siap membantu Anda kapan saja.",
        image: "/authBg.jpg",
    },
]

export default function Banner() {
    const [api, setApi] = React.useState<CarouselApi>()

    return (
        <section className="relative w-full">
            {/* CAROUSEL SECTION */}
            <div className="relative overflow-hidden [clip-path:inset(0_0_0_0)] md:[clip-path:ellipse(150%_100%_at_50%_0%)]">
                <Carousel
                    opts={{ loop: true }}
                    plugins={[
                        Autoplay({
                            delay: 5000,
                            stopOnInteraction: false,
                        }),
                    ]}
                    setApi={setApi}
                    className="w-full"
                >
                    <CarouselContent>
                        {slides.map((item, index) => (
                            <CarouselItem key={index}>
                                <div className="relative h-[60vh] md:h-[80vh] min-h-[400px] w-full">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        priority={index === 0}
                                        className="object-cover"
                                    />
                                    {/* Overlay Gradasi */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent" />

                                    {/* Content inside Slide */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 mb-12">
                                        <h1 className="text-white text-3xl md:text-5xl font-bold max-w-3xl mb-4 drop-shadow-lg">
                                            {item.title}
                                        </h1>
                                        <p className="text-slate-200 text-sm md:text-lg max-w-xl drop-shadow-md">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>

            <div className="absolute left-1/2 -translate-x-1/2 w-full -bottom-8 lg:bottom-17 px-4 z-20">
                <div className="max-w-4xl mx-auto bg-white p-2 rounded-2xl shadow-2xl border border-slate-100">
                    <div className="flex flex-col md:flex-row items-center gap-2">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <Input
                                type="text"
                                placeholder="Cari layanan, poli, atau info kesehatan..."
                                className="w-full h-12 md:h-14 pl-12 border-none bg-transparent text-base focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                        </div>
                        <Button
                            size="lg"
                            className="w-full md:w-auto h-12 md:h-14 px-10 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition-all"
                        >
                            Cari
                        </Button>
                    </div>
                </div>
            </div>

            <div className="h-16 md:h-24" />
        </section>
    )
}