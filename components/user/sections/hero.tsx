"use client"

import React, { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { Banner } from "@/types/banner-prop"
import { getMediaUrl } from "@/lib/getMediaUrl"
import { ChevronLeft, ChevronRight, MousePointer2 } from "lucide-react"

export default function Hero({ data }: { data: Banner[] }) {
    const [emblaRef, emblaApi] = useEmblaCarousel(
        { loop: true, align: "start", duration: 30 },
        [Autoplay({ delay: 6000, stopOnInteraction: false })]
    )
    const [selectedIndex, setSelectedIndex] = useState(0)

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev()
    }, [emblaApi])

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext()
    }, [emblaApi])

    const scrollTo = useCallback((index: number) => {
        if (emblaApi) emblaApi.scrollTo(index)
    }, [emblaApi])

    const onSelect = useCallback(() => {
        if (!emblaApi) return
        setSelectedIndex(emblaApi.selectedScrollSnap())
    }, [emblaApi])

    useEffect(() => {
        if (!emblaApi) return
        onSelect()
        emblaApi.on("select", onSelect)
        emblaApi.on("reInit", onSelect)
        return () => {
            emblaApi.off("select", onSelect)
            emblaApi.off("reInit", onSelect)
        }
    }, [emblaApi, onSelect])

    if (!data || data.length === 0) return null

    return (
        <section className="relative w-full h-[100vh] overflow-hidden bg-slate-950">
            {/* Carousel Container */}
            <div className="overflow-hidden h-full" ref={emblaRef}>
                <div className="flex h-full">
                    {data.map((banner, index) => (
                        <div key={banner.id} className="relative flex-[0_0_100%] min-w-0 h-full overflow-hidden">
                            {/* Background Image with Zoom Effect */}
                            <div className="absolute inset-0 z-0">
                                <Image
                                    src={getMediaUrl(banner.image_path) || "/placeholder.jpg"}
                                    alt={banner.title || "Banner"}
                                    fill
                                    className={`object-cover transition-transform duration-[10000ms] ease-linear ${index === selectedIndex ? "scale-110" : "scale-100 placeholder:opacity-0"
                                        }`}
                                    priority={index === 0}
                                    unoptimized
                                />
                            </div>

                            {/* Decorative glows (Premium aesthetic) */}
                            <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-blue-600/20 blur-[120px] rounded-full translate-x-1/4 -translate-y-1/4 pointer-events-none z-[11]" />
                            <div className="absolute bottom-1/3 left-0 w-[50%] h-[50%] bg-cyan-500/10 blur-[100px] rounded-full -translate-x-1/4 pointer-events-none z-[11]" />

                            {/* Gradient Overlay for Text Readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/20 z-10" />
                            <div className="absolute inset-0 bg-black/40 z-10" />

                            {/* Content Container */}
                            <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-16 lg:px-24 max-w-screen-2xl mx-auto">
                                <div className="md:max-w-3xl lg:max-w-5xl">
                                    <h1
                                        className={`text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-[1.05] tracking-tight drop-shadow-2xl transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] transform ${index === selectedIndex
                                                ? "translate-y-0 opacity-100 delay-300"
                                                : "translate-y-20 opacity-0"
                                            }`}
                                    >
                                        {banner.title}
                                    </h1>
                                    {banner.description && (
                                        <p
                                            className={`text-lg md:text-xl lg:text-2xl text-slate-200/90 max-w-2xl line-clamp-4 md:line-clamp-3 drop-shadow-md leading-relaxed transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] transform ${index === selectedIndex
                                                    ? "translate-y-0 opacity-100 delay-500"
                                                    : "translate-y-20 opacity-0"
                                                }`}
                                        >
                                            {banner.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Controls */}
            {data.length > 1 && (
                <div className="absolute bottom-24 md:bottom-32 left-6 md:left-16 lg:left-24 z-30 flex items-center gap-8">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={scrollPrev}
                            className="group p-2 text-white/40 hover:text-white transition-all duration-300 cursor-pointer bg-white/5 hover:bg-white/10 rounded-full border border-white/10"
                            aria-label="Previous slide"
                        >
                            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                        </button>
                        <button
                            onClick={scrollNext}
                            className="group p-2 text-white/40 hover:text-white transition-all duration-300 cursor-pointer bg-white/5 hover:bg-white/10 rounded-full border border-white/10"
                            aria-label="Next slide"
                        >
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        {data.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => scrollTo(index)}
                                className={`group relative h-1.5 transition-all duration-500 rounded-full cursor-pointer ${index === selectedIndex
                                        ? "w-10 bg-white"
                                        : "w-4 bg-white/20 hover:bg-white/40"
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            >
                                <span className="absolute -inset-2 block" />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Scroll Indicator */}
            <div className="absolute bottom-20 md:bottom-28 right-6 md:right-16 lg:right-24 z-30 hidden md:flex flex-col items-center gap-3">
                <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/40 vertical-text rotate-180" style={{ writingMode: 'vertical-rl' }}>
                    Gulir Ke Bawah
                </span>
                <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-white animate-scroll-line" />
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes scroll-line {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100%); }
                }
                .animate-scroll-line {
                    animation: scroll-line 2s cubic-bezier(0.15, 0, 0.5, 1) infinite;
                }
            `}} />
        </section>
    )
}