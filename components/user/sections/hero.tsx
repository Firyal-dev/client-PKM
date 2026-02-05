"use client"

import { useState } from "react"
import Image from "next/image"
import Autoplay from "embla-carousel-autoplay"
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import SearchBar from "@/components/user/partials/search-bar"
import { useBaseUrl } from "@/hooks/use-base-url"
import type { Banner } from "@/types/banner-prop"

export default function Banner({ data }: { data: Banner[] }) {
    const [api, setApi] = useState<CarouselApi>()
    const baseUrl = useBaseUrl()

    return (
        <section className="relative w-full">
            {/* Slider Gambar */}
            <div className="relative overflow-hidden [clip-path:inset(0_0_0_0)] md:[clip-path:ellipse(150%_100%_at_50%_0%)]">
                <Carousel
                    opts={{ loop: true }}
                    plugins={[
                        Autoplay({ delay: 5000, stopOnInteraction: false }),
                    ]}
                    setApi={setApi}
                    className="w-full"
                >
                    <CarouselContent>
                        {data.map((slide, index) => (
                            <CarouselItem key={index}>
                                <SlideItem slide={slide} isPriority={index === 0} baseUrl={baseUrl} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>

            {/* Search Bar */}
            <SearchBar />
            <div className="h-16 md:h-24" />
        </section>
    )
}

// Slide Item
function SlideItem({ slide, isPriority, baseUrl }: { slide: Banner, isPriority: boolean, baseUrl: string }) {
    return (
        <div className="relative h-[65vh] md:h-[85vh] min-h-[500px] w-full group">
            {/* Gambar dengan Overlay lebih gelap di bawah */}
            <Image
                src={`${baseUrl}${slide.image_path}`}
                alt="Banner Puskesmas"
                fill
                priority={isPriority}
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                unoptimized
            />
            
            {/* Overlay Gradient: Lebih pekat di kiri bawah buat baca teks */}
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/95 via-slate-900/40 to-transparent" />

            {/* Content Wrapper: Pindah ke kiri bawah */}
            <div className="absolute inset-0 container flex flex-col justify-end pb-32 md:pb-40">
                <div className="max-w-3xl space-y-4 animate-in fade-in slide-in-from-left-8 duration-1000">
                    
                    {/* Label/Badge kecil di atas deskripsi biar gak sepi */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/20 border border-blue-400/30 backdrop-blur-md">
                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                        <span className="text-blue-100 text-[10px] md:text-xs font-bold tracking-widest uppercase">
                            Info Puskesmas
                        </span>
                    </div>

                    {/* Deskripsi: Kita gedein ukurannya & pake font Jakarta Sans */}
                    <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] drop-shadow-2xl">
                        {slide.description}
                    </h2>

                    {/* Garis dekoratif biar manis */}
                    <div className="h-1.5 w-24 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                    
                    <p className="text-slate-300 text-sm md:text-lg font-medium max-w-xl leading-relaxed">
                        Kami berkomitmen memberikan pelayanan kesehatan prima untuk masyarakat Kecamatan Sehat.
                    </p>
                </div>
            </div>
        </div>
    )
}