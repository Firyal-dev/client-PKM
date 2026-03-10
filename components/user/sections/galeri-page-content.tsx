"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ImageOff, LayoutGrid, PlayCircle, FolderArchive, ArrowRight, Images, Film, BookImage } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-user"
import Breadcrumb from "@/components/user/partials/breadcrumb"
import { Card, CardContent } from "@/components/ui/card"
import { getMediaUrl } from "@/lib/getMediaUrl"
import type { Gallery } from "@/types/gallery-prop"
import type { Album } from "@/types/album-prop"
import type { Video } from "@/services/video/video-service"
import DOMPurify from "isomorphic-dompurify"

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

function getYouTubeEmbedHtml(embed: string): string {
    let html = embed
    if ((html.includes("youtube.com") || html.includes("youtu.be")) && !html.includes("<iframe")) {
        let videoId = ""
        if (html.includes("youtube.com/watch?v=")) {
            videoId = html.split("v=")[1].split("&")[0]
        } else if (html.includes("youtu.be/")) {
            videoId = html.split("youtu.be/")[1].split("?")[0]
        }
        if (videoId) {
            html = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
        }
    }
    return html.replace(/width="\d+"/, 'width="100%"').replace(/height="\d+"/, 'height="100%"')
}

export default function GalleryPageContent({ initialPhotos, initialAlbums, initialVideos }: GalleryPageContentProps) {
    const [activeTab, setActiveTab] = useState<TabType>("foto")

    const breadcrumbItems = [{ label: "Galeri" }]

    const counts: Record<TabType, number> = {
        foto: initialPhotos.length,
        album: initialAlbums.length,
        video: initialVideos.length,
    }

    return (
        <div className="min-h-screen bg-slate-50/50">
            {/* Hero Header */}
            <div className="bg-gradient-to-br from-blue-700 to-blue-500 text-white">
                <div className="container mx-auto px-4 py-8 md:py-10">
                    <Breadcrumb items={breadcrumbItems} />
                    <div className="mt-4 space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-blue-100 text-[10px] font-bold uppercase tracking-wider border border-white/20">
                            <LayoutGrid className="w-3.5 h-3.5" />
                            Galeri &amp; Dokumentasi
                        </div>
                        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">
                            Galeri Puskesmas
                        </h1>
                        <p className="text-blue-100 max-w-xl text-sm opacity-90 leading-relaxed">
                            Kumpulan dokumentasi kegiatan, album foto, dan video edukasi terbaru dari Puskesmas untuk masyarakat.
                        </p>
                    </div>
                </div>

                {/* Tab Nav — melekat di bawah hero */}
                <div className="container mx-auto px-4">
                    <div className="flex gap-1 border-b border-white/20">
                        {TABS.map((tab) => {
                            const Icon = tab.icon
                            const isActive = activeTab === tab.value
                            return (
                                <button
                                    key={tab.value}
                                    onClick={() => setActiveTab(tab.value)}
                                    className={`relative flex items-center gap-2 px-4 py-3 text-xs font-semibold transition-all duration-200 ${isActive
                                        ? "text-white"
                                        : "text-blue-200/70 hover:text-white/90"
                                        }`}
                                >
                                    <Icon className="w-3.5 h-3.5" />
                                    {tab.label}
                                    {counts[tab.value] > 0 && (
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-white/10 text-blue-200"}`}>
                                            {counts[tab.value]}
                                        </span>
                                    )}
                                    {isActive && (
                                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-t-full" />
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="container mx-auto px-4 py-6 min-h-[500px]">
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
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {data.map((photo) => (
                <div
                    key={photo.id}
                    className="group relative break-inside-avoid rounded-2xl overflow-hidden bg-slate-200 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                    <Image
                        src={getMediaUrl(photo.image) || "/userPlaceholder.jpg"}
                        alt={photo.image_title}
                        width={600}
                        height={400}
                        className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        unoptimized
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                        <h3 className="text-white font-bold text-sm line-clamp-1">{photo.image_title}</h3>
                        {photo.description && (
                            <p className="text-white/70 text-xs line-clamp-2 mt-1">{photo.description}</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((album) => (
                <Link key={album.id} href={`/galeri/album/${album.id}`} className="group">
                    <Card className="overflow-hidden border-none shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl bg-white h-full">
                        <div className="relative aspect-video">
                            <Image
                                src={getMediaUrl(album.album_cover) || "/userPlaceholder.jpg"}
                                alt={album.album_title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                unoptimized
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                            <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                                <Images className="w-3 h-3" />
                                {album.count || 0} Foto
                            </div>
                        </div>
                        <CardContent className="p-4">
                            <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 text-sm">
                                {album.album_title}
                            </h3>
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2 min-h-[2rem]">
                                {album.description || "Dokumentasi album kegiatan puskesmas."}
                            </p>
                            <div className="mt-3 flex items-center text-blue-600 text-xs font-bold gap-1.5 group-hover:gap-2.5 transition-all">
                                Lihat Album <ArrowRight className="w-3.5 h-3.5" />
                            </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((video) => (
                <div key={video.id} className="group flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                    <div className="relative w-full aspect-video bg-slate-100">
                        {video.embed ? (
                            <div
                                className="w-full h-full"
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(getYouTubeEmbedHtml(video.embed), {
                                        ADD_TAGS: ["iframe"],
                                        ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'src', 'width', 'height']
                                    })
                                }}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <PlayCircle className="w-14 h-14 text-slate-200" />
                            </div>
                        )}
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1.5">
                            <PlayCircle className="w-3 h-3" />
                            Video Dokumentasi
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                            {video.video_title}
                        </h3>
                        {video.video_desc && (
                            <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed flex-1">
                                {video.video_desc}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}
