"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { ImageOff } from "lucide-react"
import { CustomLink } from "@/components/ui/link"
import { EmptyState } from "@/components/ui/empty-user"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel"

// type
import type { Gallery } from "@/types/gallery-prop"

export default function Gallery({ data }: { data: Gallery[] }) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "");

    return (
        <section className="py-15 overflow-hidden">
            <div className="container flex flex-col items-center mx-auto">
                <div className="flex flex-col items-center text-center mb-12 space-y-3">
                    <span className="px-4 py-1.5 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold uppercase tracking-wide">
                        Dokumentasi
                    </span>
                    <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900">
                        Galeri Kegiatan
                    </h2>
                    <p className="max-w-xl text-sm md:text-base text-slate-600 leading-relaxed">
                        Momen berharga pelayanan kesehatan kami.
                    </p>
                </div>


                {(!data || data.length === 0) ? (
                    <EmptyState
                        title="Belum ada dokumentasi"
                        description="Saat ini belum ada foto kegiatan yang tersedia untuk ditampilkan."
                        icon={ImageOff}
                        className="max-w-4xl mx-auto"
                    />
                ) : (
                    <>
                        <div className="hidden md:flex flex-row gap-3 h-[420px] w-full max-w-6xl mx-auto">
                            {data.map((item, index) => (
                                <div
                                    key={item._id}
                                    className={cn(
                                        "group relative flex-1 min-h-[80px] md:min-h-full",
                                        "bg-slate-200 rounded-2xl overflow-hidden cursor-pointer",
                                        "transition-all duration-500 ease-out",
                                        "hover:flex-[2.5] hover:shadow-xl hover:shadow-blue-900/20"
                                    )}
                                >
                                    <Image
                                        src={`${baseUrl}${item.image}`}
                                        alt={item.image_title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        priority={index === 0}
                                        unoptimized
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                                    <div className="absolute inset-x-0 bottom-0 p-5 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                        <h3 className="text-lg md:text-xl font-bold text-white leading-snug">
                                            {item.image_title}
                                        </h3>
                                        <p className="text-slate-200 text-xs md:text-sm line-clamp-2">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="relative md:hidden w-full max-w-sm px-4">

                            <div className="absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />
                            <div className="absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />

                            <Carousel
                                opts={{
                                    align: "center",
                                    loop: true,
                                }}
                                className="w-full"
                            >
                                <CarouselContent className="-ml-2">
                                    {data.map((item, index) => (
                                        <CarouselItem key={item._id} className="pl-2 basis-[85%]">
                                            <div className="relative h-[400px] w-full bg-slate-200 rounded-2xl overflow-hidden group">
                                                <Image
                                                    src={`${baseUrl}${item.image}`}
                                                    alt={item.image_title}
                                                    fill
                                                    className="object-cover transition-transform duration-500"
                                                    sizes="(max-width: 768px) 85vw, 33vw"
                                                    priority={index === 0}
                                                    unoptimized
                                                />

                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                                <div className="absolute inset-x-0 bottom-0 p-5">
                                                    <h3 className="text-xl font-bold text-white leading-snug">
                                                        {item.image_title}
                                                    </h3>
                                                    <p className="text-slate-200 text-sm mt-1 line-clamp-2">
                                                        {item.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                            </Carousel>
                        </div>
                    </>
                )}

                {data.length > 5 && (
                    <CustomLink href="/" variant="outline" className="mt-8 mx-auto">
                        Lihat Semua
                    </CustomLink>
                )}
            </div>
        </section>
    )
}
