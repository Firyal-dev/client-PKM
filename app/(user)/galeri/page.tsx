import type { Metadata } from "next"
import { getPublicGallery } from "@/services/gallery/gallery-service"
import { getPublicAlbums } from "@/services/album/album-service"
import { getPublicVideos } from "@/services/video/video-service"

import GalleryPageContent from "@/components/user/sections/galeri-page-content"

export const metadata: Metadata = {
    title: "Galeri Dokumentasi - Puskesmas",
    description: "Kumpulan dokumentasi foto, album, dan video kegiatan terbaru dari Puskesmas.",
}

export default async function GaleriPage() {
    // Ambil data awal secara paralel
    const [photosRes, albumsRes, videosRes] = await Promise.all([
        getPublicGallery(1, 28),
        getPublicAlbums(1, 12),
        getPublicVideos(1, 12)
    ]);

    return (
        <main className="min-h-screen bg-slate-50/50">
            <GalleryPageContent
                initialPhotos={photosRes.data}
                initialAlbums={albumsRes.data}
                initialVideos={videosRes.data}
            />
        </main>
    )
}
