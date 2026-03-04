"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ImageOff, LayoutGrid, PlayCircle, FolderArchive, ArrowRight, Expand, CalendarDays } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-user"
import Breadcrumb from "@/components/user/partials/breadcrumb"
import { SegmentedControl } from "@/components/ui/segmented-control"
import { Card, CardContent } from "@/components/ui/card"
import { getMediaUrl } from "@/lib/getMediaUrl"
import type { Gallery } from "@/types/gallery-prop"
import type { Album } from "@/types/album-prop"
import type { Video } from "@/services/video/video-service"

interface GalleryPageContentProps {
    initialPhotos: Gallery[]
    initialAlbums: Album[]
    initialVideos: Video[]
}

type TabType = "foto" | "album" | "video"


export default function GalleryPageContent({
    initialPhotos,
    initialAlbums,
    initialVideos
}: GalleryPageContentProps) {
    const [activeTab, setActiveTab] = useState<TabType>("foto")

    const tabs = [
        { label: "Foto", value: "foto" as const },
        { label: "Album", value: "album" as const },
        { label: "Video", value: "video" as const },
    ]

    const breadcrumbItems = [{ label: "Galeri" }]

    // Helper untuk mengubah URL YouTube menjadi iframe jika perlu
    const renderVideo = (video: Video) => {
        if (!video.embed) return null

        let embedHtml = video.embed

        // Jika isi embed adalah URL YouTube biasa, bukan iframe
        if (embedHtml.includes("youtube.com") || embedHtml.includes("youtu.be")) {
            if (!embedHtml.includes("<iframe")) {
                let videoId = ""
                if (embedHtml.includes("youtube.com/watch?v=")) {
                    videoId = embedHtml.split("v=")[1].split("&")[0]
                } else if (embedHtml.includes("youtu.be/")) {
                    videoId = embedHtml.split("youtu.be/")[1].split("?")[0]
                }

                if (videoId) {
                    embedHtml = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
                }
            }
        }

        // Pastikan width & height 100%
        embedHtml = embedHtml.replace(/width="\d+"/, 'width="100%"').replace(/height="\d+"/, 'height="100%"')

        return (
            <div
                className="w-full h-full"
                dangerouslySetInnerHTML={{ __html: embedHtml }}
            />
        )
    }

    return (
        <div className="min-h-screen bg-slate-50/50">
            {/* Hero Header */}
            <div className="bg-gradient-to-br from-blue-700 to-blue-500 text-white">
                <div className="container mx-auto px-4 py-12 md:py-16">
                    <Breadcrumb items={breadcrumbItems} />
                    <div className="mt-6 flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-blue-100 text-[10px] font-bold uppercase tracking-wider border border-white/20">
                                <LayoutGrid className="w-3.5 h-3.5" />
                                Galeri & Dokumentasi
                            </div>
                            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                                Galeri Pusat Informasi
                            </h1>
                            <p className="text-blue-100 max-w-xl text-lg opacity-90 leading-relaxed">
                                Kumpulan dokumentasi kegiatan, album foto, dan video edukasi terbaru
                                dari Puskesmas untuk masyarakat.
                            </p>
                        </div>

                        <div className="shrink-0 p-1 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                            <SegmentedControl
                                value={activeTab}
                                onChange={(val) => setActiveTab(val as TabType)}
                                options={tabs}
                                className="w-full md:w-80 h-12 bg-transparent border-none"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="container mx-auto px-4 py-12 min-h-[500px]">
                {activeTab === "foto" && <PhotosTab data={initialPhotos} />}
                {activeTab === "album" && <AlbumsTab data={initialAlbums} />}
                {activeTab === "video" && <VideosTab data={initialVideos} renderVideo={renderVideo} />}
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
                className="py-20"
            />
        )
    }

    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {data.map((photo) => (
                <div key={photo.id} className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-200 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <Image
                        src={getMediaUrl(photo.image) || "/userPlaceholder.jpg"}
                        alt={photo.image_title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        unoptimized
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                        <h3 className="text-white font-bold text-sm md:text-base line-clamp-1">
                            {photo.image_title}
                        </h3>
                        <p className="text-white/80 text-xs line-clamp-2 mt-1">
                            {photo.description}
                        </p>
                        <button className="mt-3 w-fit p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-black transition-colors">
                            <Expand className="w-4 h-4" />
                        </button>
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
                className="py-20"
            />
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((album) => (
                <Link key={album.id} href={`/galeri/album/${album.id}`} className="group">
                    <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl bg-white">
                        <div className="relative aspect-video">
                            <Image
                                src={getMediaUrl(album.album_cover) || "/userPlaceholder.jpg"}
                                alt={album.album_title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                unoptimized
                            />
                            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
                                {album.count || 0} Foto
                            </div>
                        </div>
                        <CardContent className="p-5">
                            <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                                {album.album_title}
                            </h3>
                            <p className="text-sm text-slate-500 mt-2 line-clamp-2 min-h-[2.5rem]">
                                {album.description || "Dokumentasi album kegiatan puskemas."}
                            </p>
                            <div className="mt-4 flex items-center text-blue-600 text-xs font-bold gap-2">
                                Lihat Album <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    )
}

/* ================= VIDEO TAB ================= */

function VideosTab({ data, renderVideo }: { data: Video[], renderVideo: (video: Video) => React.ReactNode }) {
    if (data.length === 0) {
        return (
            <EmptyState
                title="Video tidak ditemukan"
                description="Belum ada video edukasi atau dokumentasi."
                icon={PlayCircle}
                className="py-20"
            />
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.map((video) => (
                <div key={video.id} className="group flex flex-col items-start">
                    <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-white shadow-sm border border-slate-100 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-blue-500/10 group-hover:-translate-y-2 mb-6">
                        {video.embed ? (
                            renderVideo(video)
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-50">
                                <PlayCircle className="w-16 h-16 text-slate-200" />
                            </div>
                        )}
                    </div>
                    <div className="space-y-3 px-2">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                            <PlayCircle className="w-3.5 h-3.5" />
                            Video Dokumentasi
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                            {video.video_title}
                        </h3>
                        {video.video_desc && (
                            <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed opacity-80">
                                {video.video_desc}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}
