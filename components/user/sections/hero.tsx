"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { Banner } from "@/types/banner-prop"
import { getMediaUrl } from "@/lib/getMediaUrl"

export default function Hero({ data }: { data: Banner[] }) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isTransitioning, setIsTransitioning] = useState(false)

    useEffect(() => {
        if (!data || data.length === 0) return

        const interval = setInterval(() => {
            setIsTransitioning(true)
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % data.length)
                setIsTransitioning(false)
            }, 300)
        }, 5000)

        return () => clearInterval(interval)
    }, [data])

    if (!data || data.length === 0) return null

    const banner = data[currentIndex]

    return (
        <section className="relative">
            <div className="relative h-[65vh] min-h-[420px] bg-slate-950 overflow-hidden">

                {/* BG Image */}
                <Image
                    src={getMediaUrl(banner.image_path) || "/placeholder.jpg"}
                    alt={banner.title || "Banner"}
                    fill
                    priority
                    className={`object-cover transition-opacity duration-500 ${isTransitioning ? "opacity-0" : "opacity-60"
                        }`}
                    unoptimized
                />

                {/* Overlay atas — buat navbar tetap terbaca di atas gambar apapun */}
                <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/70 to-transparent" />

                {/* Overlay bawah — buat teks konten terbaca */}
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

                {/* Subtle color tint */}
                <div className="absolute inset-0 bg-blue-950/20" />

                {/* Content */}
                <div className="relative z-10 container mx-auto px-6 md:px-12 lg:px-16 h-full flex items-center">
                    <div className={`max-w-3xl space-y-5 transition-all duration-500 ${isTransitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
                        }`}>

                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.08] tracking-tight">
                            {banner.title || "Pelayanan Kesehatan Terpadu"}
                        </h1>

                        {/* Description */}
                        <p className="text-slate-300/80 text-base md:text-lg leading-relaxed max-w-xl">
                            {banner.description || "Melayani masyarakat dengan cepat, tepat, dan profesional melalui layanan kesehatan yang mudah diakses."}
                        </p>

                        {/* Dots indicator — hanya muncul kalau banner > 1 */}
                        {data.length > 1 && (
                            <div className="flex items-center gap-2 pt-2">
                                {data.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            setIsTransitioning(true)
                                            setTimeout(() => {
                                                setCurrentIndex(i)
                                                setIsTransitioning(false)
                                            }, 300)
                                        }}
                                        className={`rounded-full transition-all duration-300 ${i === currentIndex
                                            ? "w-6 h-2 bg-white"
                                            : "w-2 h-2 bg-white/35 hover:bg-white/60"
                                            }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="h-10" />
        </section>
    )
}