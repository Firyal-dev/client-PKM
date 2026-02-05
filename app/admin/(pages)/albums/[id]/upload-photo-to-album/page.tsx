import { PageHeader } from "@/components/admin/page-header"
import { getAlbumDetail } from "@/services/album/album-service"
import { getGallery } from "@/services/gallery/gallery-service"
import { PhotoSelector } from "./photo-selector"
import { PaginationControl } from "@/components/pagination-control"
import { notFound } from "next/navigation"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { ImageOff, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"

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
    const limit = 15

    try {
        const [album, galleryResponse] = await Promise.all([
            getAlbumDetail(id),
            getGallery(currentPage, limit, undefined, true)
        ])

        if (!album) return notFound()

        return (
            <div className="px-5 pb-10">
                <div className="flex flex-col gap-2">
                    <Link href={`/admin/albums/${id}`} className="flex items-center text-xs text-muted-foreground hover:text-primary transition-colors w-fit">
                        <ChevronLeft className="w-3 h-3 mr-1" /> Kembali ke Detail Album
                    </Link>

                    <PageHeader
                        title="Pilih Foto"
                        description={`Menambahkan foto baru ke dalam album "${album.album_title}"`}
                    />
                </div>

                <div className={cn(
                    "mt-6 rounded-2xl bg-muted/50 border border-border p-6 min-h-[550px] flex flex-col",
                    galleryResponse.data.length === 0 && "justify-center"
                )}>
                    {galleryResponse.data.length === 0 ? (
                        <Empty className="flex flex-col items-center text-center">
                            <EmptyHeader className="flex flex-col items-center">
                                <EmptyMedia variant="icon" className="mb-4 bg-background p-4 rounded-full shadow-sm">
                                    <ImageOff className="w-10 h-10 text-primary/40" />
                                </EmptyMedia>
                                <EmptyTitle className="text-xl font-bold">Tidak ada foto tersedia</EmptyTitle>
                                <EmptyDescription className="max-w-[320px] mx-auto text-muted-foreground">
                                    Semua foto di galeri sudah masuk ke album lain, atau galeri memang masih kosong.
                                </EmptyDescription>
                                <Button asChild variant="outline" className="mt-6 rounded-xl">
                                    <Link href="/admin/gallery">Upload Foto Baru</Link>
                                </Button>
                            </EmptyHeader>
                        </Empty>
                    ) : (
                        <PhotoSelector
                            initialGallery={galleryResponse.data}
                            albumId={id}
                        />
                    )}
                </div>

                {/* Pagination */}
                {galleryResponse.totalPages > 1 && (
                    <div className="mt-8 flex justify-center">
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