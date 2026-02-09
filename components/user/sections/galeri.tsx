"use client"

import Image from "next/image"
import Link from "next/link"
import { ImageOff, LayoutGrid } from "lucide-react"

import { getMediaUrl } from "@/lib/getMediaUrl"
import type { Gallery } from "@/types/gallery-prop"

export default function Gallery({ data }: { data: Gallery[] }) {
    const hasData = Array.isArray(data) && data.length > 0

    return (
        <section className="py-16 bg-slate-50" id="galeri">
            <div className="container mx-auto px-4">

                <HeaderSection />

                {!hasData ? (
                    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-dashed border-slate-200 text-center max-w-xl mx-auto">
                        <ImageOff className="w-12 h-12 text-slate-300 mb-4" />
                        <h3 className="text-base font-semibold text-slate-900 mb-1">
                            Belum ada dokumentasi
                        </h3>
                        <p className="text-sm text-slate-500">
                            Saat ini belum tersedia foto kegiatan puskesmas.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {data.map((item, index) => (
                            <GalleryItem
                                key={item._id}
                                item={item}
                                isPriority={index === 0}
                            />
                        ))}
                    </div>
                )}

                {data?.length >= 3 && (
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
        <div className="flex flex-col items-center text-center mb-12 space-y-3">
            <span className="px-4 py-1.5 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold uppercase tracking-wide">
                Dokumentasi
            </span>

            <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900">
                Galeri Kegiatan & Layanan
            </h2>

            <p className="max-w-xl text-sm md:text-base text-slate-600 leading-relaxed">
                Dokumentasi kegiatan pelayanan kesehatan dan edukasi masyarakat.
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
        <div className="group bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition">
            <div className="relative aspect-[4/3] w-full bg-slate-200">
                <Image
                    src={getMediaUrl(item.image) || "/placeholder.jpg"}
                    alt={item.image_title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={isPriority}
                    unoptimized
                />
            </div>

            <div className="p-4">
                <h3 className="text-base font-semibold text-slate-900 line-clamp-1 mb-1">
                    {item.image_title}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                    {item.description}
                </p>
            </div>
        </div>
    )
}
