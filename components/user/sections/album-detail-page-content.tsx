"use client"

import Image from "next/image"
import { ImageOff, ArrowLeft } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-user"
import HeroHeader from "@/components/user/partials/hero-header"
import { getMediaUrl } from "@/lib/getMediaUrl"
import type { Gallery } from "@/types/gallery-prop"
import type { Album } from "@/types/album-prop"
import Link from "next/link"
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'

interface AlbumDetailPageContentProps {
    album: Album
    photos: Gallery[]
}

export default function AlbumDetailPageContent({ album, photos }: AlbumDetailPageContentProps) {
    const breadcrumbItems = [
        { label: "Galeri", href: "/galeri" },
        { label: album.album_title }
    ]

    return (
        <div className="min-h-screen bg-slate-50">
            <HeroHeader
                items={breadcrumbItems}
                title={album.album_title}
                description={album.description || "Kumpulan dokumentasi foto kegiatan puskesmas dalam album ini."}
            >
                <div className="bg-white/10 border border-white/20 rounded-xl px-5 py-3 text-center">
                    <p className="text-[10px] text-white/60 uppercase tracking-wider mb-1">Total Foto</p>
                    <p className="text-2xl font-bold text-white">{photos.length}</p>
                </div>
            </HeroHeader>

            <div className="max-w-screen-xl mx-auto px-6 md:px-12 lg:px-16 py-10">
                {photos.length === 0 ? (
                    <EmptyState
                        title="Album masih kosong"
                        description="Belum ada foto yang dimasukkan ke dalam album ini."
                        icon={ImageOff}
                        className="py-20"
                    />
                ) : (
                    <PhotoProvider>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                            {photos.map((photo) => (
                                <PhotoView
                                    key={photo.id}
                                    src={getMediaUrl(photo.image) || "/userPlaceholder.jpg"}
                                >
                                    <div className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-200 border border-white shadow-sm cursor-zoom-in hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                        <Image
                                            src={getMediaUrl(photo.image) || "/userPlaceholder.jpg"}
                                            alt={photo.image_title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                            unoptimized
                                        />

                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                                        {/* Caption */}
                                        <div className="absolute inset-x-0 bottom-0 p-3.5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                                            <p className="text-white text-xs font-bold line-clamp-1 leading-snug">
                                                {photo.image_title}
                                            </p>
                                            {photo.description && (
                                                <p className="text-white/60 text-[10px] line-clamp-1 mt-0.5">
                                                    {photo.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </PhotoView>
                            ))}
                        </div>
                    </PhotoProvider>
                )}

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