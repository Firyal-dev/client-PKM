// app/admin/(pages)/albums/[id]/page.tsx
import { PageHeader } from "@/components/page-header"
import { GalleryList } from "../../gallery/gallery-list"
import { getAlbumDetail } from "@/services/album/album-service"
import { getGallery } from "@/services/gallery/gallery-service"
import { PaginationControl } from "@/components/pagination-control"
import { notFound } from "next/navigation"

export default async function AlbumDetailPage({
    params,
    searchParams
}: {
    params: Promise<{ id: string }>,
    searchParams: Promise<{ page?: string }>
}) {
    const { id } = await params
    const qParams = await searchParams
    const currentPage = Number(qParams.page) || 1
    const limit = 12

    try {
        const [album, galleryResponse] = await Promise.all([
            getAlbumDetail(id),
            getGallery(currentPage, limit, id)
        ])

        if (!album) return notFound()

        return (
            <div className="px-5 pb-10">
                <PageHeader
                    title={album.album_title}
                    description={album.description || "Daftar foto dalam album ini"}
                    linkHref={`/admin/albums/${id}/upload-photo-to-album`}
                    linkLabel="Atur Foto Album"
                />

                <div className="mt-8 rounded-xl bg-muted/30 border border-border p-5">
                    <GalleryList initialGallery={galleryResponse.data} />
                </div>

                {galleryResponse.totalPages > 1 && (
                    <div className="mt-10 py-4 border-t border-border">
                        <PaginationControl
                            totalPages={galleryResponse.totalPages}
                            currentPage={galleryResponse.currentPage}
                        />
                    </div>
                )}
            </div>
        )
    } catch (error) {
        return notFound()
    }
}