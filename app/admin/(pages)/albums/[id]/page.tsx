import { PageHeader } from "@/components/admin/page-header"
import { GalleryList } from "../../gallery/gallery-list"
import { getAdminAlbumById } from "@/services/album/album-service"
import { getAdminGallery } from "@/services/gallery/gallery-service"
import { PaginationControl } from "@/components/pagination-control"
import { notFound } from "next/navigation"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { ImageOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"

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
    const limit = 15

    try {
        const [album, galleryResponse] = await Promise.all([
            getAdminAlbumById(id),
            getAdminGallery(currentPage, limit, { albumId: id })
        ])

        if (!album) return notFound()
        const hasData = galleryResponse.data.length > 0

        return (
            <div className="px-5 pb-10">
                <PageHeader
                    title={album.album_title}
                    description="Daftar foto dalam album ini"
                    linkHref={`/admin/albums/${id}/upload-photo-to-album`}
                    linkLabel="Atur Foto Album"
                />

                <div className={cn(
                    "mt-8 rounded-2xl bg-muted/50 border border-border p-6 min-h-[500px] flex flex-col",
                    !hasData && "justify-center"
                )}>
                    {!hasData ? (
                        <Empty className="flex flex-col items-center text-center">
                            <EmptyHeader className="flex flex-col items-center">
                                <EmptyMedia variant="icon" className="mb-4 bg-background p-4 rounded-full shadow-sm">
                                    <ImageOff className="w-10 h-10 text-primary/40" />
                                </EmptyMedia>
                                <EmptyTitle className="text-xl font-bold">
                                    Album ini masih kosong
                                </EmptyTitle>
                                <EmptyDescription className="max-w-[300px] mx-auto text-muted-foreground">
                                    Belum ada foto yang ditambahkan ke album ini.
                                </EmptyDescription>
                            </EmptyHeader>
                        </Empty>
                    ) : (
                        <GalleryList initialGallery={galleryResponse.data} />
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
