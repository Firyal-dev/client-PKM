import { getAdminGallery } from "@/services/gallery/gallery-service"
import { GalleryList } from "./gallery-list"
import { PaginationControl } from "@/components/pagination-control"
import { PageHeader } from "@/components/admin/page-header"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { ImageOff } from "lucide-react"
import { cn } from "@/lib/utils"

export default async function GalleryPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
    const params = await searchParams
    const currentPage = Number(params.page) || 1
    const { data, totalPages } = await getAdminGallery(currentPage, 20)

    return (
        <div className="px-5 pb-10">
            <PageHeader
                title="Galeri"
                description="Kelola koleksi foto dan dokumentasi"
                linkHref="/admin/gallery/upload-photo"
                linkLabel="Tambah Foto"
            />

            <div className={cn(
                "rounded-xl bg-muted/30 border border-border mt-6 p-5 min-h-[500px] flex flex-col",
                data.length === 0 && "items-center justify-center"
            )}>
                {data.length === 0 ? (
                    <Empty className="flex flex-col items-center text-center py-16">
                        <EmptyHeader className="flex flex-col items-center gap-3">
                            <EmptyMedia variant="icon" className="bg-background border border-border p-4 rounded-xl shadow-sm">
                                <ImageOff className="w-8 h-8 text-muted-foreground/50" />
                            </EmptyMedia>
                            <div>
                                <EmptyTitle className="text-base font-semibold">Belum ada foto</EmptyTitle>
                                <EmptyDescription className="text-sm text-muted-foreground mt-1">
                                    Upload foto pertama untuk mulai mengisi galeri.
                                </EmptyDescription>
                            </div>
                        </EmptyHeader>
                    </Empty>
                ) : (
                    <GalleryList gallery={data} />
                )}
            </div>

            {totalPages > 1 && (
                <div className="mt-6">
                    <PaginationControl totalPages={totalPages} currentPage={currentPage} />
                </div>
            )}
        </div>
    )
}