import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPublicAlbumById } from "@/services/album/album-service"
import { getPublicGallery } from "@/services/gallery/gallery-service"
import AlbumDetailPageContent from "@/components/user/sections/album-detail-page-content"

export const metadata: Metadata = {
    title: "Detail Album - Galeri - Puskesmas",
    description: "Informasi detail album foto kegiatan terbaru dari Puskesmas.",
}

export default async function AlbumDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params

    // Ambil detail album dan foto secara paralel
    const [album, photosRes] = await Promise.all([
        getPublicAlbumById(id),
        getPublicGallery(1, 100, { albumId: id })
    ])

    if (!album) {
        notFound()
    }

    return (
        <main className="min-h-screen bg-slate-50">
            <AlbumDetailPageContent
                album={album}
                photos={photosRes.data}
            />
        </main>
    )
}
