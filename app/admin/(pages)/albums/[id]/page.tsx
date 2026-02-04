import { PageHeader } from "@/components/admin/page-header"
import { GalleryList } from "../../gallery/gallery-list"
import { CustomLink } from "@/components/ui/link"
import { getAlbumDetail } from "@/services/album/album-service"
import { getGallery } from "@/services/gallery/gallery-service"
import { PaginationControl } from "@/components/admin/pagination-control"
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
                    description="Daftar foto dalam album ini"
                    linkHref={`/admin/albums/${id}/upload-photo-to-album`}
                    linkLabel="Atur Foto Album"
                />

                <div className="mt-8 rounded-xl bg-muted/30 border border-border p-5">
                    <GalleryList
                        initialGallery={galleryResponse.data}
                        emptyTitle="Album ini masih kosong"
                        emptyDescription="Belum ada foto yang ditambahkan ke album ini."
                        emptyAction={
                            <CustomLink href={`/admin/albums/${id}/upload-photo-to-album`}>
                                Pilih foto dari Galeri
                            </CustomLink>
                        }
                    />
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