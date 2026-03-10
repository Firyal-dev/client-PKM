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
                    <div className="max-w-7xl mx-auto">
                        <MasonryGrid data={data.slice(0, 10)} />
                    </div>
                )}

                {data?.length > 10 && (
                    <div className="mt-10 flex justify-center">
                        <Link
                            href="/galeri"
                            className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold border border-slate-200 text-slate-500 rounded-xl hover:border-blue-400 hover:text-blue-600 bg-white transition-colors"
                        >
                            <LayoutGrid className="w-3.5 h-3.5" />
                            Lihat Semua Foto
                        </Link>
                    </div>
                )}
            </div>
        </section>
    )
}

/* ── HEADER ── */
function HeaderSection() {
    return (
        <div className="flex flex-col items-center text-center mb-12 space-y-3">
            <div className="flex items-center gap-2">
                <span className="block w-6 h-px bg-blue-400" />
                <span className="text-[11px] font-bold tracking-[0.14em] text-blue-500 uppercase">
                    Dokumentasi
                </span>
                <span className="block w-6 h-px bg-blue-400" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
                Galeri Kegiatan
            </h2>
            <p className="max-w-md text-sm text-slate-500 leading-relaxed">
                Dokumentasi kegiatan pelayanan dan aktivitas terbaru puskesmas.
            </p>
        </div>
    )
}

/* ── MASONRY GRID ── */
function MasonryGrid({ data }: { data: Gallery[] }) {
    const col1 = data.filter((_, i) => i % 3 === 0)
    const col2 = data.filter((_, i) => i % 3 === 1)
    const col3 = data.filter((_, i) => i % 3 === 2)

    return (
        <>
            {/* Mobile: 2 kolom uniform, no masonry */}
            <div className="grid grid-cols-2 gap-2 md:hidden">
                {data.map((item, idx) => (
                    <div
                        key={item.id}
                        className="group relative overflow-hidden rounded-xl bg-slate-200 aspect-square"
                    >
                        <Image
                            src={getMediaUrl(item.image) || "/placeholder.jpg"}
                            alt={item.image_title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="50vw"
                            priority={idx === 0}
                            unoptimized
                        />
                        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-2.5">
                            <h3 className="text-[11px] font-bold text-white line-clamp-1 drop-shadow">
                                {item.image_title}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop: 3 kolom masonry */}
            <div className="hidden md:grid md:grid-cols-3 gap-3">
                {[col1, col2, col3].map((col, ci) => (
                    <div key={ci} className="flex flex-col gap-3">
                        {col.map((item, idx) => {
                            const isTall = (ci === 0 && idx % 2 === 0) ||
                                (ci === 1 && idx % 2 === 1) ||
                                (ci === 2 && idx % 2 === 0)
                            return (
                                <GalleryItem
                                    key={item.id}
                                    item={item}
                                    tall={isTall}
                                    isPriority={ci === 0 && idx === 0}
                                />
                            )
                        })}
                    </div>
                ))}
            </div>
        </>
    )
}

/* ── ITEM ── */
function GalleryItem({
    item,
    isPriority,
    tall,
}: {
    item: Gallery
    isPriority: boolean
    tall: boolean
}) {
    return (
        <div
            className={`group relative overflow-hidden rounded-2xl bg-slate-200 ${tall ? "aspect-[3/4]" : "aspect-[4/3]"
                }`}
        >
            <Image
                src={getMediaUrl(item.image) || "/placeholder.jpg"}
                alt={item.image_title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
                priority={isPriority}
                unoptimized
            />

            {/* Overlay — always visible at bottom, expands on hover */}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

            {/* Caption */}
            <div className="absolute inset-x-0 bottom-0 p-3 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-xs font-bold text-white line-clamp-1 drop-shadow">
                    {item.image_title}
                </h3>
                <p className="text-[10px] text-white/70 line-clamp-1 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {item.description}
                </p>
            </div>
        </div>
    )
}