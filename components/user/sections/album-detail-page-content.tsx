"use client"

import Image from "next/image"
import { ImageOff, ArrowLeft, Expand } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-user"
import HeroHeader from "@/components/user/partials/hero-header"
import { getMediaUrl } from "@/lib/getMediaUrl"
import type { Gallery } from "@/types/gallery-prop"
import type { Album } from "@/types/album-prop"
import Link from "next/link"

interface AlbumDetailPageContentProps {
    album: Album
    photos: Gallery[]
}

export default function AlbumDetailPageContent({
    album,
    photos,
}: AlbumDetailPageContentProps) {
    const breadcrumbItems = [
        { label: "Galeri", href: "/galeri" },
        { label: album.album_title }
    ]

    return (
        <div className="min-h-screen bg-slate-50">
            <HeroHeader
                items={breadcrumbItems}
                title={album.album_title}
                description={album.description || "Kumpulan dokumentasi foto kegiatan puskemas dalam album ini."}
            >
                <div className="bg-white/10 border border-white/20 rounded-xl px-5 py-3 text-center">
                    <p className="text-[10px] text-white/60 uppercase tracking-wider mb-1">Total Foto</p>
                    <p className="text-2xl font-bold text-white">{photos.length}</p>
                </div>
            </HeroHeader>

            {/* Content Area */}
            <div className="max-w-screen-xl mx-auto px-6 md:px-12 lg:px-16 py-10">
                {photos.length === 0 ? (
                    <EmptyState
                        title="Album masih kosong"
                        description="Belum ada foto yang dimasukkan ke dalam album ini."
                        icon={ImageOff}
                        className="py-20"
                    />
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                        {photos.map((photo) => (
                            <div
                                key={photo.id}
                                className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-white shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1"
                            >
                                <Image
                                    src={getMediaUrl(photo.image) || "/userPlaceholder.jpg"}
                                    alt={photo.image_title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                    unoptimized
                                />

                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                                    <h3 className="text-white font-bold text-base line-clamp-1">
                                        {photo.image_title}
                                    </h3>
                                    {photo.description && (
                                        <p className="text-white/70 text-xs line-clamp-2 mt-2 leading-relaxed">
                                            {photo.description}
                                        </p>
                                    )}
                                    <div className="mt-4 flex justify-between items-center translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                                        <button className="p-2.5 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-md text-white border border-white/20 transition-colors">
                                            <Expand className="w-4 h-4" />
                                        </button>
                                        <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">
                                            {new Date(photo.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Back Link */}
                <div className="mt-16 flex justify-center">
                    <Link
                        href="/galeri"
                        className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white border border-slate-200 text-slate-900 font-bold hover:bg-slate-50 hover:border-blue-300 hover:text-blue-600 transition-all shadow-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke Semua Galeri
                    </Link>
                </div>
            </div>
        </div>
    )
}
