"use client"

import Image from "next/image"
import Link from "next/link"
import { ImageOff, LayoutGrid } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-user"

import { getMediaUrl } from "@/lib/getMediaUrl"
import type { Gallery } from "@/types/gallery-prop"

export default function Gallery({ data }: { data: Gallery[] }) {
    const hasData = Array.isArray(data) && data.length > 0

    return (
        <section className="py-16 md:py-24 bg-slate-50" id="galeri">
            <div className="container mx-auto px-6 md:px-12 lg:px-16">

                <HeaderSection />

                {!hasData ? (
                    <EmptyState
                        title="Belum ada dokumentasi"
                        description="Saat ini belum tersedia foto kegiatan puskesmas."
                        icon={ImageOff}
                        className="max-w-xl mx-auto"
                    />
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 max-w-7xl mx-auto">
                        {data.slice(0, 10).map((item, index) => (
                            <GalleryItem
                                key={item.id}
                                item={item}
                                isPriority={index === 0}
                            />
                        ))}
                    </div>
                )}

                {data?.length > 10 && (
                    <div className="mt-10 flex justify-center">
                        <Link
                            href="/galeri"
                            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold border border-slate-300 text-slate-700 rounded-xl hover:border-blue-600 hover:text-blue-600 hover:bg-white transition-colors"
                        >
                            <LayoutGrid className="w-4 h-4" />
                            Lihat Galeri Foto
                        </Link>
                    </div>
                )}
            </div>
        </section>
    )
}

/* ================= HEADER ================= */

function HeaderSection() {
    return (
        <div className="flex flex-col items-center text-center mb-10 space-y-2">
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold uppercase tracking-wider">
                Dokumentasi
            </span>

            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
                Galeri Kegiatan
            </h2>

            <p className="max-w-xl text-sm text-slate-500">
                Dokumentasi kegiatan pelayanan dan aktivitas terbaru.
            </p>
        </div>
    )
}

/* ================= ITEM ================= */

function GalleryItem({
    item,
    isPriority,
}: {
    item: Gallery
    isPriority: boolean
}) {
    return (
        <div className="group relative rounded-lg overflow-hidden aspect-square bg-slate-200">
            <Image
                src={getMediaUrl(item.image) || "/placeholder.jpg"}
                alt={item.image_title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                priority={isPriority}
                unoptimized
            />

            {/* Overlay Gradient & Content */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4 translate-y-2 group-hover:translate-y-0">
                <h3 className="text-sm font-bold text-white line-clamp-1 mb-0.5">
                    {item.image_title}
                </h3>
                <p className="text-[10px] text-white/80 line-clamp-2 leading-tight">
                    {item.description}
                </p>
            </div>
        </div>
    )
}
