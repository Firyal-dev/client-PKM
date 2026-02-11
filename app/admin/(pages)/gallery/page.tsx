import { getAdminGallery } from "@/services/gallery/gallery-service"
import { GalleryList } from "./gallery-list"
import { PaginationControl } from "@/components/pagination-control"
import { PageHeader } from "@/components/admin/page-header"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { ImageOff, Images } from "lucide-react"
import { cn } from "@/lib/utils"

export default async function GalleryPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
    const params = await searchParams
    const currentPage = Number(params.page) || 1
    const limit = 12

    const response = await getAdminGallery(currentPage, limit)
    const hasData = response.data.length > 0

    return (
        <div className="px-5 pb-10">
            <PageHeader
                title="Galeri"
                description="Kelola semua koleksi foto dan dokumentasi puskesmas"
                linkHref="/admin/gallery/upload-photo"
                linkLabel="Tambah Foto"
            />

            {/* Konten */}
            <div className={cn(
                "rounded-2xl bg-muted/50 border border-border mt-6 p-6 min-h-[500px] flex flex-col",
                !hasData && "justify-center"
            )}>
                {!hasData ? (
                    <Empty className="flex flex-col items-center text-center">
                        <EmptyHeader className="flex flex-col items-center">
                            <EmptyMedia variant="icon" className="mb-4 bg-background p-4 rounded-full shadow-sm">
                                <ImageOff className="w-10 h-10 text-primary/40" />
                            </EmptyMedia>
                            <EmptyTitle className="text-xl font-bold">
                                Belum ada foto
                            </EmptyTitle>
                            <EmptyDescription className="max-w-[300px] mx-auto text-muted-foreground">
                                Tidak ada foto di galeri.
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                ) : (
                    <GalleryList initialGallery={response.data} />
                )}
            </div>

            {/* Pagination */}
            {response.totalPages > 1 && (
                <div className="mt-8 flex flex-col items-center gap-3">
                    <PaginationControl
                        totalPages={response.totalPages}
                        currentPage={response.currentPage}
                    />
                    <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-full border text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        <Images className="w-3 h-3" />
                        Halaman {response.currentPage} dari {response.totalPages}
                    </div>
                </div>
            )}
        </div>
    );
}