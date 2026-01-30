import { PageHeader } from "@/components/admin/page-header"
import { getAlbumDetail } from "@/services/album/album-service"
import { getGallery } from "@/services/gallery/gallery-service"
import { PhotoSelector } from "./photo-selector"
import { PaginationControl } from "@/components/admin/pagination-control"
import { notFound } from "next/navigation"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { ImageOff } from "lucide-react"

export default async function UploadPhotoToAlbum({
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
            getGallery(currentPage, limit, undefined, true) // noAlbum = true
        ])

        if (!album) return notFound()

        return (
            <div className="px-5 pb-10">
                <PageHeader
                    title="Pilih Foto Untuk Album"
                    description={`Memasukkan foto ke dalam album: ${album.album_title}`}
                />

                <div className="mt-8 rounded-xl bg-muted/30 border border-border p-5 min-h-[500px]">
                    {galleryResponse.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center min-h-[400px] py-10 w-full">
                            <Empty className="flex flex-col items-center text-center">
                                <EmptyHeader className="flex flex-col items-center">
                                    <EmptyMedia variant="icon" className="mb-4 bg-muted/50 p-4 rounded-full">
                                        <ImageOff className="w-10 h-10 text-muted-foreground" />
                                    </EmptyMedia>
                                    <EmptyTitle className="text-xl font-semibold">Tidak ada foto tersedia</EmptyTitle>
                                    <EmptyDescription className="max-w-[300px] mx-auto">
                                        Semua foto sudah memiliki album atau galeri masih kosong.
                                    </EmptyDescription>
                                </EmptyHeader>
                            </Empty>
                        </div>
                    ) : (
                        <PhotoSelector
                            initialGallery={galleryResponse.data}
                            albumId={id}
                        />
                    )}
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