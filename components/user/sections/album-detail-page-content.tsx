"use client"

import Image from "next/image"
import { ImageOff, ArrowLeft, Expand } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-user"
import Breadcrumb from "@/components/user/partials/breadcrumb"
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
        <div className="min-h-screen bg-slate-50/50">
            {/* Hero Header */}
            <div className="bg-gradient-to-br from-blue-700 to-blue-500 text-white">
                <div className="container mx-auto px-4 py-12 md:py-16">
                    <Breadcrumb items={breadcrumbItems} />
                    <div className="mt-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-3">
                            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
                                {album.album_title}
                            </h1>
                            <p className="text-blue-100 max-w-2xl text-lg">
                                {album.description || "Kumpulan dokumentasi foto kegiatan puskemas dalam album ini."}
                            </p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 shrink-0">
                            <p className="text-xs font-bold uppercase tracking-widest text-blue-100 mb-1 opacity-70">Total Foto</p>
                            <p className="text-2xl font-black text-white">{photos.length} item</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="container mx-auto px-4 py-12">
                {photos.length === 0 ? (
                    <EmptyState
                        title="Album masih kosong"
                        description="Belum ada foto yang dimasukkan ke dalam album ini."
                        icon={ImageOff}
                        className="py-20"
                    />
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                        {photos.map((photo) => (
                            <div
                                key={photo.id}
                                className="group relative aspect-[4/3] rounded-3xl overflow-hidden bg-white shadow-sm border border-slate-100 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2"
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
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
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
