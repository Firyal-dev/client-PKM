"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ImageOff, LayoutGrid, PlayCircle, FolderArchive, ArrowRight, Images, Film, BookImage } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-user"
import { Card, CardContent } from "@/components/ui/card"
import { getMediaUrl } from "@/lib/getMediaUrl"
import type { Gallery } from "@/types/gallery-prop"
import type { Album } from "@/types/album-prop"
import type { Video } from "@/services/video/video-service"
import HeroHeader from "@/components/user/partials/hero-header"
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import '@vidstack/react/player/styles/base.css'
import '@vidstack/react/player/styles/plyr/theme.css'
import { MediaPlayer, MediaProvider } from '@vidstack/react'
import { PlyrLayout, plyrLayoutIcons } from '@vidstack/react/player/layouts/plyr'

interface GalleryPageContentProps {
    initialPhotos: Gallery[]
    initialAlbums: Album[]
    initialVideos: Video[]
}

type TabType = "foto" | "album" | "video"

const TABS: { label: string; value: TabType; icon: React.ElementType; desc: string }[] = [
    { label: "Foto", value: "foto", icon: Images, desc: "Dokumentasi kegiatan" },
    { label: "Album", value: "album", icon: BookImage, desc: "Koleksi foto" },
    { label: "Video", value: "video", icon: Film, desc: "Video & dokumentasi" },
]



export default function GalleryPageContent({ initialPhotos, initialAlbums, initialVideos }: GalleryPageContentProps) {
    const [activeTab, setActiveTab] = useState<TabType>("foto")

    const breadcrumbItems = [{ label: "Galeri" }]

    const counts: Record<TabType, number> = {
        foto: initialPhotos.length,
        album: initialAlbums.length,
        video: initialVideos.length,
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Page Header */}
            <HeroHeader
                items={breadcrumbItems}
                title="Galeri Puskesmas"
                description="Kumpulan dokumentasi kegiatan, album foto, dan video terbaru dari Puskesmas."
            />

            {/* Tab Nav */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-screen-xl mx-auto px-6 md:px-12 lg:px-16">
                    <div className="flex gap-0">
                        {TABS.map((tab) => {
                            const Icon = tab.icon
                            const isActive = activeTab === tab.value
                            return (
                                <button
                                    key={tab.value}
                                    onClick={() => setActiveTab(tab.value)}
                                    className={`relative flex items-center gap-2 px-5 py-4 text-sm font-medium transition-all duration-150 ${isActive
                                        ? "text-blue-600"
                                        : "text-slate-500 hover:text-slate-900"
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {tab.label}
                                    {counts[tab.value] > 0 && (
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"
                                            }`}>
                                            {counts[tab.value]}
                                        </span>
                                    )}
                                    {isActive && (
                                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-screen-xl mx-auto px-6 md:px-12 lg:px-16 py-10 min-h-[500px]">
                {activeTab === "foto" && <PhotosTab data={initialPhotos} />}
                {activeTab === "album" && <AlbumsTab data={initialAlbums} />}
                {activeTab === "video" && <VideosTab data={initialVideos} />}
            </div>
        </div>
    )
}

/* ================= PHOTO TAB ================= */
function PhotosTab({ data }: { data: Gallery[] }) {
    if (data.length === 0) {
        return (
            <EmptyState
                title="Foto tidak ditemukan"
                description="Belum ada foto kegiatan yang diunggah."
                icon={ImageOff}
                className="py-24"
            />
        )
    }

    return (
        <PhotoProvider>  {/* ← pindah ke sini, wrap semua foto */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {data.map((photo) => (
                    <div
                        key={photo.id}
                        className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-200 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                    >
                        <PhotoView src={getMediaUrl(photo.image) || "/userPlaceholder.jpg"}>
                            <Image
                                src={getMediaUrl(photo.image) || "/userPlaceholder.jpg"}
                                alt={photo.image_title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110 cursor-zoom-in"
                                unoptimized
                            />
                        </PhotoView>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-10 pointer-events-none">
                            <h3 className="text-white font-bold text-sm line-clamp-1">{photo.image_title}</h3>
                            {photo.description && (
                                <p className="text-white/70 text-xs line-clamp-1 mt-0.5">{photo.description}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </PhotoProvider>
    )
}

/* ================= ALBUM TAB ================= */
function AlbumsTab({ data }: { data: Album[] }) {
    if (data.length === 0) {
        return (
            <EmptyState
                title="Album tidak ditemukan"
                description="Belum ada album foto yang dibuat."
                icon={FolderArchive}
                className="py-24"
            />
        )
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.map((album) => (
                <Link key={album.id} href={`/galeri/album/${album.id}`} className="group">
                    <Card className="overflow-hidden border-none shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl bg-white h-full group">
                        <div className="relative aspect-square">
                            <Image
                                src={getMediaUrl(album.album_cover) || "/userPlaceholder.jpg"}
                                alt={album.album_title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                unoptimized
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                            <div className="absolute bottom-3 left-3 px-2 z-10 py-1 rounded-lg bg-white/90 backdrop-blur-sm text-blue-600 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                                <Images className="w-3 h-3" />
                                {album.count || 0}
                            </div>
                        </div>
                        <CardContent className="p-3">
                            <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 text-xs">
                                {album.album_title}
                            </h3>
                            <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                                {album.description || "Koleksi foto kegiatan."}
                            </p>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    )
}

/* ================= VIDEO TAB ================= */

function VideosTab({ data }: { data: Video[] }) {
    if (data.length === 0) {
        return (
            <EmptyState
                title="Video tidak ditemukan"
                description="Belum ada video edukasi atau dokumentasi."
                icon={PlayCircle}
                className="py-24"
            />
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((video) => {
                const videoSrc = video.is_embed ? video.embed : getMediaUrl(video.embed, 'uploads/videos')

                return (
                    <div key={video.id} className="group flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                        <div className="relative w-full aspect-video bg-slate-950">
                            {videoSrc ? (
                                <MediaPlayer
                                    title={video.video_title}
                                    src={videoSrc}
                                    className="w-full h-full"
                                    playsInline
                                >
                                    <MediaProvider />
                                    <PlyrLayout icons={plyrLayoutIcons} />
                                </MediaPlayer>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <PlayCircle className="w-14 h-14 text-slate-400 opacity-20" />
                                </div>
                            )}
                        </div>
                        <div className="p-4 flex flex-col flex-1">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1.5">
                                <PlayCircle className="w-3 h-3" />
                                {video.is_embed ? "YouTube" : "Video"} Dokumentasi
                            </div>
                            <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug flex-1">
                                {video.video_title}
                            </h3>
                            {video.video_desc && (
                                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed opacity-80">
                                    {video.video_desc}
                                </p>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
